import { SerializedDataI } from "../../../interfaces";
import { splitIntoArraysOfArray } from "../../../utils/split-into-arrays-of-array";
import { webScrapping } from "../../../utils/web-scrapping";
import { getTeamName } from "../../../voc";
import { targetOddsElements, targetTeamNameElements } from "../config";

const className = "FootbalFortuna";
export class FootbalFortuna {
  url: string;
  numberOfScrapping: number;
  constructor(url: string) {
    this.url = url;
    this.numberOfScrapping = 0;
  }
  public getData = async () => {
    try {
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
    names: string[],
    odds: string[]
  ): Promise<SerializedDataI[]> => {
    const oddsData = await splitIntoArraysOfArray(odds, 1, 6);
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
    console.log(className, serializedData.length);
    if (serializedData.length === 0) {
      throw Error(`Nejsou žádné data. Možná event skončil ${this.url}`);
    }
    return serializedData;
  };
}
