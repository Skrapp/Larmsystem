// Funktion för att ändra styling när man aktiverar/avaktiverar ett larmsystem
async function toggleAlarmSystemStatus(alarmType){
    const alarmControlContainer = document.querySelector(`.alarm-control-container[data-alarm-type="${alarmType}"]`);
    if(!alarmControlContainer){
        logEvent('error', `Hittar ingen larmcontainer för alarmType: ${alarmType}`);
        return;
    }

    const alarmTypeSwe = getSwedishAlarmType(alarmType);

    //inväntar svar av pinkod
    const isPinCorrect = await promptForPinCode(`ändra status på ${alarmTypeSwe.toLowerCase()}`);
    if(!isPinCorrect){
        logEvent('warn', `PIN-kod fel vid ${alarmTypeSwe.toLowerCase()}`);
        
        return;
    }

    const currentStatus = alarmControlContainer.dataset.status;
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

//Event listeners för att aktivera/avaktivera larmsystem
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