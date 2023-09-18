export const splitIntoArraysOfArray = async (
  array: string[],
  startNumberOfColumn: number,
  numberOfColumn: number,
  reverse?: boolean
) => {
  const newArray: string[][] = [];
  // i= 1 => protože je na stránce stejná tabulka  s jedným kurzem, který nechceme proto začínáme od i=1. Potřebujeme to odfiltrovat
  for (let i = startNumberOfColumn; i < array.length; i += numberOfColumn) {
    const subArray = array.slice(i, i + numberOfColumn);
    newArray.push(reverse ? subArray.reverse() : subArray);
  }
  return newArray;
};
