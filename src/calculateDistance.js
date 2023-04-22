//taken from https://github.com/codingwithjustin
/* eslint-disable no-unused-vars*/

// return the haversine distance from one coordinate to the other coordinate
export function haversineDistance(pos1, pos2) {
    console.log("CALCULATING")
    const R = 3958.8 // Radius of the Earth in miles
    const rlat1 = pos1.lat * (Math.PI / 180) // Convert degrees to radians
    const rlat2 = pos2.lat * (Math.PI / 180) // Convert degrees to radians
    const difflat = rlat2 - rlat1 // Radian difference (latitudes)
    const difflon = (pos2.lng - pos1.lng) * (Math.PI / 180) // Radian difference (longitudes)
    const d =
      2 *
      R *
      Math.asin(
        Math.sqrt(
          Math.sin(difflat / 2) * Math.sin(difflat / 2) +
            Math.cos(rlat1) *
              Math.cos(rlat2) *
              Math.sin(difflon / 2) *
              Math.sin(difflon / 2)
        )
      )
      return d
    }
    
