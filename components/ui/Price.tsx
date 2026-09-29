export function Price({ value }: { value: number | null }) {
  return <span className="price">{value == null ? 'Price coming soon' : new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP',maximumFractionDigits:0}).format(value)}</span>;
}
