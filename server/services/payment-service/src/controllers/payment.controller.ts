import type { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service.ts';
import { CashfreeClient } from '../config/cashfree.ts';

export class PaymentController {
  /**
   * POST /payments/create
   */
  static async createPayment(req: Request, res: Response): Promise<void> {
    try {
      const payload = req.body;
      const orderId = payload.order_id || payload.orderId;
      const userId = payload.user_id || payload.userId;
      const amount = payload.amount;

      if (!orderId || !userId || !amount) {
        res.status(400).json({
          error: 'Missing required parameters: order_id, user_id, and amount are required.'
        });
        return;
      }

      const result = await PaymentService.createPayment(payload);
      res.status(201).json(result);
    } catch (error: any) {
      console.error('[PaymentController] createPayment Error:', error);
      res.status(500).json({ error: error.message || 'Failed to initiate payment' });
    }
  }

  /**
   * POST /payments/webhook
   */
  static async handleWebhook(req: Request, res: Response): Promise<void> {
    try {
      const rawBody = JSON.stringify(req.body);
      const timestamp = (req.headers['x-webhook-timestamp'] as string) || '';
      const signature = (req.headers['x-webhook-signature'] as string) || '';

      // Verify Cashfree webhook signature
      const isValid = CashfreeClient.verifySignature(rawBody, timestamp, signature);
      if (!isValid) {
        console.warn('[Webhook] Invalid Cashfree webhook signature');
        res.status(401).json({ error: 'Invalid webhook signature' });
        return;
      }

      const result = await PaymentService.handleWebhook(req.body, req.headers);
      res.status(200).json({ status: 'OK', result });
    } catch (error: any) {
      console.error('[PaymentController] handleWebhook Error:', error);
      // Always return 200 HTTP code to Cashfree so webhook isn't endlessly retried if payload format varies
      res.status(200).json({ status: 'ERROR', message: error.message });
    }
  }

  /**
   * GET /payments/:orderId
   */
  static async getByOrderId(req: Request, res: Response): Promise<void> {
    try {
      const { order_id, orderId } = req.params;
      const targetId = (order_id || orderId || '') as string;

      if (!targetId) {
        res.status(400).json({ error: 'order_id parameter is required' });
        return;
      }

      const payment = await PaymentService.getPaymentByOrderId(targetId);

      if (!payment) {
        res.status(404).json({ error: 'Payment record not found' });
        return;
      }

      res.status(200).json(payment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /payments/history/:userId
   */
  static async getHistoryByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { user_id, userId } = req.params;
      const targetUserId = (user_id || userId || '') as string;

      if (!targetUserId) {
        res.status(400).json({ error: 'user_id parameter is required' });
        return;
      }

      const history = await PaymentService.getPaymentHistoryByUserId(targetUserId);
      res.status(200).json({ count: history.length, payments: history });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * GET /payments/status/:transactionId
   */
  static async getStatusByTxId(req: Request, res: Response): Promise<void> {
    try {
      const { transaction_id, transactionId } = req.params;
      const targetTxId = (transaction_id || transactionId || '') as string;

      if (!targetTxId) {
        res.status(400).json({ error: 'transaction_id parameter is required' });
        return;
      }

      const payment = await PaymentService.getPaymentStatusByTxId(targetTxId);

      if (!payment) {
        res.status(404).json({ error: 'Payment transaction record not found' });
        return;
      }

      res.status(200).json(payment);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}