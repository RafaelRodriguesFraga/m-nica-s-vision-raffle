import { Eye, Clock, Heart, ShieldCheck } from "lucide-react";

const POINTS = [
  { icon: Eye, title: "Diagnóstico de glaucoma", text: "A Mônica recebeu recentemente o diagnóstico e precisa acompanhar a saúde dos olhos." },
  { icon: Clock, title: "Exames urgentes", text: "Pelo SUS, os exames sairiam apenas em alguns meses — tempo demais para esperar." },
  { icon: Heart, title: "Rede de amor", text: "A rifa nasceu para custear os exames na rede particular, com a ajuda de quem tem um cantinho no peito para ela." },
  { icon: ShieldCheck, title: "Cada número importa", text: "100% do valor arrecadado vai direto para os exames. Sua contribuição faz diferença de verdade." },
];

export function StoryCard() {
  return (
    <section id="sobre" className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]">
        <div className="grid gap-0 md:grid-cols-[1.1fr_1fr]">
          <div className="relative p-8 sm:p-12" style={{ background: "var(--gradient-warm)" }}>
            <span className="inline-block rounded-full bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
              A história
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold text-foreground sm:text-4xl">
              Um pedido de ajuda que virou uma corrente do bem.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-foreground/80">
              A Mônica é uma mulher batalhadora, cheia de vida — e agora precisa
              do carinho de todos nós. Com o diagnóstico de glaucoma, cada dia
              conta para preservar sua visão. Você entra nessa com a gente?
            </p>
          </div>
          <ul className="divide-y divide-border">
            {POINTS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4 p-6">
                <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blush text-primary">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{title}</p>
                  <p className="text-sm text-muted-foreground">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
