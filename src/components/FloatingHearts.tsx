import { Heart } from "lucide-react";

const HEARTS = [
  { top: "8%", left: "6%", size: 28, delay: "0s", opacity: 0.35 },
  { top: "18%", right: "10%", size: 20, delay: "1.2s", opacity: 0.3 },
  { top: "55%", left: "4%", size: 24, delay: "2.4s", opacity: 0.25 },
  { top: "72%", right: "8%", size: 32, delay: "0.6s", opacity: 0.28 },
  { top: "38%", right: "22%", size: 16, delay: "3.1s", opacity: 0.4 },
  { top: "88%", left: "18%", size: 22, delay: "1.8s", opacity: 0.3 },
];

export function FloatingHearts() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {HEARTS.map((h, i) => (
        <Heart
          key={i}
          className="animate-float-heart absolute text-primary"
          style={{
            top: h.top,
            left: h.left,
            right: h.right,
            width: h.size,
            height: h.size,
            opacity: h.opacity,
            animationDelay: h.delay,
            fill: "currentColor",
          }}
        />
      ))}
    </div>
  );
}
