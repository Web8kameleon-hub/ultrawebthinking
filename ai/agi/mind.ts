/**
 * Modul për menaxhimin e "mendjes" së AGI-së.
 * Përgjegjëse për ruajtjen e mendimeve, kujtesën dhe kontekstin.
 * 
 * Funksionalitetet kryesore:
 * - Gjenerimi i mendimeve të reja bazuar në input dhe kontekst.
 * - Ruajtja dhe rikthimi i mendimeve nga kujtesa.
 * - Kërkimi i mendimeve bazuar në fjalë kyçe.
 * - Pastrimi i kujtesës për të rifilluar nga e para.
 */

export type Thought = {
  id: string; // Identifikues unik për mendimin
  input: string; // Inputi që gjeneroi mendimin
  context: Record<string, any>; // Konteksti i lidhur me mendimin
  timestamp: number; // Koha kur mendimi u krijua
};

export class Mind {
  private memory: Thought[] = []; // Kujtesa e mendimeve

  /**
   * Gjeneron një mendim të ri bazuar në inputin dhe kontekstin e dhënë.
   * @param input - Inputi që gjeneron mendimin.
   * @param context - Konteksti i lidhur me mendimin (opsional).
   * @returns Mendimi i ri i krijuar.
   */
  think(input: string, context: Record<string, any> = {}): Thought {
    const newThought: Thought = {
      id: crypto.randomUUID(), // Gjeneron një ID unike për mendimin
      input,
      context,
      timestamp: Date.now(), // Koha aktuale
    };

    this.memory.push(newThought); // Shton mendimin në kujtesë
    return newThought;
  }

  /**
   * Rikthen mendimet e fundit nga kujtesa.
   * @param limit - Numri maksimal i mendimeve për t'u rikthyer (default: 10).
   * @returns Një listë e mendimeve të fundit.
   */
  recall(limit = 10): Thought[] {
    return this.memory.slice(-limit).reverse(); // Rikthen mendimet në rend kronologjik të kundërt
  }

  /**
   * Pastron të gjithë kujtesën e mendimeve.
   */
  clearMemory(): void {
    this.memory = [];
  }

  /**
   * Rikthen të gjitha mendimet që përputhen me një fjalë kyçe në input ose kontekst.
   * @param keyword - Fjalë kyçe për të kërkuar në kujtesë.
   * @returns Një listë e mendimeve që përputhen me fjalën kyçe.
   */
  search(keyword: string): Thought[] {
    return this.memory.filter(
      (thought) =>
        thought.input.includes(keyword) ||
        Object.values(thought.context).some((value) =>
          typeof value === "string" ? value.includes(keyword) : false
        )
    );
  }

  /**
   * Rikthen mendimin më të fundit nga kujtesa.
   * @returns Mendimi më i fundit ose `null` nëse kujtesa është bosh.
   */
  latest(): Thought | null {
    return this.memory.length > 0 ? this.memory[this.memory.length - 1] : null;
  }
}