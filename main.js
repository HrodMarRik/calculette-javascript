function calculate(event) {
    event.preventDefault();

// Element --> input
    var montantEmprunterElement = document.getElementsByName('montant_emprunter')[0];
    var tauxNominalElement = document.getElementsByName('taux_nominal')[0];
    var dureeRemboursementElement = document.getElementsByName('duree_remboursement')[0];
// Valeur --> valeur du input
    var montant_emprunter = montantEmprunterElement.value;
    var taux_nominal = tauxNominalElement.value;
    var duree_remboursement = dureeRemboursementElement.value;
// Parents --> division parent du input
    var montantEmprunterParent = montantEmprunterElement.closest('.form-control');
    var tauxNominalParent = tauxNominalElement.closest('.form-control');
    var dureeRemboursementParent = dureeRemboursementElement.closest('.form-control');
// mes printer -->
    var tab_printer = document.getElementById('tab_printer');
    var table_printer = document.getElementById('table_printer');
    var total_printer = document.getElementById('total_printer');
    var error_printer = document.getElementById('error_printer');
// on reinitialise mes valeur et affichage
    var error = "";
    montantEmprunterParent.classList.remove('error-border');
    tauxNominalParent.classList.remove('error-border');
    dureeRemboursementParent.classList.remove('error-border');
    error_printer.innerHTML = "";
    table_printer.innerHTML = '';

// Gestion erreur
    if (montant_emprunter === "" || taux_nominal === "" || duree_remboursement === "") {
        error += "Veuillez remplir les champs:";
        var firstError = true;

        if (montant_emprunter === "") {
            montantEmprunterParent.classList.add('error-border');
            error += (firstError ? " " : ", ") + "Montant emprunté";
            firstError = false;
        }

        if (taux_nominal === "") {
            tauxNominalParent.classList.add('error-border');
            error += (firstError ? " " : ", ") + "Taux nominal";
            firstError = false;
        }

        if (duree_remboursement === "") {
            dureeRemboursementParent.classList.add('error-border');
            error += (firstError ? " " : ", ") + "Durée de remboursement";
        }

        error_printer.innerHTML =error;
        error_printer.style.display = 'block';
        return;

    } else {
        var regex_entier_decimal = /^\d+(\.\d+)?$/; 
        var regex_decimal = /^\d+(\.\d+)$/;
        var regex_entier = /^\d+$/;

        error_printer.style.display = 'none';

        if (!regex_entier.test(montant_emprunter)) {
            error += "Le montant emprunté doit être un nombre entier.<br>";
            montantEmprunterParent.classList.add('error-border');
        }

        if (!regex_decimal.test(taux_nominal)) {
            error += "Le taux nominal doit être un nombre décimal.<br>";
            tauxNominalParent.classList.add('error-border');
        }

        if (!regex_entier.test(duree_remboursement)) {
            error += "La durée de remboursement doit être un nombre entier.<br>";
            dureeRemboursementParent.classList.add('error-border');
        }

        if (error !== "") {
            error_printer.innerHTML = error ;
            error_printer.style.display = 'block';
            return;
        }
// calcule de : mois,solde_initial,echeance,interet,amortissement,solde_restant
        var taux_interet_mensuel = (taux_nominal/12)/100;
        var duree_remboursement_mois = duree_remboursement * 12;
        var interets_du_mois = montant_emprunter * taux_interet_mensuel;
        var echeance_mensuelle = montant_emprunter * ((taux_interet_mensuel * Math.pow((1 + taux_interet_mensuel), duree_remboursement_mois)) / (Math.pow((1 + taux_interet_mensuel), duree_remboursement_mois) - 1));
        for (var mois = 1; mois <= duree_remboursement_mois; mois++) {
            var amortissement_du_mois = echeance_mensuelle - interets_du_mois;
            var solde_restant = montant_emprunter - amortissement_du_mois;
            ajout_ligne(mois, montant_emprunter, echeance_mensuelle, interets_du_mois, amortissement_du_mois, solde_restant);
            montant_emprunter = solde_restant;
            interets_du_mois = montant_emprunter * taux_interet_mensuel;
        }
    
    }
}

function ajout_ligne(mois, solde_initial, echeance, interet, amortissement, solde_restant) {
    // Convertir les valeurs en nombres
    mois = parseInt(mois);
    solde_initial = parseFloat(solde_initial);
    echeance = parseFloat(echeance);
    interet = parseFloat(interet);
    amortissement = parseFloat(amortissement);
    solde_restant = parseFloat(solde_restant);

    // Création d'une nouvelle ligne
    var newRow = document.createElement('tr');

    // Ajout des cellules avec les valeurs fournies
    newRow.innerHTML = `
        <td>${mois}</td>
        <td>${solde_initial.toFixed(2)}€</td>
        <td>${echeance.toFixed(2)}€</td>
        <td>${interet.toFixed(2)}€</td>
        <td>${amortissement.toFixed(2)}€</td>
        <td>${solde_restant.toFixed(2)}€</td>
    `;

    // Sélection du tbody
    var tableBody = document.getElementById('table_printer');

    // Ajout de la nouvelle ligne à la fin du tbody
    tableBody.appendChild(newRow);
}
