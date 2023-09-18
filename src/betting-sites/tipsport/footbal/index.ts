import { SerializedDataI } from "../../../interfaces";
import { splitIntoArraysOfArray } from "../../../utils/split-into-arrays-of-array";
import { webScrapping } from "../../../utils/web-scrapping";
import { targetOddsElements, targetTeamNameElements } from "../config";

const className = "FootbalTipsport";
export class FootbalTipsport {
  url: string;
  numberOfScrapping: number;
  constructor(url: string) {
    this.url = url;
    this.numberOfScrapping = 0;
  }
  public getData = async () => {
    try {
      this.numberOfScrapping += 1;
      const scrappedData = await webScrapping(
        this.url,
        targetTeamNameElements,
        targetOddsElements
      );
      const { names, odds } = scrappedData;
      return await this._serializeData(names, odds);
    } catch (error) {
      if (this.numberOfScrapping < 10) {
        await this.getData();
      } else {
        console.log(className, error);
        return await this._serializeData([], []);
      }
    }
  };

  private _serializeData = async (
    teamNames: string[],
    odds: string[]
  ): Promise<SerializedDataI[]> => {
    const oddsData = await splitIntoArraysOfArray(odds, 0, 5);
    const namesData = teamNames;
    const serializedData: any[] = [];

    oddsData.map((item, index) => {
      let val = {
        site: "tipsport",
        home: {
          name: namesData[index][0],
          type: "neprohra",
          rate: Number(item[1]),
        },
        host: {
          name: namesData[index][1],
          type: "neprohra",
          rate: Number(item[item.length - 2]),
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
