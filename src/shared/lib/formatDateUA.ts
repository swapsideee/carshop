export type DateInput = Date | string | number | null | undefined;

export function formatDateUA(dateValue: DateInput): string {
  if (dateValue == null || dateValue === '') return '';

  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return '';

  return d.toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
}
