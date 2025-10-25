import crypto from "crypto";

/**
 * Web8 Encryption Manager - Functional Encryption Service
 * Pure functional approach to encryption/decryption without OOP patterns
 * 
 * @author Ledjan Ahmati 
 * @version 8.0.0 Web8
 */

// Web8 Encryption Types
interface Web8EncryptionContext {
  readonly encryptionKey: Buffer;
  readonly iv: Buffer;
}

// Web8 Encryption Context Factory
function createEncryptionContext(key: string): Web8EncryptionContext {
  if (key.length !== 44) {
    throw new Error("Çelësi duhet të jetë një string Base64 me gjatësi 44 karaktere.");
  }
  
  return {
    encryptionKey: Buffer.from(key, "base64"),
    iv: Buffer.alloc(16, 0) // Vektor inicializimi (IV) i paracaktuar
  };
}

/**
 * Web8 Encryption Function
 * @param text Teksti për enkriptim
 * @param context Web8 encryption context
 * @returns Teksti i enkriptuar në format Base64
 */
function encryptText(text: string, context: Web8EncryptionContext): string {
  const cipher = crypto.createCipheriv("aes-256-cbc", context.encryptionKey, context.iv);
  let encrypted = cipher.update(text, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

/**
 * Web8 Decryption Function
 * @param encrypted Teksti i enkriptuar në format Base64
 * @param context Web8 encryption context
 * @returns Teksti i dekriptuar
 */
function decryptText(encrypted: string, context: Web8EncryptionContext): string {
  const decipher = crypto.createDecipheriv("aes-256-cbc", context.encryptionKey, context.iv);
  let decrypted = decipher.update(encrypted, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

/**
 * Web8 Key Generation Function
 * @returns Një çelës i ri enkriptimi në format Base64
 */
function generateEncryptionKey(): string {
  return crypto.randomBytes(32).toString("base64");
}

// Web8 Functional Exports
export {
  createEncryptionContext,
  encryptText,
  decryptText,
  generateEncryptionKey
};

export type {
  Web8EncryptionContext
};

// Web8 Usage Example
const encryptionKey = generateEncryptionKey();
const context = createEncryptionContext(encryptionKey);

const text = "Ultrawebthinking është e ardhmja!";
const encrypted = encryptText(text, context);
const decrypted = decryptText(encrypted, context);
