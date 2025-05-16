import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createUniqueKey(val: string, length: number) {
  return `${btoa(val).substring(0, length)}`;
}
