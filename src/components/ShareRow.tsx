import { Facebook, Instagram, Link2, MessageCircle } from "lucide-react";
import { useState } from "react";

export function ShareRow() {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.origin : "";
  const text = "Participe da Rifa Solidária pela Mônica 💖";
  const items = [
    { label: "WhatsApp", icon: MessageCircle, href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}` },
    { label: "Instagram", icon: Instagram, href: "https://instagram.com" },
  ];
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <section id="compartilhar" className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-card)]" style={{ background: "var(--gradient-warm)" }}>
        <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
          Espalhe essa corrente de amor
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Compartilhe a rifa com sua família e amigos.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {items.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2.5 text-sm font-semibold text-foreground shadow-sm transition hover:-translate-y-0.5 hover:bg-white"
            >
              <Icon className="h-4 w-4 text-primary" /> {label}
            </a>
          ))}
          <button
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-105"
          >
            <Link2 className="h-4 w-4" /> {copied ? "Link copiado!" : "Copiar link"}
          </button>
        </div>
      </div>
    </section>
  );
}
