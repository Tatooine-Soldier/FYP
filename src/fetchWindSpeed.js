import { useGeolocation } from './useGeolocation'
import { computed, ref } from 'vue'

export async function getWindSpeed() {
    const { coords } = useGeolocation()
    const initial = computed(() => ({
        lat: coords.value.latitude,
        lng: coords.value.longitude
    }))

    var lat = String(initial.value.lat)
    var lng = String(initial.value.lng)

    let currentLocation = ref(null)
    currentLocation.value = {lat: initial.value.lat, lng: initial.value.lng }

    console.log("getting wind speed", currentLocation.value)
    var res = await fetch("https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lng+"&hourly=windspeed_80m")
    var final = await res.json()

    return final
}