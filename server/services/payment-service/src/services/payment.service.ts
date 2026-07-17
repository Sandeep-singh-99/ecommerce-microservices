import prisma from '../config/database.js';
import { PaymentStatus } from '@prisma/client';

export class PaymentService {
  static async createPayment(orderId: string, userId: string, amount: number) {
    // Exact mapping for decimals, strings, and default statuses
    return await prisma.payment.create({
      data: {
        orderId,
        userId,
        amount,
        provider: 'cashfree',
        status: PaymentStatus.PENDING,
        // Mock transaction token/link generation
        paymentLink: `https://checkout.cashfree.com/mock-link/${orderId}`,
        transactionId: `tx_${Date.now()}`
      },
    });
  }

  static async getPaymentByOrderId(orderId: string) {
    return await prisma.payment.findFirst({
      where: { orderId },
    });
  }

  static async updatePaymentStatus(transactionId: string, status: PaymentStatus) {
    return await prisma.payment.update({
      where: { transactionId },
      data: { status },
    });
  }
}