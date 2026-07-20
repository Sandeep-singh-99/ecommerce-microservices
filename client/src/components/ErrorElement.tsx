import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorElement() {
  const error = useRouteError();
  console.error("Route Error:", error);

  let errorMessage = "An unexpected error occurred.";
  let errorDetails = "";

  if (isRouteErrorResponse(error)) {
    errorMessage = `${error.status} ${error.statusText}`;
    errorDetails = typeof error.data === "string" ? error.data : error.data?.message || error.statusText;
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorDetails = error.stack || "";
  } else if (typeof error === "string") {
    errorMessage = error;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2 mx-auto">
          <AlertTriangle className="h-10 w-10 animate-pulse" />
        </div>
      </div>
      <h2 className="text-3xl font-bold mb-3 tracking-tight">Something Went Wrong</h2>
      <p className="text-muted-foreground mb-6 max-w-md text-base">
        {errorMessage || "We ran into an unexpected problem while loading this page."}
      </p>

      {errorDetails && (
        <details className="mb-6 max-w-lg text-left bg-muted/50 p-4 rounded-lg text-xs font-mono text-muted-foreground overflow-auto max-h-40 border border-border">
          <summary className="cursor-pointer font-semibold mb-1 text-foreground">Error Details</summary>
          <pre className="whitespace-pre-wrap">{errorDetails}</pre>
        </details>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={() => window.location.reload()} size="lg" className="rounded-full px-6">
          <RefreshCw className="mr-2 h-4 w-4 animate-spin-once" /> Try Again
        </Button>
        <Button variant="outline" asChild size="lg" className="rounded-full px-6">
          <Link to="/">
            <Home className="mr-2 h-4 w-4" /> Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
