function calculate(event) {
    event.preventDefault();

    var montantEmprunterElement = document.getElementsByName('montant_emprunter')[0];
    var tauxNominalElement = document.getElementsByName('taux_nominal')[0];
    var dureeRemboursementElement = document.getElementsByName('duree_remboursement')[0];

    var montant_emprunter = montantEmprunterElement.value;
    var taux_nominal = tauxNominalElement.value;
    var duree_remboursement = dureeRemboursementElement.value;

    var montantEmprunterParent = montantEmprunterElement.closest('.form-control');
    var tauxNominalParent = tauxNominalElement.closest('.form-control');
    var dureeRemboursementParent = dureeRemboursementElement.closest('.form-control');

    var error_printer = document.getElementById('error_printer');
    var table_printer = document.getElementById('table_printer');
    table_printer.innerHTML = '';

    clearErrors(montantEmprunterParent, tauxNominalParent, dureeRemboursementParent, error_printer);

    if (!validateInputs(montant_emprunter, taux_nominal, duree_remboursement, montantEmprunterParent, tauxNominalParent, dureeRemboursementParent, error_printer)) {
        return;
    }

    montant_emprunter = parseFloat(montant_emprunter);
    taux_nominal = parseFloat(taux_nominal);
    duree_remboursement = parseInt(duree_remboursement);

    var taux_interet_mensuel = (taux_nominal / 12) / 100;
    var duree_remboursement_mois = duree_remboursement * 12;
    var echeance_mensuelle = montant_emprunter * ((taux_interet_mensuel * Math.pow((1 + taux_interet_mensuel), duree_remboursement_mois)) / (Math.pow((1 + taux_interet_mensuel), duree_remboursement_mois) - 1));

    for (var mois = 1; mois <= duree_remboursement_mois; mois++) {
        var interets_du_mois = montant_emprunter * taux_interet_mensuel;
        var amortissement_du_mois = echeance_mensuelle - interets_du_mois;
        var solde_restant = montant_emprunter - amortissement_du_mois;
        ajout_ligne(mois, montant_emprunter, echeance_mensuelle, interets_du_mois, amortissement_du_mois, solde_restant);
        montant_emprunter = solde_restant;
    }
}

function clearErrors(montantEmprunterParent, tauxNominalParent, dureeRemboursementParent, error_printer) {
    montantEmprunterParent.classList.remove('error-border');
    tauxNominalParent.classList.remove('error-border');
    dureeRemboursementParent.classList.remove('error-border');
    error_printer.innerHTML = "";
    error_printer.style.display = 'none';
    document.getElementById('tab_printer').style.display = 'none';
}

function validateMontant(montant, montantEmprunterParent) {
    if (montant === "") {
        montantEmprunterParent.classList.add('error-border');
        return "1";
    }

    var regex_entier = /^\d+$/;
    if (!regex_entier.test(montant)) {
        montantEmprunterParent.classList.add('error-border');
        return "2";
    }

    if (parseFloat(montant) <= 0) {
        montantEmprunterParent.classList.add('error-border');
        return "3";
    }

    return ""; // Retourne une chaîne vide si aucune erreur
}

function validateTaux(taux, tauxNominalParent) {
    if (taux === "") {
        tauxNominalParent.classList.add('error-border');
        return "1";
    }

    var regex_decimal = /^\d+(\.\d+)$/;
    if (!regex_decimal.test(taux)) {
        tauxNominalParent.classList.add('error-border');
        return "2";
    }

    if (parseFloat(taux) <= 0) {
        tauxNominalParent.classList.add('error-border');
        return "3";
    }

    return ""; // Retourne une chaîne vide si aucune erreur
}

function validateDuree(duree, dureeRemboursementParent) {
    if (duree === "") {
        dureeRemboursementParent.classList.add('error-border');
        return "1";
    }

    var regex_entier = /^\d+$/;
    if (!regex_entier.test(duree)) {
        dureeRemboursementParent.classList.add('error-border');
        return "2";
    }

    if (parseInt(duree) <= 0) {
        dureeRemboursementParent.classList.add('error-border');
        return "3";
    }

    return ""; // Retourne une chaîne vide si aucune erreur
}

function validateInputs(montant, taux, duree, montantEmprunterParent, tauxNominalParent, dureeRemboursementParent, error_printer) {
    var error = "";

    var montantError = validateMontant(montant, montantEmprunterParent);
    if (montantError === "1") {
        error += "Veuillez remplir le champ montant. ";
    } else if (montantError !== "") {
        error += montantError + ", ";
    }

    var tauxError = validateTaux(taux, tauxNominalParent);
    if (tauxError === "1") {
        error += "Veuillez remplir le champ taux. ";
    } else if (tauxError !== "") {
        error += tauxError + ", ";
    }

    var dureeError = validateDuree(duree, dureeRemboursementParent);
    if (dureeError === "1") {
        error += "Veuillez remplir le champ durée. ";
    } else if (dureeError !== "") {
        error += dureeError + ", ";
    }

    // Supprimer la dernière virgule et l'espace s'il y en a
    if (error !== "") {
        error = error.slice(0, -2);
    }

    // Afficher l'erreur dans error_printer
    if (error !== "") {
        error_printer.textContent = error;
        error_printer.style.display = "block";
    }

    return error === ""; // Retourne true si aucune erreur, false sinon
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
