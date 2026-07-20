import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const ORDER_SERVICE_URL = (process.env.ORDER_SERVICE_URL || 'http://order-service:8000').replace(/\/$/, '');
const CART_SERVICE_URL = (process.env.CART_SERVICE_URL || 'http://cart-service:8000').replace(/\/$/, '');

export class MicroserviceClient {
  /**
   * Notify Order Service of payment status change (SUCCESS or FAILED)
   */
  static async notifyOrderService(orderId: string, paymentStatus: 'SUCCESS' | 'FAILED', transactionId?: string): Promise<boolean> {
    const url = `${ORDER_SERVICE_URL}/orders/${orderId}/payment-status`;
    try {
      const response = await axios.patch(
        url,
        {
          status: paymentStatus,
          transaction_id: transactionId
        },
        { timeout: 8000 }
      );
      console.log(`[Payment -> Order] Successfully updated order_id=${orderId} payment status to ${paymentStatus}`);
      return response.status === 200;
    } catch (error: any) {
      console.error(`[Payment -> Order] Failed to update order_id=${orderId}: ${error.response?.data?.detail || error.message}`);
      return false;
    }
  }

  /**
   * Notify Cart Service to clear user's purchased cart items
   */
  static async clearUserCart(userId: string): Promise<boolean> {
    const url = `${CART_SERVICE_URL}/api/carts/user/${userId}`;
    try {
      const response = await axios.delete(url, { timeout: 8000 });
      console.log(`[Payment -> Cart] Successfully cleared cart for user_id=${userId}`);
      return response.status === 200;
    } catch (error: any) {
      console.error(`[Payment -> Cart] Failed to clear cart for user_id=${userId}: ${error.response?.data?.detail || error.message}`);
      return false;
    }
  }
}
