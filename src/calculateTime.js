const t = (distance, speed) => {
    const tme = distance/speed
    const remainder = tme%1
    const minutes = parseInt(60*remainder)
    const seconds =  (minutes%1)*60
    var hours = parseInt(tme/1)
    if (hours < 1) {
      hours = 0
      const time = minutes.toString()+" minutes  " + seconds.toFixed(2).toString() + " seconds"
      return time 
    }
    const time = hours.toFixed(0).toString() + " hours  " + minutes.toString()+" minutes  " + seconds.toFixed(2).toString() + " seconds"
    return time
  }
