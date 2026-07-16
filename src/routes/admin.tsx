import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, RotateCcw, Search, Trophy, XCircle } from "lucide-react";
import {
  fetchNumbers,
  fetchParticipants,
  getStats,
  adminConfirmPayment,
  adminCancelReservation,
  drawWinner,
} from "@/services/raffleService";
import type { Participant, RaffleNumber } from "@/types/raffle";
import { Toast } from "@/components/Toast";
import { Loading } from "@/components/Loading";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administração — Rifa da Mônica" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

type Filter = "all" | "paid" | "pending" | "reserved" | "cancelled";

function AdminPage() {
  const [numbers, setNumbers] = useState<RaffleNumber[] | null>(null);
  const [participants, setParticipants] = useState<Participant[] | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [drawing, setDrawing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const reload = async () => {
    const [n, p] = await Promise.all([fetchNumbers(), fetchParticipants()]);
    setNumbers(n);
    setParticipants(p);
  };

  useEffect(() => {
    reload();
  }, []);

  const stats = numbers ? getStats(numbers) : { sold: 0, reserved: 0, available: 0, raised: 0, total: 100 };

  const filtered = useMemo(() => {
    if (!participants) return [];
    return participants.filter((p) => {
      if (filter !== "all" && p.status !== filter) return false;
      if (query && !p.name.toLowerCase().includes(query.toLowerCase()) && !p.whatsapp.includes(query)) return false;
      return true;
    });
  }, [participants, query, filter]);

  const handleConfirm = async (p: Participant) => {
    setBusyId(p.id);
    try {
      await adminConfirmPayment(p.id);
      await reload();
      setToast(`Pagamento de ${p.name.split(" ")[0]} confirmado.`);
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Erro ao confirmar pagamento.");
    } finally {
      setBusyId(null);
    }
  };

  const handleCancel = async (p: Participant) => {
    if (!confirm(`Cancelar a reserva de ${p.name} e liberar os números?`)) return;
    setBusyId(p.id);
    try {
      await adminCancelReservation(p.id);
      await reload();
      setToast(`Reserva de ${p.name.split(" ")[0]} cancelada e números liberados.`);
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Erro ao cancelar reserva.");
    } finally {
      setBusyId(null);
    }
  };

  const handleResend = (p: Participant) => {
    const digits = p.whatsapp.replace(/\D/g, "");
    const text = encodeURIComponent(
      `Oi ${p.name.split(" ")[0]}! Passando para lembrar do pagamento dos números ${p.numbers
        .map((n) => String(n).padStart(2, "0"))
        .join(", ")} da rifa da Mônica 💛`
    );
    window.open(`https://wa.me/55${digits}?text=${text}`, "_blank");
  };

  const handleDraw = async () => {
    if (!confirm("Sortear o ganhador agora entre todos os números pagos?")) return;
    setDrawing(true);
    try {
      const result = await drawWinner();
      if (!result) {
        setToast("Ainda não há números pagos para sortear.");
        return;
      }
      setToast(`🎉 Ganhador: ${result.participant.name} — número ${String(result.number).padStart(2, "0")}!`);
    } catch (e) {
      setToast(e instanceof Error ? e.message : "Erro ao sortear.");
    } finally {
      setDrawing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toast message={toast} onClose={() => setToast(null)} />

      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Painel</p>
            <h1 className="font-display text-2xl font-semibold">Administração da Rifa</h1>
          </div>
          <Link to="/" className="rounded-full border border-input bg-background px-4 py-2 text-sm font-semibold hover:bg-accent">
            Voltar ao site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Vendidos" value={stats.sold} tone="primary" />
          <Stat label="Reservados" value={stats.reserved} tone="warning" />
          <Stat label="Disponíveis" value={stats.available} tone="muted" />
          <Stat label="Arrecadado" value={`R$ ${stats.raised.toFixed(2).replace(".", ",")}`} tone="primary" />
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-[var(--shadow-card)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar participante"
                className="w-full rounded-full border border-input bg-background py-2.5 pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {(["all", "paid", "pending", "reserved", "cancelled"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {f === "all" ? "Todos" : f === "paid" ? "Pago" : f === "pending" ? "Pendente" : f === "reserved" ? "Reservado" : "Cancelado"}
                </button>
              ))}
              <button
                onClick={handleDraw}
                disabled={drawing}
                className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-semibold text-background disabled:opacity-60"
              >
                <Trophy className="h-3.5 w-3.5" /> {drawing ? "Sorteando..." : "Sortear ganhador"}
              </button>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            {!participants ? (
              <Loading label="Carregando participantes..." />
            ) : (
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="py-2 pr-4">Participante</th>
                    <th className="py-2 pr-4">WhatsApp</th>
                    <th className="py-2 pr-4">Números</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((p) => (
                    <tr key={p.id} className="text-sm">
                      <td className="py-3 pr-4 font-semibold text-foreground">{p.name}</td>
                      <td className="py-3 pr-4 text-muted-foreground">{p.whatsapp}</td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-wrap gap-1">
                          {p.numbers.map((n) => (
                            <span key={n} className="rounded-md bg-blush px-1.5 py-0.5 text-xs font-semibold text-primary">
                              {String(n).padStart(2, "0")}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <StatusBadge status={p.status} />
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex flex-wrap gap-1.5">
                          <IconBtn
                            title="Confirmar pagamento"
                            icon={CheckCircle2}
                            disabled={busyId === p.id || p.status === "paid" || p.status === "cancelled"}
                            onClick={() => handleConfirm(p)}
                          />
                          <IconBtn
                            title="Cancelar reserva"
                            icon={XCircle}
                            disabled={busyId === p.id || p.status === "cancelled"}
                            onClick={() => handleCancel(p)}
                          />
                          <IconBtn
                            title="Reenviar cobrança no WhatsApp"
                            icon={RotateCcw}
                            disabled={p.status === "paid" || p.status === "cancelled"}
                            onClick={() => handleResend(p)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                        Nenhum participante encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string | number; tone: "primary" | "warning" | "muted" }) {
  const toneCls = tone === "primary" ? "text-primary" : tone === "warning" ? "text-amber-600" : "text-foreground";
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`mt-1 font-display text-3xl font-semibold ${toneCls}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: Participant["status"] }) {
  const map = {
    paid: { label: "Pago", cls: "bg-green-100 text-green-800" },
    pending: { label: "Pendente", cls: "bg-yellow-100 text-yellow-800" },
    reserved: { label: "Reservado", cls: "bg-blush text-primary" },
    cancelled: { label: "Cancelado", cls: "bg-muted text-muted-foreground" },
  } as const;
  const it = map[status];
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${it.cls}`}>{it.label}</span>;
}

function IconBtn({
  title,
  icon: Icon,
  onClick,
  disabled,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className="grid h-8 w-8 place-items-center rounded-lg border border-border bg-background text-muted-foreground transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}