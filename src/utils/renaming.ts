export function customRenaming(jmeno: string) {
  // Nahrazení diakritiky a převod na malá písmena
  jmeno = jmeno.replace(/[áäčďéěíľňóôřšťúůýž]/g, function (match) {
    return String.fromCharCode(match.charCodeAt(0) - 32);
  });

  // Odebrání diakritiky
  jmeno = jmeno.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  return jmeno;
}
