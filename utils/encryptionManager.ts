import crypto from "crypto";

interface EncryptionInfo {
  key: string;
  expireAt: number;
}

/**
 * Menaxheri i enkriptimit për të ruajtur dhe menaxhuar çelësat e enkriptimit.
 */
export class EncryptionManager {
  private encryptionInfo: EncryptionInfo;

  constructor(encryptionKey: string, expireAt: number) {
    this.encryptionInfo = {
      key: encryptionKey,
      expireAt: expireAt,
    };
  }

  /**
   * Kontrollon nëse çelësi i enkriptimit ka skaduar.
   * @returns `true` nëse ka skaduar, përndryshe `false`.
   */
  public isKeyExpired(): boolean {
    const currentTime = Date.now();
    return currentTime > this.encryptionInfo.expireAt;
  }

  /**
   * Enkripton një tekst të dhënë.
   * @param text Teksti për enkriptim.
   * @returns Teksti i enkriptuar.
   */
  public encrypt(text: string): string {
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(this.encryptionInfo.key, "base64"),
      Buffer.alloc(16, 0) // Vektor inicializimi (IV)
    );
    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
  }

  /**
   * Dekripton një tekst të enkriptuar.
   * @param encrypted Teksti i enkriptuar.
   * @returns Teksti i dekriptuar.
   */
  public decrypt(encrypted: string): string {
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(this.encryptionInfo.key, "base64"),
      Buffer.alloc(16, 0) // Vektor inicializimi (IV)
    );
    let decrypted = decipher.update(encrypted, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}

// Shembull përdorimi
const encryptionKey = "lqA9tJNCg11zjpumCR/NyTVf+GfXtedLuUri0iq9vQQ=";
const expireAt = 1747304078484; // Timestamp nga skedari .rscinfo

const manager = new EncryptionManager(encryptionKey, expireAt);

if (!manager.isKeyExpired()) {
  const encrypted = manager.encrypt("Ultrawebthinking është e ardhmja!");
  console.log("Teksti i enkriptuar:", encrypted);

  const decrypted = manager.decrypt(encrypted);
  console.log("Teksti i dekriptuar:", decrypted);
} else {
  console.error("Çelësi i enkriptimit ka skaduar!");
}