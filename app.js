// 1. DOM-Elemente holen, mit denen wir arbeiten wollen
const bonusForm = document.getElementById('bonus-form');
const sparkapitalInput = document.getElementById('sparkapital');
const zinssatzInput = document.getElementById('zinssatz');
const geburtstagInput = document.getElementById('geburtstag');
const ergebnisBereich = document.getElementById('ergebnis-bereich');
const bruttoBonusAnzeige = document.getElementById('brutto-bonus');

// 2. Event Listener auf das Absenden des Formulars legen
bonusForm.addEventListener('submit', function(event) {
    // Verhindert, dass die Seite beim Absenden des Formulars neu geladen wird
    event.preventDefault();

    // 3. Werte aus den Eingabefeldern auslesen und in Zahlen umwandeln
    const kapital = parseFloat(sparkapitalInput.value);
    const zinssatz = parseFloat(zinssatzInput.value);
    const tage = parseInt(geburtstagInput.value);

    // Einfache Validierung (wird in späteren Schritten verbessert)
    if (isNaN(kapital) || isNaN(zinssatz) || isNaN(tage) || kapital <= 0 || zinssatz <= 0 || tage < 1 || tage > 31) {
        alert("Bitte geben Sie gültige Werte in alle Felder ein.");
        return; // Bricht die Funktion hier ab
    }

    // 4. Die Berechnung durchführen
    // Formel: (Kapital * Zinssatz * Tage) / (360 Tage * 100 für Prozent)
    const bruttoBonus = (kapital * zinssatz * tage) / (360 * 100);

    // 5. Das Ergebnis anzeigen
    // Das Ergebnis auf 2 Dezimalstellen runden und formatieren
    bruttoBonusAnzeige.textContent = bruttoBonus.toFixed(2) + " CHF";

    // Den Ergebnis-Bereich sichtbar machen
    ergebnisBereich.classList.remove('hidden');
});