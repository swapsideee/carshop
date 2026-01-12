export function validatePhone(phone) {
  const cleaned = phone.replace(/\s+/g, '');
  const isValid = /^\+?\d{9,15}$/.test(cleaned);
  return { isValid, cleaned };
}

export function validateName(name) {
  const cleaned = name.trim();
  const isValid = /^[a-zA-Zа-яА-ЯіІїЇєЄґҐ\s'-]+$/.test(cleaned);
  return { isValid, cleaned };
}
