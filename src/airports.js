const prohibitedColor = "#FF0000" // RED ZONE
const restrictedColor = "#FF8833" // AMBER ZONE

//largest airspaces are oredered first so that they are drawn first. smaller airspace on top of them can then be clickable.
export const airports = {
  u62: {
    center: {lat: 52.180878, lng: -9.523784},
    name: "Kerry Control Amber Zone",
    rad: 18520,
    color: restrictedColor,
    contact: "atc@kerryairport.ie"
  },
  u28: {
    center: {lat: 53.428924, lng: -6.265767},
    name: "Dublin Control Amber Zone",
    rad: 12100,
    color: restrictedColor,
    contact: "suaairspace@iaa.ie"
  },
  u70: {
    center: {lat: 55.044191, lng: -8.340999},
    name: "Donegal Control Amber Zone",
    rad: 12000,
    color: restrictedColor,
    contact: "sua@donegalairport.ie"
  },
  u64: {
    center: {lat: 52.701976, lng: -8.924816},
    name: "Shannon Control Amber Zone",
    rad: 12000,
    color: restrictedColor,
    contact: "suaairspace@iaa.ie"
  },
  
  u63: {
    center: {lat: 53.910297, lng: -8.818491},
    name: "Connaught Control Amber Zone",
    rad: 12000,
    color: restrictedColor,
    contact: "michaelconnolly@irelandwestairport.com"
  },
  
  u61: {
    center: {lat: 51.841269, lng: -8.491112},
    name: "Cork Control Amber Zone",
    rad: 12000,
    color: restrictedColor,
    contact: "suaairspace@iaa.ie"
  },
  u88: {
    center: {lat: 54.280213, lng: -8.599208},
    name: "Sligo Control Amber Zone",
    rad: 12000,
    color: restrictedColor,
    contact: "safetymanager@sligoairport.com"
  },
  
  u90: {
    center: {lat: 52.1872, lng: -7.086963},
    name: "Waterford Control Amber Zone",
    rad: 12000,
    color: restrictedColor,
    contact: "sua@waterfordairport.net"
  },
  u7: {
    center: {lat: 53.302992, lng: -6.455406},
    name: "Casement Aerodrome",
    rad: 5000,
    color: restrictedColor,
    contact: "airspaceandobstacles@defenceforces.ie"
  },
  u17: {
    center: {lat: 53.424444, lng: -7.947778},
    name: "Custume Barracks",
    rad: 3704,
    color: restrictedColor,
    contact: "heliops@defenceforces.ie"
  },
  u95: {
    center: {lat: 52.167847, lng: -7.025103},
    name: "Waterford Control Terrain 5",
    rad: 3500,
    color: restrictedColor,
    contact: "sua@waterfordairport.net"
  },
  u21: {
    center: {lat: 53.352222, lng: -6.488333},
    name: "Weston Airport",
    rad: 3000,
    color: restrictedColor,
    contact: "ops@westonairport.com"
  },
  u12: {
    center: {lat: 53.072778, lng: -6.036389},
    name: "Newcastle Aerodrome",
    rad: 2778,
    color: restrictedColor,
    contact: "info@einc.ie"
  },
  u94: {
    center: {lat: 52.216361, lng: -7.016533},
    name: "Waterford Control Terrain 4",
    rad: 1700,
    color: restrictedColor,
    contact: "sua@waterfordairport.net"
  },
  u25: {
    center: {lat: 53.773674, lng: -6.336483},
    name: "Dublin Control Terrain 2",
    rad: 1500,
    color: restrictedColor,
    contact: "suaairspace@iaa.ie"
  },
  u80: {
    center: {lat: 52.703039, lng: -9.077886},
    name: "Shannon Control Terrain 3",
    rad: 1600,
    color: restrictedColor,
    contact: "suaairspace@iaa.ie"
  },
  u81: {
    center: {lat: 52.709694, lng: -8.829472},
    name: "Shannon Control Terrain 4",
    rad: 1200,
    color: restrictedColor,
    contact: "suaairspace@iaa.ie"
  },
  u76: {
    center: {lat: 53.504917, lng: -6.234667},
    name: "BallyBoughal Airfield",
    rad: 1000,
    color: restrictedColor,
    contact: "michaelbergin@live.ie"
  },
    u2: {
      center: {lat: 53.273556, lng: -6.231778 },
      name: "Currency Centre Dublin",
      rad: 500,
      color: restrictedColor,
      contact: "airspaceandobstacles@defenceforces.ie"
    },
    u3: {
      center: {lat: 53.343, lng: -6.302167 },
      name: "Royal Hospital Kilmainham",
      rad: 800,
      color: restrictedColor,
      contact: "david.duff@imma.ie"
    },
    u19: {
      center: {lat: 53.327939, lng: -6.270469},
      name: "Cathal Brugha Barracks",
      rad: 371,
      color: restrictedColor,
      contact: "airspaceandobstacles@defenceforces.ie"
    },
    u24: {
      center: {lat: 53.439478, lng: -6.342445},
      name: "Dublin Control Terrain 1",
      rad: 650,
      color: restrictedColor,
      contact: "suaairspace@iaa.ie"
    },
    u26: {
      center: {lat: 53.412841, lng: -6.337846},
      name: "Dublin Control Terrain 3",
      rad: 400,
      color: restrictedColor,
      contact: "suaairspace@iaa.ie"
    },
    
   
    u67: {
      center: {lat: 51.825383, lng: -8.5958},
      name: "Cork Control Terrain 1",
      rad: 625,
      color: restrictedColor,
      contact: "suaairspace@iaa.ie"
    },
    u68: {
      center: {lat: 51.789706, lng: -8.456769},
      name: "Cork Control Terrain 2",
      rad: 700,
      color: restrictedColor,
      contact: "suaairspace@iaa.ie"
    },
   
    u42: {
      center: {lat: 53.350158, lng: -6.288103},
      name: "Arbour Hill Prison",
      rad: 800,
      color: restrictedColor,
      contact: "PVMannerin@irishprisons.ie"
    },
    u43: {
      center: {lat: 53.754108, lng: -8.487152},
      name: "Castlerea Prison",
      rad: 800,
      color: restrictedColor,
      contact: "PVMannerin@irishprisons.ie"
    },
    u44: {
      center: {lat: 53.341092, lng: -6.383033},
      name: "Cloverhill Prison",
      rad: 800,
      color: restrictedColor,
      contact: "PVMannerin@irishprisons.ie"
    },
    u45: {
      center: {lat: 51.909278, lng: -8.459992},
      name: "Cork Prison",
      rad: 800,
      color: restrictedColor,
      contact: "PVMannerin@irishprisons.ie"
    },
    u46: {
      center: {lat: 54.288706, lng: -7.91565},
      name: "Loughan House",
      rad: 800,
      color: restrictedColor,
      contact: "airspaceandobstacles@defenceforces.ie"
    },
    u47: {
      center: {lat: 52.815725, lng: -6.190419},
      name: "Shelton Abbey",
      rad: 800,
      color: restrictedColor,
      contact: "airspaceandobstacles@defenceforces.ie"
    },
    u48: {
      center: {lat: 53.4069, lng: -6.236819},
      name: "IPS BSD",
      rad: 500,
      color: restrictedColor,
      contact: "airspaceandobstacles@defenceforces.ie"
    },
    u49: {
      center: {lat: 53.733286, lng: -7.774978},
      name: "IPS Headquarters",
      rad: 500,
      color: restrictedColor,
      contact: "airspaceandobstacles@defenceforces.ie"
    },
    u50: {
      center: {lat: 53.356389, lng: -6.340556},
      name: "Leinster Model Flying Club",
      rad: 300,
      color: restrictedColor,
      contact: "iaaliaison@maci.ie"
    },
    u51: {
      center: {lat: 53.506111, lng: -6.235278},
      name: "Ballyheary Flying Club",
      rad: 800,
      color: restrictedColor,
      contact: "iaaliaison@maci.ie"
    },
    u52: {
      center: {lat: 53.5375, lng: -6.084167},
      name: "Fingal Model Flying Club",
      rad: 800,
      color: restrictedColor,
      contact: "iaaliaison@maci.ie"
    },
    u53: {
      center: {lat: 53.225, lng: -6.318333},
      name: "Island Slope Rebel Flying Club",
      rad: 800,
      color: restrictedColor,
      contact: "iaaliaison@maci.ie"
    },

    u73: {
      center: {lat: 51.739722, lng: -8.694167},
      name: "Bandon Model Flying Club",
      rad: 800,
      color: restrictedColor,
      contact: "suaairspace@iaa.ie"
    },
    u74: {
      center: {lat: 51.78, lng: -8.72},
      name: "Cork Model Aero Club",
      rad: 800,
      color: restrictedColor,
      contact: "suaairspace@iaa.ie"
    },
    u75: {
      center: {lat: 51.620556, lng: -8.545},
      name: "Island Slope Rebels Club",
      rad: 800,
      color: restrictedColor,
      contact: "suaairspace@iaa.ie"
    },
    u77: {
      center: {lat: 52.698611, lng: -8.854722},
      name: "Shannon Model Flying Club",
      rad: 300,
      color: restrictedColor,
      contact: "suaairspace@iaa.ie"
    },
    u78: {
      center: {lat: 52.712061, lng: -8.747769},
      name: "Shannon Control Terrain 1",
      rad: 1200,
      color: restrictedColor,
      contact: "suaairspace@iaa.ie"
    },
    u79: {
      center: {lat: 52.657506, lng: -8.890856},
      name: "Shannon Control Terrain 2",
      rad: 200,
      color: restrictedColor,
      contact: "suaairspace@iaa.ie"
    },
    u82: {
      center: {lat: 52.711411, lng: -9.000114},
      name: "Shannon Control Terrain 5",
      rad: 800,
      color: restrictedColor,
      contact: "suaairspace@iaa.ie"
    },
    u83: {
        center: {lat: 52.727817, lng: -8.856397},
        name: "Shannon Control Terrain 6",
        rad: 300,
        color: restrictedColor,
        contact: "suaairspace@iaa.ie"
    },
    u85: {
      center: {lat: 52.762108, lng: -9.048511},
      name: "Shannon Control Terrain 8",
      rad: 600,
      color: restrictedColor,
      contact: "suaairspace@iaa.ie"
    },
    kilkenny: {
      center: {lat: 52.6517737, lng:-7.3129531}, 
      name: "Kilkenny Paragliding Club",
      rad: 930,
      color: restrictedColor,
      contact: "info@kinair.ie"
    },
    portLaoisePrison: {
      center: {lat: 53.0369332, lng: -7.2899055},
      name: "PortLaoise Prison",
      rad: 800,
      color: restrictedColor,
      contact: "pvmannerin@irishprisons.ie"
    },
   
    
    u91: {
      center: {lat: 52.184514, lng: -7.179378},
      name: "Waterford Control Terrain 1",
      rad: 3800,
      color: restrictedColor,
      contact: "sua@waterfordairport.net"
    },
    u92: {
      center: {lat: 52.231403, lng: -7.158811},
      name: "Waterford Control Terrain 2",
      rad: 600,
      color: restrictedColor,
      contact: "sua@waterfordairport.net"
    },
    u93: {
      center: {lat: 52.265714, lng: -7.006911},
      name: "Waterford Control Terrain 3",
      rad: 600,
      color: restrictedColor,
      contact: "sua@waterfordairport.net"
    },

    u96: {
      center: {lat: 53.077778, lng: -6.231389},
      name: "Roundwood Flying Club",
      rad: 800,
      color: restrictedColor,
      contact: "iaaliaison@maci.ie"    
    },

    ////////////////////////////////////////////////////////////////////////
    //draw red zones last so they are drawn on top of the amber zone!
    ////////////////////////////////////////////////////////////////////////
    u27: {
      center: {lat: 53.428924, lng: -6.265767},
      name: "Dublin Control Red Zone",
      rad: 5000,
      color: prohibitedColor,
      contact: "suaairspace@iaa.ie"
    },
    u31: {
      center: {lat: 52.701976, lng: -8.924816},
      name: "Shannon Control Red Zone",
      rad: 5000,
      color: prohibitedColor,
      contact: "suaairspace@iaa.ie"
    },
    u32: {
      center: {lat: 53.910297, lng: -8.818491},
      name: "Connaught Control Red Zone",
      rad: 5000,
      color: prohibitedColor,
      contact: "michaelconnolly@irelandwestairport.com"
    },
    u33: {
      center: {lat: 51.841269, lng: -8.491112},
      name: "Cork Control Red Zone",
      rad: 5000,
      color: prohibitedColor,
      contact: "suaairspace@iaa.ie"
    },
    u34: {
      center: {lat: 52.180878, lng: -9.523784},
      name: "Kerry Control Red Zone",
      rad: 5000,
      color: prohibitedColor,
      contact: "atc@kerryairport.ie"
    },
    u69: {
      center: {lat: 55.044191, lng: -8.340999},
      name: "Donegal Control Red Zone",
      rad: 5000,
      color: prohibitedColor,
      contact: "sua@donegalairport.ie"
    },
    u87: {
      center: {lat: 54.280213, lng: -8.599208},
      name: "Sligo Control Red Zone",
      rad: 5000,
      color: prohibitedColor,
      contact: "safetymanager@sligoairport.com"
    },
    u89: {
      center: {lat: 52.1872, lng: -7.086963},
      name: "Waterford Control Red Zone",
      rad: 5000,
      color: prohibitedColor,
      contact: "sua@waterfordairport.net"
    },
    
  }

  // return all the airspaces in an array
  export function getAirports() {
    var arr =  [];
    for (var airport in airports) {
      arr.push(airports[airport])
    }
    return arr;
  }

  //return the prohibited zones of airport 
  export function getRedAirports() { 
    var arr = [];
    for (var red in airports) {
      if (airports[red].color === prohibitedColor) {
        arr.push(airports[red])
      }
    }
    return arr

  }
