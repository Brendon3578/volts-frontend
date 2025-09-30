export const groupColors = [
  { color: "#AEC6CF", label: "Azul pastel" },
  { color: "#FFB347", label: "Laranja pastel" },
  { color: "#B39EB5", label: "Roxo pastel" },
  { color: "#77DD77", label: "Verde menta" },
  { color: "#FF6961", label: "Vermelho suave" },
  { color: "#FDFD96", label: "Amarelo canário" },
  { color: "#CFCFC4", label: "Cinza claro" },
  { color: "#F49AC2", label: "Rosa bebê" },
  { color: "#779ECB", label: "Azul lavanda" },
  { color: "#966FD6", label: "Lilás" },
  { color: "#FFDAC1", label: "Pêssego claro" },
  { color: "#E0BBE4", label: "Lavanda clara" },
  { color: "#D5AAFF", label: "Violeta suave" },
  { color: "#C1E1C1", label: "Verde chá" },
  { color: "#FF9AA2", label: "Rosa coral" },
  { color: "#B5EAD7", label: "Verde água" },
  { color: "#E2F0CB", label: "Verde lima" },
  { color: "#C7CEEA", label: "Azul lilás" },
  { color: "#FFF5BA", label: "Amarelo creme" },
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
