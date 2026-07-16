import { useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";

export interface ParticipantData {
  name: string;
  whatsapp: string;
  email?: string;
}

export function ParticipantForm({ onSubmit, loading }: { onSubmit: (d: ParticipantData) => void; loading?: boolean }) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatsapp.trim()) return;
    onSubmit({ name: name.trim(), whatsapp: whatsapp.trim(), email: email.trim() || undefined });
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Nome completo" required>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Como podemos te chamar?"
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </Field>
      <Field label="WhatsApp" required>
        <input
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          required
          inputMode="tel"
          placeholder="(11) 99999-9999"
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </Field>
      <Field label="Email (opcional)">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="voce@email.com"
          className="w-full rounded-xl border border-input bg-background px-4 py-3 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </Field>
      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:brightness-105 disabled:opacity-60"
      >
        {loading ? "Reservando..." : "Continuar"}
        {!loading && <ArrowRight className="h-4 w-4" />}
      </button>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-foreground">
        {label} {required && <span className="text-primary">*</span>}
      </span>
      {children}
    </label>
  );
}
