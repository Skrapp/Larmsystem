function logEvent(type, message){
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] [${type.toUpperCase()}] ${message}`);

    const logs = JSON.parse(localStorage.getItem('eventLogs')) || [];
    logs.push({ timestamp, type, message });
    localStorage.setItem('eventLogs', JSON.stringify(logs));
}

// Funktion för att ändra styling när man aktiverar/avaktiverar ett larm
function toggleAlarmSystemStatus(alarmType){
    const alarmControlContainer = document.querySelector(`.alarm-control-container[data-alarm-type="${alarmType}"]`);
    if(!alarmControlContainer){
        logEvent('error', `Hittar ingen larmcontainer för alarmType: ${alarmType}`);
        return;
    }

    const currentStatus = alarmControlContainer.dataset.status;
    const alarmTypeSwe = getSwedishAlarmInfo(alarmType);
    const statusBtnText = alarmControlContainer.querySelector(".alarm-status-btn .status-text");
    const statusIcon = alarmControlContainer.querySelector(".alarm-status-btn i");
    const toggleBtn = alarmControlContainer.querySelector(".set-active-btn");

    if(currentStatus === 'inactive'){
        logEvent('info', `Aktiverar ${alarmTypeSwe.toLowerCase()}`);
        alarmControlContainer.dataset.status = 'active';
        statusBtnText.innerText = "Aktiverat";
        toggleBtn.innerText = `Stäng av ${alarmTypeSwe.toLowerCase()}`;
        if(alarmType === 'trespassing' && statusIcon){
            statusIcon.classList.remove('bi-unlock2');
            statusIcon.classList.add('bi-lock');
        }
    }
    else{
        logEvent('info', `Avaktiverar ${alarmTypeSwe.toLowerCase()}`);
        alarmControlContainer.dataset.status = 'inactive';
        statusBtnText.innerText = 'Ej aktiverat';
        toggleBtn.innerText = `Aktivera ${alarmTypeSwe.toLowerCase()}`;
        if(alarmType === 'trespassing' && statusIcon){
            statusIcon.classList.remove('bi-lock');
            statusIcon.classList.add('bi-unlock2');
        }
    }
}

function getSwedishAlarmInfo(alarmType){
    switch(alarmType){
        case "trespassing":
            return "Inbrottslarm";
        case "fire":
            return "Brandlarm";
        default:
            logEvent('warn', `Okänt larmtyp: ${alarmType}`);
    }
    return "Larm";
}

function deactivateAlarm(alarmType){
    const alarmInfoSwe = getSwedishAlarmInfo(alarmType);
    //logga
    logEvent('info', `Försöker stänga av ${alarmInfoSwe.toLowerCase()}...`);

    //pinkod

    logEvent('info', `${alarmInfoSwe} avstängt!`);

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
    //TODO gör den snyggare?
    const confirmationMsg = document.createElement('p');
    confirmationMsg.innerText = `${alarmInfoSwe} är avstängt.`;
    const mainElement = document.querySelector('main');
    mainElement.insertBefore(confirmationMsg, mainElement.firstChild);

    setTimeout(() => {
        confirmationMsg.remove();
    }, 5000);
}

//Funktion för att trigga ett alarm att utlösas, skapar en 
function triggerAlarm(alarmType){
    //Logga
    const alarmInfoSwe = getSwedishAlarmInfo(alarmType);
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

// Funktion för att visa loggar
function showLogs(){
    const logsContainer = document.querySelector('#logs-container');
    const logsList = document.querySelector('#logs-list');
    const logsBtn = document.querySelector('#logs-btn');
    const logs = JSON.parse(localStorage.getItem('eventLogs')) || [];
    
    logsList.innerHTML = '';
    
    //TODO style logsContainer och alla element inne i
    logs.forEach(log => {
        const logElement = document.createElement('li');
        logElement.textContent = `[${log.timestamp}] [${log.type.toUpperCase()}] ${log.message}`;
        logsList.appendChild(logElement);
    });
    logsContainer.hidden = false;
    logsBtn.textContent = 'Uppdatera loggar';
}

//Event listeners för att aktiverea/avaktivera larmstatus
const alarmControlContainers = document.querySelectorAll(".alarm-control-container");
alarmControlContainers.forEach(c => {
    const toggleBtn = c.querySelector(".set-active-btn");
    const alarmType = c.dataset.alarmType;

    if(!toggleBtn){
        logEvent('error', `Det finns ingen toggle-knapp i container: ${c}`);
        return;
    }
    
    toggleBtn.addEventListener('click', () => 
        toggleAlarmSystemStatus(alarmType)
    );
})

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

const logsBtn = document.querySelector('#logs-btn');
logsBtn.addEventListener('click', showLogs);

const closeLogsBtn = document.querySelector('#close-logs-btn');
closeLogsBtn.addEventListener('click', () => {
    const logsContainer = document.querySelector('#logs-container');
    const logsBtn = document.querySelector('#logs-btn');

    logsContainer.hidden = true;
    logsBtn.textContent = 'Visa loggar';
})