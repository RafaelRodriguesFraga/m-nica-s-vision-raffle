import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";

export function Toast({ message, onClose }: { message: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!message) return;
    const id = setTimeout(onClose, 3000);
    return () => clearTimeout(id);
  }, [message, onClose]);
  if (!message) return null;
  return (
    <div className="fixed left-1/2 top-6 z-50 -translate-x-1/2 animate-pop-in">
      <div className="flex items-center gap-3 rounded-full bg-foreground px-4 py-2.5 text-sm text-background shadow-lg">
        <CheckCircle2 className="h-4 w-4 text-primary" />
        {message}
        <button onClick={onClose} aria-label="Fechar" className="opacity-70 hover:opacity-100">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
