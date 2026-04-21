import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Banknote, ShieldCheck } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/hooks/hooks';
import { clearCart } from '@/redux/slice/cartSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

export default function Checkout() {
  const { items } = useAppSelector(state => state.cart);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  const subtotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 15.00;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      dispatch(clearCart());
      toast.success("Order placed successfully! Check your email for details.");
      navigate('/');
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Checkout not available</h1>
        <p className="text-muted-foreground mb-8">Your cart is empty.</p>
        <Button asChild><Link to="/products">Continue Shopping</Link></Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-10 py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>
      
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="bg-muted/20 border-b border-border/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Truck className="h-5 w-5 text-violet-500" /> Shipping Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="123 Main St, Apt 4B" required />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" placeholder="New York" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" placeholder="NY" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" placeholder="10001" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" required />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="bg-muted/20 border-b border-border/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-violet-500" /> Payment Method
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                {/* Credit Card */}
                <div className="flex items-start space-x-3 border border-border p-4 rounded-lg bg-card cursor-pointer hover:border-violet-500 transition-colors">
                  <RadioGroupItem value="card" id="card" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="card" className="font-semibold text-base block cursor-pointer">Credit Card</Label>
                    <p className="text-sm text-muted-foreground mb-4">Pay securely with Visa, Mastercard, or Amex.</p>
                    {paymentMethod === 'card' && (
                      <div className="space-y-4 pt-2 animate-in slide-in-from-top-2">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input id="cardNumber" placeholder="0000 0000 0000 0000" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expDate">Expiry Date</Label>
                            <Input id="expDate" placeholder="MM/YY" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="123" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cash on Delivery */}
                <div className="flex items-start space-x-3 border border-border p-4 rounded-lg bg-card cursor-pointer hover:border-violet-500 transition-colors">
                  <RadioGroupItem value="cod" id="cod" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="cod" className="font-semibold text-base block cursor-pointer flex items-center gap-2">
                      <Banknote className="h-4 w-4" /> Cash on Delivery
                    </Label>
                    <p className="text-sm text-muted-foreground">Pay with cash when your order is delivered.</p>
                  </div>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="border-border/50 shadow-sm sticky top-28 bg-slate-50 dark:bg-card/50">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded overflow-hidden bg-muted/20 shrink-0 border border-border">
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 text-sm">
                      <h4 className="font-medium line-clamp-2 mb-1">{item.product.name}</h4>
                      <p className="text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-medium text-sm">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-emerald-500 font-medium">Free</span>
                  ) : (
                    <span>${shipping.toFixed(2)}</span>
                  )}
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between font-bold text-xl mb-6">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Button type="submit" size="lg" className="w-full text-base shadow-lg shadow-primary/20" disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Place Order"}
              </Button>
              
              <div className="mt-4 flex items-center justify-center text-xs text-muted-foreground gap-1">
                <ShieldCheck className="h-4 w-4" /> Payments are 100% secure and encrypted
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
