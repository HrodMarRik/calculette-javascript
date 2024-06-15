document.addEventListener('DOMContentLoaded', function() {
  const inputMontant = document.querySelector('input[name="montant_emprunter"]');

  inputMontant.addEventListener('input', function() {
    formatMontant(this);
  });

  function formatMontant(input) {
    let montant = input.value.replace(/\s/g, '');
    montant = montant.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    input.value = montant;
  }
});
