import { useGeolocation } from './useGeolocation'
import { computed, ref } from 'vue'

// fetch 5 day hourly wind speed values for the device location 
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

    var res = await fetch("https://api.open-meteo.com/v1/forecast?latitude="+lat+"&longitude="+lng+"&hourly=windspeed_80m")
    var final = await res.json()

    return final
}