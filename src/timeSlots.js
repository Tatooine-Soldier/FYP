export function getTimeSlots() {
    const times = [] //final array of JSON timeslot objects that will be returned
    var timesList = [] //temp array of string times
    var hours = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"]
    var minutes = ["00", "15", "30", "45"]

    for (var hour in hours) {
        hours[hour] = hours[hour].toString()
        for (var minute in minutes) {
            minutes[minute] = minutes[minute].toString()
            var timeEntry = hours[hour] + ":" + minutes[minute]
            timesList.push(timeEntry)
        }
    }
    
    for (var val in timesList) {
        var timeslot = {
            time: timesList[val],
            status: false, ////false means this timeslot is not booked
            flightDurationL: 0,
            userID: 0
        } 
        times.push(timeslot)
    }
    return times
}

