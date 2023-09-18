import { customRenaming } from "../utils/renaming";

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
  let newname = customRenaming(name);
  return VocMap.has(name) ? customRenaming(VocMap.get(name)!) : newname;
};
