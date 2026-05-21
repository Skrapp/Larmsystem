const activeStatusContainers = document.querySelectorAll(".active-status-container");

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

activeStatusContainers.forEach(c => {
    const toggleBtn = c.querySelector(".set-active-btn");
    toggleBtn.addEventListener('click', () => 
        toggleAlarmStatus(c)
);
})
