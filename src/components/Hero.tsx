import { Heart, Sparkles } from "lucide-react";
import { FloatingHearts } from "./FloatingHearts";

export function Hero({ onCta }: { onCta: () => void }) {
  return (
    <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <FloatingHearts />
      <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-14 text-center sm:px-6 sm:pb-24 sm:pt-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white/70 px-4 py-1.5 text-xs font-semibold text-primary shadow-sm">
          <Sparkles className="h-3.5 w-3.5" /> Rifa Solidária
        </span>
        <h1 className="mt-6 text-4xl font-semibold leading-[1.05] text-foreground sm:text-6xl md:text-7xl">
          Um número. <br />
          <span className="text-primary">Um gesto de amor.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
          Ajude a <strong className="text-foreground">Mônica</strong> a realizar seus
          exames oftalmológicos com urgência. Cada número é um pouquinho de esperança.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            onClick={onCta}
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition-all hover:scale-[1.02] hover:brightness-105"
          >
            <Heart className="h-4 w-4 transition-transform group-hover:scale-125" fill="currentColor" />
            Escolher meus números
          </button>
          <a href="#sobre" className="text-sm font-semibold text-muted-foreground hover:text-foreground">
            Conhecer a história →
          </a>
        </div>
      </div>
    </section>
  );
}
