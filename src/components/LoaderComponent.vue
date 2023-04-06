<template>
    <div class="wavy-container">
        <div class="wavy" v-if="msg">
            <!-- <span>L</span><span>o</span><span>a</span><span>d</span><span>i</span><span>n</span><span>g</span><span>.</span><span>.</span><span>.</span> -->
            <span>Scheduling flight...</span>
        </div>
        <div v-else class="wavy">
            <span>Generating flight path...</span>
        </div>
        <div id="loader-msg"></div>
    </div>
</template>

<style>
    .wavy {
        top: 10%;
        animation: waviy 2.2s infinite;
    }

    @keyframes waviy {
        0%,40%,100% {
          transform: translateY(0)
        }
        20% {
          transform: translateY(-20px)
        }
      }

    .wavy-container {
        animation: fadeIn 2s ease-in-out forwards;
    }

    @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
</style>
<script>
export default {
  name: 'App',
  props: ['propmsg'],
  data(props) {
    return { 
      msg: props.propmsg
    }
  }, mounted() {
    console.log("LOADER IN MSG--->", this.propmsg)
  }
}
</script>