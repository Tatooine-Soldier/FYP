<template>
    <section id="outcome">
        Flight outcome plan {{ info }}
    </section>
</template>

<script>
export default{
  el: '#outcome',
  data () {
    return {
      info: null
    }
  },
}
</script>