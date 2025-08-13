export function numberToCurrency(
  value: number,
  currency: 'BRL' | 'USD' | 'EUR' = 'BRL'
) {
  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : currency === 'EUR' ? 'de-DE' : 'pt-BR', {
    style: 'currency',
    currency
  }).format(value)
}