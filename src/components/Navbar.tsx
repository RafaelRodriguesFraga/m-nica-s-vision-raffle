import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
            <Heart className="h-4 w-4" fill="currentColor" />
          </span>
          <span className="font-display text-lg font-semibold leading-none">
            Rifa da Mônica
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground sm:flex">
          <a href="#sobre" className="hover:text-foreground">Sobre</a>
          <a href="#numeros" className="hover:text-foreground">Números</a>
          <a href="#compartilhar" className="hover:text-foreground">Compartilhar</a>
        </nav>
        <a
          href="#numeros"
          className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:brightness-105 sm:text-sm"
        >
          Participar
        </a>
      </div>
    </header>
  );
}
