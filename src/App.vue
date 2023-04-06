<script setup>
import NavComponent from "./components/NavComponent.vue"
import FooterComponent from "./components/FooterComponent.vue";
import SettingsComponent from "./views/SettingsComponent.vue";

// import { Loader } from '@googlemaps/js-api-loader'
//     /* eslint-disable no-undef*/
//     import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
//     import { useGeolocation } from './useGeolocation'
//     // import haversineDistance from './calculateDistance'
//     const GOOGLE_MAPS_API_KEY = 'AIzaSyDTNOMjJP2zMMEHcGy2wMNae1JnHkGVvn0'
//     var counter = 0;
//     export default {
//       name: 'App',
//       data() {
//         let counter = 0;
//         return counter
//       },
//       setup() {
//         const { coords } = useGeolocation()
//         const currPos = computed(() => ({
//           lat: coords.value.latitude,
//           lng: coords.value.longitude
//         }))
//         const otherLoc = ref(null)
//         let clickListener = null;

//         const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY})
//         const mapDiv = ref(null);
      
//         let sourceMarker = ref(null)
//         let destMarker = ref(null)
//         let map = ref(null)
//         onMounted(async () => {
//           await loader.load()
//           map.value = new google.maps.Map(mapDiv.value, {
//             center: currPos.value,
//             zoom: 9
//           })
//           clickListener = map.value.addListener(
//             'click',
//             ({latLng: {lat, lng}}) => 
//               (otherLoc.value = {lat: lat(), lng: lng()},
//               destMarker.value = new google.maps.Marker({
//                 position: otherLoc.value,
//                 draggable: true,
//                 map: map.value
//               })
//             )
//           )
//           sourceMarker.value = new google.maps.Marker({
//             position: currPos.value,
//             draggable: true,
//             map: map.value
//           })
//         })
//         onUnmounted(async () => {
//             if (clickListener) clickListener.remove()
//         })
//         let line = null
//         watch([map, currPos, otherLoc], () => {
//           if (line) line.setMap(null)
//           if (map.value && otherLoc.value != null)
//             line = new google.maps.Polyline({
//               path: [currPos.value, otherLoc.value],
//               map: map.value
//             })
//         })
//         const haversineDistance = (pos1, pos2) => {
//         const R = 3958.8 // Radius of the Earth in miles
//         const rlat1 = pos1.lat * (Math.PI / 180) // Convert degrees to radians
//         const rlat2 = pos2.lat * (Math.PI / 180) // Convert degrees to radians
//         const difflat = rlat2 - rlat1 // Radian difference (latitudes)
//         const difflon = (pos2.lng - pos1.lng) * (Math.PI / 180) // Radian difference (longitudes)
//         const d =
//           2 *
//           R *
//           Math.asin(
//             Math.sqrt(
//               Math.sin(difflat / 2) * Math.sin(difflat / 2) +
//                 Math.cos(rlat1) *
//                   Math.cos(rlat2) *
//                   Math.sin(difflon / 2) *
//                   Math.sin(difflon / 2)
//             )
//           )*1.609344  //convert to kilometres
//           return d
//         }
//         const distance = computed(() =>
//         otherLoc.value === null
//           ? 0
//           : haversineDistance(currPos.value, otherLoc.value)
//         )
//         return { currPos, otherLoc, distance, mapDiv }
//       },
//       method: {
//         handleCheck(event) {
//           const currPos = computed(() => ({
//               lat: event.latLng.latitude,
//               lng: event.latLng.longitude
//             }))
//           if (counter % 2 == 0) {
//             sourceMarker.value = new google.maps.Marker({
//               position: currPos.value,
//               draggable: true,
//               map: map.value
//             })
//             counter = counter += 1
//           } else {
//             destMarker.value = new google.maps.Marker({
//               position: currPos.value,
//               draggable: true,
//               map: map.value
//             })
//             counter = counter + 1
//           }
//         }
//       }
//     }
</script> 

<template >
  <section id="app">
    <NavComponent id="navApp"/>

    <section class="main-container" id="main-container">
      <main>
        <!-- :propsettings="settings" -->
          <router-view id="router-view"   v-slot="{ Component }"> 
            <component :is="Component" :propsettings="settings"/>
          </router-view>
      </main>
    </section>
    <img src="./assets/settings-cog.jpg" id="settings-logo" @click="showSettings()"/>
    <div id="sc">
      <SettingsComponent @settingsEvent="updateSettings"></SettingsComponent>
    </div>
    <FooterComponent id="footerApp"/>
  </section>
</template>

<style>
    #app {
      background-color: rgb(77, 76, 76);
      overflow: hidden;
      width: 100%;
      min-height: 100vh;
    }

    body {
      margin: 0px;
    
    }   

    #settings-logo {
      position: fixed;
      right: 3%;
      top: 90%;
      width: 2.5%;
      height: 5%;
      z-index: 1;
      border: solid .5px rgb(117, 115, 115);
      border-radius: 15px;
    }

    #settings-logo:hover {
      cursor: pointer;
      animation-name: example;
      animation-duration: 2s;
    }

    #sc {
      display: none;
      width: 25%;
      position: fixed;
      top: 70%;
      right: 4%;
      z-index: 1;
    }

    @keyframes example {
      0% {transform: rotate(90deg);}
      100% {transform: rotate(270deg);}
    }
  


</style>

<script>
export default {
    data() {
        return {
            user: {
                name: ""
            }, 
            counter: 0,
            settings: {
              size:0,
              theme: "dark",
              units: "km" 
            }
        };
    },
    methods: {
        displayName({ n }) {
            this.user.name = n;
            console.log("Recieved in parent:", this.user.name);
        },
        showSettings() {
          var s = document.getElementById("sc");
          if (this.counter % 2 === 0) {
            s.style.display = "block";
          } else {
            s.style.display = "none";
          }
          this.counter += 1
          
        },
        updateSettings({s, t, u}) {
          console.log("Received in parent*", s, t, u)
          this.settings.size = s
          this.settings.theme = t
          this.settings.units = u
        }
    },
   components: { SettingsComponent }
}
</script>

