function logEvent(type, message){
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] [${type.toUpperCase()}] ${message}`);

    const logs = JSON.parse(localStorage.getItem('eventLogs')) || [];
    logs.push({ timestamp, type, message });
    localStorage.setItem('eventLogs', JSON.stringify(logs));
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

// Knappar
const closeLogsBtn = document.querySelector('#close-logs-btn');
closeLogsBtn.addEventListener('click', () => {
    const logsContainer = document.querySelector('#logs-container');

    logsContainer.hidden = true;
    logsBtn.textContent = 'Visa loggar';
})

const logsBtn = document.querySelector('#logs-btn');
logsBtn.addEventListener('click', showLogs);