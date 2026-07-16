import {
  collection, doc, getDoc, getDocs, orderBy, query,
  runTransaction, serverTimestamp, Timestamp, writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { PRICE_PER_NUMBER, TOTAL_NUMBERS, type Participant, type RaffleNumber } from "@/types/raffle";
import type { ParticipantData } from "@/components/ParticipantForm";

const numId = (n: number) => String(n).padStart(2, "0");

// ---------- Público ----------

export async function fetchNumbers(): Promise<RaffleNumber[]> {
  const snap = await getDocs(collection(db, "numbers"));
  const map = new Map<number, RaffleNumber>();
  snap.forEach((d) => {
    const data = d.data();
    map.set(data.number, { number: data.number, status: data.status, participantId: data.participantId ?? null });
  });
  const result: RaffleNumber[] = [];
  for (let i = 1; i <= TOTAL_NUMBERS; i++) {
    result.push(map.get(i) ?? { number: i, status: "available", participantId: null });
  }
  return result;
}

export function getStats(numbers: RaffleNumber[]) {
  const sold = numbers.filter((n) => n.status === "paid").length;
  const reserved = numbers.filter((n) => n.status === "reserved" || n.status === "pending").length;
  const blocked = numbers.filter((n) => n.status === "blocked").length;
  return {
    sold,
    reserved,
    available: numbers.length - sold - reserved - blocked,
    raised: sold * PRICE_PER_NUMBER,
    total: numbers.length,
  };
}

export async function reserveNumbers(selected: number[], data: ParticipantData): Promise<Participant> {
  if (selected.length === 0) throw new Error("Selecione ao menos um número.");
  const participantRef = doc(collection(db, "participants"));

  await runTransaction(db, async (tx) => {
    const refs = selected.map((n) => doc(db, "numbers", numId(n)));
    const snaps = await Promise.all(refs.map((r) => tx.get(r)));

    snaps.forEach((snap, i) => {
      const status = snap.exists() ? snap.data().status : "available";
      if (status !== "available") throw new Error(`O número ${selected[i]} não está mais disponível.`);
    });

    refs.forEach((ref, i) => {
      tx.set(ref, { number: selected[i], status: "reserved", participantId: participantRef.id, updatedAt: serverTimestamp() });
    });

    tx.set(participantRef, {
      name: data.name, whatsapp: data.whatsapp, email: data.email ?? null,
      numbers: selected, status: "reserved", createdAt: serverTimestamp(), updatedAt: serverTimestamp(),
    });
  });

  return { id: participantRef.id, name: data.name, whatsapp: data.whatsapp, email: data.email, numbers: selected, status: "reserved", createdAt: Date.now() };
}

// Usuário avisa que pagou (ainda não é confirmação do admin)
export async function confirmPayment(participantId: string): Promise<void> {
  const ref = doc(db, "participants", participantId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Reserva não encontrada.");
  const numbers: number[] = snap.data().numbers;

  const batch = writeBatch(db);
  batch.update(ref, { status: "pending", updatedAt: serverTimestamp() });
  numbers.forEach((n) => batch.update(doc(db, "numbers", numId(n)), { status: "pending", updatedAt: serverTimestamp() }));
  await batch.commit();
}

// Chamar quando o ReservationTimer estourar (libera os números de verdade)
export async function expireReservation(participantId: string): Promise<void> {
  const ref = doc(db, "participants", participantId);
  const snap = await getDoc(ref);
  if (!snap.exists() || snap.data().status !== "reserved") return;
  const numbers: number[] = snap.data().numbers;

  const batch = writeBatch(db);
  numbers.forEach((n) => batch.update(doc(db, "numbers", numId(n)), { status: "available", participantId: null, updatedAt: serverTimestamp() }));
  batch.update(ref, { status: "cancelled", updatedAt: serverTimestamp() });
  await batch.commit();
}

// ---------- Admin ----------

export async function fetchParticipants(): Promise<Participant[]> {
  const q = query(collection(db, "participants"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id, name: data.name, whatsapp: data.whatsapp, email: data.email ?? undefined,
      numbers: data.numbers, status: data.status,
      createdAt: (data.createdAt as Timestamp | undefined)?.toMillis() ?? Date.now(),
    };
  });
}

export async function adminConfirmPayment(participantId: string): Promise<void> {
  const ref = doc(db, "participants", participantId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Participante não encontrado.");
  const numbers: number[] = snap.data().numbers;

  const batch = writeBatch(db);
  batch.update(ref, { status: "paid", updatedAt: serverTimestamp() });
  numbers.forEach((n) => batch.update(doc(db, "numbers", numId(n)), { status: "paid", updatedAt: serverTimestamp() }));
  await batch.commit();
}

export async function adminCancelReservation(participantId: string): Promise<void> {
  const ref = doc(db, "participants", participantId);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Participante não encontrado.");
  const numbers: number[] = snap.data().numbers;

  const batch = writeBatch(db);
  batch.update(ref, { status: "cancelled", updatedAt: serverTimestamp() });
  numbers.forEach((n) => batch.update(doc(db, "numbers", numId(n)), { status: "available", participantId: null, updatedAt: serverTimestamp() }));
  await batch.commit();
}

export async function adminReleaseNumber(n: number): Promise<void> {
  const batch = writeBatch(db);
  batch.update(doc(db, "numbers", numId(n)), { status: "available", participantId: null, updatedAt: serverTimestamp() });
  await batch.commit();
}

export async function adminBlockNumber(n: number): Promise<void> {
  const batch = writeBatch(db);
  batch.update(doc(db, "numbers", numId(n)), { status: "blocked", participantId: null, updatedAt: serverTimestamp() });
  await batch.commit();
}

export async function drawWinner(): Promise<{ number: number; participant: Participant } | null> {
  const snap = await getDocs(collection(db, "numbers"));
  const paid = snap.docs.map((d) => d.data()).filter((d) => d.status === "paid");
  if (paid.length === 0) return null;
  const winner = paid[Math.floor(Math.random() * paid.length)];
  const pSnap = await getDoc(doc(db, "participants", winner.participantId));
  const data = pSnap.data()!;
  return {
    number: winner.number,
    participant: {
      id: pSnap.id, name: data.name, whatsapp: data.whatsapp, numbers: data.numbers,
      status: data.status, createdAt: (data.createdAt as Timestamp)?.toMillis() ?? Date.now(),
    },
  };
}

// Rodar uma vez só, pra criar os 100 números
export async function seedNumbersIfNeeded(): Promise<void> {
  const snap = await getDocs(collection(db, "numbers"));
  if (!snap.empty) return;
  const batch = writeBatch(db);
  for (let i = 1; i <= TOTAL_NUMBERS; i++) {
    batch.set(doc(db, "numbers", numId(i)), { number: i, status: "available", participantId: null });
  }
  await batch.commit();
}