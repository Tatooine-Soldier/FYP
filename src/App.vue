<script setup>
import NavComponent from "./components/NavComponent.vue"
import FooterComponent from "./components/FooterComponent.vue";
import SettingsComponent from "./views/SettingsComponent.vue";

</script> 

<template >
  <section id="app">
    <NavComponent id="navApp"/>

    <section class="main-container" id="main-container">
      <main>
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
            }
        };
    },
    methods: {
        // displays the expanded settings 
        showSettings() {
          var s = document.getElementById("sc");
          if (this.counter % 2 === 0) {
            s.style.display = "block";
          } else {
            s.style.display = "none";
          }
          this.counter += 1
          
        },

        // called when settings component emits data
        updateSettings({s, t}) {
          console.log("Received in parent*", s, t, u)
          this.settings.size = s
          this.settings.theme = t
        }
    },
   components: { SettingsComponent }
}
</script>

