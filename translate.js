
function getSwedishAlarmType(alarmType){
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
