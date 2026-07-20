import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.ts';

const router = Router();

// STEP 3 & STEP 8: Create Payment Record & Cashfree Order
router.post('/create', PaymentController.createPayment);
router.post('/', PaymentController.createPayment);

// STEP 4 & STEP 8: Cashfree Webhook Handler
router.post('/webhook', PaymentController.handleWebhook);

// STEP 8: Payment Query APIs
router.get('/history/:user_id', PaymentController.getHistoryByUserId);
router.get('/status/:transaction_id', PaymentController.getStatusByTxId);
router.get('/:order_id', PaymentController.getByOrderId);

export default router;
