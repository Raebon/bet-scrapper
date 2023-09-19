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

async function internalScrapeMethod(
  url: string,
  targetTeamNameElements: string,
  targetOddsElements: string
) {
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();
  await page.goto(url);

  try {
    await page.waitForXPath(targetTeamNameElements);
    await page.waitForXPath(targetOddsElements);

    const targetTeamNameElementsPupperteered = await page.$x(
      targetTeamNameElements
    );

    const targetOddsElementsPupperteered = await page.$x(targetOddsElements);

    const names: string[] = [];
    const odds: string[] = [];

    if (targetTeamNameElementsPupperteered.length > 0) {
      for (const item of targetTeamNameElementsPupperteered) {
        const textContent: any = await page.evaluate(
          (el) => el.textContent,
          item
        );
        if (textContent !== null) {
          names.push(textContent.split(" - "));
        }
      }
    }

    if (targetOddsElementsPupperteered.length > 0) {
      for (const item of targetOddsElementsPupperteered) {
        const textContent: any = await page.evaluate(
          (el) => el.textContent,
          item
        );

        odds.push(textContent);
      }
    }

    return {
      names,
      odds,
    };
  } catch (error: any) {
    if (error.message.includes("The document has mutated")) {
      // Opakovat operace nebo počkat
      return internalScrapeMethod(
        url,
        targetTeamNameElements,
        targetOddsElements
      );
    } else {
      throw error;
    }
  } finally {
    await browser.close();
  }
}
