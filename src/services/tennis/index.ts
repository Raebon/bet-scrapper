import { TennisFortuna } from "../../betting-sites/fortuna/tennis";
import { TennisTipsport } from "../../betting-sites/tipsport/tennis";
import { SerializedDataI } from "../../interfaces";
import { calculateArbitrageBetting } from "../../utils/arbitrage-betting";

export class TennisService {
  static async evaluate(tipsportLink: string, fortunaLink: string) {
    const tennisTipsport = new TennisTipsport(tipsportLink);
    const tennisFortuna = new TennisFortuna(fortunaLink);
    try {
      const tennisTipsportData = await tennisTipsport.getData();
      const tennisFortunaData = await tennisFortuna.getData();

      const data = await calculateArbitrageBetting(
        [
          ...((tennisTipsportData as SerializedDataI[]) ?? []),
          ...((tennisFortunaData as SerializedDataI[]) ?? []),
        ] as SerializedDataI[],
        1000
      );
      return {
        result: data,
        links: [tipsportLink, fortunaLink],
      };
    } catch (error) {
      console.log("TennisService", error);
    }
  }
}
