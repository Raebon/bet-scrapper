import { SerializedDataI } from "../../../interfaces";
import { splitIntoArraysOfArray } from "../../../utils/split-into-arrays-of-array";
import { webScrapping } from "../../../utils/web-scrapping";
import { getTeamName } from "../../../voc";
import { targetOddsElements, targetTeamNameElements } from "../config";

const className = "FootbalFortuna";
export class FootbalFortuna {
  url: string;
  numberOfScrapping: number;
  newEvaluation: boolean;
  constructor(url: string, newEvaluation: boolean) {
    this.url = url;
    this.numberOfScrapping = 0;
    this.newEvaluation = newEvaluation;
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
    const startColumn =
      this.url === "https://www.ifortuna.cz/sazeni/fotbal/fortuna-liga" ? 1 : 0;
    const oddsData = (
      await splitIntoArraysOfArray(odds, startColumn, 6)
    ).reverse();
    const namesData = names.reverse();
    const serializedData: any[] = [];
    let numberOfLiveMatches = 0;
    oddsData.map((item, index) => {
      if (!namesData[index]) {
        numberOfLiveMatches += 1;
      }
    });

    /*  if (numberOfLiveMatches > 0) {
      numberOfLiveMatches -= 1;
    } */

    oddsData.slice(numberOfLiveMatches).map((item, index) => {
      let val = {
        site: "fortuna",
        home: {
          name: getTeamName(namesData[index][0].replace(/\n/g, "")),
          type: "neprohra",
          rate: Number(item[3]), //  4. column //neprohra
        },
        host: {
          name: getTeamName(namesData[index][1].replace(/\n/g, "")),
          type: "výhra",
          rate: Number(item[2]), //3. column //výhra
        },
      };
      let val1 = {
        site: "fortuna",
        home: {
          name: getTeamName(namesData[index][0].replace(/\n/g, "")),
          type: "výhra",
          rate: Number(item[0]), //  4. column //neprohra
        },
        host: {
          name: getTeamName(namesData[index][1].replace(/\n/g, "")),
          type: "neprohra",
          rate: Number(item[4]), //3. column //neprohra
        },
      };
      if (this.newEvaluation) {
        serializedData.push(val);
      } else {
        serializedData.push(val1);
      }
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
