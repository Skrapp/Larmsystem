// Funktion för att ändra styling när man aktiverar/avaktiverar ett larm
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

function deactivateAlarm(alarmType){
    console.log(`Försöker stänga av ${alarmType}...`);
    //logga
    //pinkod
    //ta bort alla element kopplade till alarmType i alarm-info-section
    //Om alla larm är avstängda, ta bort hela alarm-info-section
    //Lägg till ett konfirmationsmeddelande att larmet är avstängt (försvinner efter 5 s)

}

//Funktion för att trigga ett alarm att utlösas, skapar en 
function triggerAlarm(alarmType){
    let alarmInfoSwe = "";
    switch(alarmType){
        case "trespassing":
            console.log("Inbrottslarm utlöst!");
            alarmInfoSwe = "Inbrottslarm";
            break;
        case "fire":
            console.log("Brandlarm utlöst!");
            alarmInfoSwe = "Brandlarm";
            break;
        default:
            console.warn("Okänt larmtyp:", alarmType);
    }
    //Logga
    
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

//Event listeners för att aktiverea/avaktivera larmstatus
const activeStatusContainers = document.querySelectorAll(".active-status-container");
activeStatusContainers.forEach(c => {
    const toggleBtn = c.querySelector(".set-active-btn");

    if(!toggleBtn){
        console.error("Det finns ingen toggle-knapp i container:", c);
        return;
    }
    
    toggleBtn.addEventListener('click', () => 
        toggleAlarmStatus(c)
    );
})

//Event listeners för att trigga larm
const triggerBtns = document.querySelectorAll(".alarm-trigger-btn");
triggerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const alarmType = btn.dataset.alarmType;
        //pinkod
        triggerAlarm(alarmType);
    });
});