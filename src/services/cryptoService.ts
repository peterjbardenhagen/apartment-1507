// Lightweight password hashing using the browser's built-in Web Crypto API.
// This is a client-only demo app with no backend, so this is best-effort
// obfuscation (protects against casually reading localStorage) rather than
// real production-grade auth security.
export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!hash) return false
  return (await hashPassword(password)) === hash
}
