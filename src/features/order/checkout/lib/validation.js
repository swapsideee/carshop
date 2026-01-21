import { validateName, validatePhone } from '@/shared/lib';

const EMAIL_RE = /\S+@\S+\.\S+/;

export function validateOrderForm(form) {
  const { isValid: phoneValid, cleaned: cleanedPhone } = validatePhone(form.phone);
  const { isValid: nameValid, cleaned: cleanedName } = validateName(form.name);

  if (!nameValid) return { ok: false, error: 'Ім’я повинно містити лише літери' };
  if (!phoneValid) return { ok: false, error: 'Введіть коректний номер телефону' };

  const email = (form.email || '').trim();
  if (!email || !EMAIL_RE.test(email)) return { ok: false, error: 'Введіть коректний email' };

  return {
    ok: true,
    cleaned: {
      name: cleanedName,
      phone: cleanedPhone,
      email,
      comment: (form.comment || '').trim(),
    },
  };
}
