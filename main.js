function calculate(event) {
    event.preventDefault();
    var montant_emprunter = document.getElementsByName('montant_emprunter')[0].value;
    var taux_nominal = document.getElementsByName('taux_nominal')[0].value;
    var duree_remboursement = document.getElementsByName('duree_remboursement')[0].value;
    var printer = document.querySelector('.printer');
    var error = document.getElementByID('error')
    if (montant_emprunter == "" || taux_nominal == "" || duree_remboursement == "") {
        printer.innerHTML = "vide";
        console.log("vide");
    } else {

        printer.innerHTML = "<p>Résultat du calcul : " + montant_emprunter + "</p>";
        console.log("validé");
    }
}
function html(argument) {
    // body...
}