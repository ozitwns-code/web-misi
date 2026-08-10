export function normalizeNoWa(raw: string) {
  return raw.replace(/[\s-]/g, "");
}

export function isValidNoWa(noWa: string) {
  return /^\+?\d{9,15}$/.test(noWa);
}

export function isValidPassword(password: string) {
  return typeof password === "string" && password.length >= 8;
}

export function isValidNama(nama: string) {
  return typeof nama === "string" && nama.trim().length >= 2;
}
