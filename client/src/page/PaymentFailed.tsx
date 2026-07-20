import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { XCircle, RefreshCw, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaymentFailed() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id') || searchParams.get('orderId') || '';
  const reason = searchParams.get('reason') || 'Transaction was declined or cancelled.';

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[70vh]">
      <Card className="max-w-md w-full border-destructive/20 shadow-lg text-center">
        <CardHeader className="pt-8">
          <div className="mx-auto w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-10 h-10" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">
            Payment Failed
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            We couldn't process your payment. Please try again or use a different payment method.
          </p>
        </CardHeader>

        <CardContent className="space-y-4 py-4 text-left">
          <div className="bg-destructive/5 rounded-lg p-4 space-y-2 text-sm border border-destructive/10">
            {orderId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Reference:</span>
                <span className="font-medium font-mono">{orderId}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reason:</span>
              <span className="font-medium text-destructive">{reason}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pb-8">
          <Button asChild variant="outline" className="w-full">
            <Link to="/cart">
              <ShoppingCart className="mr-2 h-4 w-4" /> Back to Cart
            </Link>
          </Button>
          <Button asChild className="w-full">
            <Link to="/checkout">
              <RefreshCw className="mr-2 h-4 w-4" /> Retry Payment
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
