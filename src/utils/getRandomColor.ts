import { colorsList } from "@/utils/colorList";

/**
 * Gera uma cor aleatória que ainda não foi usada.
 * @param usedColors Lista de cores já utilizadas.
 * @returns Uma cor aleatória ou null caso não existam mais cores disponíveis.
 */
export function getRandomUnusedColor(usedColors: string[]): string | null {
  const availableColors = colorsList.filter((c) => !usedColors.includes(c));

  if (availableColors.length === 0) {
    return null; 
  }

  const randomIndex = Math.floor(Math.random() * availableColors.length);
  return availableColors[randomIndex];
}