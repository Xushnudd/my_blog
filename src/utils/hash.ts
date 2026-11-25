import crypto from "node:crypto"

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derivedKey}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;
  
  const [salt, originalHex] = parts
  const originalBuf = Buffer.from(originalHex, "hex");
  const derivedBuf = crypto.scryptSync(password, salt, 64);

  if (originalBuf.length !== derivedBuf.length) return false;
  return crypto.timingSafeEqual(originalBuf, derivedBuf);
}