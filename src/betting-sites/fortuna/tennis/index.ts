import { SerializedDataI } from "../../../interfaces";
import { splitIntoArraysOfArray } from "../../../utils/split-into-arrays-of-array";
import { webScrapping } from "../../../utils/web-scrapping";
import { getTeamName } from "../../../voc";
import { targetOddsElements, targetTeamNameElements } from "../config";

const className = "TennisFortuna";
export class TennisFortuna {
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
      //console.log(className, error);
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
    try {
      const oddsData = await splitIntoArraysOfArray(odds, 0, 2);
      const namesData = names;
      const serializedData: any[] = [];
      let numberOfLiveMatches = 0;
      oddsData.map((item, index) => {
        if (!namesData[index]) {
          numberOfLiveMatches += 1;
        }
      });
      oddsData.slice(numberOfLiveMatches).map((item, index) => {
        if (namesData[index]) {
          let val = {
            site: "fortuna",
            home: {
              name: getTeamName(namesData[index][0].replace(/\n/g, ""))?.split(
                " "
              )[0],
              rate: Number(item[0]), // 1. column
            },
            host: {
              name: getTeamName(namesData[index][1].replace(/\n/g, ""))?.split(
                " "
              )[0],
              rate: Number(item[1]), //2. column
            },
          };
          serializedData.push(val);
        }
      });
      console.log(
        `${className}${
          serializedData.length === 0 ? " načítání..." : " hotovo"
        }`
      );
      if (serializedData.length === 0) {
        console.log(`Nejsou žádné data. Možná event skončil ${this.url}`);
      }
      console.log(serializedData);
      return serializedData;
    } catch (error) {
      console.log(error);
      return [];
    }
  };
}
