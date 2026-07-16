import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, MessageCircle } from "lucide-react";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { InformationCards } from "@/components/InformationCards";
import { StoryCard } from "@/components/StoryCard";
import { ProgressBar } from "@/components/ProgressBar";
import { NumberGrid } from "@/components/NumberGrid";
import { SelectedNumbersCard } from "@/components/SelectedNumbersCard";
import { ReservationTimer } from "@/components/ReservationTimer";
import { ParticipantForm, type ParticipantData } from "@/components/ParticipantForm";
import { PixCard } from "@/components/PixCard";
import { ShareRow } from "@/components/ShareRow";
import { Footer } from "@/components/Footer";
import { Loading } from "@/components/Loading";
import { Toast } from "@/components/Toast";

import { fetchNumbers, reserveNumbers, confirmPayment, getStats } from "@/services/raffleService";
import { PRICE_PER_NUMBER, RESERVATION_MINUTES, type Participant, type RaffleNumber } from "@/types/raffle";

export const Route = createFileRoute("/")({
  component: Index,
});

type Step = "select" | "form" | "payment" | "done";

function Index() {
  const [numbers, setNumbers] = useState<RaffleNumber[] | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [step, setStep] = useState<Step>("select");
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNumbers().then(setNumbers);
  }, []);

  const stats = numbers ? getStats(numbers) : { sold: 0, reserved: 0, available: 0, raised: 0, total: 100 };

  const selectedArr = useMemo(() => Array.from(selected).sort((a, b) => a - b), [selected]);
  const total = selectedArr.length * PRICE_PER_NUMBER;

  const toggle = (n: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  };

  const scrollToGrid = () => gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const continueToForm = () => {
    if (selectedArr.length === 0) return;
    setStep("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitForm = async (data: ParticipantData) => {
    setLoading(true);
    try {
      const p = await reserveNumbers(selectedArr, data);
      setParticipant(p);
      setExpiresAt(Date.now() + RESERVATION_MINUTES * 60 * 1000);
      setStep("payment");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  const reportPayment = async () => {
    if (!participant) return;
    setLoading(true);
    try {
      await confirmPayment(participant.id);
      setStep("done");
      setToast("Recebemos! Confirmação em breve.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  const backHome = () => {
    setSelected(new Set());
    setParticipant(null);
    setExpiresAt(null);
    setStep("select");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Toast message={toast} onClose={() => setToast(null)} />
      <Navbar />

      {step === "select" && (
        <>
          <Hero onCta={scrollToGrid} />
          <InformationCards />
          <StoryCard />

          <section id="numeros" ref={gridRef} className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <div className="mb-8 text-center">
              <span className="inline-block rounded-full bg-blush px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
                Escolha seus números
              </span>
              <h2 className="mt-3 font-display text-3xl font-semibold text-foreground sm:text-4xl">
                Toque nos números para participar
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                R$ 10,00 por número · você pode escolher quantos quiser
              </p>
            </div>

            <div className="mb-6">
              <ProgressBar sold={stats.sold} total={stats.total} />
            </div>

            <Legend />

            {!numbers ? (
              <Loading label="Carregando números..." />
            ) : (
              <div className="mt-6 pb-40 sm:pb-8">
                <NumberGrid numbers={numbers} selected={selected} onToggle={toggle} />
              </div>
            )}
          </section>

          <ShareRow />
          <SelectedNumbersCard
            selected={selectedArr}
            onRemove={toggle}
            onContinue={continueToForm}
          />
        </>
      )}

      {step === "form" && (
        <FlowContainer title="Seus dados" subtitle="Precisamos deles para reservar seus números.">
          <div className="mb-6 rounded-2xl bg-blush p-4 text-sm text-primary">
            <p className="font-semibold">Números selecionados</p>
            <p className="mt-1">{selectedArr.map((n) => String(n).padStart(2, "0")).join(", ")}</p>
            <p className="mt-2 font-display text-xl font-semibold">
              Total: R$ {total.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <ParticipantForm onSubmit={submitForm} loading={loading} />
          <button onClick={() => setStep("select")} className="mt-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Voltar aos números
          </button>
        </FlowContainer>
      )}

      {step === "payment" && participant && expiresAt && (
        <FlowContainer title="Pagamento" subtitle="Finalize com o Pix abaixo.">
          <div className="mb-4 flex justify-center">
            <ReservationTimer expiresAt={expiresAt} onExpire={backHome} />
          </div>
          <PixCard amount={total} code={`00020126360014BR.GOV.BCB.PIX...RIFA-MONICA-${participant.id}`} />
          <p className="mt-4 rounded-xl bg-muted p-4 text-center text-xs text-muted-foreground">
            Seus números serão confirmados após a verificação do pagamento.
          </p>
          <button
            onClick={reportPayment}
            disabled={loading}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-[var(--shadow-soft)] transition hover:brightness-105 disabled:opacity-60"
          >
            {loading ? "Enviando..." : "Já fiz o pagamento"}
          </button>
        </FlowContainer>
      )}

      {step === "done" && participant && (
        <FlowContainer title="Obrigada de coração!" subtitle="Você acabou de fazer parte dessa corrente de amor.">
          <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-card)]">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-blush">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <p className="mt-4 font-display text-2xl font-semibold text-foreground">
              {participant.name.split(" ")[0]}, recebemos seu pedido!
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Números: <span className="font-semibold text-foreground">{selectedArr.map((n) => String(n).padStart(2, "0")).join(", ")}</span>
            </p>
            <div className="mt-5 inline-flex rounded-full bg-yellow-100 px-4 py-1.5 text-xs font-semibold text-yellow-800">
              Aguardando confirmação do pagamento
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button onClick={backHome} className="flex-1 rounded-full border border-input bg-background px-5 py-3 text-sm font-semibold text-foreground hover:bg-accent">
              Voltar ao início
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent("Oi! Acabei de participar da rifa da Mônica.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:brightness-105"
            >
              <MessageCircle className="h-4 w-4" /> Falar com a organização
            </a>
          </div>
        </FlowContainer>
      )}

      <Footer />
    </div>
  );
}

function FlowContainer({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-xl px-4 py-14 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="font-display text-3xl font-semibold text-foreground sm:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {children}
      <div className="mt-8 text-center">
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">← Página inicial</Link>
      </div>
    </section>
  );
}

function Legend() {
  const items = [
    { label: "Disponível", cls: "bg-card border-2 border-primary/30" },
    { label: "Selecionado", cls: "bg-primary" },
    { label: "Indisponível", cls: "bg-muted" },
  ];
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
      {items.map((it) => (
        <div key={it.label} className="inline-flex items-center gap-2">
          <span className={`inline-block h-4 w-4 rounded-md ${it.cls}`} />
          {it.label}
        </div>
      ))}
    </div>
  );
}
