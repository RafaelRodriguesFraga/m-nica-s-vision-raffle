export type NumberStatus = "available" | "reserved" | "sold";

export interface RaffleNumber {
  value: number;
  status: NumberStatus;
  participantId?: string;
}

export interface Participant {
  id: string;
  name: string;
  whatsapp: string;
  email?: string;
  numbers: number[];
  status: "reserved" | "pending" | "paid";
  createdAt: number;
}

export const PRICE_PER_NUMBER = 10;
export const TOTAL_NUMBERS = 100;
export const RESERVATION_MINUTES = 15;
