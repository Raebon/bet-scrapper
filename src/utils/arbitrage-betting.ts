import { SerializedDataI, TSubject } from "../interfaces";

interface SerializedChosenDataI {
  home: TSubject;
  host: TSubject;
  margin?: number;
}

interface DivideAmountI {
  site: string;
  name: string;
  amount: number;
  profit: number;
  rate: number;
}

export const calculateArbitrageBetting = async (
  data: SerializedDataI[],
  desiredBet: number
) => {
  const dataForCalculation = separateBySiteAndCombineData(data);
  const keys = dataForCalculation.siteNames;
  const groupedMatches: any = {};
  const arrayOfMatches: any = [];
  for (let i = 0; i < keys.length; i++) {
    dataForCalculation.result.map((item: any) => {
      arrayOfMatches.push(item[keys[i]]);
    });
  }

  arrayOfMatches.forEach((item: SerializedDataI) => {
    let matchKeyHomeName = new Date().toDateString();
    let matchKeyHostName = new Date().toDateString();
    if (item !== null) {
      matchKeyHomeName = item.home?.name;
      matchKeyHostName = item.host?.name;
    }

    const matchKey = `${matchKeyHomeName} vs ${matchKeyHostName}`;
    if (!groupedMatches[matchKey]) {
      groupedMatches[matchKey] = [];
    }

    groupedMatches[matchKey].push(item);
  });

  const groupedMatchesFromSites = Object.values(groupedMatches).filter(
    (matches: any) => matches.length > 1
  );
  const result: SerializedChosenDataI[] = [];
  groupedMatchesFromSites.forEach((item: any) => {
    if (item.length > 0) {
      const choosed = chooseBetterRate(item);
      result.push(choosed as any);
    }
  });

  const calculatedMarginAndEvaluated = calculateMarginAndEvaluate(
    result.filter((item) => item !== null || item !== undefined)
  );

  return divideAmount(calculatedMarginAndEvaluated, desiredBet);
};

const divideAmount = (
  data: SerializedChosenDataI[] | undefined,
  desiredBet: number
) => {
  if (!data || data.length === 0) {
    return [];
  }

  const resultData: DivideAmountI[][] = [];
  data.forEach((item) => {
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
  });
  return resultData;
};

const calculateMarginAndEvaluate = (
  data: SerializedChosenDataI[]
): SerializedChosenDataI[] | undefined => {
  const results: SerializedChosenDataI[] = [];
  /* data.push({
    home: {
      site: "fortuna",
      name: "Fortuna Hebar Pazardzhik - test",
      type: "výhra",
      rate: 2.1,
    },
    host: {
      site: "tipsport",
      name: "Tipsport Pirin Blagoevgrad - test",
      type: "neprohra",
      rate: 1.93,
    },
  }); */
  data.forEach((item) => {
    if (item) {
      const homeRate = item.home?.rate;
      const hostRate = item.host?.rate;

      const margin = (1 / homeRate) * 100 + (1 / hostRate) * 100;

      if (margin < 100) {
        results.push({ ...item, margin });
      }
    }
  });
  return results;
};

const chooseBetterRate = (data: SerializedDataI[]) => {
  let maxRateHome: SerializedDataI | null | undefined;
  let maxHomeRate = -Infinity;
  let maxRateHost: SerializedDataI | null | undefined;
  let maxHostRate = -Infinity;

  data.forEach((item) => {
    if (item && item.home && item.home?.rate > maxHomeRate) {
      maxHomeRate = item.home?.rate;
      maxRateHome = item;
    }
  });
  data.forEach((item) => {
    if (item && item.home && item.host?.rate > maxHostRate) {
      maxHostRate = item.host?.rate;
      maxRateHost = item;
    }
  });

  if (!maxRateHost || !maxRateHome) {
    return;
  }

  let filteredMatchesByHighestRate: SerializedChosenDataI = {
    home: {
      site: maxRateHome!.site,
      name: maxRateHome!.home.name,
      rate: maxRateHome!.home.rate,
    },
    host: {
      site: maxRateHost!.site,
      name: maxRateHost!.host.name,
      rate: maxRateHost!.host.rate,
    },
  };
  if (
    filteredMatchesByHighestRate.home.site ===
    filteredMatchesByHighestRate.host.site
  ) {
    return null;
  }
  return {
    home: {
      site: maxRateHome!.site,
      name: maxRateHome!.home.name,
      rate: maxRateHome!.home.rate,
    },
    host: {
      site: maxRateHost!.site,
      name: maxRateHost!.host.name,
      rate: maxRateHost!.host.rate,
    },
  };
};

const separateBySiteAndCombineData = (data: SerializedDataI[]) => {
  const separatedData: any = {};

  data.forEach((item) => {
    const siteName = item.site;

    if (!separatedData[siteName]) {
      separatedData[siteName] = [];
    }

    separatedData[siteName].push(item);
  });

  return combineData(separatedData);
};

const combineData = (separatedData: any) => {
  const result: SerializedDataI[] = [];
  const siteNames = Object.keys(separatedData);
  const maxLength = Math.max(
    ...siteNames.map((site) => separatedData[site].length)
  );
  for (let i = 0; i < maxLength; i++) {
    const combinedItem: any = {};

    siteNames.forEach((site) => {
      const items = separatedData[site];
      if (i < items.length) {
        combinedItem[site] = items[i];
      } else {
        combinedItem[site] = null; // Pokud v některém poli chybí položka, můžete ji označit jako null nebo jinou hodnotu podle potřeby.
      }
    });

    result.push(combinedItem);
  }
  return { siteNames, maxLength, result };
};
