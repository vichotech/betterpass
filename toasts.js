const toastsCont = document.getElementById("toasts-cont");

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