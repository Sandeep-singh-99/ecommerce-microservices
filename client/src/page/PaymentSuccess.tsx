import React, { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, FileText, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch } from '@/hooks/hooks';
import { clearCart } from '@/redux/slice/cartSlice';
import { useFetchOrderDetails } from '@/api/payment.api';
import { useQueryClient } from '@tanstack/react-query';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const orderId = searchParams.get('order_id') || searchParams.get('orderId') || '';
  const txId = searchParams.get('tx_id') || searchParams.get('transaction_id') || '';

  const { data: orderDetails, isLoading } = useFetchOrderDetails(orderId, !!orderId);

  useEffect(() => {
    // Clear purchased cart items in Redux & invalidates cache
    dispatch(clearCart());
    queryClient.invalidateQueries({ queryKey: ['cart'] });
  }, [dispatch, queryClient]);

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[70vh]">
      <Card className="max-w-md w-full border-emerald-500/20 shadow-lg text-center">
        <CardHeader className="pt-8">
          <div className="mx-auto w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <CardTitle className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            Payment Successful!
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Thank you for your order. Your transaction has been confirmed.
          </p>
        </CardHeader>

        <CardContent className="space-y-4 py-4 text-left">
          <div className="bg-muted/40 rounded-lg p-4 space-y-2 text-sm border border-border/50">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID:</span>
              <span className="font-medium font-mono">{orderId || 'N/A'}</span>
            </div>
            {orderDetails?.order_number && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Number:</span>
                <span className="font-medium font-mono">{orderDetails.order_number}</span>
              </div>
            )}
            {txId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID:</span>
                <span className="font-medium font-mono">{txId}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-border/50">
              <span className="text-muted-foreground font-semibold">Total Amount:</span>
              <span className="font-bold text-base text-foreground">
                ₹{orderDetails?.total_amount ? Number(orderDetails.total_amount).toFixed(2) : 'Paid'}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pb-8">
          <Button asChild variant="outline" className="w-full">
            <Link to="/products">
              <ShoppingBag className="mr-2 h-4 w-4" /> Continue Shopping
            </Link>
          </Button>
          <Button asChild className="w-full">
            <Link to="/">
              <FileText className="mr-2 h-4 w-4" /> Return Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
