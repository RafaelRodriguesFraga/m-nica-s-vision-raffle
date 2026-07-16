import { Timer } from "lucide-react";
import { useEffect, useState } from "react";

export function ReservationTimer({ expiresAt, onExpire }: { expiresAt: number; onExpire?: () => void }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const remaining = Math.max(0, expiresAt - now);
  useEffect(() => {
    if (remaining === 0) onExpire?.();
  }, [remaining, onExpire]);
  const m = Math.floor(remaining / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-blush px-4 py-2 text-sm font-semibold text-primary">
      <Timer className="h-4 w-4" />
      Reserva expira em {String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}
    </div>
  );
}
