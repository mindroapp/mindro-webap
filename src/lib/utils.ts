
import { type ClassValue, clsx } from "clsx";
import { format, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string, formatStr: string = "PPP") {
  try {
    const date = parseISO(dateString);
    return format(date, formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
}
