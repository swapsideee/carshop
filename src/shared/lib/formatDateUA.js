export function formatDateUA(dateValue) {
  if (dateValue == null || dateValue === '') return '';

  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return '';

  return d.toLocaleDateString('uk-UA', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  });
}
