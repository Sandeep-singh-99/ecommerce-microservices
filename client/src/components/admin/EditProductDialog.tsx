import React, { useState, useEffect, type ChangeEvent } from "react";
import { Loader, UploadCloud, X } from "lucide-react";
import MDEditor from "@uiw/react-md-editor";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTheme } from "@/components/theme-provider";
import { useUpdateProductById } from "@/api/productApi";
import type { Product } from "@/types/product";

interface EditProductDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProductDialog({ product, open, onOpenChange }: EditProductDialogProps) {
  const [details, setDetails] = useState<string | undefined>("");
  const [images, setImages] = useState<File[]>([]);
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    product_name: "",
    product_brand: "",
    product_price: "",
    sales_price: "",
    product_category: "",
    product_description: "",
  });

  const { mutate, isPending } = useUpdateProductById();

  // Resolve system theme to actual light/dark for MDEditor
  const resolvedTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  useEffect(() => {
    if (product) {
      setFormData({
        product_name: product.name || "",
        product_brand: product.brand || "",
        product_price: product.price?.toString() || "",
        sales_price: product.sales_price?.toString() || "",
        product_category: product.category || "",
        product_description: product.description || "",
      });
      setDetails(product.details || "");
      setImages([]); // Reset new images
    }
  }, [product, open]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({
      ...formData,
      product_category: value,
    });
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;

    const data = new FormData();
    data.append("product_name", formData.product_name);
    data.append("product_brand", formData.product_brand);
    data.append("product_price", formData.product_price);
    data.append("sales_price", formData.sales_price);
    data.append("product_category", formData.product_category);
    data.append("product_description", formData.product_description || "");
    data.append("product_details", details || "");

    images.forEach((img) => {
      data.append("new_images", img);
    });

    mutate(
      { id: product.id, formData: data },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the details for this product.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-auto"
        >
          <ScrollArea className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="product_name">Product Name</Label>
                <Input
                  id="product_name"
                  value={formData.product_name}
                  onChange={handleChange}
                  placeholder="e.g. Wireless Headphones"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product_brand">Brand</Label>
                <Input
                  id="product_brand"
                  placeholder="e.g. Sony"
                  value={formData.product_brand}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product_price">Regular Price ($)</Label>
                <Input
                  id="product_price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  required
                  value={formData.product_price}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sales_price">Sale Price ($)</Label>
                <Input
                  id="sales_price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.sales_price}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="product_category">Category</Label>
                <Select value={formData.product_category} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mouse">Mouse</SelectItem>
                    <SelectItem value="airpodes">Airpodes</SelectItem>
                    <SelectItem value="camera">Camera</SelectItem>
                    <SelectItem value="earphones">Earphones</SelectItem>
                    <SelectItem value="mobile">Mobiles</SelectItem>
                    <SelectItem value="printer">Printers</SelectItem>
                    <SelectItem value="processor">Processor</SelectItem>
                    <SelectItem value="refrigerator">Refrigerator</SelectItem>
                    <SelectItem value="speaker">Speakers</SelectItem>
                    <SelectItem value="tv">TV</SelectItem>
                    <SelectItem value="trimmer">Trimmers</SelectItem>
                    <SelectItem value="watch">Watches</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="product_description">Short Description</Label>
                <Textarea
                  id="product_description"
                  placeholder="Brief summary of the product..."
                  rows={3}
                  value={formData.product_description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Product Details (Markdown)</Label>
                <div
                  data-color-mode={resolvedTheme}
                  className="border rounded-md overflow-hidden"
                >
                  <MDEditor
                    value={details}
                    onChange={setDetails}
                    height={300}
                    preview="edit"
                  />
                </div>
              </div>

              {product.images && product.images.length > 0 && (
                <div className="space-y-2 md:col-span-2 mb-4">
                  <Label>Current Images</Label>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {product.images.map((img, i) => (
                      <div
                        key={i}
                        className="relative w-20 h-20 rounded-md border overflow-hidden"
                      >
                        <img
                          src={img.url}
                          alt="Current product image"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2 md:col-span-2">
                <Label>New Images (Optional)</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Uploading new images will replace existing images. Leave blank to keep existing.
                </p>
                <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center bg-muted/20">
                  <UploadCloud className="h-8 w-8 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag & drop your new images here or click to browse
                  </p>
                  <Input
                    id="new_images"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Label
                    htmlFor="new_images"
                    className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors"
                  >
                    Browse Files
                  </Label>
                </div>

                {images.length > 0 && (
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {images.map((img, i) => (
                      <div
                        key={i}
                        className="relative w-20 h-20 rounded-md border overflow-hidden group"
                      >
                        <img
                          src={URL.createObjectURL(img)}
                          alt="upload preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="px-6 py-4 border-t mt-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader className="animate-spin" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
