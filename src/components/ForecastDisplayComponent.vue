<template>
    <div class="wind-display-container">
        <div><h2>Forecast for <span id="date-wind"></span> at <span id="time-wind"></span></h2></div>
        <div class="coordinate-display">
          <b>Take-Off Location:</b>
            <div id="source-coord">
              <div>Wind Speed(km/h):</div> <div id="speed-wind-source"></div>
              <div>Wind Direction:</div> <div id="direction-wind-source"> </div>
              <div>Status:</div><div id="warning-wind-source"> </div>
            </div>
        </div>
        <div class="coordinate-display">
          <b>Destination Location:</b>
          <div id="source-coord">
            <div>Wind Speed(km/h):</div> <div id="speed-wind-dest"></div>
            <div>Wind Direction:</div> <div id="direction-wind-dest"> </div>
            <div>Status:</div><div id="warning-wind-dest"> </div>
          </div>
        </div>
    </div>

</template>

<style>
.wind-display-container {
  display: grid;
  grid-template-rows: 20% 40% 40%;
  padding-bottom: 10%;
}

#warning-wind {
  width: 100%;
  padding: 10px;
}

#source-coord {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
}

.coordinate-display {
  padding: 10px;
}

.coordinate-display:last-of-type {
  margin-top: 5%;
}
</style>

<script>

export default {
  name: 'App',
  props: ['propcoords', 'propwindspeed', 'propwindtime'],
  data() {
    return { 
      source: "",
      dest: "",
      date: "",
      time: "",
      speed: 0,
      direction: "",
      colour: ""
    }
  }, mounted() {
  }, 
}
</script>