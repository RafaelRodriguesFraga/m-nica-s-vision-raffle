export type NumberStatus = "available" | "reserved" | "pending" | "paid" | "blocked";

export interface RaffleNumber {
  number: number;
  status: NumberStatus;
  participantId?: string | null;
}

export type ParticipantStatus = "reserved" | "pending" | "paid" | "cancelled";

export interface Participant {
  id: string;
  name: string;
  whatsapp: string;
  email?: string;
  numbers: number[];
  status: ParticipantStatus;
  createdAt: number;
}

export const PRICE_PER_NUMBER = 10;
export const TOTAL_NUMBERS = 100;
export const RESERVATION_MINUTES = 15;