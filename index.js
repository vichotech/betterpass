/* SELECTORS
================================================================= */
const settings = document.getElementById("settings");
const lowerCheck = document.getElementById("include-lower");
const upperCheck = document.getElementById("include-upper");
const numbersCheck = document.getElementById("include-numbers");
const specialCheck = document.getElementById("include-special");

const fakeLabel = document.getElementById("fake-label");
const fakeSelect = document.getElementById("fake-select");
const fakeOptionsList = document.getElementById("fake-options-list");
const firstRadio = document.getElementById("first-radio");

const lengthLabel = document.getElementById("length-label");
const lengthInput = document.getElementById("length-input");

const genBtn = document.getElementById("gen-btn");
const copyBtn = document.getElementById("copy-btn");

const passText = document.querySelector(".password-cont");
const crackTimeSpan = document.getElementById("crack-time");

/* VARIABLES
================================================================= */
const lowerChars = "abcdefghijklmnñopqrstuvwxyz".split("");
const upperChars = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
const numbersChars = Array.from("0123456789");
const specialChars = "¡!\"#$%&'()*+,-./:;<=>¿?@[\\]^_`{}~".split("");
const chars = lowerChars.concat(upperChars, numbersChars, specialChars);

let length;
let password = "";

let hasLower;
let hasUpper;
let hasNumbers;
let hasSpecial;

let firstChar = "";
let lastChar = "";
let includeText = "";

/* ONLOAD
================================================================= */
// From ChatGPT
window.addEventListener("load", () => {    
    // Select all the checkboxes and update their relatives variables
    lowerCheck.checked = true;
    upperCheck.checked = true;
    numbersCheck.checked = true;
    specialCheck.checked = true;
    hasLower = true;
    hasUpper = true;
    hasNumbers = true;
    hasSpecial = true;
    
    // Actualizar las opciones del select 'firstCharSelect' según los caracteres seleccionados
    updateFirstCharSelect();

    // Reset #length-input and #length-label
    lengthInput.value = 8;
    lengthLabel.textContent = `Password length: ${lengthInput.value}`;
    fakeLabel.innerText = "None";
});

/* EVENTS
================================================================= */
const settingsToggle = Array.from(document.querySelectorAll(".settings-toggle"));
settingsToggle.forEach((trigger) => {
    trigger.addEventListener("click", () => {
        settings.classList.toggle("active");
    })
})

firstRadio.addEventListener("click", function() {
    if (this.checked) {
        firstChar = "";
        fakeLabel.innerText = this.value;
    };
});

// Show #length-input value in #lenght-label in real time
lengthInput.addEventListener("input", () => {
    lengthLabel.textContent = `Password length: ${lengthInput.value}`;
});

// Toggle 'hasLower' variable's value according to if its input is cheched or not
lowerCheck.addEventListener("input", () => {
    hasLower = lowerCheck.checked ? true : false;
    check(lowerChars);
    alertIfAnyCheck();
    updateFirstCharSelect();
});

// Toggle 'hasUpper' variable's value according to if its input is cheched or not
upperCheck.addEventListener("input", () => {
    hasUpper = upperCheck.checked ? true : false;
    check(upperChars);
    alertIfAnyCheck();
    updateFirstCharSelect();
});

// Toggle 'hasNumbers' variable's value according to if its input is cheched or not
numbersCheck.addEventListener("input", () => {
    hasNumbers = numbersCheck.checked ? true : false;
    check(numbersChars);
    alertIfAnyCheck();
    updateFirstCharSelect();
    
});
// Toggle 'hasSpecial' variable's value according to if its input is cheched or not
specialCheck.addEventListener("input", () => {
    hasSpecial = specialCheck.checked ? true : false;
    check(specialChars);
    alertIfAnyCheck();
    updateFirstCharSelect();
});

// Event when clicking #gen-btn
genBtn.addEventListener("click", () => {
    // Verify if there's any selected checkboxes
    if(!hasLower && !hasUpper && !hasNumbers && !hasSpecial) {
        showAlert("error", "At least one type of characters must be selected", 3000); // Show alert once the password is copied. See function below 👇
    } else {
        // Create an array with every .char-span
        let finalChars = document.querySelectorAll(".char-span");
        let finalCharsArray = [].slice.call(finalChars);

        // Evaluate if the array is empty or not
        if(finalCharsArray.length === 0) {
            genPassword(); // See function below 👇
        } else {
            password = ""; // Empty 'password' variable's value
            finalCharsArray.filter(function(e) {
                passText.removeChild(e); // Remove every .char-span
            });
            genPassword(); // See function below 👇
        }
    }
});

function alertIfAnyCheck() {
    if(!hasLower && !hasUpper && !hasNumbers && !hasSpecial) {
        showAlert("warning", "Select at least one type of characters", 2500); // Show alert once the password is copied. See function below 👇
    }
};

function check(charArray) {
    if (charArray.some((char) => char === firstChar)) {
        firstChar = "";
        fakeLabel.innerText = "None";
    }
};

// From ChatGPT
function updateFirstCharSelect() {
    const fakeOptions = Array.from(document.querySelectorAll(".fake-opt"));
    const lowerOptions = Array.from(document.querySelectorAll(".lower-char"));
    const upperOptions = Array.from(document.querySelectorAll(".upper-char"));
    const numbersOptions = Array.from(document.querySelectorAll(".number-char"));
    const specialOptions = Array.from(document.querySelectorAll(".special-char"));
  
    // Ocultar o mostrar las opciones según los checkboxes marcados
    lowerOptions.forEach((opt) => {
      opt.hidden = !lowerCheck.checked;
    });
  
    upperOptions.forEach((opt) => {
      opt.hidden = !upperCheck.checked;
    });
  
    numbersOptions.forEach((opt) => {
      opt.hidden = !numbersCheck.checked;
    });
  
    specialOptions.forEach((opt) => {
      opt.hidden = !specialCheck.checked;
    });

    lowerChars.forEach((char) => {
        if (!fakeOptions.some((option) => option.value === char)) {
            const li = createRadioElement("lower-char", char);
            fakeOptionsList.appendChild(li);
        }
    });

    upperChars.forEach((char) => {
        if (!fakeOptions.some((option) => option.value === char)) {
            const li = createRadioElement("upper-char", char);
            fakeOptionsList.appendChild(li);
        }
    });

    numbersChars.forEach((char) => {
        if (!fakeOptions.some((option) => option.value === char)) {
            const li = createRadioElement("number-char", char);
            fakeOptionsList.appendChild(li);
        }
    });

    specialChars.forEach((char) => {
        if (!fakeOptions.some((option) => option.value === char)) {
            const li = createRadioElement("special-char", char);
            fakeOptionsList.appendChild(li);
        }
    });
};

function createRadioElement(liClass, radioValue) {
    const li = document.createElement("li");
    li.classList.add("opt-cont");
    li.classList.add(liClass)
    li.setAttribute("onClick", "closeDetails()");
    const radio = document.createElement("input");
    radio.classList.add("fake-opt");
    radio.setAttribute("type", "radio");
    radio.setAttribute("name", "char");
    radio.value = radioValue;
    radio.addEventListener("click", function() {
        if (radio.checked) {
            firstChar = radio.value;
            fakeLabel.innerText = firstChar;
        };
    });
    li.appendChild(radio);
    return li;
};

function closeDetails() {
    fakeSelect.removeAttribute("open");
    fakeOptionsList.scrollTop = 0; //! Doesn't work
};

function genPassword() {
    length = lengthInput.value; // Take 'password' variable's length from #lenght-input value
    let allChars = []; // Array that will contain all the selected characters groups
    let bindingChars = []; // Array that will contain one character from every selected characters group
    let passChars = []; // Array that will contain the bindingChars[] plus as many character from allChars[] as needed to reach the password length

    if (hasLower) {
        let index = Math.floor(Math.random() * lowerChars.length);
        allChars = allChars.concat(lowerChars)
        bindingChars.push(lowerChars[index]);
    }
    if (hasUpper) {
        let index = Math.floor(Math.random() * upperChars.length);
        allChars = allChars.concat(upperChars)
        bindingChars.push(upperChars[index]);
    }
    if (hasNumbers) {
        let index = Math.floor(Math.random() * numbersChars.length);
        allChars = allChars.concat(numbersChars)
        bindingChars.push(numbersChars[index]);
    }
    if (hasSpecial) {
        let index = Math.floor(Math.random() * specialChars.length);
        allChars = allChars.concat(specialChars)
        bindingChars.push(specialChars[index]);
    }

    passChars = passChars.concat(bindingChars);
    //console.log(passChars);

    // Evaluate if there is any first chars defined
    if (!firstChar == "") {
        password = firstChar;
        // Concatenate the rest of 'password' variable's characters up to its max. length
        for (let i = bindingChars.length; i < length - 1; i++) {
            let index = Math.floor(Math.random() * allChars.length);
            passChars.push(allChars[index]);
        }
    } else {
        // Concatenate the rest of 'password' variable's characters up to its max. length
        for (let i = bindingChars.length; i < length; i++) {
            let index = Math.floor(Math.random() * allChars.length);
            passChars = passChars.concat(allChars[index]);
        }
    };

    while (passChars.length > 0) {
        let index = Math.floor(Math.random() * passChars.length);
        password += passChars[index];
        passChars.splice(index, 1);
    }

    // Turn every 'password' variable's character into a .char-span element
    const passCharsArray = password.split("");
    passCharsArray.forEach(function(c) {
        const char = document.createElement("span");
        char.classList.add("char-span");
        char.innerText = c;
        /* if (lowerChars.includes(c)) {
            char.style.color = "cyan";
        } else if (upperChars.includes(c)) {
            char.style.color = "blue";
        } else if (numbersChars.includes(c)) {
            char.style.color = "#f0f";
        } else if (specialChars.includes(c)) {
            char.style.color = "yellow";
        } */
        passText.appendChild(char);
    });

    const crackTime = calcCrackTime();
    if (crackTime < 1) {
        crackTimeSpan.innerText = "< 1 year"
        console.log(`Tiempo aproximado para descifrar la contraseña: < 1 año`);
    } else {
        crackTimeSpan.innerText = `${crackTime} years`;
        console.log(`Tiempo aproximado para descifrar la contraseña: ${crackTime} años`);
    }
}; //* WORKING OK 👌

// Copy password to clipboard
copyBtn.addEventListener("click", () => {
    const textToCopy = document.createElement("textarea");
    textToCopy.value = password;
    document.body.appendChild(textToCopy);
    textToCopy.select();
    document.execCommand("copy");
    document.body.removeChild(textToCopy);
    showAlert("success", "Password copied", 1500); // Show alert once the password is copied. See function below 👇
});

function showAlert(type, message, duration) {
    const newAlert = document.createElement("div");
    newAlert.classList.add("alert");
    newAlert.classList.add(`alert-${type}`);
    newAlert.innerText = message;
    newAlert.style.opacity = 0;
    document.body.appendChild(newAlert);

    // Remove .alert past timeout
    setTimeout(() => {
        newAlert.style.opacity = 1;
        setTimeout(() => {
            newAlert.style.opacity = 0;
            setTimeout(() => {
                newAlert.remove();
            }, 200);
        }, duration);
    }, 10);
};

/* function calcCrackTime() {
    const chars = [...lowerChars, ...upperChars, ...numbersChars, ...specialChars];
    const n = password.length;
    const c = chars.length;
    const r = 1000000000; // Tasa de descifrado de 1 billón de intentos por segundo
    const t = (Math.pow(c, n) / r).toFixed(2);
    let a = (t / (60 * 60 * 24 * 365)).toFixed(2);
    if (a > 1) {
        a = Math.round(a);
    };
    return a;
};  */

function calcCrackTime() {
    const n = password.length;
    let c = 0; // Variedad de caracteres
    const r = 1000000000; // Tasa de descifrado de 1 billón de intentos por segundo

    if (hasLower) c += lowerChars.length;
    if (hasUpper) c += upperChars.length;
    if (hasNumbers) c += numbersChars.length;
    if (hasSpecial) c += specialChars.length;

    // En lugar de usar una fórmula simplificada, usaremos la fórmula completa para calcular la Entropía
    const entropy = n * Math.log2(c);

    // Ahora calculamos el tiempo de crackeo
    const crackTimeSeconds = Math.pow(2, entropy) / r; 
    let crackTimeYears = (crackTimeSeconds / (60 * 60 * 24 * 365)).toFixed(2);

    if (crackTimeYears > 1) {
        crackTimeYears = Math.round(crackTimeYears);
    };

    return crackTimeYears;
};