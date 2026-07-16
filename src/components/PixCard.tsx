import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function PixCard({ amount, code }: { amount: number; code: string }) {
  const [copied, setCopied] = useState(false);
  
  // API gratuita que transforma o texto do Pix em imagem de QR Code
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(code)}`;

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
      
      <div className="mx-auto mt-6 grid h-52 w-52 overflow-hidden place-items-center rounded-2xl bg-white ring-1 ring-border">
        <img 
          src={qrCodeUrl} 
          alt="QR Code do Pix" 
          className="h-full w-full object-contain p-2"
        />
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">Abra o app do seu banco e escaneie o código</p>

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