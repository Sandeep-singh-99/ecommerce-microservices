import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import paymentRoutes from './routes/payment.routes.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/health', (req: Request, res: Response) => {
    return res.status(200).json("Payment Service");
})


// Root route
app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({ service: 'Payment Service API', status: 'running' });
});

// Mount routes under /payments and /payment
app.use('/payments', paymentRoutes);
app.use('/payment', paymentRoutes);
app.use('/webhook/cashfree', paymentRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('[PaymentService Error]:', err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`[Payment Service] Running on http://localhost:${PORT}`);
});

export default app;