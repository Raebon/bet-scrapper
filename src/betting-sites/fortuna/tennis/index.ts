import { SerializedDataI } from "../../../interfaces";
import { splitIntoArraysOfArray } from "../../../utils/split-into-arrays-of-array";
import { webScrapping } from "../../../utils/web-scrapping";
import { getTeamName } from "../../../voc";
import { targetOddsElements, targetTeamNameElements } from "../config";

const className = "TennisFortuna";
export class TennisFortuna {
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
    names: string[],
    odds: string[]
  ): SerializedDataI[] => {
    const oddsData = splitIntoArraysOfArray(odds, 0, 2);
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
        const homeName = getTeamName(
          namesData[index][0].replace(/\n/g, "")
        )?.split(" ")[0];
        const hostName = getTeamName(
          namesData[index][1].replace(/\n/g, "")
        )?.split(" ")[0];
        const matchKey = `${homeName} vs ${hostName}`;
        let val = {
          site: "fortuna",
          matchKey,
          home: {
            name: homeName,
            rate: Number(item[0]), // 1. column
          },
          host: {
            name: hostName,
            rate: Number(item[1]), //2. column
          },
        };
        serializedData.push(val);
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
