function calculate(event) {
    event.preventDefault();
    var montant_emprunter = document.getElementsByName('montant_emprunter')[0].value;
    var taux_nominal = document.getElementsByName('taux_nominal')[0].value;
    var duree_remboursement = document.getElementsByName('duree_remboursement')[0].value;
    var printer = document.querySelector('.printer');
    var error_printer = document.getElementById('error_printer');
    var error = ""
    if (montant_emprunter == "" || taux_nominal == "" || duree_remboursement == "") {
        printer.innerHTML =""
        document.getElementById('error_printer').style.display = 'block';
    } else {
        var regex_entier_decimal = /^\d+(\.\d+)?$/;
        var regex_decimal = /^\d+(\.\d+)$/;
        var regex_entier = /^\d+$/;
        
        document.getElementById('error_printer').style.display = 'none';
        
        if (!regex_entier_decimal.test(montant_emprunter)) {
            error += "Le montant emprunté doit être un nombre entier ou decimal.";
        }
        
        if (!regex_decimal.test(taux_nominal)) {
            error += "Le taux nominal doit être un decimal.";
        }
        
        if (!regex_entier.test(duree_remboursement)) {
            error += "La durée de remboursement doit être un nombre entier.";
        }
        
        if (error != "") {
            error_printer.innerHTML = error;
            document.getElementById('error_printer').style.display = 'block';
            return;
        }

        printer.innerHTML = html(montant_emprunter, taux_nominal, duree_remboursement);
    }
}

function html(K, T, n) {
    var html = "";
    var nombre_mois = duree_remboursement * 12;

    var M = (K * taux_periodique) / (1 - Math.pow((1 + taux_periodique), -n));

    // Calcul du coût total du crédit
    var cout_total = M * n - K;

    // Calcul des intérêts totaux payés
    var interets_totaux = cout_total - K;

    // Génération du HTML avec les résultats
    html += "<p>Montant des mensualités : " + M.toFixed(2) + " €</p>";
    html += "<p>Coût total du crédit : " + cout_total.toFixed(2) + " €</p>";
    html += "<p>Intérêts totaux payés : " + interets_totaux.toFixed(2) + " €</p>";

    return html;
}
