import { FootbalFortuna } from "../../betting-sites/fortuna/footbal";
import { FootbalTipsport } from "../../betting-sites/tipsport/footbal";
import { SerializedDataI } from "../../interfaces";
import { calculateArbitrageBetting } from "../../utils/arbitrage-betting";

export class FootbalService {
  static async evaluate(
    tipsportLink: string,
    fortunaLink: string,
    newEvaluation: boolean = false
  ) {
    const firstCzechLeaqueTipsport = new FootbalTipsport(tipsportLink);
    const firstCzechLeagueFortuna = new FootbalFortuna(
      fortunaLink,
      newEvaluation
    );
    try {
      const tipsportData = await firstCzechLeaqueTipsport.getData();
      const fortunaData = await firstCzechLeagueFortuna.getData();

      const data = await calculateArbitrageBetting(
        [
          ...((tipsportData as SerializedDataI[]) ?? []),
          ...((fortunaData as SerializedDataI[]) ?? []),
        ] as SerializedDataI[],
        1000
      );
      return {
        result: data,
        links: [tipsportLink, fortunaLink],
      };
    } catch (error) {
      console.log("FootbalService", error);
    }
  }
}
