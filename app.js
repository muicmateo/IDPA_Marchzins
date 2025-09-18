const bonusForm = document.getElementById('bonus-form');
const sparkapitalInput = document.getElementById('sparkapital');
const zinssatzInput = document.getElementById('zinssatz');
const geburtstagInput = document.getElementById('geburtstag');
const ergebnisBereich = document.getElementById('ergebnis-bereich');
const bruttoBonusAnzeige = document.getElementById('brutto-bonus');


bonusForm.addEventListener('submit', function(event) {

    event.preventDefault();


    const kapital = parseFloat(sparkapitalInput.value);
    const zinssatz = parseFloat(zinssatzInput.value);
    const tage = parseInt(geburtstagInput.value);


    if (isNaN(kapital) || isNaN(zinssatz) || isNaN(tage) || kapital <= 0 || zinssatz <= 0 || tage < 1 || tage > 31) {
        alert("Bitte geben Sie gültige Werte in alle Felder ein.");
        return;
    }

    // Formel: (Kapital * Zinssatz * Tage) / (360 Tage * 100 für Prozent)
    const bruttoBonus = (kapital * zinssatz * tage) / (360 * 100);

    bruttoBonusAnzeige.textContent = bruttoBonus.toFixed(2) + " CHF";

    ergebnisBereich.classList.remove('hidden');
});