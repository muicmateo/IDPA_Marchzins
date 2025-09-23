// --- Validierungsfunktionen ---
function clearErrors() {
  const errorMessages = document.querySelectorAll(".error-message");
  const errorInputs = document.querySelectorAll("input.error");
  const generalError = document.getElementById("general-error");

  errorMessages.forEach((msg) => {
    msg.classList.remove("show");
    msg.textContent = "";
  });

  errorInputs.forEach((input) => {
    input.classList.remove("error");
  });

  generalError.classList.remove("show");
  generalError.textContent = "";
}

function showError(inputId, message) {
  const input = document.getElementById(inputId);
  const errorElement = document.getElementById(inputId + "-error");

  input.classList.add("error");
  errorElement.textContent = message;
  errorElement.classList.add("show");

  if (!document.querySelector("input.error:focus")) {
    input.focus();
  }
}

function showGeneralError(message) {
  const generalError = document.getElementById("general-error");
  generalError.textContent = message;
  generalError.classList.add("show");
}

// --- Übersetzungen ---
const translations = {
  de: {
    titel: "Marchzins-Bonus Rechner",
    kapital: "Kapital (CHF):",
    normalzins: "Normalzins (%):",
    bonuszins: "Bonuszins (%):",
    geburtstag: "Geburtstag (Tag):",
    geburtsmonat: "Geburtsmonat (1-12):",
    berechnen: "Berechnen",
    ergebnisPlaceholder:
      'Bitte geben Sie alle Werte ein und klicken Sie auf "Berechnen".',
    generalError:
      "Bitte korrigieren Sie die Fehler und versuchen Sie es erneut.",
    fehlerKapital: "Bitte geben Sie einen gültigen Kapitalbetrag ein.",
    fehlerKapitalMax: "Das Kapital ist zu hoch (max. 999.999.999 CHF).",
    fehlerZins: "Bitte geben Sie einen gültigen {name} ein.",
    fehlerZinsMax: "Der {name} ist unrealistisch hoch (max. 50%).",
    fehlerGeburtsmonat: "Der Geburtsmonat muss zwischen 1 und 12 liegen.",
    fehlerGeburtstag: "Bitte geben Sie einen gültigen Geburtstag ein.",
    fehlerGeburtstagMonat: "Der {monat} hat nur {tage} Tage.",
    fehlerDatumKombi: "Ungültige Datumskombination.",
  },
  en: {
    titel: "March Interest Bonus Calculator",
    kapital: "Capital (CHF):",
    normalzins: "Normal Interest (%):",
    bonuszins: "Bonus Interest (%):",
    geburtstag: "Birthday (Day):",
    geburtsmonat: "Birth Month (1-12):",
    berechnen: "Calculate",
    ergebnisPlaceholder: 'Please enter all values and click "Calculate".',
    generalError: "Please correct the errors and try again.",
    fehlerKapital: "Please enter a valid capital amount.",
    fehlerKapitalMax: "The capital is too high (max. 999,999,999 CHF).",
    fehlerZins: "Please enter a valid {name}.",
    fehlerZinsMax: "{name} is unrealistically high (max. 50%).",
    fehlerGeburtsmonat: "Birth month must be between 1 and 12.",
    fehlerGeburtstag: "Please enter a valid birthday.",
    fehlerGeburtstagMonat: "{month} has only {days} days.",
    fehlerDatumKombi: "Invalid date combination.",
  },
};

let currentLang = "de";

// --- Validierungen ---
function validateKapital(value) {
  const t = translations[currentLang];
  if (isNaN(value) || value <= 0) return t.fehlerKapital;
  if (value > 999999999) return t.fehlerKapitalMax;
  return null;
}

function validateZins(value, name) {
  const t = translations[currentLang];
  if (isNaN(value) || value < 0) return t.fehlerZins.replace("{name}", name);
  if (value > 50) return t.fehlerZinsMax.replace("{name}", name);
  return null;
}

function validateGeburtsmonat(value) {
  const t = translations[currentLang];
  if (isNaN(value) || value < 1 || value > 12) return t.fehlerGeburtsmonat;
  return null;
}

function validateGeburtstag(tag, monat) {
  const t = translations[currentLang];

  if (isNaN(tag) || isNaN(monat)) return null;

  const tageImMonat = new Date(new Date().getFullYear(), monat, 0).getDate();
  if (tag < 1 || tag > tageImMonat) {
    const monatName = new Date(
      new Date().getFullYear(),
      monat - 1
    ).toLocaleDateString(currentLang === "de" ? "de-DE" : "en-US", {
      month: "long",
    });
    return t.fehlerGeburtstagMonat
      .replace("{monat}", monatName)
      .replace("{tage}", tageImMonat);
  }
  return null;
}

// --- Echtzeit-Validierung + Komma zu Punkt ---
const inputs = [
  { id: "kapital", validator: validateKapital },
  {
    id: "normalzins",
    validator: (v) => validateZins(v, translations[currentLang].normalzins),
  },
  {
    id: "bonuszins",
    validator: (v) => validateZins(v, translations[currentLang].bonuszins),
  },
  { id: "geburtsmonat", validator: validateGeburtsmonat },
  {
    id: "geburtstag",
    validator: (v) => {
      const monat = parseInt(document.getElementById("geburtsmonat").value);
      return validateGeburtstag(v, monat);
    },
  },
];

inputs.forEach((inputObj) => {
  const inputEl = document.getElementById(inputObj.id);

  inputEl.addEventListener("input", function () {
    let value = this.value;

    if (["kapital", "normalzins", "bonuszins"].includes(inputObj.id)) {
      value = value.replace(",", ".");
      value = value.replace(/[^0-9.]/g, "");
      const parts = value.split(".");
      if (parts.length > 2) value = parts[0] + "." + parts.slice(1).join("");
      this.value = value;
    }

    const val = parseFloat(this.value);
    const error = inputObj.validator(val);
    const errorEl = document.getElementById(inputObj.id + "-error");

    if (error) {
      this.classList.add("error");
      errorEl.textContent = error;
      errorEl.classList.add("show");
    } else {
      this.classList.remove("error");
      errorEl.textContent = "";
      errorEl.classList.remove("show");
    }
  });
});

// --- Berechnung ---
document
  .getElementById("berechnenButton")
  .addEventListener("click", function () {
    clearErrors();

    const kapitalValue = parseFloat(
      document.getElementById("kapital").value.replace(",", ".")
    );
    const normalzinsValue = parseFloat(
      document.getElementById("normalzins").value.replace(",", ".")
    );
    const bonuszinsValue = parseFloat(
      document.getElementById("bonuszins").value.replace(",", ".")
    );
    const geburtstagValue = parseInt(
      document.getElementById("geburtstag").value
    );
    const geburtsmonatValue = parseInt(
      document.getElementById("geburtsmonat").value
    );

    let hasErrors = false;
    const validations = [
      { id: "kapital", value: kapitalValue, fn: validateKapital },
      {
        id: "normalzins",
        value: normalzinsValue,
        fn: (v) => validateZins(v, translations[currentLang].normalzins),
      },
      {
        id: "bonuszins",
        value: bonuszinsValue,
        fn: (v) => validateZins(v, translations[currentLang].bonuszins),
      },
      {
        id: "geburtsmonat",
        value: geburtsmonatValue,
        fn: validateGeburtsmonat,
      },
      {
        id: "geburtstag",
        value: geburtstagValue,
        fn: (v) => validateGeburtstag(v, geburtsmonatValue),
      },
    ];

    validations.forEach((item) => {
      const error = item.fn(item.value);
      if (error) {
        showError(item.id, error);
        hasErrors = true;
      }
    });

    if (hasErrors) {
      showGeneralError(translations[currentLang].generalError);
      return;
    }

    try {
      const kapital = kapitalValue;
      const normalzins = normalzinsValue / 100;
      const bonuszins = bonuszinsValue / 100;
      const jahr = new Date().getFullYear();
      const tageMonat = new Date(jahr, geburtsmonatValue, 0).getDate();

      if (geburtstagValue > tageMonat) {
        const monatName = new Date(
          jahr,
          geburtsmonatValue - 1
        ).toLocaleDateString(currentLang === "de" ? "de-DE" : "en-US", {
          month: "long",
        });
        showError(
          "geburtstag",
          translations[currentLang].fehlerGeburtstagMonat
            .replace("{monat}", monatName)
            .replace("{tage}", tageMonat)
        );
        showGeneralError(translations[currentLang].fehlerDatumKombi);
        return;
      }

      const tageBonus = geburtstagValue;
      const tageNormal = tageMonat - tageBonus;
      const normalTageszins = normalzins / 365;
      const bonusTageszins = bonuszins / 365;
      const zinsBonus = kapital * bonusTageszins * tageBonus;
      const zinsNormal = kapital * normalTageszins * tageNormal;
      const gesamtzins = zinsBonus + zinsNormal;

      const monatName = new Date(
        jahr,
        geburtsmonatValue - 1
      ).toLocaleDateString(currentLang === "de" ? "de-DE" : "en-US", {
        month: "long",
      });

      document.getElementById("ergebnis").innerText =
        `${monatName} ${jahr} - ${
          currentLang === "de" ? "Zinsberechnung" : "Interest Calculation"
        }:\n\n` +
        `${
          currentLang === "de" ? "Anzahl Tage im Monat" : "Days in month"
        }: ${tageMonat}\n` +
        `${
          currentLang === "de" ? "Bonustage" : "Bonus days"
        } (1. - ${geburtstagValue}.): ${tageBonus}\n` +
        `${currentLang === "de" ? "Normaltage" : "Normal days"} (${
          geburtstagValue + 1
        }. - ${tageMonat}.): ${tageNormal}\n\n` +
        `${
          currentLang === "de" ? "Bonuszins-Anteil" : "Bonus interest portion"
        }: ${zinsBonus.toFixed(2)} €\n` +
        `${
          currentLang === "de" ? "Normalzins-Anteil" : "Normal interest portion"
        }: ${zinsNormal.toFixed(2)} €\n\n` +
        `${
          currentLang === "de" ? "Gesamtzins für" : "Total interest for"
        } ${monatName}: ${gesamtzins.toFixed(2)} €`;
    } catch (error) {
      console.error("Berechnungsfehler:", error);
      showGeneralError(
        currentLang === "de"
          ? "Es ist ein unerwarteter Fehler aufgetreten. Bitte überprüfen Sie Ihre Eingaben."
          : "An unexpected error occurred. Please check your inputs."
      );
    }
  });

// --- Enter-Taste für Berechnung ---
document.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    document.getElementById("berechnenButton").click();
  }
});

// --- Sprachwechsel ---
function switchLanguage() {
  currentLang = currentLang === "de" ? "en" : "de";
  const t = translations[currentLang];

  document.querySelector("h2").innerText = t.titel;
  document.getElementById("label-kapital").innerText = t.kapital;
  document.getElementById("label-normalzins").innerText = t.normalzins;
  document.getElementById("label-bonuszins").innerText = t.bonuszins;
  document.getElementById("label-geburtstag").innerText = t.geburtstag;
  document.getElementById("label-geburtsmonat").innerText = t.geburtsmonat;
  document.getElementById("berechnenButton").innerText = t.berechnen;
  document.getElementById("ergebnis").innerText = t.ergebnisPlaceholder;
  document.getElementById("general-error").innerText = "";

  document.querySelector(".result-section h3").innerText =
    currentLang === "de" ? "Ergebnis:" : "Result:";

  document.getElementById("languageButton").innerText =
    currentLang === "de" ? "English" : "Deutsch";
}

document
  .getElementById("languageButton")
  .addEventListener("click", switchLanguage);
