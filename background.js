const background = document.getElementById("background");

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
};