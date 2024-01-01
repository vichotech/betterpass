/* SELECTORS
================================================================= */
const genBtn = document.getElementById("gen-btn");
const emptyState = document.getElementById("empty-state");
const passCont = document.querySelector(".password-cont");

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

/* EVENTS
================================================================= */
window.addEventListener("load", () => {
    showBg();
    resetSettings();
    updateFirstCharSelect();
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
function check(charArray) {
    if (charArray.some((char) => char === firstChar)) {
        firstChar = "";
        fakeLabel.innerText = "None";
        firstRadio.checked = true;
    }
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
    passText.classList.add("b--p-10-30");
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