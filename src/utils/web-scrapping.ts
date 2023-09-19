import puppeteer from "puppeteer";

interface WebScrappingRes {
  names: string[];
  odds: string[];
}

export const webScrapping = async (
  url: string,
  targetTeamNameElements: string,
  targetOddsElements: string
): Promise<WebScrappingRes> => {
  return internalScrapeMethod(url, targetTeamNameElements, targetOddsElements);
};

const internalScrapeMethod = async (
  url: string,
  targetTeamNameElements: string,
  targetOddsElements: string
) => {
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();
  await page.goto(url);

  const targetTeamNameElementsPupperteered = await page.$x(
    targetTeamNameElements
  );

  const targetOddsElementsPupperteered = await page.$x(targetOddsElements);

  const names: string[] = [];
  const odds: string[] = [];

  if (targetTeamNameElementsPupperteered.length > 0) {
    for (const item of targetTeamNameElementsPupperteered) {
      const textContent: any = await item.evaluate((el) => el.textContent);
      if (textContent !== null) {
        names.push(textContent.split(" - "));
      }
    }
  }

  if (targetOddsElementsPupperteered.length > 0) {
    for (const item of targetOddsElementsPupperteered) {
      const textContent: any = await item.evaluate((el) => el.textContent);
      odds.push(textContent);
    }
  }

  await browser.close();
  return {
    names,
    odds,
  };
};
