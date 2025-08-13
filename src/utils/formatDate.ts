  export function formatDate(date: Date | null) {
    if (!date) return "";
    return date.toLocaleDateString("pt-BR");
  }

 