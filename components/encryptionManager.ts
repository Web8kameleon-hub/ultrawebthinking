import crypto from "crypto";

/**
 * EncryptionManager - Një klasë për menaxhimin e enkriptimit dhe dekriptimit.
 * Siguron funksionalitete për të ruajtur dhe përdorur çelësat e enkriptimit.
 */
export class EncryptionManager {
  private readonly encryptionKey: Buffer;
  private readonly iv: Buffer;

  constructor(key: string) {
    if (key.length !== 44) {
      throw new Error("Çelësi duhet të jetë një string Base64 me gjatësi 44 karaktere.");
    }
    this.encryptionKey = Buffer.from(key, "base64");
    this.iv = Buffer.alloc(16, 0); // Vektor inicializimi (IV) i paracaktuar
  }

  /**
   * Enkripton një tekst të dhënë.
   * @param text Teksti për enkriptim.
   * @returns Teksti i enkriptuar në format Base64.
   */
  encrypt(text: string): string {
    const cipher = crypto.createCipheriv("aes-256-cbc", this.encryptionKey, this.iv);
    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
  }

  /**
   * Dekripton një tekst të enkriptuar.
   * @param encrypted Teksti i enkriptuar në format Base64.
   * @returns Teksti i dekriptuar.
   */
  decrypt(encrypted: string): string {
    const decipher = crypto.createDecipheriv("aes-256-cbc", this.encryptionKey, this.iv);
    let decrypted = decipher.update(encrypted, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }

  /**
   * Gjeneron një çelës të ri enkriptimi në format Base64.
   * @returns Një çelës i ri enkriptimi.
   */
  static generateKey(): string {
    return crypto.randomBytes(32).toString("base64");
  }
}

// Shembull përdorimi
const encryptionKey = EncryptionManager.generateKey(); // Gjenero një çelës të ri
const manager = new EncryptionManager(encryptionKey);

const text = "Ultrawebthinking është e ardhmja!";
const encrypted = manager.encrypt(text);
console.log("Teksti i enkriptuar:", encrypted);

const decrypted = manager.decrypt(encrypted);
console.log("Teksti i dekriptuar:", decrypted);