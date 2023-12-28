/* SELECTORS
================================================================= */
const background = document.getElementById("background");
const settings = document.getElementById("settings-modal-cont");
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
const passNumberLabel = document.getElementById("pass-number-label");
const passNumberInput = document.getElementById("pass-number-input");

const genBtn = document.getElementById("gen-btn");
const cancBtn = document.getElementById("canc-btn");

const emptyState = document.getElementById("empty-state");
const passCont = document.querySelector(".password-cont");
const crackTimeSpan = document.getElementById("crack-time");
const modalBlur = document.getElementById("modal-blur");

const toastsCont = document.getElementById("toasts-cont");

/* VARIABLES
================================================================= */
const lowerChars = "abcdefghijklmnñopqrstuvwxyz".split("");
const upperChars = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
const numbersChars = Array.from("0123456789");
const specialChars = "¡!\"#$%&'()*+,-./:;<=>¿?@[\\]^_`{}~".split("");
const chars = lowerChars.concat(upperChars, numbersChars, specialChars);

let numberOfPass = 1;
let length = 8;
let password = "";

let hasLower = true;
let hasUpper = true;
let hasNumbers = true;
let hasSpecial = true;

let firstChar = "";
let lastChar = "";
let includeText = "";

/* EVENTS
================================================================= */
window.addEventListener("load", () => {
    showBg();
    resetSettings();
    updateFirstCharSelect();
});

const settingsToggle = Array.from(document.querySelectorAll(".settings-toggle"));
settingsToggle.forEach((trigger) => {
    trigger.addEventListener("click", () => {
        settings.classList.toggle("active");
        modalBlur.classList.toggle("active");
    })
})

firstRadio.addEventListener("click", function() {
    if (this.checked) {
        firstChar = "";
        fakeLabel.innerText = this.value;
    };
    setTimeout(closeDetails, 400);
});

// Show #pass-number-input value in #pass-number-label in real time
passNumberInput.addEventListener("input", () => {
    numberOfPass = passNumberInput.value;
    passNumberLabel.textContent = `Passwords: ${numberOfPass}`;
});

// Show #length-input value in #lenght-label in real time
lengthInput.addEventListener("input", () => {
    length = lengthInput.value;
    lengthLabel.textContent = `Length: ${length}`;
});

// Toggle 'hasLower' variable's value according to if its input is cheched or not
lowerCheck.addEventListener("input", () => {
    hasLower = lowerCheck.checked ? true : false;
    check(lowerChars);
    showToastIfAnyChecks();
    updateFirstCharSelect();
});

// Toggle 'hasUpper' variable's value according to if its input is cheched or not
upperCheck.addEventListener("input", () => {
    hasUpper = upperCheck.checked ? true : false;
    check(upperChars);
    showToastIfAnyChecks();
    updateFirstCharSelect();
});

// Toggle 'hasNumbers' variable's value according to if its input is cheched or not
numbersCheck.addEventListener("input", () => {
    hasNumbers = numbersCheck.checked ? true : false;
    check(numbersChars);
    showToastIfAnyChecks();
    updateFirstCharSelect();
});

// Toggle 'hasSpecial' variable's value according to if its input is cheched or not
specialCheck.addEventListener("input", () => {
    hasSpecial = specialCheck.checked ? true : false;
    check(specialChars);
    showToastIfAnyChecks();
    updateFirstCharSelect();
});

cancBtn.addEventListener("click", () => {
    setTimeout(resetSettings, 400);
});

genBtn.addEventListener("click", () => {
    // Verify if there's any selected checkboxes
    if(!hasLower && !hasUpper && !hasNumbers && !hasSpecial) {
        showToast({
            type: "error",
            title: "Error!",
            description: "At least one type of characters must be selected before creating a new password."
        });
    } else {
        const passwords = Array.from(document.querySelectorAll(".password"));
        if(passwords.length === 0) {
            for(let i = 0; i < numberOfPass; i++){
                genPassword();
            }
        } else {
            password = ""; // Empty 'password' variable's value
            passwords.filter((p) => {
                passCont.removeChild(p);
            });
            for(let i = 0; i < numberOfPass; i++){
                genPassword();
            }
        }
    }
});

/* FUNCTIONS
================================================================= */
function showBg() {
    background.innerText = "";
    let chars = "";
    const bgChars = lowerChars.concat(upperChars, numbersChars);
    for(let i = 0; i < 100; i++) {
        const index = Math.floor(Math.random() * bgChars.length);
        chars += bgChars[index];
    }
    for(let i = 0; i < 50; i++){
        background.innerText += chars;
    }
    console.log("Background loaded");
};

function resetSettings() {
    // Select all the checkboxes and update their relatives variables
    lowerCheck.checked = true;
    upperCheck.checked = true;
    numbersCheck.checked = true;
    specialCheck.checked = true;
    hasLower = true;
    hasUpper = true;
    hasNumbers = true;
    hasSpecial = true;
    
    // Reset 'firstCharSelect' option
    fakeLabel.innerText = "None";
    firstChar = "";
    closeDetails();

    // Reset #length-input and #length-label
    lengthInput.value = 8;
    length = lengthInput.value;
    lengthLabel.textContent = `Length: ${length}`;

    // Reset #pass-number-input and #pass-number-label
    passNumberInput.value = 1;
    numberOfPass = passNumberInput.value;
    passNumberLabel.textContent = `Passwords: ${numberOfPass}`;
}

function showToastIfAnyChecks() {
    if(!hasLower && !hasUpper && !hasNumbers && !hasSpecial) {
        showToast({
            type: "warning",
            title: "Warning!",
            description: "Select at least one type of characters."
        }); // Show toast once the password is copied. See function below 👇
    }
};

function check(charArray) {
    if (charArray.some((char) => char === firstChar)) {
        firstChar = "";
        fakeLabel.innerText = "None";
        firstRadio.checked = true;
    }
};

function updateFirstCharSelect() {
    const fakeOptions = Array.from(document.querySelectorAll(".fake-opt"));
    const lowerOptions = Array.from(document.querySelectorAll(".lower-char"));
    const upperOptions = Array.from(document.querySelectorAll(".upper-char"));
    const numbersOptions = Array.from(document.querySelectorAll(".number-char"));
    const specialOptions = Array.from(document.querySelectorAll(".special-char"));
  
    // Toggle options according to the checked checkboxes
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
    li.classList.add(liClass);
    const radio = document.createElement("input");
    radio.setAttribute("type", "radio");
    radio.setAttribute("name", "char");
    radio.classList.add("fake-opt");
    radio.classList.add("w--100");
    radio.classList.add("bd-rd--1");
    radio.classList.add("bd--p-50-10_1_sd");
    radio.classList.add("tr--a_out_4");
    radio.classList.add("cur--pointer");
    radio.value = radioValue;
    radio.addEventListener("click", () => {
        if (radio.checked) {
            firstChar = radio.value;
            fakeLabel.innerText = firstChar;
        };
        setTimeout(closeDetails, 400);
    });
    li.appendChild(radio);
    return li;
};

function closeDetails() {
    fakeSelect.removeAttribute("open");
};

function genPassword() {
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

    // Evaluate if there is any first chars defined
    if (!firstChar == "") {
        password = firstChar;
        // Concatenate the rest of 'password' characters up to its max. length
        for (let i = bindingChars.length; i < length - 1; i++) {
            let index = Math.floor(Math.random() * allChars.length);
            passChars.push(allChars[index]);
        }
    } else {
        password = "";
        // Concatenate the rest of 'password' characters up to its max. length
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

    // Hide empty state
    emptyState.style.display = "none";

    const passText = document.createElement("p");
    passText.classList.add("password");
    passText.classList.add("w--100");
    passText.classList.add("p--2_3");
    passText.classList.add("text_sub-l");
    passText.classList.add("b--p-10-50");
    passText.classList.add("bdp-f--blur-1");
    passText.classList.add("bd--p-50-10_1_sd");
    passText.classList.add("bd-rd--2");
    passText.classList.add("tr--a_out_4");
    passText.classList.add("cur--pointer");

    const passCharsArray = password.split("");
    passCharsArray.forEach((c) => {
        const char = document.createElement("span");
        char.classList.add("char-span");
        char.innerText = c;
        if (lowerChars.includes(c)) {
            char.style.color = "cyan";
        } else if (upperChars.includes(c)) {
            char.style.color = "#0f0";
        } else if (numbersChars.includes(c)) {
            char.style.color = "#f0f";
        } else if (specialChars.includes(c)) {
            char.style.color = "#ff0";
        }
        passText.appendChild(char);
    });

    // Copy password to clipboard
    passText.addEventListener("click", (e) => {
        copy(e.target.textContent, "Password copied to clipboard.", "Create a password before copying it.");
    });

    passCont.appendChild(passText);
};

function copy(text, successMsg, errorMsg) {
    const display = window.getComputedStyle(emptyState).display;
    if (display === "none") {
        const textToCopy = document.createElement("textarea");
        textToCopy.value = text;
        document.body.appendChild(textToCopy);
        textToCopy.select();
        document.execCommand("copy");
        document.body.removeChild(textToCopy);
        showToast({
            type: "success",
            title: "Success!",
            description: successMsg
        }); // Show toast once the password is copied. See function below 👇
    } else {
        showToast({
            type: "error",
            title: "Error!",
            description: errorMsg
        });        
    }
}

function showToast({type, title, description}) {
    const toast = document.createElement("div");

    // Classes
    const classes = [
        "toast",
        `toast-${type}`,
        "relative",
        "p--3",
        "flex",
        "j-c--space-b",
        "al-i--start",
        "g--3",
        "bd-rd--2",
        "ov--hidden"
    ];
    classes.forEach(c => {
        toast.classList.add(c);
    });
    
    // Asign random ID
    const now = Date.now();
    const randomNum = Math.floor(Math.random() * 100);
    const toastID = now + randomNum;
    toast.id = toastID;

    // Icons
    const icons = {
        success:    `<svg 
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                        <path d="M9 12l2 2l4 -4" />
                    </svg>`,
        warning:    `<svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                        <line x1="12" x2="12" y1="9" y2="13" />
                        <line x1="12" x2="12.01" y1="17" y2="17" />
                    </svg>`,
        error:      `<svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" x2="12" y1="8" y2="12" />
                        <line x1="12" x2="12.01" y1="16" y2="16" />
                    </svg>`
    }

    // Template
    const template =    `<div class="toast__main-layer flex al-i--start g--2">
                            ${icons[type]}
                            <div class="toast__text-cont flex f-d--col g--1">
                                <p class="toast__title text_sub-m">${title}</p>
                                <p class="toast__description text_body-s">${description}</p>
                            </div>
                        </div>
                        <button class="toast__btn cur--pointer">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#f2f2f2"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M18 6l-12 12m0 -12l12 12" />
                            </svg>
                        </button>`;
    toast.innerHTML = template;
    
    const toastCountdown = document.createElement("div");
    toastCountdown.classList.add("toast__countdown");
    toast.appendChild(toastCountdown);

    // Functions
    const fadeToast = (id) => {
        document.getElementById(id)?.classList.add("fade");
    };
    const closeToast = (e) => {
        if (e.animationName === "fade") {
            toast.removeEventListener("animationend", closeToast);
            toast.remove();
        }
    };
    const autoCloseToast = (e) => {
        if (e.animationName === "countdown") {
            toastCountdown.removeEventListener("animationend", autoCloseToast);
        }
        fadeToast(toastID);
    };

    // Events
    toast.addEventListener("click", (e) => {
        if (e.target.closest("button.toast__btn")) {
            fadeToast(toastID);
        }
    });
    toast.addEventListener("animationend", closeToast);
    toastCountdown.addEventListener("animationend", autoCloseToast);

    // Animation
    const SPEED = 120;
    const duration = description.length * SPEED;
    toastCountdown.style.animationDuration = `${duration}ms`;    

    toastsCont.appendChild(toast);
};

function calcCrackTime() {
    const n = password.length;
    let c = 0; // Character variety
    const r = 1000000000; // 1 billion attempts per second decryption rate

    if (hasLower) c += lowerChars.length;
    if (hasUpper) c += upperChars.length;
    if (hasNumbers) c += numbersChars.length;
    if (hasSpecial) c += specialChars.length;

    // use the full formula to calculate Entropy instead of a simplified one
    const entropy = n * Math.log2(c);

    // Calculate the crack time
    const crackTimeSeconds = Math.pow(2, entropy) / r; 
    let crackTimeYears = (crackTimeSeconds / (60 * 60 * 24 * 365)).toFixed(2);

    if (crackTimeYears > 1) {
        crackTimeYears = Math.round(crackTimeYears);
    };

    return crackTimeYears;
};