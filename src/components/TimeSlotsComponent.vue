<template>
    <section class="timeslots-container">
        <div><h2>Bookings</h2></div>
        <section class="cards" v-for="timeslot in timesList" :key="timeslot.time" @click="handleTimePick(timeslot.time)">
            <div v-if="timeslot.status" class="disabled-click" id="disabled-click">
                <div class="inner-card">
                    <div>Time :</div> <div id="time-div">{{ timeslot.time }}</div>
                </div>
                <div>
                    <div v-if="timeslot.status" class="inner-card" >
                        <div>Status:</div><div>Unavailable <span class="colour-signal-unavailable"></span></div>
                    </div>
                    <div v-else class="inner-card">
                        <div>Status:</div> <div>Available <span class="colour-signal-available"></span></div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="inner-card">
                    <div>Timeslot :</div> <div id="time-div">{{ timeslot.time }}</div>
                </div>
                <div>
                    <div v-if="timeslot.status" class="inner-card" >
                        <div>Status:</div><div>Unavailable <span class="colour-signal-unavailable"></span></div>
                    </div>
                    <div v-else class="inner-card">
                        <div>Status:</div> <div>Available <span class="colour-signal-available"></span></div>
                    </div>
                </div>
            </div>
            

        </section>
    </section>
</template>

<style>

    .timeslots-container {
        z-index: 1;
        position: absolute;
        background-color: white;
        color: black;
        width: 58%;
        left: 20%;
        top: 20%;
        height: 300px;
        overflow: scroll;
        border: solid 3px grey;
    }

    .cards {
        /*padding: 5px */
        border: solid black 1px;
        width: 90%;
        margin: 10px;
    }

    .cards:hover {
        background-color: rgb(241, 240, 240);
        cursor: pointer;
    }

    .disabled-click {
        pointer-events: none;
        background-color: rgb(241, 240, 240);
    }

    #disabled-click {
        cursor: context-menu;
    }

    .inner-card {
        display: grid;
        grid-template-columns: 50% 50%;
        text-align: left;
    }
    .inner-card div:first-child {
        padding-left: 10%;;
    }

    .colour-signal-available {
        width: 15px;
        height: 15px;
        margin-left: 15px;
        position: absolute;
        background-color: rgb(1, 181, 91);
        border: solid .5px rgb(1, 181, 91);
        border-radius: 15px;
    }

    .colour-signal-unavailable {
        width: 15px;
        height: 15px;
        margin-left: 15px;
        position: absolute; 
        background-color: rgb(230, 36, 11);
        border: solid .5px rgb(230, 36, 11);
        border-radius: 15px;
    }

</style>

<script>
    /* eslint-disable */
    import { getTimeSlots } from '@/timeSlots';
    export default {
        name: 'App',
        props: ['proptimes'],
        watch: { 
            proptimes: function(newVal, oldVal) { // watch it
                console.log('Prop changed: ', newVal, ' | was: ', oldVal)
                function update(l) {
                    var tlist = []
                    for (var i = 0; i <newVal.length; i++) {
                        const t = {
                            time: newVal[i],
                            status: true
                        }
                        tlist.push(t)
                    }
                    
                    for (var j = 0; j < l.length; j++) {
                        var checked = false; //used to not override the slots previously marked as bookied by other times that occur later for the same date
                        for (i=0; i < tlist.length; i++) {
                            if (l[j].time === tlist[i].time ) { //tlist[i]is everything that should be unavailable for this date, l[j] is every date
                                l[j] = tlist[i]
                                checked =  true
                            } 
                            else if (l[j].time !== tlist[i].time && checked === false) { // if the displayed list item is red but it shouldn't be(eg. it didnt update and still shows the booked dtimes for the last date)
                                l[j].status = false
                            }
                            
                        }
                    }
                }update(this.timesList)
            }
        },
        data() {
            return {
                timesList: this.proptimes
            }
        },
        created() {
            var timeSlots = getTimeSlots();
            //console.log("timeslots:", timeSlots);
            console.log("recieved proptimes", this.proptimes)
            

            // call axios getDates, loop through the timeSlots and compare to database results
            // the time will be unavailable if another drone will be within the radius within the 15 minutes range
            for (var i = 0; i < timeSlots.length; i++) { 
                
                this.timesList.push(timeSlots[i]) 
            }
        },
        methods: {
            handleTimePick(t) {
                var timePicked = t
                this.$emit('timeEvent', timePicked)
            }
        }
    }
</script>