import {
  ChoosenBetterMatch,
  CombinedMatches,
  DivideAmountI,
  GroupedBySites,
  SerializedDataI,
  SitesEnum,
} from "../interfaces";
import stringSimilarity from "string-similarity";

export const arbitrageBettingV2 = async (
  data: SerializedDataI[],
  desiredBet: number
) => {
  const groupBySites: GroupedBySites = {
    tipsport: [],
    fortuna: [],
  };
  //dát dohromady zápasy podle site
  data.forEach((item) => {
    if (item.site === SitesEnum.fortuna) {
      groupBySites.fortuna.push(item);
    }
    if (item.site === SitesEnum.tipsport) {
      groupBySites.tipsport.push(item);
    }
  });
  // vyhledat zápasy které jsou stejné podle jména hostu a domácích
  const combinedMatches = combineMatches(
    groupBySites.fortuna,
    groupBySites.tipsport
  );
  const result = divideAmount(combinedMatches, desiredBet);
  return result;
  //console.log("combineMatches", test);
};

function combineMatches(
  fortunaMatches: SerializedDataI[],
  tipsportMatches: SerializedDataI[]
) {
  console.log(
    "tipsportMatches & fortunaMatches",
    tipsportMatches,
    fortunaMatches
  );
  const combinedMatches: CombinedMatches[] = [];

  fortunaMatches.forEach((fortunaMatch) => {
    const { matchKey } = fortunaMatch;
    // Najděte nejbližší shody mezi týmy v Tipsport
    const tipsportMatchKeys: string[] = [];
    tipsportMatches.map((record) => {
      tipsportMatchKeys.push(record.matchKey!);
    });
    const homeMatches = stringSimilarity.findBestMatch(
      matchKey!,
      tipsportMatchKeys
    );
    // Pokud byla nalezena shoda, přidejte ji k výsledku
    if (homeMatches.bestMatch.rating > 0.8) {
      const tipsportMatch = tipsportMatches[homeMatches.bestMatchIndex];
      console.log("párování", tipsportMatch, fortunaMatch);
      combinedMatches.push({ fortuna: fortunaMatch, tipsport: tipsportMatch });
    }
  });
  const choosenBetterRatingMatches = chooseBetterRating(combinedMatches);
  console.log("choosenBetterRatingMatches", choosenBetterRatingMatches);
  const result = artbitrageCalculation(choosenBetterRatingMatches);
  return result;
}

function chooseBetterRating(data: CombinedMatches[]) {
  console.log("chooseBetterRating", data);
  const result: ChoosenBetterMatch[] = [];
  data.forEach((item) => {
    let match: ChoosenBetterMatch = {
      home: undefined,
      host: undefined,
    };
    //vyhodnotit kde je lepší kurz u domácích
    if (item.fortuna.home.rate - item.tipsport.home.rate >= 0) {
      match.home = item.fortuna.home;
      match.home.site = SitesEnum.fortuna;
    }
    if (item.fortuna.home.rate - item.tipsport.home.rate < 0) {
      match.home = item.tipsport.home;
      match.home.site = SitesEnum.tipsport;
    }

    //vyhodnotit kde je lepší kurz u hostujících
    if (item.fortuna.host.rate - item.tipsport.host.rate >= 0) {
      match.host = item.fortuna.host;
      match.host.site = SitesEnum.fortuna;
    }
    if (item.fortuna.host.rate - item.tipsport.host.rate < 0) {
      match.host = item.tipsport.host;
      match.host.site = SitesEnum.tipsport;
    }
    if (match.home?.site !== match.host?.site) {
      result.push(match);
      console.log(
        "chooseBetterRating",
        item.fortuna.home.rate - item.tipsport.home.rate,
        match
      );
    }
  });
  return result.filter((item) => item.home?.name !== item.host?.name);
}

function artbitrageCalculation(data: ChoosenBetterMatch[]) {
  const results: ChoosenBetterMatch[] = [];
  const log: ChoosenBetterMatch[] = [];
  data.forEach((item) => {
    if (item) {
      const homeRate = item.home?.rate ?? 1;
      const hostRate = item.host?.rate ?? 1;

      const margin = (1 / homeRate) * 100 + (1 / hostRate) * 100;

      log.push({ ...item, margin });
      if (margin < 100) {
        results.push({ ...item, margin });
        //pokud budu chtít zobrazit jen profitující. Lepší je za mě asi ukázat vše a na FE si to pomocí toggle vyfiltrovat
      }
    }
  });
  console.log("artbitrageCalculation - log & data", log);
  return results;
}

const divideAmount = (data: ChoosenBetterMatch[], desiredBet: number) => {
  if (!data || data.length === 0) {
    return [];
  }

  const resultData: DivideAmountI[][] = [];
  data.forEach((item) => {
    if (item && item.home && item.host) {
      const homeRateInversion = (1 / item.home.rate) * 100;
      const hostRateInversion = (1 / item.host.rate) * 100;
      const margin = item.margin!;
      const homeAmout = (homeRateInversion / margin) * desiredBet;
      const hostAmout = (hostRateInversion / margin) * desiredBet;
      const home = {
        site: item.home.site!,
        name: item.home.name,
        type: item.home.type,
        amount: homeAmout,
        profit: homeAmout * item.home.rate - desiredBet,
        rate: item.home.rate,
      };
      const host = {
        site: item.host.site!,
        name: item.host.name,
        type: item.host.type,
        amount: (hostRateInversion / margin) * desiredBet,
        profit: hostAmout * item.host.rate - desiredBet,
        rate: item.host.rate,
      };
      resultData.push([{ ...home }, { ...host }]);
    }
  });
  return resultData;
};
