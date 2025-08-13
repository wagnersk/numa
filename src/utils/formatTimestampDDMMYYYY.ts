export function formatTimestampDDMMYYYY(timestamp: number): string {
  if (!timestamp || isNaN(timestamp)) return "";

  const date = new Date(timestamp);

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // mês começa no 0
  const yyyy = date.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}