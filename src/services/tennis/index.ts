import { TennisFortuna } from "../../betting-sites/fortuna/tennis";
import { TennisTipsport } from "../../betting-sites/tipsport/tennis";
import { SerializedDataI } from "../../interfaces";
import { calculateArbitrageBetting } from "../../utils/arbitrage-betting";
import { arbitrageBettingV2 } from "../../utils/v2-arbitrage-betting";
interface EvaluateResult {
  result: any; // Zde můžete specifikovat typ výsledku
  links: string[];
}
export class TennisService {
  static async evaluate(
    tipsportLink: string,
    fortunaLink: string,
    desiredBet: number = 1000,
    retryCount: number = 3
  ): Promise<EvaluateResult | null> {
    const tennisTipsport = new TennisTipsport(tipsportLink);
    const tennisFortuna = new TennisFortuna(fortunaLink);
    try {
      const tennisTipsportData = await tennisTipsport.getData();
      const tennisFortunaData = await tennisFortuna.getData();

      if (tennisTipsportData && tennisFortunaData) {
        const data = await arbitrageBettingV2(
          [
            ...((tennisTipsportData as SerializedDataI[]) ?? []),
            ...((tennisFortunaData as SerializedDataI[]) ?? []),
          ] as SerializedDataI[],
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
      console.log("TennisService", error);
      return {
        result: [],
        links: [tipsportLink, fortunaLink],
      };
    }
  }
}
