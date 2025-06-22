export function validatePhone(phone) {
    const cleaned = phone.replace(/\s+/g, "");
    const isValid = /^\+?\d{9,15}$/.test(cleaned);
    return { isValid, cleaned };
}
