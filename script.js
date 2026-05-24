//Stäng av ett aktivt alarm
async function deactivateAlarm(alarmType){
    const alarmTypeSwe = getSwedishAlarmType(alarmType);
    //logga
    logEvent('info', `Försöker stänga av ${alarmTypeSwe.toLowerCase()}...`);

    //inväntar svar av pinkod
    const isPinCorrect = await promptForPinCode(`stäng av ${alarmTypeSwe.toLowerCase()}`);
    if(!isPinCorrect){
        logEvent('warn', `PIN-kod fel vid avstängning av ${alarmTypeSwe.toLowerCase()}`);
        
        return;
    }

    //Här ska det skickas anrop till server att stänga av 
    logEvent('info', `${alarmTypeSwe} avstängt!`);

    //ta bort alla element kopplade till alarmType i alarm-info-section
    const alarmInfoSection = document.getElementById('alarm-info-section');
    if(!alarmInfoSection){
        logEvent('warn', "Det finns ingen alarm-info-section att uppdatera.");
        return;
    }
    
    const infoToRemove = alarmInfoSection.querySelector(`p[data-alarm-type="${alarmType}"]`);
    const btnToRemove = alarmInfoSection.querySelector(`button[data-alarm-type="${alarmType}"]`);

    if(infoToRemove) infoToRemove.remove();
    if(btnToRemove) btnToRemove.remove();

    //Om alla larm är avstängda, ta bort hela alarm-info-section
    if(!alarmInfoSection.querySelector('.deactivate-alarm-btn')) {
        alarmInfoSection.remove();
    }
    //Lägg till ett konfirmationsmeddelande att larmet är avstängt (försvinner efter 5 s)
    const confirmationMsg = document.createElement('p');
    confirmationMsg.innerText = `${alarmTypeSwe} är avstängt.`;
    const mainElement = document.querySelector('main');
    mainElement.insertBefore(confirmationMsg, mainElement.firstChild);

    setTimeout(() => {
        confirmationMsg.remove();
    }, 5000);
}

//Funktion för att trigga ett alarm att utlösas, skapar en 
function triggerAlarm(alarmType){
    //Logga
    const alarmInfoSwe = getSwedishAlarmType(alarmType);
    logEvent('info', `Larm utlöst: ${alarmInfoSwe}`);

    // Informera om larmet
    let alarmInfoSection = document.getElementById('alarm-info-section');
    if(!alarmInfoSection){
        //Om section inte finns, skapa den
        alarmInfoSection = document.createElement('section');
        alarmInfoSection.id = 'alarm-info-section';
        alarmInfoSection.innerHTML = `
            <h1>Larm utlöst!</h1>

            <p>För att stänga av larm, klicka på knappen nedan (pinkod behövs).</p>
            <div class="deactivate-alarm-btn-container">
            </div>
        `;

        const mainElement = document.querySelector('main');
        mainElement.insertBefore(alarmInfoSection, mainElement.firstChild);
    }
    //Om larmtypen inte redan larmats, lägg till i alarm-info-section
    if(!alarmInfoSection.querySelector(`.deactivate-alarm-btn[data-alarm-type="${alarmType}"]`)){
        const newInfo = document.createElement('p');
        newInfo.dataset.alarmType = alarmType;
        newInfo.innerText = `${alarmInfoSwe} har utlöst.`;
        
        const newDeacivationButton = document.createElement('button');
        newDeacivationButton.classList.add('deactivate-alarm-btn');
        newDeacivationButton.dataset.alarmType = alarmType;
        newDeacivationButton.innerText = `Stäng av ${alarmInfoSwe.toLowerCase()}`;
        
        alarmInfoSection.insertBefore(newInfo, alarmInfoSection.querySelector('p'));
        
        const btnContainer = alarmInfoSection.querySelector('.deactivate-alarm-btn-container');
        btnContainer.appendChild(newDeacivationButton);

        newDeacivationButton.addEventListener('click', () => {
            deactivateAlarm(alarmType);
        });

    }else return; //Om det redan larmats, gör inget


    //focus på alarm-info-section
    alarmInfoSection.scrollIntoView({ behavior: "smooth" });
}

//Event listeners för att trigga larm
const triggerBtns = document.querySelectorAll(".alarm-trigger-btn");
triggerBtns.forEach(btn => {
    const alarmType = btn.dataset.alarmType;
    if(alarmType === 'all'){
        btn.addEventListener('click', () => {
            triggerAlarm('fire');
            triggerAlarm('trespassing');
        })
        return;
    }
    btn.addEventListener('click', () => {
        //pinkod
        triggerAlarm(alarmType);
    });
});