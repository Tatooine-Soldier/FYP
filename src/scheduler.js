//i'll need to segment flights and store them
var flight = {
            srclat: "52.96408563130871", 
            srclng: "-8.141321874218754", 
            destlat: "53.48498603983665", 
            destlng: "-7.526130414562992",
            hour: "12",
            minute: "45",
            date: "2023-02-28",
            endtime: "02/28/2023, 17:11:00",
            speed: "16",
            corridor: "low-speed",
            waypoint: {lat: "", lng: ""},
            altitude: "30",
            orientation: "N",
            drone: {name: "", model: ""},
            id: "0"
}

export class Scheduler {
    constructor() {}
    fetchGridCoordinates() {
        axios //do axios to get this flight from the flights database and check if its start point is within the segmentation of any other flights
        .post("/fetchGridCoordinates")
        .then((response) => {
            const data = response.data;
            console.log("FETCHED FLIGHTS FOR THIS DATE: ", data);
            var timeList = [];
            for (item in myArray) {
                console.log("\nitem:" + typeof item + "\tdatesDisplay:" + datesDisplay);
                if (item === "0") {
                    datesDisplay = myArray[item] + "\n";
                }
                else {
                    datesDisplay = datesDisplay + "\n" + myArray[item];
                    console.log("typeof:", typeof myArray[item])
                    if (myArray[item] !== "") {
                        var time = myArray[item].slice(0,5)
                        timeList.push(time)
                    }
                }
            }
        })
    }

}

