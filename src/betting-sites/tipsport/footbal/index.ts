import { SerializedDataI } from "../../../interfaces";
import { splitIntoArraysOfArray } from "../../../utils/split-into-arrays-of-array";
import { webScrapping } from "../../../utils/web-scrapping";
import { targetOddsElements, targetTeamNameElements } from "../config";

export class FootbalTipsport {
  url: string;
  constructor(url: string) {
    this.url = url;
  }
  public getData = async () => {
    try {
      const scrappedData = await webScrapping(
        this.url,
        targetTeamNameElements,
        targetOddsElements
      );
      const { names, odds } = scrappedData;
      return this._serializeData(names, odds);
    } catch (error) {
      console.log(error);
      return "error";
    }
  };

  private _serializeData = async (
    teamNames: string[],
    odds: string[]
  ): Promise<SerializedDataI[]> => {
    const oddsData = splitIntoArraysOfArray(odds, 0, 5);
    const namesData = teamNames;
    const serializedData: any[] = [];

    oddsData.map((item, index) => {
      let val = {
        site: "tipsport",
        home: {
          name: namesData[index][0],
          rate: Number(item[1]),
        },
        host: {
          name: namesData[index][1],
          rate: Number(item[item.length - 2]),
        },
      };
      serializedData.push(val);
    });
    return serializedData;
  };
}
