import React, { useState } from 'react';
import { Search, Eye, Filter } from 'lucide-react';
import { dummyOrders } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminOrders() {
  const [search, setSearch] = useState('');

  const filteredOrders = dummyOrders.filter(o => 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">View and manage customer orders.</p>
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Card className="shadow-sm">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID or customer..."
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
            <Badge variant="secondary" className="px-3 py-1 cursor-pointer whitespace-nowrap">All Orders</Badge>
            <Badge variant="outline" className="px-3 py-1 cursor-pointer whitespace-nowrap bg-background text-muted-foreground hover:text-foreground">Pending</Badge>
            <Badge variant="outline" className="px-3 py-1 cursor-pointer whitespace-nowrap bg-background text-muted-foreground hover:text-foreground">Processing</Badge>
            <Badge variant="outline" className="px-3 py-1 cursor-pointer whitespace-nowrap bg-background text-muted-foreground hover:text-foreground">Delivered</Badge>
          </div>
        </div>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.id}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {order.date}
                  </TableCell>
                  <TableCell>
                    {order.customer}
                  </TableCell>
                  <TableCell>
                    {order.items} items
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        order.status === 'Delivered' ? 'default' : 
                        order.status === 'Processing' ? 'secondary' : 
                        order.status === 'Cancelled' ? 'destructive' : 'outline'
                      }
                      className={order.status === 'Pending' ? 'border-amber-500 text-amber-500' : ''}
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${order.total.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View Details</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
