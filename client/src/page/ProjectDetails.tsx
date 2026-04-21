import { CheckCircle2, Code2, Layers, Palette, TerminalSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ProjectDetails() {
  return (
    <div className="container mx-auto px-4 md:px-10 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <Badge className="mb-4 bg-violet-500/10 text-violet-500 border-violet-500/20 hover:bg-violet-500/20">Buyzaar V1.0</Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-balance">
          Project Architecture & Details
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A modern, responsive e-commerce frontend built with React, Vite, ShadCN UI, and Tailwind CSS.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur">
          <CardHeader>
            <Layers className="h-8 w-8 text-violet-500 mb-2" />
            <CardTitle>Architecture</CardTitle>
            <CardDescription>Scalable & modular structure</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Component-based design</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Custom hooks & utilities</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Dedicated layout wrappers</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Centralized state management</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur">
          <CardHeader>
            <Code2 className="h-8 w-8 text-violet-500 mb-2" />
            <CardTitle>Tech Stack</CardTitle>
            <CardDescription>Modern frontend tooling</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">React 19</Badge>
              <Badge variant="secondary">TypeScript</Badge>
              <Badge variant="secondary">Vite</Badge>
              <Badge variant="secondary">React Router v7</Badge>
              <Badge variant="secondary">Redux Toolkit</Badge>
              <Badge variant="secondary">Tanstack Query</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur">
          <CardHeader>
            <Palette className="h-8 w-8 text-violet-500 mb-2" />
            <CardTitle>UI / UX</CardTitle>
            <CardDescription>Clean & accessible design</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-primary/20">Tailwind CSS v4</Badge>
              <Badge variant="outline" className="border-primary/20">ShadCN UI</Badge>
              <Badge variant="outline" className="border-primary/20">Lucide Icons</Badge>
              <Badge variant="outline" className="border-primary/20">Radix Primitives</Badge>
              <Badge variant="outline" className="border-primary/20">Dark Mode Support</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 shadow-sm mb-12 overflow-hidden">
        <div className="border-b border-border bg-muted/30 p-4 flex items-center gap-2">
          <TerminalSquare className="h-5 w-5 text-muted-foreground" />
          <span className="font-mono text-sm font-medium">Features Implementation</span>
        </div>
        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-border pb-2">Client Experience</h3>
              <ul className="space-y-4">
                <li>
                  <div className="font-medium">Responsive Layout</div>
                  <div className="text-sm text-muted-foreground">Mobile-first approach ensuring perfect display on all devices from 320px to 4K.</div>
                </li>
                <li>
                  <div className="font-medium">Global State Management</div>
                  <div className="text-sm text-muted-foreground">Redux Toolkit manages Cart and Auth state globally, persisting across page navigations.</div>
                </li>
                <li>
                  <div className="font-medium">Theming System</div>
                  <div className="text-sm text-muted-foreground">Built-in light/dark mode toggle using next-themes with tailored CSS variables.</div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-border pb-2">Business Logic</h3>
              <ul className="space-y-4">
                <li>
                  <div className="font-medium">Dynamic Routing</div>
                  <div className="text-sm text-muted-foreground">React Router v7 implementation with nested layouts for Shop vs Admin sections.</div>
                </li>
                <li>
                  <div className="font-medium">Cart Engine</div>
                  <div className="text-sm text-muted-foreground">Quantity validation, subtotal calculation, tax computation, and stock limits.</div>
                </li>
                <li>
                  <div className="font-medium">Admin Dashboard</div>
                  <div className="text-sm text-muted-foreground">Protected admin layout with ShadCN Sidebar component for management interfaces.</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
