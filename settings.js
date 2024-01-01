/* SELECTORS
================================================================= */
const modalBlur = document.getElementById("modal-blur");
const settings = document.getElementById("settings-modal-cont");

// Checkboxes
const lowerCheck = document.getElementById("include-lower");
const upperCheck = document.getElementById("include-upper");
const numbersCheck = document.getElementById("include-numbers");
const specialCheck = document.getElementById("include-special");

// Ranges
const lengthLabel = document.getElementById("length-label");
const lengthInput = document.getElementById("length-input");
const passNumberLabel = document.getElementById("pass-number-label");
const passNumberInput = document.getElementById("pass-number-input");

// Fake select
const fakeLabel = document.getElementById("fake-label");
const fakeSelect = document.getElementById("fake-select");
const fakeOptionsList = document.getElementById("fake-options-list");
const firstRadio = document.getElementById("first-radio");

// Buttons
const doneBtn = document.getElementById("done-btn");
const cancBtn = document.getElementById("canc-btn");

/* FUNCTIONS
================================================================= */
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

function showToastIfAnyChecks() {
    if(!hasLower && !hasUpper && !hasNumbers && !hasSpecial) {
        showToast({
            type: "warning",
            title: "Warning!",
            description: "Select at least one type of characters."
        }); // Show toast once the password is copied. See function below 👇
    }
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
    firstRadio.checked = true;
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

/* EVENTS
================================================================= */
const settingsToggle = Array.from(document.querySelectorAll(".settings-toggle"));
settingsToggle.forEach((trigger) => {
    trigger.addEventListener("click", () => {
        settings.classList.toggle("active");
        modalBlur.classList.toggle("active");
    })
})

// Checkboxes 
lowerCheck.addEventListener("input", () => {
    hasLower = lowerCheck.checked ? true : false;
    check(lowerChars);
    showToastIfAnyChecks();
    updateFirstCharSelect();
});

upperCheck.addEventListener("input", () => {
    hasUpper = upperCheck.checked ? true : false;
    check(upperChars);
    showToastIfAnyChecks();
    updateFirstCharSelect();
});

numbersCheck.addEventListener("input", () => {
    hasNumbers = numbersCheck.checked ? true : false;
    check(numbersChars);
    showToastIfAnyChecks();
    updateFirstCharSelect();
});

specialCheck.addEventListener("input", () => {
    hasSpecial = specialCheck.checked ? true : false;
    check(specialChars);
    showToastIfAnyChecks();
    updateFirstCharSelect();
});

// Ranges
passNumberInput.addEventListener("input", () => {
    numberOfPass = passNumberInput.value;
    passNumberLabel.textContent = `Passwords: ${numberOfPass}`;
});

lengthInput.addEventListener("input", () => {
    length = lengthInput.value;
    lengthLabel.textContent = `Length: ${length}`;
});

// Fake select
firstRadio.addEventListener("click", function() {
    if (this.checked) {
        firstChar = "";
        fakeLabel.innerText = this.value;
    };
    setTimeout(closeDetails, 400);
});

// Buttons
doneBtn.addEventListener("click", () => {
    closeDetails();
})

cancBtn.addEventListener("click", () => {
    setTimeout(resetSettings, 400);
});