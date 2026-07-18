import { Request, Response } from 'express';
import { PaymentService } from '../services/payment.service.js';

export class PaymentController {
  static async initiatePayment(req: Request, res: Response): Promise<void> {
    try {
      const { orderId, userId, amount } = req.body;

      if (!orderId || !userId || !amount) {
        res.status(400).json({ error: 'Missing required parameters' });
        return;
      }

      const payment = await PaymentService.createPayment(orderId, userId, amount);
      res.status(201).json(payment);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async getStatus(req: Request, res: Response): Promise<void> {
    try {
      const { orderId } = req.params;
      const payment = await PaymentService.getPaymentByOrderId(orderId);

      if (!payment) {
        res.status(404).json({ error: 'Payment record not found' });
        return;
      }

      res.status(200).json(payment);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}