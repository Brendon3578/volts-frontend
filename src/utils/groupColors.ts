export const groupColors = [
  { color: "#3DA5FF", label: "Azul vibrante" },
  { color: "#FF7B2C", label: "Laranja energético" },
  { color: "#B565F7", label: "Roxo intenso" },
  { color: "#4ADE80", label: "Verde brilhante" },
  { color: "#FF5C5C", label: "Vermelho vivo" },
  { color: "#FFD93D", label: "Amarelo forte" },
  { color: "#A0A0A0", label: "Cinza neutro" },
  { color: "#FF66B3", label: "Rosa vibrante" },
  { color: "#5CA9E6", label: "Azul claro forte" },
  { color: "#A874FF", label: "Lilás vívido" },
  { color: "#C9A2FF", label: "Lavanda intensa" },
];

// Função getBrightness otimizada com cache
const brightnessCache = new Map<string, number>();

export function getBrightness(hex: string): number {
  // Verificar se é um valor CSS custom property
  if (hex.startsWith("var(")) {
    return 128; // valor padrão neutro para CSS variables
  }

  // Verificar cache primeiro
  if (brightnessCache.has(hex)) {
    return brightnessCache.get(hex)!;
  }

  const cleaned = hex.replace("#", "");

  // Normaliza para formato #RRGGBB de forma mais eficiente
  const fullHex =
    cleaned.length === 3 ? cleaned.replace(/(.)/g, "$1$1") : cleaned;

  const bigint = parseInt(fullHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  // Fórmula de luminância percebida otimizada
  const brightness = Math.round((r * 299 + g * 587 + b * 114) / 1000);

  // Armazenar no cache
  brightnessCache.set(hex, brightness);

  return brightness;
}
