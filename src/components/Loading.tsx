import { Heart } from "lucide-react";

export function Loading({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
      <Heart className="h-8 w-8 animate-pulse text-primary" fill="currentColor" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
