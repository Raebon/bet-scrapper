import { SerializedDataI } from "../../../interfaces";
import { splitIntoArraysOfArray } from "../../../utils/split-into-arrays-of-array";
import { webScrapping } from "../../../utils/web-scrapping";
import { getTeamName } from "../../../voc";
import { targetOddsElements, targetTeamNameElements } from "../config";

const className = "FootbalFortuna";
export class FootbalFortuna {
  url: string;
  newEvaluation: boolean;
  constructor(url: string, newEvaluation: boolean) {
    this.url = url;
    this.newEvaluation = newEvaluation;
  }
  public getData = async () => {
    const scrappedData = await webScrapping(
      this.url,
      targetTeamNameElements,
      targetOddsElements
    );
    const { names, odds } = scrappedData;
    const data = this._serializeData(names, odds);
    return data;
  };

  private _serializeData = (
    names: string[],
    odds: string[]
  ): SerializedDataI[] => {
    // const startColumn = this.url === "https://www.ifortuna.cz/sazeni/fotbal/fortuna-liga" ? 1 : 0;
    const oddsData = splitIntoArraysOfArray(odds, 0, 6).reverse();
    const namesData = names.reverse();
    const serializedData: any[] = [];
    let numberOfLiveMatches = 0;
    /*     oddsData.map((item, index) => {
      if (!namesData[index]) {
        numberOfLiveMatches += 1;
      }
    }); */

    oddsData.slice(numberOfLiveMatches).map((item, index) => {
      const homeName = getTeamName(namesData[index][0].replace(/\n/g, ""));
      const hostName = getTeamName(namesData[index][1].replace(/\n/g, ""));
      const matchKey = `${homeName} vs ${hostName}`;
      let val = {
        site: "fortuna",
        matchKey,
        home: {
          name: homeName,
          type: "neprohra",
          rate: Number(item[3]), //  4. column //neprohra
        },
        host: {
          name: hostName,
          type: "výhra",
          rate: Number(item[2]), //3. column //výhra
        },
      };
      let val1 = {
        site: "fortuna",
        matchKey: ``,
        home: {
          name: homeName,
          type: "výhra",
          rate: Number(item[0]), //  4. column //neprohra
        },
        host: {
          name: hostName,
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
      console.log(`Nejsou žádné data. Možná event skončil ${this.url}`);
    }
    console.log(serializedData.length);
    return serializedData;
  };
}
