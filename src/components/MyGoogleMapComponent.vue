<template>
  <div id="big-container">
    <div class="distance-caption-container" id="distance-caption-container">
      <div class="distance-details" >
          <div id="distanceKM" class="distanceUpdate">{{ distance }}km</div>
          <div class="sub-distance">Distance of path(km)</div>
        </div>
      <div class="distance-details">
        <div id="distanceTime" class="distanceUpdate">{{ calculatedTime }}</div>
        <div class="sub-distance">Estimated arrival</div>
      </div>
      <div class="source-coords">
        <div class="source-coords-title">
          STARTING POINT:
        </div>
        <div>
          Lat: <span class="coords-display" id="cursorLat"></span>
        </div>
        <div>
          Lng: <span class="coords-display" id="cursorLng"></span>
        </div>
      </div>
      <div class="dest-coords">
        <div class="source-coords-title">
          DESTINATION POINT
        </div>
        <div>
          Lat: <span class="coords-display" id="destCursorLat"></span>
        </div>
        <div>
          Lng: <span class="coords-display" id="destCursorLng"></span>
        </div>
      </div>
    </div>
    <!-- <button id="coords-confirm-button" @click="$emit('someEvent', {c:currPos, d:otherLoc} )">Confirm</button> -->
    
    <div class="submit-div" 
      @click="$emit('someEvent', {c:currPos, d:otherLoc, distance:distance, w:waypointLoc, t:calculatedTime, r:rawTime} )">
        CONFIRM
    </div>
    
    <div ref="mapDivHere" style="width:100%; height:80vh;"/>
    <div id="airportClicked"></div>
    <div id="addWaypoint">Add Waypoint</div>
   
    <div id="locationWarning">
      <span id="markerName"></span> is within a <span id="colorAirspace"></span> area.
      <br><br>
      <div id="airspaceMessage"></div>
      <br>
      <div id="contactMessage"></div>
    </div>
  </div>

</template>

<style>
  #locationWarning {
    display: none;
    color: white;
    background-color: rgb(101, 100, 100);
    border: solid 1px rgb(101, 100, 100);
    border-radius: 5px;
    box-shadow: 0px 1px 3px #576481;
    position: absolute;
    top: 48%;
    margin-left: .8%;
    width: 18.5%;
    padding: 7px;
  }

  

  .distanceUpdate {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
  }

  #distanceTime {
    font-size: 20px;;
  }

  .sub-distance {
    font-size: 12px;;
  }

  .distance-details {
    display: grid;
    grid-template-rows: 75% 25%;
    text-align: center;
  }
  

  .distance-caption-container {
    background-color: white;
    padding: 5px;
    display: grid;
    grid-template-columns: 20% 30% 25% 25%;
  }

  .distance-and-time {
    display: grid;
    grid-template-rows: 50% 50%;
  }

  .source-coords {
    display: grid;
    grid-template-rows: 20% 40% 40%;
  }

  .dest-coords {
    display: grid;
    grid-template-rows: 20% 40% 40%;
  }

  .coords-display {
    font-size: 12px;
    width: 60%;
    padding: 2px;
  }

  .source-coords-title {
    padding-bottom:20px;
  }

  #coords-confirm-button {
    position: static;
    padding: 2px;
    width: 100%;
  }

  .submit-div {
    background-color: white;
    border: solid 1px grey;
    text-align: center;
    padding: 3px;
    transition: 0.4s;
  }

  .submit-div:hover {
    background-color: rgb(101, 100, 100);
    color: white;
  }

  #airportClicked {
    position: absolute;
    z-index: 1;
    color: white;
    font-size: 1em;
    width: 25%;
    left: 37%;
    top: 20%;
    text-align: center;
    background-color: rgb(101, 100, 100);
    padding: 10px;
    border: solid 1.5px grey;
    border-radius: 20px;
    opacity: .9;
    display: none;
  }

  #addWaypoint {
    background-color: white;
    color: black;
    width: 19%;
    position: absolute;
    top: 75.5%;
    margin-left: 1.2%;
    text-align: center;
    padding: 5px;
    border: solid .1px #9a9a9a;
    border-radius: 3px;
    box-shadow: 0px 1px 3px #576481;
    display: none;
  }

  #addWaypoint:hover {
    background-color: rgb(235, 234, 234);
    cursor: pointer;
  }
</style>

<script>
import { Loader } from '@googlemaps/js-api-loader'
    /* eslint-disable no-undef*/
    /* eslint-disable no-unused-vars*/
    import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
    import { useGeolocation } from '../useGeolocation'
    import { airports, getAirports } from '../airports'
    import { LinkedList } from '../linkedList'
    import { getLineSegments } from '../lineSegments'
    import { Grid } from '../gridCoords';
    
    // import haversineDistance from './calculateDistance'
    //const GOOGLE_MAPS_API_KEY = 'AIzaSyDTNOMjJP2zMMEHcGy2wMNae1JnHkGVvn0'
    const GOOGLE_MAPS_API_KEY = 'AIzaSyBkU3LEkHvrO8_kpSWGqobpFob-sESKlA8'
    export default {
      name: 'App',
      props: ['propspeed'],
      data() {
        return {
          speed: 1,
          path: []
        }
      },
      setup(props) {
        const { coords } = useGeolocation()
        const initial = computed(() => ({
          lat: coords.value.latitude,
          lng: coords.value.longitude
        }))
        
        const currPos = ref(null)
        const otherLoc = ref(null)
        const waypointLoc = ref(null)
        waypointLoc.value = {lat: "nil", lng: "nil"}
        let clickListener = null;
        let dragListener = null;
        let waypointDragListener = null;
        let waypointListener = null;
        let destDragListener = null;
        let cursor = {lat: 0.0, lng: 0.0}
        let oldMarkers = [];

        const loader = new Loader({ apiKey: GOOGLE_MAPS_API_KEY})
        const mapDivHere = ref(null);
      
        let sourceMarker = ref(null)
        let destMarker = ref(null)
        let waypoint = ref(false)
        let oldMarker = ref(null)
        let waypointMarker = ref(null)
        var waypointDiv;
        var waypointList = new LinkedList(sourceMarker, destMarker);
        let wl = [];
        var flightPlanCoordinates = [];
        const RED_ZONE = "Entering Red Zone airspace is prohibited by law";

        let map = ref(null)
        var circle;
        var mycircle;
        var circleRef =  ref(null);
        var updatedDistance = ref(null)
        var destinfowindow;
        var lineSegmentsList = {};
        var speedref = ref(30);
        

        
        
        onMounted(async () => {
          await loader.load()
          currPos.value = {lat: initial.value.lat, lng: initial.value.lng}
          console.log("currPos.value", currPos.value)

          var circleList = [];
          function displayWarning() { 
              
              if (circleRef.value.result) {
                var doc = document.getElementById("locationWarning");
                doc.style.display = "block"; 
                var colorDiv = document.getElementById("colorAirspace");
                colorDiv.style.color = circleRef.value.color;
                var msgDiv = document.getElementById("airspaceMessage");
                var contactDiv = document.getElementById("contactMessage");
                msgDiv.style.color = "#FFFFFF";
                var markerDiv = document.getElementById("markerName");
                if (circleRef.value.color === "#FF8833") {
                  colorDiv.innerHTML = "AMBER";
                  markerDiv.innerHTML =  circleRef.value.marker;
                  msgDiv.innerHTML = "Please contact <span id='airName'>"+ circleRef.value.name + "</span> UAS zone authority before beginning your flight."; //Unmanned Aerial System
                  contactDiv.style.color = "#FFFFFF"
                  contactDiv.innerHTML = "Email: <span><i><a id='emailAirport' href = 'mailto: "+circleRef.value.contact+"'>"+ circleRef.value.contact +"</a></i></span>"; 
                  var email = document.getElementById("emailAirport");
                  email.style.color = "#FFFFFF"
                  email.style.fontSize = "12px";
                  var nameDiv = document.getElementById("airName");
                  nameDiv.style.color =  "#FF8833";
                } else if (circleRef.value.color === "#FF0000") {
                  colorDiv.innerHTML = "RED";
                  msgDiv.innerHTML = RED_ZONE;
                }
              }
            }

          map.value = new google.maps.Map(mapDivHere.value, {
            center: currPos.value,
            mapId: '3bf85d4d49160123',
            zoom: 9
          })
          clickListener = map.value.addListener(
            'click',
            ({latLng: {lat, lng}}) => 
              (otherLoc.value = {lat: lat(), lng: lng()},
              getAirports(), 
              destMarker.value = new google.maps.Marker({
                position: otherLoc.value,
                draggable: true,
                map: map.value
              }),
              destinfowindow = new google.maps.InfoWindow({
                content: "Destination Point",
                ariaLabel: "Destination",
              }),
              destMarker.value.addListener("click", () => {
                destinfowindow.open({
                    anchor: destMarker.value,
                    map,
                });
              }),
              destDragListener = destMarker.value.addListener(
                'drag',
                function(event) {
                  otherLoc.value = {lat: event.latLng.lat(), lng: event.latLng.lng()},
                  
                  circle = function() {
                    var airportsList =  getAirports();
                    for (var airspace=0; airspace<airportsList.length; airspace++) { //for circle on map
                        var distnace = haversineDistance(airportsList[airspace].center, otherLoc.value)
                        distnace = distnace*1000;     //convert to metres
                        if (distnace < (airportsList[airspace].rad)) {  // the radius was not accurately represented on the map so I multiplied by .6 to be more accuarte?????
                            console.log("*WITHIN RADIUS*:\n", "distance: ", distnace, "airport name and rad:", airportsList[airspace].name, airportsList[airspace].rad);
                            const ret = {
                                result: true, 
                                name: airportsList[airspace].name, 
                                color: airportsList[airspace].color,
                                marker: "Destination marker",
                                contact: airportsList[airspace].contact
                            }
                            circleRef.value =  ret
                            displayWarning()
                        } 
                    }
                  },
                  circle.call(),
                  console.log("OTHER-->",otherLoc.value.lat)
                  var d = document.getElementById('destCursorLat')
                  d.innerHTML = otherLoc.value.lat;
                  var c = document.getElementById('destCursorLng')
                  c.innerHTML = otherLoc.value.lng;
                }
              ),
              displayWaypointClicker(),
               waypointList = new LinkedList(sourceMarker.value, destMarker.value)
            )
          )

          
          var grid  = new Grid(4);
          console.log("Calling in MyGoogle map component")
          var psos = grid.generateCoords([[{lat: 51.8964507, lng: -8.4908813}]], false).then(data => { 
            console.log("Received In map coords--->", data); 
            // need to check where data is being sent to Final Map component, do i just pass path as a Prop up to planner like all the other data?
          })
          .catch(error => {
            console.error(error);
          }); //centerPoint for Ireland grid
          console.log("psos: ", psos)
          



          // while (typeof psos === "undefined") {
          //   var pl = grid.getAl()
          //   if (typeof pl !== "undefined") {
          //     console.log("psos, pl", psos, pl)
          //     psos = pl
          //     break
          //   }
          // }
          // console.log("psos", psos)
          // var ps = psos[0]
          // var vr = psos[1]
          // for (var i=1;i<vr.length;i++) {
          //     for(var k=0;k<vr.length;k++) {
          //       var lat = vr[i].lat 
          //       var lng = vr[i].lng
          //       var latnext = vr[k].lat
          //       var lngnext = vr[k].lng
          //       if (Math.abs(lat - latnext) < 0.06 && Math.abs(lng - lngnext) < 0.06) {                  
          //         var coord1 = {lat: lat, lng: lng}
          //         var coord2 = {lat: latnext, lng: lngnext}
          //         console.log("coord1, coord2", coord1.lat, coord2.lat)
          //         var line;
          //         line = new google.maps.Polyline({
          //           path: [coord1, coord2],
          //           map: map.value
          //         })
          //         // line.setMap(null)
          //       }
          //     }
              
          // }
          // for (var plist in ps) {  //for list in listOfLists
          //   for (var j=0;j<ps[plist].length;j++) {
          //       const gridCircle = new google.maps.Circle({
          //         strokeColor: "#220088",
          //         strokeOpacity: 0.8,
          //         strokeWeight: 1,
          //         fillColor: "#110066",
          //         fillOpacity: 0.7,
          //         map: map.value,
          //         center: ps[plist][j],
          //         radius: 400
          //     });
          //   }
          // }


          waypointDiv = document.getElementById("addWaypoint");
          waypointListener = waypointDiv.addEventListener("click", function(){
            waypointLoc.value = {lat: map.value.center.lat(), lng: map.value.center.lng()}
            flightPlanCoordinates.push(waypointLoc.value)
            waypoint.value = true
            drawPath()
            console.log("flightPlanCoordinates::::",flightPlanCoordinates)
            waypointMarker.value = new google.maps.Marker({
              map: map.value,
              position: waypointLoc.value,
              draggable: true,
              icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              }
            }),
            waypointDragListener = waypointMarker.value.addListener(
              'drag',
              function(e) {
                waypointLoc.value = {lat: e.latLng.lat(), lng: e.latLng.lng()}
                flightPlanCoordinates[flightPlanCoordinates.length - 1] = waypointLoc.value
                console.log("PATH", flightPlanCoordinates)
                //flightPlanCoordinates.push(waypointLoc.value)
                updatePath()
                circle = function() {
                  var airportsList =  getAirports();
                  for (var airspace=0; airspace<airportsList.length; airspace++) { //for circle on map
                        var distnace = haversineDistance(airportsList[airspace].center, waypointLoc.value)
                        distnace = distnace*1000;     //convert to metres
                        if (distnace < (airportsList[airspace].rad)) {  // the radius was not accurately represented on the map so I multiplied by .6 to be more accuarte?????
                            console.log("*WITHIN RADIUS*:\n", "distance: ", distnace, "airport name and rad:", airportsList[airspace].name, airportsList[airspace].rad);
                            const ret = {
                                result: true, 
                                name: airportsList[airspace].name, 
                                color: airportsList[airspace].color,
                                marker: "Waypoint",
                                contact: airportsList[airspace].contact
                            }
                            circleRef.value =  ret
                            displayWarning()
                        } 
                       
                    }
                  },
                circle.call()
              },
              
              console.log("After dragging", flightPlanCoordinates)
            )

          
            function drawPath() {
                const flightPath = new google.maps.Polyline({
                path: flightPlanCoordinates,
                geodesic: true,
                strokeColor: "#FF0000",
                strokeOpacity: 0.5,
                strokeWeight: 3,
                });
                flightPath.setMap(map.value) 
                return flightPath
              }
            
            function updatePath() {
              const flightPath = new google.maps.Polyline({
                path: flightPlanCoordinates,
                geodesic: true,
                strokeColor: "#FF0000",
                strokeOpacity: 0.5,
                strokeWeight: 3,
                });
                flightPath.setMap(map.value) 
                return flightPath
            }

     
            //   if (waypointLinesD) waypointLinesD.setMap(null)
            // waypointLinesD = new google.maps.Polyline({
            //   path: [otherLoc.value, flightPlanCoordinates[flightPlanCoordinates.length-1]],
            //   map: map.value,
            //   strokeColor: "#FF0000",
            //   strokeOpacity: 0.5,
            // })
            console.log(flightPlanCoordinates)
          })

          sourceMarker.value = new google.maps.Marker({
            position: currPos.value,
            draggable: true,
            map: map.value
          })
          //add in info window that appears when clicked  
          const sourceinfowindow = new google.maps.InfoWindow({
            content: "Starting Point",
            ariaLabel: "Start",
          });
          sourceMarker.value.addListener("click", () => {
            sourceinfowindow.open({
                anchor: sourceMarker.value,
                map,
            });
          });
          var d = document.getElementById('cursorLat')
          d.innerHTML = currPos.value.lat;
          var c = document.getElementById('cursorLng')
          c.innerHTML = currPos.value.lng;
          dragListener = sourceMarker.value.addListener(
            'drag',
            function(event) {
              currPos.value = {lat: event.latLng.lat(), lng: event.latLng.lng()}
              console.log("CURRPOS.LAT",currPos.value.lat)
              cursor.lat = event.latLng.lat(),
              cursor.lng = event.latLng.lng()
              var d = document.getElementById('cursorLat')
              d.innerHTML = cursor.lat;
              var c = document.getElementById('cursorLng')
              c.innerHTML = cursor.lng;
              circle = function() {
                  var airportsList =  getAirports();
                  for (var airspace=0; airspace<airportsList.length; airspace++) { //for circle on map
                       
                        var distnace = haversineDistance(airportsList[airspace].center, currPos.value)
                        distnace = distnace*1000;     //convert to metres
                        if (distnace < (airportsList[airspace].rad)) {  // the radius was not accurately represented on the map so I multiplied by .6 to be more accuarte?????
                            console.log("*WITHIN RADIUS*:\n", "distance: ", distnace, "airport name and rad:", airportsList[airspace].name, airportsList[airspace].rad);
                            const ret = {
                                result: true, 
                                name: airportsList[airspace].name, 
                                color: airportsList[airspace].color,
                                marker: "Starting point",
                                contact: airportsList[airspace].contact
                            }
                            circleRef.value =  ret
                            displayWarning()
                        } 
                       
                    }
                  },
                circle.call()
            }
          )


          for (const airport in airports) {
              const cityCircle = new google.maps.Circle({
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: airports[airport].color,
              fillOpacity: 0.35,
              map: map.value,
              center: airports[airport].center,
              radius: airports[airport].rad
            });
            cityCircle.addListener("click", function() {
              console.log(airports[airport].name)
              var a = document.getElementById("airportClicked");
              a.style.display="block";
              a.innerHTML = airports[airport].name
              setTimeout(function() {
                a.style.display="none"; //fade out would be nice here
              },1300)
            })
            circleList.push(cityCircle);
          }
          //do smaller airports next, 10 nautical mile radius, the 3 larger airports hav an extended area outside area already given so add it in
          //add onclick listener to the circle
         
          function check(marker, circle, radius) 
          {  
              var km = radius/1000;
              var kx = Math.cos(Math.PI * circle.lat / 180) * 111;
              var dx = Math.abs(circle.center.lng() - marker.lng) * kx;
              var dy = Math.abs(circle.center.lat() - marker.lat) * 111;  
              return Math.sqrt(dx * dx + dy * dy) <= km;
          }

          function displayWaypointClicker() {
            var t = document.getElementById("addWaypoint")
            t.style.display = "block";
          }

          
        
        })
        onUnmounted(async () => {
            if (clickListener) clickListener.remove()
            if (dragListener) dragListener.remove()
            if (destDragListener) destDragListener.remove()
            if (waypointDragListener) waypointDragListener.remove()
        
        })
        let line = null //source to dest
        watch([map, currPos, otherLoc], () => {
          if (line) line.setMap(null)
          if (map.value && otherLoc.value != null)
            line = new google.maps.Polyline({
              path: [currPos.value, otherLoc.value],
              map: map.value
            })
            lineSegmentsList = getLineSegments(line)
            circle = function() {
                  var airportsList =  getAirports();
                  for (var airspace=0; airspace<airportsList.length; airspace++) { //for circle on map
                        
                        for (var p in lineSegmentsList) {
                          var distnace = haversineDistance(airportsList[airspace].center, lineSegmentsList[p])
                          distnace = distnace*1000;     //convert to metres
                          if (distnace < (airportsList[airspace].rad)) {  // the radius was not accurately represented on the map so I multiplied by .6 to be more accuarte?????
                              console.log("*WITHIN RADIUS*:\n", "distance: ", distnace, "airport name and rad:", airportsList[airspace].name, airportsList[airspace].rad);
                              const ret = {
                                  result: true, 
                                  name: airportsList[airspace].name, 
                                  color: airportsList[airspace].color,
                                  marker: "Path",
                                  contact: airportsList[airspace].contact
                              }
                              circleRef.value =  ret
                              displayWarning()
                          } 
                        }
                       
                    }
                  },
                circle.call()
        })

        

        let waypointLines = null //source to waypoint
        watch([map,currPos, waypointLoc], () => {
          if (waypointLines) waypointLines.setMap(null)
            waypointLines = new google.maps.Polyline({
              path: [currPos.value, flightPlanCoordinates[0]],
              map: map.value,
              strokeColor: "#FF0000",
              strokeOpacity: 0.5,
            })
            // lineSegmentsList = getLineSegments(waypointLines)
            //inPath(lineSegmentsList)
        })
        // flightPlanCoordinates[flightPlanCoordinates.length-1]
        let waypointLinesD = null  //waypoint to dest
        watch([map,otherLoc, waypointLoc], () => {
          if (waypointLinesD) waypointLinesD.setMap(null)
            waypointLinesD = new google.maps.Polyline({
              path: [otherLoc.value, flightPlanCoordinates[flightPlanCoordinates.length-1]],
              map: map.value,
              strokeColor: "#FF0000",
              strokeOpacity: 0.5,
            })
        }) 

        function displayWarning() { 
              if (circleRef.value.result) {
                var doc = document.getElementById("locationWarning");
                doc.style.display = "block"; 
                var colorDiv = document.getElementById("colorAirspace");
                colorDiv.style.color = circleRef.value.color;
                var msgDiv = document.getElementById("airspaceMessage");
                var contactDiv = document.getElementById("contactMessage");
                msgDiv.style.color = "#FFFFFF";
                var markerDiv = document.getElementById("markerName");
                if (circleRef.value.color === "#FF8833") {
                  colorDiv.innerHTML = "AMBER";
                  markerDiv.innerHTML =  circleRef.value.marker;
                  msgDiv.innerHTML = "Please contact <span id='airName'>"+ circleRef.value.name + "</span> UAS zone authority before beginning your flight."; //Unmanned Aerial System
                  contactDiv.style.color = "#FFFFFF"
                  contactDiv.innerHTML = "Email: <span><i><a id='emailAirport' href = 'mailto: "+circleRef.value.contact+"'>"+ circleRef.value.contact +"</a></i></span>"; 
                  var email = document.getElementById("emailAirport");
                  email.style.color = "#FFFFFF"
                  email.style.fontSize = "12px";
                  var nameDiv = document.getElementById("airName");
                  nameDiv.style.color =  "#FF8833";
                } else if (circleRef.value.color === "#FF0000") {
                  colorDiv.innerHTML = "RED";
                  msgDiv.innerHTML = RED_ZONE;
                }
              }
        }


        
        function waypointsLength() {
          var result = 0;
          var total = 0;
          if (flightPlanCoordinates.length > 1) { //if there are more than one waypoint, get the lengths between them all and add them
            for (var i = 0; i < flightPlanCoordinates.length-1; i++) {
              result = parseFloat(haversineDistance(flightPlanCoordinates[i], flightPlanCoordinates[i+1]))
              result += parseFloat(haversineDistance(flightPlanCoordinates[i], currPos.value))
              result += parseFloat(haversineDistance(flightPlanCoordinates[flightPlanCoordinates.length-1], otherLoc.value))
              total = result;
            }
          } else if (flightPlanCoordinates.length === 0) {
            total = parseFloat(haversineDistance(currPos.value, otherLoc.value))
          } 
          else {
            total = parseFloat(haversineDistance(currPos.value, waypointLoc.value))
            result = parseFloat(haversineDistance(waypointLoc.value, otherLoc.value))
            total += result
          }
          total = total.toFixed(2);
          var calculatedWaypointTime;
          calculatedWaypointTime =  t(total,  parseFloat(document.getElementById("speed").value))
          //updateTime(calculatedWaypointTime)
          
          var dis = document.getElementById("distanceKM");
          dis.innerHTML = total+"km";

          return total;
        }

        function updateTime(calculatedTime) { //update the estimated time calculations in html
          var t = document.getElementById("distanceTime")
          t.innerHTML = calculatedTime
        }

        const haversineDistance = (pos1, pos2) => {
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
          )*1.609344  //convert to kilometres
          return d.toFixed(2)
        }

        const distance = computed(() =>
        otherLoc.value === null && waypoint.value === false
          ? 0
          : waypointsLength()
        )

        const waypointsDistance = computed(() => 
        waypointLoc.value === null
          ? 0
          : waypointsLength()
        )

        const rawT = (distance, speed) => {
          if (speed === 0) {
            speed = 1
          }
          console.log("distance, speed", distance, speed)
          return distance/speed
        }

        var rawTime = computed(() =>
          rawT(distance.value, props.propspeed)
        )


        const t = (distance, speed) => {
          console.log("speed in t", speed, "distance in t", distance)
          if (speed === 0) {
            speed = 1
          }
          const tme = distance/speed
          rawTime =  tme
          const remainder = tme%1
          console.log("REMAINDER",remainder)
          const minutes = parseInt(60*remainder)
          const seconds =  (minutes%1)*60
          var hours = parseInt(tme/1)
          if (hours < 1) {
            hours = 0
            const time = minutes.toString()+" minutes  "
            return time 
          }
          const time = hours.toFixed(0).toString() + " hours  " + minutes.toString()+" minutes  " 
          
          return time 
        }
        
   
        var calculatedTime = computed(() =>
            distance.value === null 
              ? 0
              : t(distance.value, props.propspeed)
              //parseFloat(document.getElementById("sspeed").value)
        )

      
        console.log("(calculatedTime):", calculatedTime)

        
        return { currPos, otherLoc, distance, mapDivHere, calculatedTime, waypointsDistance,  waypointLoc, rawTime}
      },
      methods: {
        addWaypoint() {

        }, 
        // getSpeed() {
        //   var t = document.getElementById("distanceTime")  
        //   var calculatedTime = calculateT(t.value ,parseFloat(document.getElementById("speed").value))
        //   t.innerHTML = calculatedTime
        //   return this.speed
        // }
      }
    
    }
  

</script>
