import { ArrowRight, X } from "lucide-react";
import { PRICE_PER_NUMBER } from "@/types/raffle";

interface Props {
  selected: number[];
  onRemove: (n: number) => void;
  onContinue: () => void;
}

export function SelectedNumbersCard({ selected, onRemove, onContinue }: Props) {
  if (selected.length === 0) return null;
  const total = selected.length * PRICE_PER_NUMBER;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 px-3 pb-3 sm:left-auto sm:right-6 sm:bottom-6 sm:px-0 sm:pb-0">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] sm:w-96">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Seus números
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {selected.sort((a, b) => a - b).map((n) => (
                <span
                  key={n}
                  className="inline-flex items-center gap-1 rounded-full bg-blush px-2.5 py-1 text-xs font-semibold text-primary"
                >
                  {String(n).padStart(2, "0")}
                  <button
                    type="button"
                    aria-label={`Remover ${n}`}
                    onClick={() => onRemove(n)}
                    className="grid h-4 w-4 place-items-center rounded-full hover:bg-primary/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="font-display text-xl font-semibold text-primary">
              R$ {total.toFixed(2).replace(".", ",")}
            </p>
          </div>
        </div>
        <button
          onClick={onContinue}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-105"
        >
          Continuar <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
