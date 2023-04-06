<template>
    <div id="container">
      <label for="Speed">Speed(km/h): </label>
      <input type="number" id="sspeed" name="speed" min="1" max="120" ref="selectedspeed" value="1" @click="handleThis()">
    </div>
</template>

<style scoped>


  #container {
    position: absolute;
    top: 39%;
    left: .3%;
    padding: 5px;
    width: 20%;
    margin-left: 0%;
    color: rgb(78, 76, 76);
  }

  label {
    background-color: white;
    padding-bottom: 2.5px;
    padding-top: .75px;
    padding-left: 4px;
    font-size: 1.1em;;
    border: solid 1px white;
    border-radius: 7px;;
  }
</style>

<script>
export default {
    data() {
      return {
        speed: 30
      }
    },
    methods: {
        handleThis() {
            this.speed = this.$refs.selectedspeed.value;
            console.log("this.speed:",this.speed)
            this.$emit('speedEvent', this.speed)
        }
    }

}
</script>