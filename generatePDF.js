function generatePDF() {

  let margin = 10 / 25.4 * 72; // Marge de 10mm

  // Récupérer le contenu du header
  let headerContent = document.querySelector("header").innerHTML;

  // Appliquer le centrage et le padding au contenu du header
  let centeredHeaderContent = `<div style="text-align: center; margin: 40px;">${headerContent}</div>`;

  let elements = document.querySelectorAll("table");

  // Créer un document HTML contenant le contenu du header et le contenu du tableau
  let htmlContent = centeredHeaderContent;

  elements.forEach(table => {
    htmlContent += table.outerHTML; // Ajouter le contenu du tableau au document HTML
  });

  // Ajouter le contenu HTML à html2pdf
  html2pdf().from(htmlContent).set({
    margin: [margin, margin],
    filename: 'monDocument.pdf',
    pagebreak: { mode: ['avoid-all'] }
  }).save();
}
