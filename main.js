function calculate(event) {
    event.preventDefault();

    var montantEmprunterElement = document.getElementsByName('montant_emprunter')[0];
    var tauxNominalElement = document.getElementsByName('taux_nominal')[0];
    var dureeRemboursementElement = document.getElementsByName('duree_remboursement')[0];

    var montant_emprunter = montantEmprunterElement.value.replace(/\s/g, '');
    var taux_nominal = tauxNominalElement.value.replace(/\s/g, '');
    var duree_remboursement = dureeRemboursementElement.value.replace(/\s/g, '');

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
    document.getElementById('tab_printer').style.display = 'block';
    const numberElements = document.querySelectorAll(".number");
    numberElements.forEach(element => {
    const number = parseFloat(element.textContent.replace(/\s/g, '').replace(/,/g, '.'));
    if (!isNaN(number)) {
      const formattedNumber = new Intl.NumberFormat('fr-FR').format(number);
      element.textContent = formattedNumber;
    }
    });
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
    var champs_vide = "";
    var error = "";

    var montantError = validateMontant(montant, montantEmprunterParent);
    if (montantError === "1") {
        champs_vide += "<b>Montant</b>";
    } else if (montantError === "2") {
        error += "le <b>Montant</b> dois être un entier.<br>";
    } else if (montantError === "3") {
        error += "le <b>Montant</b> est <b>null</b>.<br>";
    }

    var tauxError = validateTaux(taux, tauxNominalParent);
    if (tauxError === "1") {
        if (champs_vide !== "") { champs_vide += ', '}
        champs_vide += "<b>Taux nominal</b>";
    } else if (tauxError === "2") {
        error += "le <b>Taux nominal</b> dois être un decimal.<br>";
    } else if (tauxError === "3") {
        error += "le <b>Taux nominal</b> est <b>null</b>.<br>";
    }

    var dureeError = validateDuree(duree, dureeRemboursementParent);
    if (dureeError === "1") {
        if (champs_vide !== "") { champs_vide += ', '}
        champs_vide += "<b>Durée</b>";
    } else if (dureeError === "2") {
        error += "la <b>Durée</b> dois être un entier.<br>";
    } else if (dureeError === "3") {
        error += "la <b>Durée</b> est <b>null</b>.<br>";
    }

    if (error !== "" || champs_vide !== "") {
        if (champs_vide !== "") { champs_vide = "Veuillez remplir les champs: " + champs_vide}
            error_printer.innerHTML = champs_vide + ".<br>" + error;
        error_printer.style.display = "block";
    }

    return error === "";
}



function ajout_ligne(mois, solde_initial, echeance, interet, amortissement, solde_restant) {
    // Convertir les valeurs en nombres
    mois = parseInt(mois);
    solde_initial = parseFloat(solde_initial);
    echeance = parseFloat(echeance);
    interet = parseFloat(interet);
    amortissement = parseFloat(amortissement);
    solde_restant = parseFloat(solde_restant);

    var newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td class="number">${mois}</td>
        <td class="number">${solde_initial.toFixed(2)}€</td>
        <td class="number">${echeance.toFixed(2)}€</td>
        <td class="number">${interet.toFixed(2)}€</td>
        <td class="number">${amortissement.toFixed(2)}€</td>
        <td class="number">${solde_restant.toFixed(2)}€</td>
    `;

    var tableBody = document.getElementById('table_printer');

    tableBody.appendChild(newRow);
}


