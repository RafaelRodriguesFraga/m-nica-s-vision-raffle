import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
        <p className="inline-flex items-center gap-2">
          Feito com <Heart className="h-4 w-4 text-primary" fill="currentColor" /> para a Mônica
        </p>
        <Link to="/admin" className="text-xs hover:text-foreground">Administração</Link>
      </div>
    </footer>
  );
}
