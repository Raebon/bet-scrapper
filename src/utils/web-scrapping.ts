import puppeteer from "puppeteer";
require("dotenv").config();

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
    args: ["--disable-setuid-sandbox", "--no-sandbox", "--no-zygote"],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXUTABLE_PATH
        : puppeteer.executablePath(),
    headless: "new",
  });
  try {
    console.log("start webscraping");
    const page = await browser.newPage();
    await page.goto(url, { timeout: 0 });
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
