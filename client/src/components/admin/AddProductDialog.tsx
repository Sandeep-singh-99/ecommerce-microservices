import React, { useState } from "react";
import { Plus, UploadCloud, X } from "lucide-react";
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
  DialogTrigger,
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

export function AddProductDialog() {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState<string | undefined>("**Product Features**\n\n- Feature 1\n- Feature 2");
  const [images, setImages] = useState<File[]>([]);
  const { theme } = useTheme();
  
  // Resolve system theme to actual light/dark for MDEditor
  const resolvedTheme = theme === "system" 
    ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") 
    : theme;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // form handling logic
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-3xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new product to your store.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-auto">
          <ScrollArea className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="product_name">Product Name</Label>
                <Input id="product_name" placeholder="e.g. Wireless Headphones" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product_brand">Brand</Label>
                <Input id="product_brand" placeholder="e.g. Sony" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product_price">Regular Price ($)</Label>
                <Input id="product_price" type="number" min="0" step="0.01" placeholder="0.00" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sales_price">Sale Price ($)</Label>
                <Input id="sales_price" type="number" min="0" step="0.01" placeholder="0.00" />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="product_category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="home">Home & Kitchen</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="product_description">Short Description</Label>
                <Textarea 
                  id="product_description" 
                  placeholder="Brief summary of the product..." 
                  rows={3} 
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Product Details (Markdown)</Label>
                <div data-color-mode={resolvedTheme} className="border rounded-md overflow-hidden">
                  <MDEditor
                    value={details}
                    onChange={setDetails}
                    height={300}
                    preview="edit"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Product Images</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center bg-muted/20">
                  <UploadCloud className="h-8 w-8 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">Drag & drop your images here or click to browse</p>
                  <Input 
                    id="images" 
                    type="file" 
                    accept="image/*" 
                    multiple 
                    className="hidden" 
                    onChange={handleImageUpload}
                  />
                  <Label htmlFor="images" className="cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors">
                    Browse Files
                  </Label>
                </div>
                
                {images.length > 0 && (
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {images.map((img, i) => (
                      <div key={i} className="relative w-20 h-20 rounded-md border overflow-hidden group">
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
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
