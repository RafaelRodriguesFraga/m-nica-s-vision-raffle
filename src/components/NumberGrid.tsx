import { Lock } from "lucide-react";
import type { RaffleNumber } from "@/types/raffle";

interface Props {
  numbers: RaffleNumber[];
  selected: Set<number>;
  onToggle: (n: number) => void;
}

export function NumberGrid({ numbers, selected, onToggle }: Props) {
  return (
    <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 sm:gap-3 md:grid-cols-10">
      {numbers.map((n) => {
        const isSelected = selected.has(n.number);
        const isSold = n.status === "paid" || n.status === "reserved";
        const label = String(n.number).padStart(2, "0");
        const base = "aspect-square rounded-xl font-semibold text-sm sm:text-base transition-all duration-200 flex items-center justify-center select-none";
        let cls = "";
        if (isSold) {
          cls = "bg-muted text-muted-foreground/60 cursor-not-allowed";
        } else if (isSelected) {
          cls = "bg-primary text-primary-foreground shadow-[var(--shadow-soft)] scale-[1.04] animate-pop-in";
        } else {
          cls = "bg-card text-foreground border-2 border-primary/30 hover:border-primary hover:bg-blush hover:-translate-y-0.5";
        }
        return (
          <button
            key={n.number}
            type="button"
            disabled={isSold}
            aria-pressed={isSelected}
            aria-label={`Número ${label}${isSold ? " indisponível" : ""}`}
            onClick={() => onToggle(n.number)}
            className={`${base} ${cls}`}
          >
            {isSold ? <Lock className="h-4 w-4" /> : label}
          </button>
        );
      })}
    </div>
  );
}
