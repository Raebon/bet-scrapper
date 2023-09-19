export function customRenaming(jmeno: string) {
  // Nahrazení diakritiky a převod na malá písmena
  jmeno = jmeno.replace(/[áäčďéěíľňóôřšťúůýž]/g, function (match) {
    return String.fromCharCode(match.charCodeAt(0) - 32);
  });

  // Odebrání diakritiky
  jmeno = jmeno.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  return jmeno;
}

export function odstranDiakritiku(str1: string) {
  var i, j, str2;
  str2 = "";
  for (i = 0; i < str1.length; i++) {
    j = DIAKRITIKA[0].indexOf(str1.charAt(i));
    if (j !== -1) {
      str2 += DIAKRITIKA[1].charAt(j);
    } else {
      str2 += str1.charAt(i);
    }
  }
  return str2;
}

function textToFileName(str: string) {
  return odstranDiakritiku(str)
    .toLowerCase()
    .replace(new RegExp("[^a-z0-9]+", "g"), "_")
    .replace(new RegExp("(^_)|(_$)", "g"), "");
}

var DIAKRITIKA = [
  "áäčďéěíĺľňóôöŕšťúůüýřžÁÄČĎÉĚÍĹĽŇÓÔÖŔŠŤÚŮÜÝŘŽ",
  "aacdeeillnooorstuuuyrzAACDEEILLNOOORSTUUUYRZ",
];
