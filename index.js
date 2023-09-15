import puppeteer from "puppeteer";

const url = "https://www.tipsport.cz/kurzy/fotbal/fotbal-muzi/1-ceska-liga-120";

const main = async () => {
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();
  await page.goto(url);

  const targetTeamNameElements = await page.$x(
    "//div/div/div//div/div/div/div/div/div/div[@class='o-matchRow']/div[@class='o-matchRow__main']/div[@class='o-matchRow__leftSide']/div[@class='o-matchRow__leftSideInner']/div[@class='o-matchRow__colEvent']/span[@class='o-matchRow__matchName']/span"
  );

  const targetOddsElements = await page.$x(
    "//div/div/div//div/div/div/div/div/div/div[@class='o-matchRow']/div[@class='o-matchRow__main']/div[@class='o-matchRow__rightSide']/div[@class='o-matchRow__rightSideInner']/div[@class='m-matchRowOdds m-matchRowOdds--countOpp5']/div[@class='btnRate']"
  );
  console.log(targetOddsElements);
  const teamNames = [];
  const odds = [];
  if (targetTeamNameElements.length > 0) {
    for (const item of targetTeamNameElements) {
      const textContent= await page.evaluate(
        (el) => el.textContent,
        item
      );
      if (textContent !== null) {
        teamNames.push(textContent.split(" - "));
      }
    }
  } 
  
  if (targetOddsElements.length > 0) {
    for (const item of targetOddsElements) {
      const textContent= await page.evaluate(
        (el) => el.textContent,
        item
      );

      odds.push(textContent);
    }
  }
  console.log(teamNames, rozdelNaPole(odds));
  await browser.close();
};

main();

function rozdelNaPole(poleCisel) {
  const novaPole = [];
  for (let i = 0; i < poleCisel.length; i += 5) {
    const podpole = poleCisel.slice(i, i + 5);
    novaPole.push(podpole);
  }
  return novaPole;
}
