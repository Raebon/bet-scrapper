import { SerializedDataI } from "../../../interfaces";
import { splitIntoArraysOfArray } from "../../../utils/split-into-arrays-of-array";
import { webScrapping } from "../../../utils/web-scrapping";
import { getTeamName } from "../../../voc";
import { targetOddsElements, targetTeamNameElements } from "../config";

export class FootbalFortuna {
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
    names: string[],
    odds: string[]
  ): Promise<SerializedDataI[]> => {
    const oddsData = splitIntoArraysOfArray(odds, 1, 6);
    const namesData = names;
    const serializedData: any[] = [];
    oddsData.map((item, index) => {
      let val = {
        site: "fortuna",
        home: {
          name: getTeamName(namesData[index][0].replace(/\n/g, "")),
          rate: Number(item[3]), // 2 - 3. column
        },
        host: {
          name: getTeamName(namesData[index][1].replace(/\n/g, "")),
          rate: Number(item[4]), //4 - 4. column
        },
      };
      serializedData.push(val);
    });
    return serializedData;
  };
}
