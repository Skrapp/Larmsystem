const trespassingStatusContainer = document.querySelector("#trespassing-status-container");
const toggleTrespassingBtn = trespassingStatusContainer.querySelector(".set-active-btn");
const fireStatusContainer = document.querySelector("#fire-status-container");
const toggleFireBtn = fireStatusContainer.querySelector(".set-active-btn");


//TODO make it a for loop, make a class of status-container, get a list of em, for each element set up event listener on button
toggleTrespassingBtn.addEventListener('click', () => 
    toggleAlarmStatus(trespassingStatusContainer)
);

toggleFireBtn.addEventListener('click', () => 
toggleAlarmStatus(fireStatusContainer)
);

function toggleAlarmStatus(alarmStatusContainer){
    const currentStatus = alarmStatusContainer.dataset.status;
    const statusBtnText = alarmStatusContainer.querySelector(".active-status-btn .status-text");
    const toggleBtn = alarmStatusContainer.querySelector(".set-active-btn");

    
    if(currentStatus === 'inactive'){
        alarmStatusContainer.dataset.status = 'active';
        statusBtnText.innerText = "Aktiverat";
        toggleBtn.innerText = "Stäng av larm"
    }
    else{
        alarmStatusContainer.dataset.status = 'inactive';
        statusBtnText.innerText = 'Ej aktiverat';
        toggleBtn.innerText = 'Aktivera larm';
    }
}