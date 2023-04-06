export function windSpeedToColour(listOfWindSpeeds) {
    var colorList = []
    for (var val in listOfWindSpeeds) {
        var intWindVal = parseInt(listOfWindSpeeds[val])
        console.log(intWindVal)
        if (intWindVal >= 55) {      
            colorList.push("#c00000")
        } else if (intWindVal < 55 && intWindVal >= 51) {
            colorList.push("#f30606")
        } else if (intWindVal < 51 && intWindVal >= 45) {
            colorList.push("#ff5700")
        } else if (intWindVal < 45 && intWindVal >= 41) {
            colorList.push("#f79a35")
        } else if (intWindVal < 41 && intWindVal >= 35) {
            colorList.push("#ffd027")
        } else if (intWindVal < 35 && intWindVal >= 31) {
            colorList.push("#ffee37")
        } else {
            colorList.push("#83a7f9")
        }
    } 
    return colorList

}