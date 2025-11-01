// Generates secure random alphanumeric or numeric IDs

export function genNumericId(len: number): string {
  let out = '';
  while (out.length < len) out += Math.floor(Math.random() * 10);
  return out;
}

export function genBase36Id(len: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}