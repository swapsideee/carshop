export type ValidationResult = {
  isValid: boolean;
  cleaned: string;
};

export function validatePhone(phone: string): ValidationResult {
  const cleaned = phone.replace(/\s+/g, '');
  const isValid = /^\+?\d{9,15}$/.test(cleaned);
  return { isValid, cleaned };
}

export function validateName(name: string): ValidationResult {
  const cleaned = name.trim();
  const isValid = /^[a-zA-Zа-яА-ЯіІїЇєЄґҐ\s'-]+$/.test(cleaned);
  return { isValid, cleaned };
}
