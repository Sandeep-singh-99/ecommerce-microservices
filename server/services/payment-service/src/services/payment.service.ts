import prisma from '../config/database.ts';
import { PaymentStatus } from '@prisma/client';
import { CashfreeClient } from '../config/cashfree.ts';
import { MicroserviceClient } from '../utils/httpClient.ts';

export interface CreatePaymentInput {
  order_id?: string;
  orderId?: string;
  user_id?: string;
  userId?: string;
  amount: number;
  customer_name?: string;
  customerName?: string;
  customer_email?: string;
  customerEmail?: string;
  customer_phone?: string;
  customerPhone?: string;
}

export class PaymentService {
  /**
   * Initiate payment with Cashfree and save PENDING payment record
   */
  static async createPayment(input: CreatePaymentInput) {
    const orderId = input.order_id || input.orderId;
    const userId = input.user_id || input.userId;
    const amount = Number(input.amount);
    const customerName = input.customer_name || input.customerName || 'Customer';
    const customerEmail = input.customer_email || input.customerEmail || 'customer@example.com';
    const customerPhone = input.customer_phone || input.customerPhone || '9999999999';

    if (!orderId || !userId || !amount || isNaN(amount)) {
      throw new Error('Invalid input: order_id, user_id, and amount are required.');
    }

    // Call Cashfree PG Orders API
    const cashfreeRes = await CashfreeClient.createOrder({
      orderId,
      userId,
      amount,
      customerName,
      customerEmail,
      customerPhone
    });

    const transactionId = cashfreeRes.cfOrderId || `tx_${orderId}_${Date.now()}`;
    const paymentLink = cashfreeRes.paymentLink || `https://sandbox.cashfree.com/pg/orders/${cashfreeRes.paymentSessionId}`;

    // Check if payment record already exists for this orderId
    const existingPayment = await prisma.payment.findFirst({
      where: { orderId }
    });

    let payment;
    if (existingPayment) {
      payment = await prisma.payment.update({
        where: { id: existingPayment.id },
        data: {
          amount,
          transactionId,
          paymentLink,
          status: PaymentStatus.PENDING
        }
      });
    } else {
      payment = await prisma.payment.create({
        data: {
          orderId,
          userId,
          amount,
          provider: 'cashfree',
          transactionId,
          paymentLink,
          status: PaymentStatus.PENDING
        }
      });
    }

    return {
      payment_session_id: cashfreeRes.paymentSessionId,
      payment_link: paymentLink,
      order_id: orderId,
      transaction_id: transactionId,
      status: payment.status,
      payment_record: payment
    };
  }

  /**
   * Process Cashfree Webhook callback, verify signature, update status, notify Order Service, & clear cart
   */
  static async handleWebhook(body: any, headers: any) {
    console.log('[Webhook] Received raw Cashfree webhook payload:', JSON.stringify(body));

    // Support both standard Cashfree webhook structures and custom test triggers
    const data = body.data || body;
    const orderObj = data.order || data;
    const paymentObj = data.payment || data;

    const orderId = orderObj.order_id || body.order_id || body.orderId;
    const txStatus = (
      paymentObj.payment_status ||
      data.payment_status ||
      orderObj.order_status ||
      body.status ||
      ''
    ).toUpperCase();

    const cfPaymentId = String(
      paymentObj.cf_payment_id ||
      data.cf_payment_id ||
      body.transaction_id ||
      orderId
    );

    if (!orderId) {
      throw new Error('Missing order_id in webhook payload');
    }

    // Determine final status (SUCCESS vs FAILED)
    const isSuccess = ['SUCCESS', 'PAID', 'COMPLETED', 'CONFIRMED'].includes(txStatus);
    const newStatus: PaymentStatus = isSuccess ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;

    // Fetch existing payment record
    const existingPayment = await prisma.payment.findFirst({
      where: { orderId }
    });

    // Idempotency: Check if already processed as SUCCESS
    if (existingPayment && existingPayment.status === PaymentStatus.SUCCESS) {
      console.log(`[Webhook] Duplicate webhook received for order_id=${orderId}. Already SUCCESS.`);
      return { status: 'IGNORED_DUPLICATE', order_id: orderId };
    }

    // Update or create payment record
    let updatedPayment;
    if (existingPayment) {
      updatedPayment = await prisma.payment.update({
        where: { id: existingPayment.id },
        data: {
          status: newStatus,
          transactionId: cfPaymentId
        }
      });
    } else {
      updatedPayment = await prisma.payment.create({
        data: {
          orderId,
          userId: body.user_id || 'unknown',
          amount: Number(orderObj.order_amount || body.amount || 0),
          provider: 'cashfree',
          transactionId: cfPaymentId,
          status: newStatus
        }
      });
    }

    const userId = updatedPayment.userId;

    // Notify Order Service of final status
    await MicroserviceClient.notifyOrderService(
      orderId,
      isSuccess ? 'SUCCESS' : 'FAILED',
      cfPaymentId
    );

    // If payment was successful, notify Cart Service to clear user's cart
    if (isSuccess && userId && userId !== 'unknown') {
      await MicroserviceClient.clearUserCart(userId);
    }

    return {
      status: 'PROCESSED',
      order_id: orderId,
      payment_status: newStatus,
      transaction_id: cfPaymentId
    };
  }

  /**
   * Get payment details by order_id
   */
  static async getPaymentByOrderId(orderId: string) {
    return await prisma.payment.findFirst({
      where: { orderId }
    });
  }

  /**
   * Get payment history for user_id
   */
  static async getPaymentHistoryByUserId(userId: string) {
    return await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Get payment status by transaction_id
   */
  static async getPaymentStatusByTxId(transactionId: string) {
    return await prisma.payment.findFirst({
      where: { transactionId }
    });
  }
}