import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  format,
} from "date-fns";

export function calculateShiftDuration(start: Date, end: Date) {
  if (end <= start) {
    return { days: 0, hours: 0, minutes: 0 };
  }

  const days = differenceInDays(end, start);

  // Remove os dias para calcular horas restantes
  const hours = differenceInHours(end, start) - days * 24;

  // Remove dias e horas para calcular minutos restantes
  const minutes = differenceInMinutes(end, start) - (days * 24 + hours) * 60;

  return { days, hours, minutes };
}

export function formatShiftDuration(start: Date, end: Date) {
  const { days, hours, minutes } = calculateShiftDuration(start, end);

  const parts = [];

  if (days > 0) parts.push(`${days} dia${days > 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hora${hours > 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} minuto${minutes > 1 ? "s" : ""}`);

  return parts.length > 0 ? parts.join(", ") : "0 minutos";
}

export function toHtmlDatetimeLocal(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes())
  );
}

export function addHours(hours: number, date: Date = new Date()): Date {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
}

export const formatCompleteDate = (date: Date) => {
  return format(date, "dd/MM/yyyy HH:mm");
};

export const formatToSimpleDateOnly = (date: string) => {
  const result = new Date(date);
  return format(result, "yyyy-MM-dd");
};
