import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import { dummyProducts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { AddProductDialog } from '@/components/admin/AddProductDialog';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetProducts } from '@/api/productApi';

export default function AdminProducts() {
  const [search, setSearch] = useState('');
  
  const filteredProducts = dummyProducts.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const { data, isLoading, isError } = useGetProducts({
    search,
    page: 1,
    limit: 10,
  })

  const products = data?.products || [];

  return (
     <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your store's inventory.</p>
        </div>
        <AddProductDialog />
      </div>

      <Card className="shadow-sm">
        {/* Search */}
        <div className="p-4 border-b border-border flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20 hidden sm:table-cell">
                  Image
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Sales Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {/* Loading */}
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    Loading products...
                  </TableCell>
                </TableRow>
              )}

              {/* Error */}
              {isError && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-destructive py-6">
                    Failed to load products
                  </TableCell>
                </TableRow>
              )}

              {/* Data */}
              {!isLoading &&
                products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                      <img
                        src={product.images?.[0]?.url}
                        alt={product.name}
                        className="h-10 w-10 rounded-md object-cover border"
                      />
                    </TableCell>

                    <TableCell>
                      <div className="font-medium line-clamp-1">
                        {product.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ID: {product.id}
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant="secondary">{product.category}</Badge>
                    </TableCell>

                    <TableCell className="font-medium">
                      ${product.price || "0.00"}
                    </TableCell>

                    <TableCell>
                      ${product.sales_price || "0.00"}
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />

                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}

              {/* Empty */}
              {!isLoading && products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No products found
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
