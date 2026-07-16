import type { NumberStatus, Participant, RaffleNumber } from "@/types/raffle";
import { TOTAL_NUMBERS } from "@/types/raffle";

// Mocked service — ready to swap for Firebase later.
// Deterministic pretend-sold numbers so the UI feels real.
const SOLD = new Set([3, 7, 12, 22, 27, 34, 41, 49, 58, 63, 71, 77, 82, 88, 94]);
const RESERVED = new Set([5, 19, 45, 66]);

const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

export async function fetchNumbers(): Promise<RaffleNumber[]> {
  await delay(300);
  return Array.from({ length: TOTAL_NUMBERS }, (_, i) => {
    const value = i + 1;
    let status: NumberStatus = "available";
    if (SOLD.has(value)) status = "sold";
    else if (RESERVED.has(value)) status = "reserved";
    return { value, status };
  });
}

export async function reserveNumbers(numbers: number[], participant: Omit<Participant, "id" | "numbers" | "status" | "createdAt">): Promise<Participant> {
  await delay(600);
  return {
    id: `p_${Date.now()}`,
    name: participant.name,
    whatsapp: participant.whatsapp,
    email: participant.email,
    numbers,
    status: "pending",
    createdAt: Date.now(),
  };
}

export async function confirmPayment(participantId: string): Promise<{ ok: true }> {
  await delay(500);
  console.log("[mock] payment reported", participantId);
  return { ok: true };
}

export function getStats(numbers: RaffleNumber[]) {
  const sold = numbers.filter((n) => n.status === "sold").length;
  const reserved = numbers.filter((n) => n.status === "reserved").length;
  const available = numbers.filter((n) => n.status === "available").length;
  return { sold, reserved, available, raised: sold * 10, total: numbers.length };
}
