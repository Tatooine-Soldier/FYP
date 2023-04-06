<template>
    <section id="calendar">
        <section class="calendar-container">
            <div class="month">
                <div><small @click="monthDown()">&#10094;</small> {{ months[currentDate.month] }} <small @click="monthUp()">&#10095;</small></div> <div><small>&#10094;</small> {{ currentDate.year }} <small>&#10095;</small></div>
            </div>
            <div class="weekdays">
                <div class="weekday" v-for="(weekday, index) in weekdays" :key="index">
                  {{ weekday }}
                </div>
            </div>
            <div class="dates">
                <div class="day-hidden" v-for="(n, index) in (firstMonthDay -1)" :key="'prev'+index">
                    {{ (prevMonthDays +1) - firstMonthDay + n }}
                </div>
                <div class="date" :class="{ active: n === currentDate.date}"
                v-for="(n, index) in currentMonthDays" 
                :key="'day'+index" @click="currentDate.date = n ;getBookings()" id="datecell"> {{ n }} </div>
                <div class="day-hidden" v-for="(n, index) in (43 - (currentMonthDays + firstMonthDay))" :key="'next'+index">
                    {{ n }}
                  </div>
            </div>
        </section>
    </section>
    <!-- <div id="results">{{ bookedDates }}</div> -->
    <div id="ts"><TimeSlotsComponent @timeEvent="logTime" :proptimes="timeslots" ></TimeSlotsComponent></div>
    <div id="time-confirmed">Time confirmed</div>
    <div><img src="../assets/ex-sign.png" id="ex-sign-bookings" v-on:click="disappearEx()"/></div>
</template>

<style>
    .calendar-container {
        width: 99.4%;
        border: rgb(120, 255, 36) solid 1px;
        background-color: rgb(100, 100, 100);

    }

    .month {
        padding: 5px;
    }

    .weekdays {
        display: grid;
        grid-template-columns: 14.28% 14.28% 14.28% 14.28% 14.28% 14.28% 14.28%;
    }

    .weekday {
        border: solid white 1px;
    }

    .month {
        display: grid;
        grid-template-columns: 50% 50%;
    }

    .date {
        cursor: pointer;
    }
    
    .date:hover {
          background-color: #fff;
          color: #2A4C50;
    }

    .date:nth-child(7n) {
          color: rgb(120, 255, 36);
    }

    .dates {
        display: grid;
        grid-template-columns: 14.2% 14.2% 14.2% 14.2% 14.2% 14.2% 14.2%;
        grid-template-rows: 16% 16% 16% 16% 16% 16%;
    }

    .day-hidden {
        opacity: .4;
      }
    
    .day-hidden:nth-child(7n) {
          color: rgb(120, 255, 36);
    }

      
    small:hover {
        cursor: pointer;
    }

    #ts {
        display: none;
    }

    #time-confirmed {
        display: none;
        background-color: rgb(100, 100, 100);
        color: white;
        padding: 10px;
        position: absolute;
        top: 80%;
        right: 35%;
        z-index: 1;
        border: solid rgb(100, 100, 100) 1px;
        border-radius: 15px;

        animation-name: fadeOut;
        animation-duration: 3s;

    }

    @keyframes fadeOut {
        from {display: block;}
        to {display: none;}
      }

    #results {
      display: none;
      border: solid 1px rgb(120, 255, 36);
      background-color: grey;
      padding: 5px;
      position: relative;
      z-index: 1;
    }

    #ex-sign-bookings {
            position: absolute;
            top: 20.5%;
            right: 24%;
            margin-top: .3%;
            z-index: 1;
            display: none;
    }

    #ex-sign-bookings:hover {
        cursor: pointer;
    }

</style>

<script>
    import axios from 'axios';
// import { resolve } from 'path';
    import TimeSlotsComponent from './TimeSlotsComponent.vue';
    export default {
    data: function () {
        return {
            weekdays: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
            months: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December"
            ],
            years: [
                "2023",
                "2024",
                "2025"
            ],
            currentDate: {
                date: 0,
                month: 0,
                year: 0
            },
            bookedDates: null,
            timeslots: [],
            fullDate: "",
            flightID: ""
        };
    },
    props: ["propdates", "propID"],
    methods: {
        getCurrentDate() {
            let today = new Date();
            this.currentDate.date = today.getDate();
            this.currentDate.month = today.getMonth();
            console.log("MONTH", this.currentDate.month);
            this.currentDate.year = today.getFullYear();
        },
        monthUp() {
            if (this.currentDate.month === 11) {
                this.currentDate.month = 0;
                this.currentDate.year += 1;
            }
            else {
                this.currentDate.month += 1;
            }
        },
        monthDown() {
            if (this.currentDate.month === 0) {
                this.currentDate.month = 11;
                this.currentDate.year -= 1;
            }
            else {
                this.currentDate.month -= 1;
            }
        },
        getBookings() {
            // let date = document.getElementById("datecell");
            // var d = date.innerHTML
            // if (d.length != 2) {
            //   d = "0"+d
            // }
            let date = this.currentDate.date;
            String(date);
            if (["1", "2", "3", "4", "5", "6", "7", "8", "9"].indexOf(date) >= 0) {
                date = "0" + date;
            }
            let month = this.currentDate.month;
            month = month + 1;
            String(month);
            if (month.length != 2) {
                month = "0" + month;
            }
            let year = this.currentDate.year;
            let fullDate = year + "-" + month + "-" + date;
            this.fullDate = fullDate
            this.logTime()

            this.flightID = this.propID
            console.log("propID-->", this.flightID)
            console.log("", this.fullDate.length)
    
            if (this.fullDate.length === 9) {
                this.fullDate = this.fullDate.slice(0,8) + "0" +  this.fullDate.slice(8,9)
            }

            const queryDate = {
                date: this.fullDate,
                id: this.flightID, //handle this in backend
                reset: false
            };
            
            // axios
            //     .post("/getDateFlight", queryDate)
            //     // query will fetch all flights on this date and checks which one has timestamps at this time and has coords within a certain radius
            //     // might need to move the timeslot selector to after the route has been calculated
            //     .then((response) => {
            //     const data = response.data;
            //     console.log("FETCHED FLIGHTS FOR THIS DATE: ", data);
            //     if (data.length === 0) {
            //         this.bookedDates = "Available";
            //     }
            //     else {
            //         const myArray = data.split(",");
            //         var datesDisplay = null;
            //         var item;
            //         var timeList = [];
            //         for (item in myArray) {
            //             console.log("\nitem:" + typeof item + "\tdatesDisplay:" + datesDisplay);
            //             if (item === "0") {
            //                 datesDisplay = myArray[item] + "\n";
            //             }
            //             else {

            //                 datesDisplay = datesDisplay + "\n" + myArray[item];
            //                 console.log("typeof:", typeof myArray[item])
            //                 if (myArray[item] !== "") {
            //                   var time = myArray[item].slice(0,5)
            //                   timeList.push(time)
            //                 }
            //             }
            //         }
            //         this.timeslots = timeList
            //         this.bookedDates = datesDisplay;
            //     }
                
            //     // var times = document.getElementById("results");
            //     // times.style.display = "block";
            //     var t = document.getElementById('ts')
            //     t.style.display = 'block'
            //     var e = document.getElementById("ex-sign-bookings")
            //     e.style.display = "block";
            // })
            //     .catch(function (error) {
            //     console.log("ERROR:", error);
            // });
            axios 
            .post("/getFlightsWithinRadius", queryDate)
            .then((response) => {
                //store flight date in each flight segment
                var data = response.data
                console.log("RAW: Unavailable Time--> ", data)
                var itemsList = [];
                var fullMinuteDisplayed;

                const myArray = data.split(",");
                console.log("RAW List---> ", myArray)
                for (var item in myArray) {
                    if (myArray[item].length === 4) {
                        console.log("myArray[item].slice(0,3) => ", myArray[item].slice(0,3))
                        fullMinuteDisplayed = myArray[item].slice(0,3) + "0" + myArray[item].slice(3,4)
                        itemsList.push(fullMinuteDisplayed)
                    }
                    else if (myArray[item].length === 0)  {
                        continue
                    }
                    else {
                        itemsList.push(myArray[item])
                    }
                }
                this.timeslots = itemsList
                console.log("Unavailable Time--> ", itemsList)
            })
            var t = document.getElementById('ts')
            t.style.display = 'block'
            var e = document.getElementById("ex-sign-bookings")
            e.style.display = "block";
        },
        quantiseTimeList() { //round times up to be one of the times in the 15 minute intervals

        },
        disappearEx() {
            var t = document.getElementById("ts");
            t.style.display = "none";
            var e = document.getElementById("ex-sign-bookings")
            e.style.display = "none";
        },
        logTime(t) {
            console.log("Received in parent-->", t)
            t = this.fullDate + "," + String(t)
            this.$emit('selectedTimeEvent', t)

            // var c = document.getElementById("time-confirmed")
            // c.style.display = "block"
        }
    },
    computed: {
        prevMonthDays() {
            let year = this.currentDate.month === 0 ? this.currentDate.year - 1 : this.currentDate.year;
            let month = this.currentDate.month === 0 ? 12 : this.currentDate.month;
            return new Date(year, month, 0).getDate();
        },
        firstMonthDay() {
            let firstDay = new Date(this.currentDate.year, this.currentDate.month, 1).getDay();
            if (firstDay === 0)
                firstDay = 7;
            return firstDay;
        },
        currentDay() {
            return new Date(this.currentDate.year, this.currentDate.month, this.currentDate.date).getDay();
        },
        currentMonthDays() {
            return new Date(this.currentDate.year, this.currentDate.month + 1, 0).getDate();
        }
    },
    created() {
        this.getCurrentDate();
        // this.bookedDates = props.propdates;
    },
    components: { TimeSlotsComponent }
}
</script>