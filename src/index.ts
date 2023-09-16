import { FootbalFortuna } from "./betting-sites/fortuna/footbal";
import { TennisFortuna } from "./betting-sites/fortuna/tennis";
import { FootbalTipsport } from "./betting-sites/tipsport/footbal";
import { TennisTipsport } from "./betting-sites/tipsport/tennis";
import { SerializedDataI } from "./interfaces";
import { calculateArbitrageBetting } from "./utils/arbitrage-betting";

const firstCzechLeaqueTipsport = new FootbalTipsport(
  "https://www.tipsport.cz/kurzy/fotbal/fotbal-muzi/1-ceska-liga-120"
);
const firstCzechLeagueFortuna = new FootbalFortuna(
  "https://www.ifortuna.cz/sazeni/fotbal/fortuna-liga"
);

const davisCupTipsport = new TennisTipsport(
  "https://www.tipsport.cz/kurzy/tenis/tenis-muzi-dvouhra/davis-cup-80856"
);
const davisCupFortuna = new TennisFortuna(
  "https://www.ifortuna.cz/sazeni/tenis/m-davis-cup-dvouhra"
);
const main = async () => {
  try {
    const tipsportData = await firstCzechLeaqueTipsport.getData();
    const fortunaData = await firstCzechLeagueFortuna.getData();

    const resultFoobal = await calculateArbitrageBetting(
      [
        ...((tipsportData as SerializedDataI[]) ?? []),
        ...((fortunaData as SerializedDataI[]) ?? []),
      ] as SerializedDataI[],
      30000
    );
    console.log("resultFoobal", resultFoobal);

    const tennisTipsportData = await davisCupTipsport.getData();
    const tennisFortunaData = await davisCupFortuna.getData();

    const resultTennis = await calculateArbitrageBetting(
      [
        ...((tennisTipsportData as SerializedDataI[]) ?? []),
        ...((tennisFortunaData as SerializedDataI[]) ?? []),
      ] as SerializedDataI[],
      2000
    );

    console.log("resultTennis", resultTennis);
  } catch (error) {
    console.error("Chyba při scrapingu:", error);
  }
};

main();
