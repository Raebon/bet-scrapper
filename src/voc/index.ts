import { customRenaming, odstranDiakritiku } from "../utils/renaming";

const VocMap = new Map([
  ["Č.Budějovice", "České Budějovice"],
  ["Ml.Boleslav", "Mladá Boleslav"],
  ["Hr.Králové", "Hradec Králové"],
]);

//todo: metoda která vrátí celý název podle klíče
export const getTeamName = (name: string) => {
  if (!name) {
    return "nevsazet";
  }
  let newname = odstranDiakritiku(name);
  return VocMap.has(name) ? odstranDiakritiku(VocMap.get(name)!) : newname;
};
