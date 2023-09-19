import { FootbalFortuna } from "../../betting-sites/fortuna/footbal";
import { FootbalTipsport } from "../../betting-sites/tipsport/footbal";
import { SerializedDataI } from "../../interfaces";
import { calculateArbitrageBetting } from "../../utils/arbitrage-betting";
import { arbitrageBettingV2 } from "../../utils/v2-arbitrage-betting";

interface EvaluateResult {
  result: any; // Zde můžete specifikovat typ výsledku
  links: string[];
}

export class FootbalService {
  static async evaluate(
    tipsportLink: string,
    fortunaLink: string,
    newEvaluation: boolean = false,
    desiredBet: number = 1000,
    retryCount: number = 3 // Počet pokusů
  ): Promise<EvaluateResult | null> {
    const firstCzechLeaqueTipsport = new FootbalTipsport(tipsportLink);
    const firstCzechLeagueFortuna = new FootbalFortuna(
      fortunaLink,
      newEvaluation
    );

    try {
      const tipsportData = await firstCzechLeaqueTipsport.getData();
      const fortunaData = await firstCzechLeagueFortuna.getData();

      if (tipsportData && fortunaData) {
        const data = await arbitrageBettingV2(
          [
            ...(tipsportData as SerializedDataI[]),
            ...(fortunaData as SerializedDataI[]),
          ],
          desiredBet
        );
        return {
          result: data,
          links: [tipsportLink, fortunaLink],
        };
      } else {
        console.log("Nepodařilo se načíst data z Tipsport nebo Fortuna.");
        if (retryCount > 0) {
          console.log(`Opakování pokusu (${retryCount} zbývá)...`);
          return this.evaluate(
            tipsportLink,
            fortunaLink,
            newEvaluation,
            desiredBet,
            retryCount - 1
          );
        } else {
          console.log("Vyčerpány všechny pokusy.");
          return {
            result: [],
            links: [tipsportLink, fortunaLink],
          };
        }
      }
    } catch (error) {
      console.error("Chyba při vyhodnocování:", error);
      return {
        result: [],
        links: [tipsportLink, fortunaLink],
      };
    }
  }
}
