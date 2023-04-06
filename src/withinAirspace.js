
import { getAirports, getRedAirports } from "./airports";
import {  haversineDistance } from "./calculateDistance";

export function checkD(marker) { //used to check if marker is within airport airspace
    console.log("calling checkD");
    var airports = [];
    airports =  getAirports();
    
    for (var airspace=0; airspace<airports.length; airspace++) { //for circle on map
        console.log()
        var distnace = haversineDistance(airports[airspace].center, marker)
        distnace = distnace*1000;     //convert to metres
        if (distnace < (airports[airspace].rad*.6)) {  // the radius was not accurately represented on the map so I multiplied by .6 to be more accuarte?????
            console.log("*WITHIN RADIUS*:\n", "distance: ", distnace, "airport name and rad:", airports[airspace].name, airports[airspace].rad);
            const ret = {
                result: true, 
                name: airports[airspace].name, 
                color: airports[airspace].color
            }
            return ret;
        } else {
            console.log("distance:",distnace, airports[airspace].name)
        }

    }
}

export function checkRedAreas(gridNode) { //used to check if a grid node is withim a red airspace
    var airports = getRedAirports()
    for (var air in airports) {
        var distance = haversineDistance(gridNode, airports[air].center)
        distance = distance*1000
        if (distance < (airports[air].rad*.6)) {
            return false
        }
        else {
            return true
        }
    }
    
    
}