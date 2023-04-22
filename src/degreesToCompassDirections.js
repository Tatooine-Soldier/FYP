// return list of Nautical directions converted from the inputted degree values
export function convertDegreesToDirection(degreeList) {
    var listOfDirections = []
    for (var i in degreeList) {
        var degree = degreeList[i]
        if (degree <= 180) {
            if (degree <= 90) {
                if (degree <= 22.5) {
                    listOfDirections.push("North-NorthEast")
                    console.log("degreeList[i]", degreeList[i])
                }
                if (22.5 < degree && degree <= 45) {
                    listOfDirections.push("NorthEast")
                    console.log("degreeList[i]", degreeList[i])
                }
                if (45 < degree && degree <= 67.5) {
                    listOfDirections.push("East-NorthEast")
                    console.log("degreeList[i]", degreeList[i])
                }
                if (67.5 < degree && degree <= 90) {
                    listOfDirections.push("East")
                    console.log("degreeList[i]", degreeList[i])
                }
            }
            else {
                if (90 < degree && degree <= 112.5) {
                    listOfDirections.push("East-SouthEast")
                }
                if (112.5 < degree && degree <= 135) {
                    listOfDirections.push("SouthEast")  
                }
                if (135 < degree && degree <= 157.5) {
                    listOfDirections.push("South-SouthEast")
                }
                if (157.5 < degree && degree <= 180) {
                    listOfDirections.push("South")
                }
            }
        } 
        else {
            if (degree <= 270) {
                if (180 < degree && degree <= 202.5) {
                    listOfDirections.push("South-SouthWest")
                    console.log("degreeList[i] SWS", degreeList[i])
                }
                if (202.5 < degree && degree <= 225) {
                    listOfDirections.push("SouthWest")
                    console.log("degreeList[i] SW", degreeList[i])
                }
                if (225 < degree && degree <= 247.5) {
                    listOfDirections.push("West-SouthWest")
                    console.log("degreeList[i] WSW", degreeList[i])
                }
                if (247.5 < degree && degree <= 270) {
                    listOfDirections.push("West")
                }
            }
            else {
                if (270 < degree && degree <= 292.5) {
                    listOfDirections.push("West-NorthWest")
                }
                if (292.5 < degree && degree <= 315) {
                    listOfDirections.push("NorthWest")
                }
                if (315 < degree && degree <= 337.5) {
                    listOfDirections.push("North-NorthWest")
                }
                if (337.5 < degree && degree <= 360)  {
                    listOfDirections.push("North")
                }
            }
        }
    }
  
    return listOfDirections
    
}