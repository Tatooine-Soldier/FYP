<script setup>
  import FinalGoogleMapComponent from "@/components/FinalGoogleMapComponent.vue"
import MyGoogleMapComponent from "../components/MyGoogleMapComponent.vue"
//import MyCalendarComponent from "../components/MyCalendarComponent.vue";
import SpeedSelectorComponent from "@/components/SpeedSelectorComponent.vue";
import LoaderComponent from "@/components/LoaderComponent.vue";
import ForecastDisplayComponent from "@/components/ForecastDisplayComponent.vue";
//import FinalGoogleMapComponentVue from "@/components/FinalGoogleMapComponent.vue";
//   const props = defineProps(['title'])
</script>

<template>
    <section class="flight-planner" id="flight-planner">
            <!-- <form action="/planner" method="post"> -->
        <form @submit.prevent="handleSubmit()">
            <section id="loadingScreen"><LoaderComponent :propmsg="loaderMsg" :key="loaderRefresh"></LoaderComponent></section>
            <section class="flight-details-container" id="flight-details-container">
                <section class="flight-details" id="flight-details">
                    <section class="flight-details-content">
                        <h1>Confirm Flight Details</h1>
                        <section class="flight-details-content-grid">
                            <div>Take-Off from: <div class="coordsConfirm"><i class="latdisplay">{{ coords.sourcelatitude }}</i>   <i class="longdisplay">{{ coords.sourcelongitude }}</i></div></div>
                            <div>Land at: <div class="coordsConfirm"><i class="latdisplay">{{ coords.destlatitude }}</i>   <i class="longdisplay">{{ coords.destlongitude }}</i></div></div>
                            <div>Speed: <div class="coordsConfirm">{{speed.velocity}} KM/H</div></div>
                            <div>Altitude(Default): <div class="coordsConfirm">{{altitude}} m</div></div>
                            <div>Calculated distance: <div class="coordsConfirm">{{ distance }} KM</div></div>
                        </section>
                        <section class="flight-details-buttons">
                            <input id="cancel-but" name="but" type="button" value="Cancel" v-on:click="disappear()"/>
                            <button id="confirm-but" v-on:click="showFinalMap(true)">Confirm</button>
                        </section>
                    </section>
                </section>
            </section>
            <img src="../assets/ex-sign.png" id="ex-sign-wind" v-on:click="disappearWindEx()"/>

            <section id="details-map-container">
                <!-- <MyGoogleMapComponent @someEvent="logme" :propspeed="time"></MyGoogleMapComponent> -->
                <!-- <SpeedSelectorComponent @speedEvent="logspeed"></SpeedSelectorComponent> -->
            </section>
            <section id="final-map-container">
                <FinalGoogleMapComponent @loadedMap="logLoaded" :propcoords="coords" :propspeed="speed.velocity" :propdate="date" :propway="waypoints" :propSubgrid="subGrid" :propEndTime="endTime" :propDuration="duration" :propID="flightID" :key="componentKey"></FinalGoogleMapComponent>
            </section>
            <section id="weather-display-planner">
                <ForecastDisplayComponent :key="windKey"></ForecastDisplayComponent>
            </section>
            
            <section id="calendar-display-afterwards" >
                <section class="time-selection">
                    <div>
                        <label for="hour">Select hour: </label>
                        <select id="hour" name="hour" v-model="date.hour" >
                            <option value="00">00</option>
                            <option value="01">01</option>
                            <option value="02">02</option>
                            <option value="03">03</option>
                            <option value="04">04</option>
                            <option value="05">05</option>
                            <option value="06">06</option>
                            <option value="07">07</option>
                            <option value="08">08</option>
                            <option value="09">09</option>
                            <option value="10">10</option>
                            <option value="11">11</option>
                            <option value="12">12</option>
                            <option value="13">13</option>
                            <option value="14">14</option>
                            <option value="15">15</option>
                            <option value="16">16</option>
                            <option value="17">17</option>
                            <option value="18">18</option>
                            <option value="19">19</option>
                            <option value="20">20</option>
                            <option value="21">21</option>
                            <option value="22">22</option>
                            <option value="23">23</option>
                        </select>
                    </div>
                    <div>
                        <label for="minute">Select minute: </label>
                        <select id="minute" name="minute" v-model="date.minute" >
                            <option value="00">00</option>
                            <option value="15">15</option>
                            <option value="30">30</option>
                            <option value="45">45</option>
                        </select>
                    </div>
                    <div id="last-div">
                        <label for="day">Select day: </label>
                        <input type="date" name="date" id="day" v-model="date.day" />
                    </div>

                    
                </section>
                <!-- <section>
                    <div class="check-time-db" @click="getDates()">Check availablility</div>
                 
                    <MyCalendarComponent @selectedTimeEvent="logTime" :propdates="bookedDates" :propID="flightID"></MyCalendarComponent>
                </section> -->
                <section>
                   
                    
                     <div id="submit-div-planflight" @click="showFinalMap(true)">Confirm Time</div>
                     <!-- <input type="button" value="Confirm" @click="showFinalMap(true)"/> -->
                </section>
            </section>
            
            <section class="waypoint-submit-container" id="waypoint-container">
                Enter desired waypoints:
                <section>
                    <input type="text" name="sourcelatitude" size="16"/>
                </section>
            </section>
            <section class="date-flights-container">
                <li v-for="item in bookedDates" :key="item">
                    {{ item }}
                </li>
            </section>
            <div><img src="../assets/ex-sign.png" id="ex-sign" v-on:click="disappearEx()"/></div>

            <!-- row content  -->
            <span><b @click="hidePanel()" id="lt">&gt;</b></span>
            <section class="split-container" id="splitContainer">
                <section class="map-container">
                    <MyGoogleMapComponent @someEvent="logme" :propspeed="time"></MyGoogleMapComponent>
                    <SpeedSelectorComponent @speedEvent="logspeed"></SpeedSelectorComponent>
                </section>
                <section class="side-container">
                    <section class="four-rows">
                        <section class="fp-info-container">
                            <section class="fp-sub-info">
                                
                                <section class="border-decor">
                                    <p class="fp-subtitle">Select your time to fly:</p>
                                   
                                        <section class="time-selection">
                                            <div>
                                                <label for="hour">Select hour: </label>
                                                <select id="hour" name="hour" v-model="date.hour">
                                                    <option value="00">00</option>
                                                    <option value="01">01</option>
                                                    <option value="02">02</option>
                                                    <option value="03">03</option>
                                                    <option value="04">04</option>
                                                    <option value="05">05</option>
                                                    <option value="06">06</option>
                                                    <option value="07">07</option>
                                                    <option value="08">08</option>
                                                    <option value="09">09</option>
                                                    <option value="10">10</option>
                                                    <option value="11">11</option>
                                                    <option value="12">12</option>
                                                    <option value="13">13</option>
                                                    <option value="14">14</option>
                                                    <option value="15">15</option>
                                                    <option value="16">16</option>
                                                    <option value="17">17</option>
                                                    <option value="18">18</option>
                                                    <option value="19">19</option>
                                                    <option value="20">20</option>
                                                    <option value="21">21</option>
                                                    <option value="22">22</option>
                                                    <option value="23">23</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label for="minute">Select minute: </label>
                                                <select id="minute" name="minute" v-model="date.minute">
                                                    <option value="00">00</option>
                                                    <option value="15">15</option>
                                                    <option value="30">30</option>
                                                    <option value="45">45</option>
                                                </select>
                                            </div>
                                            <div id="last-div">
                                                <label for="day">Select day: </label>
                                                <input type="date" name="date" v-model="date.day"/>
                                            </div>
                                            
                                            
                                        </section>
                                        <div id="weather-div-planner">
                                            <input type="button" name="windData" id="fetchWindButton" value="Wind Forecast" @click="fetchWind()"/>
                                        </div>
                                    
                                    
                                </section>
                            </section>
                        </section>
                        <section class="fp-info-container">
                        
                            <section class="fp-sub-info">
                                <p class="fp-subtitle">Select your source and destination:</p>
                                <section class="coords-container">
                                    
                                    <!-- <form action="/location" method="post"> -->
                                    <section class="coords">
                                        <section class="coords-source">
                                            <div class="coords-labels"><b>Source:</b></div>
                                            <section class="coords-inputs">
                                                <label for="latitude">Latitude: </label>
                                                <input type="text" name="sourcelatitude" size="16" ref="mysourcelat"/>
                                                <label for="longitude">Longitude: </label>
                                                <input type="text" name="sourcelongitude" size="16" ref="mysourcelong"/>
                                            </section>
                                        </section>
                                        <section class="coords-destination">
                                            <div class="coords-labels"><b>Destination:</b></div>
                                            <section class="coords-inputs">
                                                <label for="latitude">Latitude: </label>
                                                <input type="text" name="destlatitude" size="16" ref="mydestlat"/>
                                                <label for="longitude">Longitude: </label>
                                                <input type="text" name="destlongitude" size="16" ref="mydestlong">
                                            </section>
                                        </section>
                                        <section class="waypoints-container">
                                            <div class="waypoints-select">
                                                <label for="waypoint">Waypoint Lat:</label>
                                                <input type="text" name="waypoint" size="16" ref="mywaylat" value="0.0"/>
                                                <label for="waypoint">Waypoint Lng:</label>
                                                <input type="text" name="waypoint" size="16" ref="mywaylng" value="0.0"/>
                                         
                                            </div>
    
                                        </section>
                                    </section>
                                </section>
                            </section>
                        </section>
                        <section class="fp-info-container">
                            
                            <section class="fp-sub-info">
                                <p class="fp-subtitle">View your desired UAV speed:</p>
                                    <!-- <form action="/speed" method="post"> -->
                                    <section class="speed-container">
                                       
                                        <label for="speed">Speed(km/h): </label>
                                        <input type="number" id="speed" name="speed" min="1" max="120" ref="myspeed" value="1" disabled>
                                     
                                    </section>
                                    <hr>
                                    <section class="altitude-container">
                                        <p class="fp-subtitle">View your default UAV altitude(metres):</p>
                                        <section>
                                            
                                            <label for="altitude">Altitude: </label>
                                            <input type="number" id="altitude" name="altitude" min="15" max="120" ref="myaltitude" disabled>
                                            <p><small><i>* EU Aviation Safety Authority states the maximum flight altitude is 120m.* <br>More information can be found <a href="https://www.easa.europa.eu/en/light/topics/drones" style="color:white;">https://www.easa.europa.eu/en/light/topics/drones</a></i></small></p>
                                        </section>
                                    </section>
                                    <hr>
                                    <section class="orientation-container">
                                        <p class="fp-subtitle">Select your desired view orientation:</p>
                                        <section>
                                            <label for="orientation">Select orientation: </label>
                                            <select id="orientation" name="orientation" ref="myorientation">
                                                <option value="N">North</option>
                                                <option value="NE">NorthEast</option>
                                                <option value="E">East</option>
                                                <option value="SE">SouthEast</option>
                                                <option value="S">South</option>
                                                <option value="SW">SouthWest</option>
                                                <option value="W">West</option>
                                                <option value="NW">NorthWest</option>
                                            </select>
                                        </section>
                                    </section>
                                    <hr>
                                    <section class="drone-details">
                                        <section>
                                            <p>Aircraft details:</p>
                                            <section class="drone-spec">
                                                <section class="spec-inputs">
                                                    <label for="droneDropdown">Select saved drone: </label>
                                                    <select id="orientation" name="drone-name" ref="mydronename">
                                                        <option v-for="(drone, index) in dronesList" v-bind:key="index">{{drone}}</option>
                                                    </select>
                                                    <br>
                                                    OR 
                                                    Input new drone data:
                                                    <div>
                                                        <label for="drone-name">UAV name: </label>
                                                        <input type="text" name="drone-name" size="16" ref="mydronename"/>
                                                        <label for="drone-model">UAV model: </label>
                                                        <input type="text" name="drone-model" size="16" ref="mydronemodel">
                                                        <label for="drone-weight">UAV weight: </label>
                                                        <input type="text" name="drone-weight" size="16" ref="mydroneweight">
                                                    </div>
                                                    
                                                </section>
                                            </section>
                                        </section>
                                    </section>
                                    <!-- <input id="submit" name="submit" type="submit" value="Add"/> -->
                                    <!-- </form> -->
                            </section>
                        </section>
                        <section class="fp-info-container">
                                    <div class="check-time-db" @click="showFinalDetails()">Submit</div>
                                    <!-- <input id="submit" name="submit" type="submit" value="Add"/> -->
                            
                        </section>
                      
                    </section>
                </section>
                
            </section>
        </form>




        
    </section>
</template>

<style>

    .split-container {
        display: grid;
        grid-template-columns: 65% 35%;
        height: 100vh;
    }

    .side-container {
        height: auto;
        overflow-y: scroll;
        overflow-x: scroll;
        background-color: rgb(117, 115, 115);
       
    }

    .four-rows {
        display: grid;
        /*grid-template-rows: 42% 42% 16%;*/
grid-template-rows: 30% 30% 20% 20%;
        color: white;
        
    }

    

    .full-display {
        width: 100%;
    }



    .info-container {
        display: none;
    }

    .longdisplay {
        padding: 5px;
    }

    .latdisplay {
        padding: 5px;
    }

    #weather-div-planner {
        display: flex;
        align-items: center;
    }

    #submit-div-planflight {
        background-color: white;
        border: solid 1px grey;
        text-align: center;
        padding: 3px;
        transition: 0.4s;
    }

    #submit-div-planflight:hover {
        background-color: rgb(101, 100, 100);
        color: white;
        cursor: pointer;
    }

    #fetchWindButton {
        width: 100%;
        margin-top: 5%;
        margin-left: 5%;
        margin-right: 5%;
        padding: 5px;
    }

    #fetchWindButton:hover {
        cursor: pointer;
    }

    #ex-sign-wind {
        top: 20%;
        right: 15.5%;
        position: fixed;
        display: none;
        z-index: 1;
    }

    #lt {
        background-color: red;
        color: white;
        font-size: 1.2em;
        width: 2%;
        position: absolute;
        top: 15%;
        right: 5%;
        border: solid black 1px;
        background-color: rgb(117, 115, 115);
    }

    #lt:hover {
        cursor: pointer;
    }

    #lowc {
        position: absolute;
        top: 54%;
        right: 17%;
        width: 10%;
        background-color: grey;
        border: solid 2px rgb(184, 255, 36);
        border-radius: 15px;
        z-index: 1;
        padding: 5px;
        font-size: .8em;
    }

    #or {
        font-size: 18px;
    }

    #midc {
        position: absolute;
        top: 58%;
        right: 17%;
        width: 10%;
        background-color: grey;
        border: solid 2px rgb(184, 255, 36);
        border-radius: 15px;
        z-index: 1;
        padding: 5px;
        font-size: .8em;
    }

    #highc {
        position: absolute;
        top: 62%;
        right: 17%;
        width: 10%;
        background-color: grey;
        border: solid 2px rgb(184, 255, 36);
        border-radius: 15px;
        z-index: 1;
        padding: 5px;
        font-size: .8em;
    }

    .flight-planner-columns {
        display: grid;
        grid-template-columns: 25% 25% 25% 25%;
        align-items: center;
        justify-items: center;
        color: white;
    }

    .fp-info-container {
        width: 100%;
        text-align: center;
        padding: 5px;
        
    }

    .fp-info-container:last-of-type {
        margin-top: 75%;
    }
   

    .fp-info-container h1 {
        margin: 0px;
    }

 

    .fp-sub-info {
        padding: 10px;
    }

    .fp-sub-info:first-of-type {
        padding: 0px;
    }

    .time-selection {
        display:grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: 50% 40% 10%;
    }

    .time-selection div{
        padding-bottom: 10%;
    }

    .fp-subtitle {
        padding: 4%;
    }

    #last-div {
        grid-column-start: 1;
        grid-column-end: 3;
        padding: 5px 0px;
    }

    #cancel-but {
        padding: 5px;
        width: 100%;
    }

    #confirm-but {
        margin-left: 5px;
        padding: 5px;
        width: 100%;
    }

    #map-container {
        display: none;
        z-index: 1;
        position: relative;
    }

    .coordsConfirm {
        float: right;
    }

    .waypoints-select {
        padding: 5px;
        display: grid;
        grid-template-columns: 38% 62%;
    }

    .waypoints-select label {
        text-align: left;
    }

    .coords-inputs {
        padding: 12px;
        display: grid;
        grid-template-columns: 38% 62%;
    }

    .coords-inputs label {
        text-align: left;
    }

    .coords {
        display: grid;
        grid-template-rows: 40% 40% 20%;
    }

    .coords-labels {
        padding: 5px;
        text-align: left;
    }

    .spec-inputs {
        padding: 12px;
        display: grid;
        grid-template-columns: 38% 62%;
    }

    .spec-inputs label {
        text-align: left;
    }
  
    .speeds-option {
        display: grid;
        grid-template-rows: 33% 33% 33%;
    }

    .speeds-inputs {
        padding: 10px;
    }

    .flight-details-container {
        display: none;
        z-index: 1;
        position: relative;
        width: 100%;
    }

    .flight-details {
        border: solid 2px rgb(184, 255, 36); 
        background-color: rgb(77, 76, 76);
        width: 45%;
        position: absolute;
        padding: 10px;
        margin-top: 2%;
        margin-left: 26.5%;
        
        color: white;
    }

    .flight-details-content {
        padding: 10px;
    }

    .flight-details-content h1 {
        font-size: large;
        margin-top: 0px;
        margin-bottom: 0px;
        text-align: center;
    }

    .flight-details-content-grid {
        display: grid;
        grid-template-rows: 50% 50%;
        grid-template-rows: 20% 20% 20% 20% 20%;
        margin: 0% 5%;
    }

    .flight-details-content-grid div {
        padding: 5px;
    }

    .flight-details-buttons {
        display: grid;
        grid-template-columns: 50% 50%;
        float: right;
    }

    .flight-details-buttons button:first-of-type{
        margin-right: 5px;
    }

    .coords-source {
        padding: 10px;
    }

    .coords-destination {
        padding: 10px;
    }

    #calendar-display-afterwards {
        position: absolute;
        display: none;
        z-index: 1;
        top: 20%;
        left: 10%;
        right: 10%;
        background-color: grey;
        border: solid 1px grey;
    }


    #details-map-container {
        position: absolute;
        display: none;
        z-index: 1;
        left: 10%;
        right: 10%;
        background-color: grey;
        border: solid 1px grey;

    }

    #ex-sign {
        position: absolute;
        right: 10.5%;
        margin-top: .3%;
        z-index: 1;
        display: none;
    }

    #ex-sign:hover {
        cursor: grab;
    }

    #final-map-container {
        position: absolute;
        display: none;
        z-index: 1;
        left: 10%;
        right: 10%;
        background-color: grey;
        border: solid 1px grey;
    }

    .speed-containers {
        display: grid;
        grid-template-columns: 40% 40% 20%;
        padding: 10px;
    }

    .speed-selectors {
        display: grid;
        grid-template-rows: 33% 33% 33%;
    }

    .speed-selectors label {
        padding: 5px;
        font-size: .9em;
    }

    .speed-selectors input {
        margin: 5px;
    }
    
    .waypoint-submit-container {
        display: none;
    }

    .check-time-db {
        background-color: white;
        border: solid 1px grey;
        text-align: center;
        padding: 3px;
        transition: 0.4s;
        color: black;     
        padding: 5px;
      }
    
      .check-time-db:hover {
        background-color: rgb(101, 100, 100);
        color: white;
        cursor: pointer;
      }

    .date-flights-container {
        color: red;
    }

    .map-conatiner {
        z-index: 1;
    }

    #loadingScreen {
        display: none;
        height: 100%;
        width: 100%;
        text-align: center;
        font-size: 60pt;
        color: white;
        padding-top: 10%;
        margin-top: 1%;
    }

    #weather-display-planner {
        display: None;
        width: 60%;
        color: white;
        position: fixed;
        z-index: 1;
        top: 20%;
        background-color: rgb(77, 76, 76);
        padding: 25px;
        left: 18.5%;

    }
  

</style>

<!-- <script defer src="<https://maps.googleapis.com/maps/api/js?key=AIzaSyDTNOMjJP2zMMEHcGy2wMNae1JnHkGVvn0&callback=initMap>"> -->
<script>
 // import * as geolib from 'geolib';
import axios from 'axios';
//import { getWindSpeed } from "@/fetchWindSpeed";
import { convertDegreesToDirection } from "@/degreesToCompassDirections";
import { windSpeedToColour } from "@/displayWindWarningColours"
//import router from "@/router";
//import { response } from "express"; NOT SURE IF I NEED THIS
const LAYER_ONE = "60"
const LAYER_TWO = "90"
const LAYER_THREE = "120"

export default {
    data() {
      return {
        date: {
          hour: '',
          minute: '',
          day: ''
        },
        coords: {
            sourcelongitude: '',
            sourcelatitude: '',
            destlongitude: '',
            destlatitude: ''
        },
        speed: {
            description: '',  //corridor
            velocity: ''
        },
        info: null,
        distance: null,
        waypoints: {
            lat: '',
            lng: ''
        },
        droneSpec: {
            name: '',
            model: '',
            weight: ''
        },
        componentKey: 0,
        windKey: 0,
        bookedDates: null,
        altitude: 0,
        subGrid: "",
        orientation: '',
        time: 0,
        displayCounter: 0,
        endTime: "00",
        duration: 0,
        flightID: "",
        loadedFMap: false,
        loaderMsg: true,
        loaderRefresh: 0,
        windData: [],
        windDataHour: "",
        dronesList: []
      }
    },
    props: ['propsettings'],
    components: {
    MyGoogleMapComponent,
    FinalGoogleMapComponent,
    ForecastDisplayComponent
},
    setup(props) {
        console.log("Props--->", props.propsettings)
    },
    methods: {
      handleSubmit() {
        // Send data to the server or update your stores and such.
        this.coords.sourcelatitude = this.$refs.mysourcelat.value;
        this.coords.sourcelongitude = this.$refs.mysourcelong.value;
        this.coords.destlatitude = this.$refs.mydestlat.value;
        this.coords.destlongitude = this.$refs.mydestlong.value;
        this.waypoints.lat =  this.$refs.mywaylat.value;      //SEND ACROSS TO FINAL MAP COMPONENT AND GENERATE FLIGHT PATH
        this.waypoints.lng =  this.$refs.mywaylng.value;
        this.altitude =  this.$refs.myaltitude.value;
        this.orientation = this.$refs.myorientation.value;
        console.log("this.$refs.myspeed.value--> ", this.$refs.myspeed.value)
        this.speed.velocity = this.$refs.myspeed.value;
        this.droneSpec.name = this.$refs.mydronename.value;
        // this.droneSpec.model = this.$refs.mydronemodel.value;
        // this.droneSpec.weight = this.$refs.mydroneweight.value;
        // this.date.day = this.$refs.date.value;
        // this.date.hour = this.$refs.hour.value;
        // this.date.minute = this.$refs.minute.value;
        if (this.speed.velocity < 20) {
            this.speed.description = "low-speed";
            this.subGrid = LAYER_ONE
        } else if (20 <= this.speed.velocity < 30 ) {
            this.speed.description = "mid-speed";
            this.subGrid = LAYER_TWO
        } else if (30 <= this.speed.velocity < 50 ) {
            this.speed.description = "high-speed";
            this.subGrid = LAYER_THREE
        } 
        console.log("waypoints:", this.$refs.mywaylng.value, this.$refs.mywaylat.value)

        // var myTime =  this.hour +"-"+this.minute
        // var input_date = new Date(this.date)
        // input_date.setMinutes(input_date.getMinutes())




        // var details = document.getElementById('flight-details-container');
        // details.style.display = 'block';

        // var grey = document.getElementById('flight-planner-columns');
        // grey.style.opacity = 0.2;
        // grey.style.pointerEvents = "none";


        // const flight = { 
        //     srclat: this.coords.sourcelatitude, 
        //     srclng: this.coords.sourcelongitude, 
        //     destlat: this.coords.destlatitude, 
        //     destlng: this.coords.destlongitude,
        //     hour: this.date.hour,
        //     minute: this.date.minute,
        //     date: this.date.day,
        //     speed: this.speed.description
        // }

        // //this needs to be in a seperate function. 
        // //if user selects "confirm", call this function
        // axios
        // .post("/storeFlight", flight)
        // .then((response) => {
        //   const data = response.data;
        //   console.log("STORED FLIGHT SUCCESSFUL: ",data);
        // })
        // .catch (function (error) {
        //     console.log("ERROR:", error);    
        // })

        
      },
      showFinalDetails() {
        this.handleSubmit()
        var details = document.getElementById('flight-details-container');
        details.style.display = 'block';
      },
      disappear: function (event) {
        var details = document.getElementById('flight-details-container');
        details.style.display = 'None';
        console.log(event)
        var finaldetails = document.getElementById('final-map-container');
        finaldetails.style.display = 'None';
        console.log(event)

        var grey = document.getElementById('flight-planner-columns');
        grey.style.opacity = 1;
        grey.style.pointerEvents = "initial";
      },
      handleSubmitCoords() {
        console.log(this.coords)
      }, 
      showMap(event) {
            var map = document.getElementById("details-map-container")
            map.style.display = "block"
            var con = document.getElementById("ex-sign")
            con.style.display = "block"
            console.log(event);
      }, 
      disappearEx() {
        var map = document.getElementById("details-map-container")
        map.style.display = "none"
        var fmap = document.getElementById("final-map-container")
        fmap.style.display = "none"
        var ex = document.getElementById("ex-sign")
        ex.style.display = "none"
      },
      showFinalMap(storeDate) {
        var tl = this.date.day + " " + this.date.hour +":"+this.date.minute+":"+"00" 
        console.log("full date--> ", tl)
        var duration = Math.round(this.duration*60)
        console.log("DURATION", duration) //duration in minutes
        
        let input_date_str = tl;
        let input_date = new Date(input_date_str);  
        console.log("input_date-->", input_date)
        input_date.setMinutes(input_date.getMinutes() + duration)

        let options = {year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false};
        let result_date_str = input_date.toLocaleString("en-US", options);
        console.log("ENDTIME RESULT: ", result_date_str);
        this.endTime = result_date_str
        
        let max = 100000
        let min = 1
        const randomInteger = (Math.floor(Math.random() * (max - min + 1)) + min).toString();
        this.flightID = randomInteger

        const drone  = {
            name: this.droneSpec.name,
            model: this.droneSpec.model,
            weight: this.droneSpec.weight
        }
        var flight = {};
        if (storeDate) {   //put grid layer in here 
            flight = { 
                id: randomInteger,
                srclat: this.coords.sourcelatitude, 
                srclng: this.coords.sourcelongitude, 
                destlat: this.coords.destlatitude, 
                destlng: this.coords.destlongitude,
                hour: this.date.hour,
                minute: this.date.minute,
                date: this.date.day,
                endtime: this.endTime,
                speed: this.speed.velocity,
                corridor: this.speed.description,
                waypoint: this.waypoints,
                altitude: this.altitude,
                subgrid: this.subGrid,
                orientation: this.orientation,
                drone: drone
            }
            this.loaderMsg = false
          
        } else { //generate flight path
            flight = { 
                id: randomInteger,
                srclat: this.coords.sourcelatitude, 
                srclng: this.coords.sourcelongitude, 
                destlat: this.coords.destlatitude, 
                destlng: this.coords.destlongitude,
                endtime: this.endTime,
                speed: this.speed.velocity,
                corridor: this.speed.description,
                waypoint: this.waypoints,
                altitude: this.altitude,
                subgrid: this.subGrid,
                orientation: this.orientation,
                drone: drone
            }
            console.log("MSG-->", this.loaderMsg)

        }
        console.log("FLIGHT---> ", flight)
        this.renderLoading()
        //this needs to be in a seperate function. 
        //if user selects "confirm", call this function
        axios
        .post("/storeFlight", flight)
        .then((response) => {
          const data = response.data;
          console.log("STORED FLIGHT SUCCESSFUL: ",data);
          var c = document.getElementById("splitContainer")
            c.style.display = "none"
            var m = document.getElementById("flight-details-container")
            m.style.display = "none"
            var footer = document.getElementById("footerApp")
            footer.style.display = "none"
            var f = document.getElementById("loadingScreen")
            var x = document.getElementById("ex-sign")
            x.style.display = "none";
            f.style.display = "block"
            //this.forceRenderer();
            console.log("done rendered map again")
            this.updateDate(storeDate);
        })
        .catch (function (error) {
            console.log("ERROR:", error);    
        })


        // * COMMENTED OUT DO THAT THE FINAL MAP DOESNT APPEAR EXACTLY AFTER PRESSING SUBMIT, SHOW CALENDAR FIRST **

        // var map = document.getElementById("final-map-container")
        // map.style.display = "block"
        // var con = document.getElementById("ex-sign")
        // con.style.display = "block"
        // var details = document.getElementById('flight-details');
        // details.style.display = 'None';
       
      },
      updateDate(checkRadius) {
        const flightData = {
            id: this.flightID,
            date: this.date.day,
            hour: this.date.hour,
            minute: this.date.minute
        }
        this.loaderMsg = checkRadius
        this.renderLoading()
        var t = document.getElementById("final-map-container")
        t.style.display = "none"
        var cal = document.getElementById("calendar-display-afterwards")
        cal.style.display = "none"
        var lt = document.getElementById("lt")
        lt.style.display = "none"
        var l = document.getElementById("loadingScreen")
        l.style.display = "block"
       

        axios
        .post("/updateFlightTime", flightData)
        .then((response) => {
          const data = response.data;
          console.log("UPDATED FLIGHT TIME: ",data);
          this.forceRenderer(); //can this be called before axios??
        }).then(() => {
            console.log("checking radius after time select ", checkRadius)
            if (checkRadius) { //only schedule the flight once the time has been selected
                this.checkRadius()
            }
        })
        .catch (function (error) {
            console.log("ERROR:", error);    
        })

      }, 
      checkRadius() {
        setTimeout(() => {
        // code to be executed after 3 seconds
            var fullDate = this.date.day //might be wrong format eg / instead of -
            console.log("sending fulldate: ", fullDate) 
            const queryDate = {
                date: fullDate,
                id: this.flightID,//handle this in backend
                reset: true
            };
            axios 
                .post("/getFlightsWithinRadius", queryDate)
                .then((response) => {
                    var cal = document.getElementById("calendar-display-afterwards")
                    cal.style.display = "none"
                    
                    var data =  response.data
                    console.log("response from radius function--> ", data)
                    var d = data.split(" ")
                    console.log("d-->", d)
                    var b = document.getElementById("flightlogbutton")
                    var r =  document.getElementById("take-off-time")
                    var f = document.getElementById("eta-final")
                    var a =  document.getElementById("take-off-altitude")
                    var t = document.getElementById("final-map-container")
                    if(d.length > 4) {
                        if (d[0] === "none") {

                            t.style.display = "none"
                            alert("Change Take-Off time")
                            this.$router.push('')
                        } 
                        else {
                            b.style.display = "block"
                            
                            r.innerHTML = d[3]
                            
                            f.innerHTML = d[1]
                           
                            a.innerHTML = d[4]
                        }
                    } else {
                        if (d[0] === "none") {
                            t = document.getElementById("final-map-container")
                            t.style.display = "none"
                            alert("Change Take-Off time")
                            this.$router.push('')
                        } 
                        else {
                            b.style.display = "block"
                            
                            r.innerHTML = d[1]
                            
                            f.innerHTML = d[0]
                           
                            a.innerHTML = d[2]
                        }
                    }
                })
                .catch (function (error) {
                    console.log("ERROR:", error);    
                })
        }, 13000);
      },
      async fetchWind() {
        var lat = parseFloat(this.$refs.mysourcelat.value);
        var lng = parseFloat(this.$refs.mysourcelong.value);

        if (lat === "" || lng === "") {
            console.log("Please select a location")
        }

        lat = lat.toFixed(2)
        lng = lng.toFixed(2)

        var hour = document.getElementById("hour").value
        var minute = document.getElementById("minute").value
        var date = document.getElementById("day").value
        
        this.windDataHour = hour
        console.log(hour, minute, date)

        console.log("lng, lat", lng, lat)
        var res = await fetch("https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lng+"&hourly=windspeed_80m,winddirection_80m&start_date="+date+"&end_date="+date)
        var final = await res.json()
        console.log("final", final)

        var x = document.getElementById("ex-sign-wind")
        x.style.display = "block"

        this.windData = final
        this.windKey += 1

        var dt =document.getElementById("date-wind")

        var endHour = this.calculateETA(hour)
        var doc = document.getElementById("weather-display-planner")
        doc.style.display = "block"
        for (var time in final.hourly.time) {
            var val = final.hourly.time[time].slice(11,13)
            console.log("val", val)
            if (val === hour) {
              var direction = convertDegreesToDirection([final.hourly.winddirection_80m[time]])
              direction = direction[0]
              var windspeed =  final.hourly.windspeed_80m[time]
              var windColour = windSpeedToColour([final.hourly.windspeed_80m[time]])
              console.log("WindColour:", windColour)
              this.colour = windColour[0]
              
                var s =document.getElementById("speed-wind-source")
                var d =document.getElementById("direction-wind-source")
                var t =document.getElementById("time-wind")
                var w =document.getElementById("warning-wind-source")
                s.innerHTML = windspeed
                d.innerHTML = direction
                t.innerHTML = hour + ":" + minute
                dt.innerHTML = this.date.day 
                w.style.backgroundColor = this.colour
            }
        }


        //DEST////////////////////////////////////////////////////////

        lat = parseFloat(this.$refs.mydestlat.value);
        lng = parseFloat(this.$refs.mydestlong.value);

        if (lat === "" || lng === "") {
            console.log("Please select a location")
        }

        lat = lat.toFixed(2)
        lng = lng.toFixed(2)

        hour = document.getElementById("hour").value
        minute = document.getElementById("minute").value
        date = document.getElementById("day").value
        
        this.windDataHour = hour
        console.log(hour, minute, date)

        console.log("lng, lat", lng, lat)
        res = await fetch("https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lng+"&hourly=windspeed_80m,winddirection_80m&start_date="+date+"&end_date="+date)
        final = await res.json()
        console.log("final", final)

        x = document.getElementById("ex-sign-wind")
        x.style.display = "block"

        this.windData = final
        this.windKey += 1

        dt =document.getElementById("date-wind")
        w =document.getElementById("warning-wind-source")

        endHour = this.calculateETA(hour)
        doc = document.getElementById("weather-display-planner")
        doc.style.display = "block"
        for ( time in final.hourly.time) {
            val = final.hourly.time[time].slice(11,13)
            console.log("val and endHour", val, endHour)
            if (val === endHour) {
              direction = convertDegreesToDirection([final.hourly.winddirection_80m[time]])
              direction = direction[0]
              windspeed =  final.hourly.windspeed_80m[time]
              windColour = windSpeedToColour([final.hourly.windspeed_80m[time]])
              console.log("WindColour:", windColour)
              this.colour = windColour[0]

              var sdest =document.getElementById("speed-wind-dest")
                var ddest =document.getElementById("direction-wind-dest")
                var tdest =document.getElementById("time-wind")
                var wdest =document.getElementById("warning-wind-dest")
                sdest.innerHTML = windspeed
                ddest.innerHTML = direction
                tdest.innerHTML = hour + ":" + minute
                dt.innerHTML = this.date.day 
                wdest.style.backgroundColor = this.colour
                console.log("FOUND-->", windspeed, direction)
            }
        }
        
        
      },
      calculateETA(hour) {
        var durationHour = document.getElementById("distanceTime").innerHTML
        durationHour = durationHour.slice(0,2)
        hour = parseInt(hour)
        durationHour = parseInt(durationHour)
        var endHour = hour+durationHour
        console.log("Added ", durationHour, " and ", hour, "=", endHour)
        var endHourStr = endHour.toString() 
        if (endHourStr.length === 1) {
            endHourStr = "0"+endHourStr
        } 
        return endHourStr
        //maybe get the hours between
    
      },
      lowInfo() {
        var c = document.getElementById('lowc');
        c.style.display = 'block';
      },
      midInfo() {
        var c = document.getElementById('midc');
        c.style.display = 'block';
      },
      highInfo() {
        var c = document.getElementById('highc');
        c.style.display = 'block';
      },
      hideInfo() {
        const infos = document.getElementsByClassName('info-container');
        var i = 0;
        while (i < 3) {
            infos[i].style.display = 'none';
            i ++;
        }
      }, 
      async logme({c, d, distance, w, t, r}) { // data received from map component 
        console.log("RECEIVED IN PARENT",c.lat, c.lng, d.lat, d.lng, t);
        this.$refs.mysourcelat.value = c.lat.toString();
        this.$refs.mysourcelong.value = c.lng.toString();
        this.$refs.mydestlat.value = d.lat.toString();
        this.$refs.mydestlong.value = d.lng.toString();
        this.$refs.mywaylat.value =  w.lat.toString();
        this.$refs.mywaylng.value =  w.lng.toString();

        this.distance = distance;
        this.duration = r
        console.log("\nRAW TIME \n", r)

        var end =  ""
        console.log(t.length)
        if (t.length < 13) {
            end = "0" + t.slice(0,1)
        } else {
            end = t.slice(0,2)
            var endF = ""
            if (t.length === 21) {
                endF = t.slice(9, 11) 
            } 
            // else if (t.length === 20) {
            //     endF = "00"
            // }
            else {
                endF =  t.slice(10, 12)
            }
            end = end+":"+endF
        }
        console.log("END===>", end)
       

        var map = document.getElementById("details-map-container")
        map.style.display = "none"
        var con = document.getElementById("ex-sign")
        con.style.display = "none"

        // var lng = c.lng.toString()
        // var lat = c.lat.toString()


      },
      logLoaded() {
        this.loadedFMap = true
        console.log("LOADED FMAP IN PLANNER")
      },
      logspeed(c) {
        this.time = c
        var s = document.getElementById("speed")
        s.value = c
        var alt = document.getElementById("altitude")
        if (c < 20) {
            alt.value = LAYER_ONE
        } else if (c < 30 && c >= 20){
            alt.value = LAYER_TWO
        } else {
            alt.value = LAYER_THREE
        }
      },
      logTime(t) {
        console.log("Received fulltime: ", t, "len(fulltime)", t.length)
        if (t.length > 15) {
            var arr =  t.split(",")
            this.date.day = arr[0]
            var time =  arr[1]
            var hour =  time.slice(0,2)
            this.date.hour = hour
            var minute = time.slice(3,5)
            this.date.minute = minute
        } else {
            arr =  t.split(",")
            this.date.day = arr[0]
            this.date.day =  this.date.day.slice(0,8) + "0" + this.date.day.slice(8,9)
            time =  arr[1]
            hour =  time.slice(0,2)
            this.date.hour = hour
            minute = time.slice(3,5)
            this.date.minute = minute
        }
        console.log("this.date", this.date)

        

        //console.log("hour + minute", hour, minute)
      },

      disappearWindEx() {
        var d = document.getElementById("ex-sign-wind")
        d.style.display = "none"
        var wl = document.getElementById("weather-display-planner")
        wl.style.display = "none"
      }, 

      setWaypoint() {
        var w = document.getElementById("waypoint-container")
        w.style.display = "block";
      },
      forceRenderer() {
        this.componentKey += 1
      },
      renderLoading() {
        this.loaderRefresh += 1
      },
      hidePanel() {
        var d = document.getElementById("splitContainer");
        var l = document.getElementById("lt");
        if (this.displayCounter % 2 === 0) {
            d.classList.replace('split-container','full-display')
            l.innerHTML = "&lt";
        } else {
            d.classList.replace('full-display','split-container')
            l.innerHTML = "&gt";
        }
        this.displayCounter += 1
      },
      getDates() {
        axios
        .post("/getAllTimes")
        .then((response) => {
          const data = response.data;
          console.log("33-->",data,"<--33");
          const myArray = data.split(",");
          this.bookedDates = myArray;
        })
        .catch (function (error) {
            console.log("ERROR:", error);    
        })
      },
      getDrones(arr) {
        for (var flight in arr) {
            if (arr[flight].drone !== "") {
                if (!this.dronesList.includes(arr[flight].drone)) {
                    this.dronesList.push(arr[flight].drone)
                }
            }
            
        }
        console.log("DRONESLIST-->", this.dronesList)
      }

    }, 
    mounted() {
        axios
        .post("/userProfile")
        .then((response) =>{
            const data = response.data;
            console.log("data: ", data)
            var dataArray = data.split("|")
            console.log("dataArray--> ", dataArray)

            var flights = dataArray[1]
            const jsonArray = JSON.parse(flights);
            console.log("jsonArray-->", jsonArray)
            this.getDrones(jsonArray);
        })
    }

}


</script>


