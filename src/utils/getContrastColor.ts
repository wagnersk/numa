/**
 * Retorna 'black' ou 'white' dependendo do contraste com a cor de fundo
 * @param hex cor hexadecimal (ex: "#FFAA00" ou "FFAA00")
 */
export function getContrastColor(hex: string): "black" | "white" {
  // Remove # se existir
  hex = hex.replace("#", "");

  // Converte hex para RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Calcula luminância relativa (fórmula padrão)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Se luminância > 0.5, fundo é claro → texto preto; caso contrário → texto branco
  return luminance > 0.5 ? "black" : "white";
}