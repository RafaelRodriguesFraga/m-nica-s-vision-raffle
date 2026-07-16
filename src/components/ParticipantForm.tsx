import { useState } from "react";

export interface ParticipantData {
  name: string;
  whatsapp: string;
  email?: string;
}

export function ParticipantForm({
  onSubmit,
  loading,
}: {
  onSubmit: (data: ParticipantData) => void;
  loading?: boolean;
}) {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; whatsapp?: string; email?: string }>({});

  // Máscara automática para o WhatsApp com suporte ao nono dígito separado
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, ""); // Remove tudo que não for número
    if (val.length > 11) val = val.slice(0, 11);
    
    // Formatação dinâmica
    if (val.length > 2) {
      const ddd = val.slice(0, 2);
      const rest = val.slice(2);
      
      if (rest.length > 8) {
        // Formato Celular (9 dígitos): (XX) 9 XXXX-XXXX
        val = `(${ddd}) ${rest.slice(0, 1)} ${rest.slice(1, 5)}-${rest.slice(5)}`;
      } else if (rest.length > 4) {
        // Formato Intermediário / Fixo (8 dígitos): (XX) XXXX-XXXX
        val = `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
      } else {
        val = `(${ddd}) ${rest}`;
      }
    } else if (val.length > 0) {
      // Enquanto digita o DDD: (XX
      val = `(${val}`;
    }
    
    setWhatsapp(val);
    
    // Limpa o erro quando a pessoa começa a digitar de novo
    if (errors.whatsapp) setErrors((p) => ({ ...p, whatsapp: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; whatsapp?: string; email?: string } = {};

    // Validação de Nome (Mínimo 3 letras)
    if (name.trim().length < 3) {
      newErrors.name = "Por favor, digite seu nome completo.";
    }

    // Validação de Celular (Precisa ter 10 ou 11 números)
    const phoneDigits = whatsapp.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      newErrors.whatsapp = "Digite um celular válido com DDD.";
    }

    // Validação de E-mail (Opcional, mas se preencher, tem que ser válido)
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Digite um e-mail válido.";
    }

    // Se tiver algum erro, para por aqui e mostra na tela
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Se estiver tudo certo, envia os dados!
    onSubmit({ 
      name: name.trim(), 
      whatsapp: whatsapp.trim(), 
      email: email.trim() || undefined 
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-semibold text-foreground">
          Nome completo <span className="text-primary">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
          }}
          placeholder="Como podemos te chamar?"
          className={`w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:ring-2 ${
            errors.name 
              ? "border-red-500 focus:ring-red-500/20" 
              : "border-input focus:border-primary focus:ring-primary/20"
          }`}
          disabled={loading}
        />
        {errors.name && <p className="mt-1 text-xs font-medium text-red-500">{errors.name}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-foreground">
          WhatsApp <span className="text-primary">*</span>
        </label>
        <input
          type="tel"
          value={whatsapp}
          onChange={handlePhoneChange}
          placeholder="(27) 9 9662-6640"
          className={`w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:ring-2 ${
            errors.whatsapp 
              ? "border-red-500 focus:ring-red-500/20" 
              : "border-input focus:border-primary focus:ring-primary/20"
          }`}
          disabled={loading}
        />
        {errors.whatsapp && <p className="mt-1 text-xs font-medium text-red-500">{errors.whatsapp}</p>}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-semibold text-foreground">
          E-mail <span className="text-muted-foreground font-normal">(opcional)</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
          }}
          placeholder="voce@email.com"
          className={`w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:ring-2 ${
            errors.email 
              ? "border-red-500 focus:ring-red-500/20" 
              : "border-input focus:border-primary focus:ring-primary/20"
          }`}
          disabled={loading}
        />
        {errors.email && <p className="mt-1 text-xs font-medium text-red-500">{errors.email}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:brightness-105 disabled:opacity-60 cursor-pointer"
      >
        {loading ? "Processando..." : "Continuar"}
      </button>
    </form>
  );
}