const pinCodeDisplay = document.querySelector('#pin-code-display');
const keys = document.querySelectorAll('.key');
const clearBtn = document.querySelector('.clear-btn');
const submitBtn = document.querySelector('.submit-btn');
let pin = '';

keys.forEach(key => {
    key.addEventListener('click', () => {
        pin += key.textContent;
        updateDisplay();
    });

});

clearBtn.addEventListener('click', () => {
    pin = '';

    updateDisplay();

});

function updateDisplay() {

    pinCodeDisplay.textContent =
        '*'.repeat(pin.length);

}

// Funktion för att prompta användaren att trycka in pinkod
function promptForPinCode(reason){
    return new Promise((resolve) => {
        const correctPin = 1234;
        let attempts = 0;
        const maxAttempts = 3;
        pin = '';

        updateDisplay();

        const instruction = document.getElementById('pin-code-instruction');
        instruction.innerText = `Tryck in pinkod för att ${reason}, avsluta med "*"`

        const pinCodeOverlay = document.getElementById('pin-code-overlay');
        pinCodeOverlay.style.display = 'flex';
        
        const handleSubmit = () => {
            const isCorrect = parseInt(pin) === correctPin;
            attempts++;
            
            if(isCorrect){
                pinCodeOverlay.style.display = 'none';
                submitBtn.removeEventListener('click', handleSubmit);
                resolve(isCorrect);
                return;
            }
            
            if(attempts < maxAttempts){
                logEvent('warn', `PIN-kod fel. Försök ${attempts}.`);
                pin = '';
                updateDisplay();
                instruction.innerText = 
                    `PIN-kod fel. Försök igen (${maxAttempts - attempts} försök kvar)`;
            } else {
                logEvent('error', `PIN-kod fel ${maxAttempts} gånger i följd - åtkomst nekad`);
                instruction.innerText = `PIN-kod fel för många gånger. Åtkomst nekad.`;
                
                //Här skulle en riktig lock-out vara
                setTimeout(() => {
                    pinCodeOverlay.style.display = 'none';
                    submitBtn.removeEventListener('click', handleSubmit);
                    resolve(false);
                }, 10000);
            }
        };
        
        submitBtn.addEventListener('click', handleSubmit);
    });
}