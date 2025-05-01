/**
 * Modul për përpunimin e inputeve në AGI.
 * Përgjegjëse për marrjen dhe analizimin e të dhënave nga burime të ndryshme.
 * 
 * Funksionalitetet kryesore:
 * - Marrja e inputeve nga burime të ndryshme (tekst, API, rrjet, etj.).
 * - Normalizimi dhe pastrimi i të dhënave.
 * - Analiza semantike dhe kategorizimi i inputeve.
 * - Zbulimi i emocioneve, qëllimeve dhe kontekstit nga inputet.
 * - Mbështetje për gjuhë të shumta dhe analiza të avancuara.
 */

export type SenseInput = {
  source: "user" | "api" | "network" | "system"; // Burimi i inputit
  data: string; // Të dhënat e inputit
  metadata?: Record<string, any>; // Informacion shtesë për inputin
  language?: string; // Gjuha e inputit (opsionale)
};

export type ProcessedInput = {
  original: SenseInput; // Inputi origjinal
  normalized: string; // Inputi i pastruar dhe normalizuar
  intent: string; // Qëllimi i zbuluar nga inputi
  sentiment: "positive" | "neutral" | "negative"; // Emocioni i zbuluar
  keywords: string[]; // Fjalë kyçe të zbuluara nga inputi
  language: string; // Gjuha e zbuluar ose e dhënë
  context: string; // Konteksti i analizuar nga metadata
};

export class Sense {
  /**
   * Përpunon një input të dhënë dhe kthen një strukturë të analizuar.
   * @param input - Inputi që duhet përpunuar.
   * @returns Një objekt të përpunuar që përmban të dhënat e analizës.
   */
  async process(input: SenseInput): Promise<ProcessedInput> {
    // Normalizimi i inputit
    const normalized = this.normalize(input.data);

    // Zbulimi i gjuhës së inputit
    const language = input.language || this.detectLanguage(normalized);

    // Zbulimi i qëllimit (intent)
    const intent = this.detectIntent(normalized);

    // Analiza e emocioneve (sentiment analysis)
    const sentiment = this.analyzeSentiment(normalized);

    // Nxjerrja e fjalëve kyçe
    const keywords = this.extractKeywords(normalized);

    // Analiza e kontekstit nga metadata
    const context = this.analyzeContext(input.metadata || {});

    return {
      original: input,
      normalized,
      intent,
      sentiment,
      keywords,
      language,
      context,
    };
  }

  /**
   * Normalizon një tekst duke hequr hapësirat e panevojshme dhe shenjat e pikësimit.
   * @param text - Teksti që duhet normalizuar.
   * @returns Teksti i pastruar dhe normalizuar.
   */
  private normalize(text: string): string {
    return text.trim().toLowerCase().replace(/[^\w\s]/gi, "");
  }

  /**
   * Zbulon qëllimin (intent) nga një tekst i dhënë.
   * @param text - Teksti që duhet analizuar.
   * @returns Një string që përfaqëson qëllimin e zbuluar.
   */
  private detectIntent(text: string): string {
    if (text.includes("plan")) return "planning";
    if (text.includes("help")) return "assistance";
    if (text.includes("search")) return "information_retrieval";
    return "unknown";
  }

  /**
   * Analizon emocionet (sentiment) nga një tekst i dhënë.
   * @param text - Teksti që duhet analizuar.
   * @returns Një string që përfaqëson emocionin e zbuluar.
   */
  private analyzeSentiment(text: string): "positive" | "neutral" | "negative" {
    const positiveWords = ["good", "great", "excellent", "happy", "love"];
    const negativeWords = ["bad", "terrible", "sad", "hate", "angry"];

    const positiveMatches = positiveWords.filter((word) => text.includes(word));
    const negativeMatches = negativeWords.filter((word) => text.includes(word));

    if (positiveMatches.length > negativeMatches.length) return "positive";
    if (negativeMatches.length > positiveMatches.length) return "negative";
    return "neutral";
  }

  /**
   * Nxjerr fjalë kyçe nga një tekst i dhënë.
   * @param text - Teksti që duhet analizuar.
   * @returns Një listë e fjalëve kyçe të zbuluara.
   */
  private extractKeywords(text: string): string[] {
    const stopWords = ["the", "is", "at", "which", "on", "and", "a", "an"];
    const words = text.split(/\s+/);
    return words.filter((word) => !stopWords.includes(word));
  }

  /**
   * Zbulon gjuhën e një teksti të dhënë.
   * @param text - Teksti që duhet analizuar.
   * @returns Një string që përfaqëson gjuhën e zbuluar.
   */
  private detectLanguage(text: string): string {
    if (/[а-яА-ЯЁё]/.test(text)) return "russian";
    if (/[a-zA-Z]/.test(text)) return "english";
    if (/[çë]/.test(text)) return "albanian";
    return "unknown";
  }

  /**
   * Analizon kontekstin nga metadata e dhënë.
   * @param metadata - Metadata për inputin.
   * @returns Një string që përfaqëson kontekstin e analizuar.
   */
  private analyzeContext(metadata: Record<string, any>): string {
    if (metadata.priority === "high") return "urgent";
    if (metadata.source === "api") return "external_request";
    return "general";
  }
}