import { SerializedDataI } from "../../../interfaces";
import { splitIntoArraysOfArray } from "../../../utils/split-into-arrays-of-array";
import { webScrapping } from "../../../utils/web-scrapping";
import { getTeamName } from "../../../voc";
import { targetOddsElements, targetTeamNameElements } from "../config";

const className = "TennisTipsport";
export class TennisTipsport {
  url: string;
  constructor(url: string) {
    this.url = url;
  }
  public getData = async () => {
    const scrappedData = await webScrapping(
      this.url,
      targetTeamNameElements,
      targetOddsElements
    );
    const { names, odds } = scrappedData;
    return this._serializeData(names, odds);
  };

  private _serializeData = (
    teamNames: string[],
    odds: string[]
  ): SerializedDataI[] => {
    const oddsData = splitIntoArraysOfArray(odds, 0, 2);
    const namesData = teamNames;
    const serializedData: any[] = [];

    oddsData.map((item, index) => {
      const homeName = getTeamName(namesData[index][0]?.split(" ")[0]);
      const hostName = getTeamName(namesData[index][1]?.split(" ")[0]);
      const matchKey = `${homeName} vs ${hostName}`;
      let val = {
        site: "tipsport",
        matchKey,
        home: {
          name: homeName,
          rate: Number(item[0]),
        },
        host: {
          name: hostName,
          rate: Number(item[item.length - 1]),
        },
      };
      serializedData.push(val);
    });

    console.log(
      `${className}${serializedData.length === 0 ? " načítání..." : " hotovo"}`
    );
    if (serializedData.length === 0) {
      throw Error(`Nejsou žádné data. Možná event skončil ${this.url}`);
    }
    console.log(serializedData);
    return serializedData;
  };
}
