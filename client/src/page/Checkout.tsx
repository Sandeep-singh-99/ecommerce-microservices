import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, Truck, ShieldCheck, Loader2 } from 'lucide-react';
import { useAppSelector } from '@/hooks/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCheckout } from '@/api/payment.api';
import type { IOrderCreatePayload } from '@/types/order';

export default function Checkout() {
  const { items } = useAppSelector((state) => state.cart);
  const checkoutMutation = useCheckout();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    email: '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 15.0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const orderPayload: IOrderCreatePayload = {
      shipping_address: {
        name: `${formData.firstName} ${formData.lastName}`.trim() || undefined,
        address_line1: formData.address,
        address_line2: formData.address2 || undefined,
        city: formData.city,
        state: formData.state,
        postal_code: formData.zip,
        country: 'India',
        phone: formData.phone || undefined,
        email: formData.email || undefined,
      },
      items: items.map((item) => ({
        product_id: item.product.id || item.id,
        quantity: item.quantity,
      })),
    };

    checkoutMutation.mutate(orderPayload);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Checkout not available</h1>
        <p className="text-muted-foreground mb-8">Your cart is empty.</p>
        <Button asChild>
          <Link to="/products">Continue Shopping</Link>
        </Button>
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
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address Line 1</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main St"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address2">Address Line 2 (Optional)</Label>
                <Input
                  id="address2"
                  value={formData.address2}
                  onChange={handleChange}
                  placeholder="Apt, Suite, Building"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Mumbai"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Maharashtra"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP / Postal Code</Label>
                  <Input
                    id="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    placeholder="400001"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9999999999"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cashfree Payment Gateway Info */}
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="bg-muted/20 border-b border-border/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-violet-500" /> Payment Gateway
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="border border-violet-500/30 bg-violet-500/5 p-4 rounded-lg flex items-center gap-4">
                <div className="p-3 bg-violet-500/10 rounded-full text-violet-500">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-base">Cashfree Payment Gateway</h4>
                  <p className="text-sm text-muted-foreground">
                    You will be securely redirected to Cashfree to complete payment via UPI, Credit/Debit Cards, NetBanking, or Wallets.
                  </p>
                </div>
              </div>
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
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded overflow-hidden bg-muted/20 shrink-0 border border-border">
                      <img
                        src={
                          typeof item.product.images?.[0] === 'string'
                            ? item.product.images[0]
                            : (item.product.images?.[0] as any)?.image_url || '/placeholder.png'
                        }
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-sm">
                      <h4 className="font-medium line-clamp-2 mb-1">{item.product.name}</h4>
                      <p className="text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-medium text-sm">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (8%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  {shipping === 0 ? (
                    <span className="text-emerald-500 font-medium">Free</span>
                  ) : (
                    <span>₹{shipping.toFixed(2)}</span>
                  )}
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-bold text-xl mb-6">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full text-base shadow-lg shadow-primary/20"
                disabled={checkoutMutation.isPending}
              >
                {checkoutMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirecting to Secure Payment...
                  </>
                ) : (
                  'Proceed to Checkout'
                )}
              </Button>

              <div className="mt-4 flex items-center justify-center text-xs text-muted-foreground gap-1">
                <ShieldCheck className="h-4 w-4" /> Encrypted & Secure Cashfree Payment
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
