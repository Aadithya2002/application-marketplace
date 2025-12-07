import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidUrl(urlString: string | null | undefined): boolean {
  if (!urlString) return false
  try {
    new URL(urlString)
    return true
  } catch (e) {
    return false
  }
}
