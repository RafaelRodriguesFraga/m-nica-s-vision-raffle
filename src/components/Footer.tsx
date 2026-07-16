import { Heart } from "lucide-react";

export function Footer() {

  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4 px-4 sm:flex-row sm:px-6">
        <p className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          Feito com <Heart className="h-4 w-4 fill-primary text-primary" /> para a Mônica
        </p>
      </div>
    </footer>
  );
}