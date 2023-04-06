<template>
    <section class="profile-page">
        <section id="expanded-flight">
            Expanded Flight:
            <p class="flight-details-records">
                <b>ID:</b> {{ flightIDs[cursor] }}
            </p>
            <p class="flight-details-records">
                <b>Date:</b> {{ flightDates[cursor] }}
            </p>
            <p class="flight-details-records">
                <b>Take-Off Time:</b> {{ flightStartTimes[cursor] }}
            </p>
            <p class="flight-details-records">
                <b>ETA:</b> {{ flightEndTimes[cursor] }}
            </p>
            <p class="flight-details-records">
                <b>Altitude:</b> {{ flightAltitudes[cursor] }}
            </p>
            <p class="flight-details-records">
                <b>Drone:</b> {{ flightDrones[cursor] }}
            </p>
            <p class="flight-details-records">
                <b>Starting point:</b>{{ flightSourceCoords[cursor] }}
            </p>
            <p class="flight-details-records">
                <b>Destination Point</b>{{ flightDestCoords[cursor] }}
            </p> 
        </section>
        <img src="../assets/ex-sign.png" id="profile-ex" @click="hideFlight()"/>
        <section class="profile-main">
            <header>
                <p>Profile Page</p>
                <h2>Welcome <i>{{ user }}</i></h2>
            </header>
            <input type="button" value="hide" id="collapseFlights" @click="collapseFlights()">
            <section class="profile-data-container">
                <div class="past-flight-display" id="past-flight-display">
                    <p id="past-flights-heading">Your past flights: </p>
                    <!-- <p v-for="(flight, index) in flightData" v-bind:key="index">
                        {{ flight }}
                    </p> -->

                    <div class="flight-details-headings" id="flight-details-headings">
                        <b>Flight ID</b>
                        <b>Date</b>
                        <b>Start Time</b>
                        <b>End Time</b>
                        <b>Altitude</b>
                    </div>
                    <div class="displayFlightDetails" id="displayFlightDetails" v-for="(i, index) in flightData" v-bind:key="index" @click="showFlight(index)">
                            <p class="flight-details-records">
                                {{ flightIDs[index] }}
                            </p>
                            <p class="flight-details-records">
                                {{ flightDates[index] }}
                            </p>
                            <p class="flight-details-records">
                                {{ flightStartTimes[index] }}
                            </p>
                            <p class="flight-details-records">
                                {{ flightEndTimes[index] }}
                            </p>
                            <p class="flight-details-records">
                                {{ flightAltitudes[index] }}
                            </p>
                    </div>  
                </div>
                <div>
                    Your Saved Drones:
                    <div v-for="(i, index) in flightDrones" v-bind:key="index" class="drones-container">
                        <p class="drones-records">{{ flightDrones[index] }}</p>
                    </div>
                </div>
            </section>
            <div>
                <router-link to="/"><button class="but" @click="logout()">Logout</button></router-link>
            </div>
        </section>
    </section>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            user: "",
            flightData: [],
            flightIDs: [],
            flightDates: [],
            flightStartTimes: [],
            flightEndTimes: [],
            flightAltitudes: [],
            flightDrones: [],
            flightSourceCoords: [],
            flightDestCoords: [],
            pastCoordinates: [],
            cursor: 0,
            counter: 0
        }
    },
    async created() {
        axios
        .post("/userProfile")
        .then((response) => {
          const data = response.data;
          console.log("data: ", data)
          var dataArray = data.split("|")
          console.log("dataArray--> ", dataArray)
          this.user = dataArray[0]

          var flights = dataArray[1]
          const jsonArray = JSON.parse(flights);
          console.log("jsonArray-->", jsonArray)
          this.flightData = jsonArray
          this.arrangeDetails()
        })
        .catch(function (error) {
            console.log("ERROR:", error); 
        })
    },
    methods: {
        getIDs() {

        },
        arrangeDetails() {
            for (var flight in this.flightData) {
                this.flightIDs.push(this.flightData[flight].id)
                this.flightDates.push(this.flightData[flight].date)
                this.flightStartTimes.push(this.flightData[flight].time)
                this.flightEndTimes.push(this.flightData[flight].endTime)
                this.flightAltitudes.push(this.flightData[flight].altitude)
                if (this.flightData[flight].drone !== "") {
                    console.log("this.flightData[flight].drone-->", this.flightData[flight].drone)
                    this.flightDrones.push(this.flightData[flight].drone)
                }
                this.flightSourceCoords.push(this.flightData[flight].startCoord)
                this.flightDestCoords.push(this.flightData[flight].destCoord)
            }
        },
        showFlight(i) {
            this.cursor = i
            var e = document.getElementById("expanded-flight")
            e.style.display = 'block'
            var x = document.getElementById("profile-ex")
            x.style.display = 'block'
        },
        hideFlight() {
            var e = document.getElementById("expanded-flight")
            e.style.display = 'none'
            var x = document.getElementById("profile-ex")
            x.style.display = 'none'
        },
        logout() {
            var loginIcon = document.getElementById("login-icon")
            loginIcon.style.display = "none"
            var np = document.getElementById("nav-planner")
              np.style.visibility = "hidden"
        },
        collapseFlights() {
            var f = document.getElementById("past-flight-display")
            var c = document.getElementById("collapseFlights")
            if (this.counter % 2 === 0) {
                c.value = "show"
                f.style.display = "none"
            } else {
                c.value = "hide"
                f.style.display = "block"
            }
            this.counter += 1
        }
    }
}
</script>

<style>
.profile-main {
    color: white;
    padding-bottom: 20%;
}

.profile-data-container{
    display: grid;
    grid-template-columns: 70% 30%;
    column-gap: 4%;
}

#past-flights-heading {
    font-size: 1.1em;
}

header {
    text-align: center;
    border-bottom: solid 2px rgb(120, 255, 36);
    width: 60%;
    left: 20%;
    right: 20%;
}

#expanded-flight {
    display: none;
    width: 60%;
    left: 20%;
    top: 20%;
    background-color: rgb(79, 80, 80);
    color: white;
    z-index: 1;
    position: fixed;
    border: solid 2px rgb(120, 255, 36);
    padding: 3px;
}

#profile-ex {
    display: none;
    right: 19%;
    top: 20%;
    z-index: 1;
    position: fixed;
}

#profile-ex:hover {
    cursor: pointer;
}

.flight-details-records {
    text-align: center;
    border: solid grey 1px;
}

.displayFlightDetails {
    display: grid;
    grid-template-columns: 20% 20% 20% 20% 20%;
    background-color: rgb(50, 50, 50);
    border: solid grey 3px;
}

.displayFlightDetails:hover {
    background-color: rgb(70, 75, 70);
    cursor: pointer;
}

.flight-details-headings {
    display: grid;
    grid-template-columns: 20% 20% 20% 20% 20%;
    text-align: center;
}

.past-flight-display {
    padding: 10px;
}

.drones-records {
    text-align: center;
    border: solid grey 1px;
}

.drones-container {
    width: 50%;
    background-color: rgb(50, 50, 50);
    border: solid grey 3px;
    margin-left: 3%;
}

.but {
    margin: 1%;
    font-size: 15pt;
    padding: 10px 15px;
    color: white;
    font-weight: bolder;
    background-color: rgb(101, 100, 100);
    border: rgb(120, 255, 36) 2px solid;
    border-radius: 7px;
    width: 10%;
}

.but:hover {
    background-color: rgb(130, 127, 127);
    cursor:pointer;
}
</style>