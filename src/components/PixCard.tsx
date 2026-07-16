import { Check, Copy, QrCode } from "lucide-react";
import { useState } from "react";

export function PixCard({ amount, code }: { amount: number; code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Pagamento via Pix</p>
        <p className="mt-1 font-display text-3xl font-semibold text-primary">
          R$ {amount.toFixed(2).replace(".", ",")}
        </p>
      </div>
      <div className="mx-auto mt-6 grid h-52 w-52 place-items-center rounded-2xl bg-gradient-to-br from-blush to-white ring-1 ring-border">
        <QrCode className="h-32 w-32 text-primary/70" strokeWidth={1.2} />
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">QR Code Pix (demonstração)</p>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Pix Copia e Cola</p>
        <div className="mt-2 flex items-stretch gap-2">
          <code className="flex-1 truncate rounded-xl bg-muted px-3 py-2.5 text-xs text-muted-foreground">
            {code}
          </code>
          <button
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 text-xs font-semibold text-primary-foreground transition hover:brightness-105"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copiado" : "Copiar"}
          </button>
        </div>
      </div>
    </div>
  );
}
