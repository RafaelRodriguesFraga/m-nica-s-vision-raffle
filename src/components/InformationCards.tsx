import { Gift, Hash, HandHeart, Tag } from "lucide-react";

const CARDS = [
  { icon: Tag, label: "Valor", value: "R$ 10,00", hint: "por número" },
  { icon: Hash, label: "Números", value: "01 – 100", hint: "disponíveis" },
  { icon: Gift, label: "Prêmio", value: "Festa na Caixa", hint: "uma linda surpresa" },
  { icon: HandHeart, label: "Destino", value: "100%", hint: "para os exames" },
];

export function InformationCards() {
  return (
    <section className="mx-auto grid max-w-6xl gap-4 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
      {CARDS.map(({ icon: Icon, label, value, hint }) => (
        <div
          key={label}
          className="group rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft)]"
        >
          <div className="mb-4 grid h-11 w-11 place-items-center rounded-full bg-blush text-primary transition-transform group-hover:scale-110">
            <Icon className="h-5 w-5" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
          <p className="mt-1 font-display text-2xl font-semibold text-foreground">{value}</p>
          <p className="text-sm text-muted-foreground">{hint}</p>
        </div>
      ))}
    </section>
  );
}
