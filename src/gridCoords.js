 /* eslint-disable no-unused-vars */ 
import {ref} from 'vue'
import axios from 'axios'
import { Graph, Node } from './graph'
import { checkRedAreas } from './withinAirspace';

const getCoordinates = require('./graph.js');
const LAYER_ONE = "60" //altitude of sub grids in metres
const LAYER_TWO = "90"
const LAYER_THREE = "120"

let MIN_LAT = ""
let MAX_LAT = ""
let MIN_LNG = ""
let MAX_LNG = ""

export class Grid {
    constructor(size) {
        this.counter = ref(0)
        this.nlist = []
        this.elist = []
        this.slist = []
        this.wlist = []
        this.gap = 0.05
        this.size = size
        this.al = []
        this.returned = []
        this.nearest = {}
        this.borderNodes = []
    }

    //generate the coordinates then store them in a database collection "grids"
    // .05 change in coordinate value is roughly a 6km change in distance
    //centerList param is the coordinate which will be the centerpoint of the grid

    generateCoords(centerList, full, anchors={} ) {  
        var center;
        var j;
        for (var i = 0; i < this.size; i++) { //creates nodes directly n e s w of central node

            for (center in centerList) {
                for (j in centerList[center]) {
                    var nlat = centerList[center][j].lat + this.gap 
                    var nlng = centerList[center][j].lng
                    var nnext = {lat: nlat, lng: nlng}
                    if (checkRedAreas(nnext)) {
                        this.nlist.push(nnext)
                    }
                    
                    var elat = centerList[center][j].lat 
                    var elng = centerList[center][j].lng + this.gap 
                    var enext = {lat: elat, lng: elng}
                    if (checkRedAreas(enext)) {
                        this.elist.push(enext)
                    }
                    

                    var slat = centerList[center][j].lat - this.gap
                    var slng = centerList[center][j].lng 
                    var snext = {lat: slat, lng: slng}
                    if (checkRedAreas(snext)) {
                        this.slist.push(snext)
                    }
                    

                    var wlat = centerList[center][j].lat
                    var wlng = centerList[center][j].lng - this.gap
                    var wnext = {lat: wlat, lng: wlng}
                    if (checkRedAreas(wnext)) {
                        this.wlist.push(wnext)
                    }
                 
                }
            }
            this.gap = this.gap + .05
    
        }
        

        this.gap = 0.05
        const max_vals = this.gap * this.size //constant used to calculate min and max lat and lng values 
        MAX_LAT = centerList[center][j].lat + max_vals
        MIN_LAT = centerList[center][j].lat - max_vals
        MAX_LNG = centerList[center][j].lng + max_vals
        MIN_LNG = centerList[center][j].lng - max_vals
        this.borderNodes.push(String(MAX_LAT), String(MIN_LAT), String(MIN_LNG), String(MAX_LNG)) 
        

        for (i = 0; i < this.size; i++) { // now get the coordinates of each column
            //north rows for west columns and east columns
            for (var point in this.nlist) { 
                
                wlat = this.nlist[point].lat
                wlng = this.nlist[point].lng - this.gap
                wnext = {lat: wlat, lng: wlng}
                if (checkRedAreas(wnext)) {
                    this.wlist.push(wnext)
                }

                elat = this.nlist[point].lat
                elng = this.nlist[point].lng + this.gap
                enext = {lat: elat, lng: elng}
                if (checkRedAreas(enext)) {
                    this.elist.push(enext)
                }
            }

            //south rows for west columns and east columns
            for (point in this.slist) { 
            
                wlat = this.slist[point].lat
                wlng = this.slist[point].lng - this.gap
                wnext = {lat: wlat, lng: wlng}
                if (checkRedAreas(wnext)) {
                    this.wlist.push(wnext)
                }

                elat = this.slist[point].lat
                elng = this.slist[point].lng + this.gap
                enext = {lat: elat, lng: elng}
                if (checkRedAreas(enext)) {
                    this.elist.push(enext)
                }
            }
            this.gap = this.gap + .05
        }

        var finalList = [this.nlist, this.elist, this.slist, this.wlist]

        var coordinate = {
        id: 0,
        lat: "",
        lng: "",
        }
        var c = 1
        var coordsList = []

        //add the center point of the grid
        coordsList.push( 
            {
                lat: String(centerList[0][0].lat),
                lng: String(centerList[0][0].lng),
                id: String(0)
            }
        )
        for (point in finalList) {
            for (var coord in finalList[point]) {
                coordinate = {
                    lat: String(finalList[point][coord].lat),
                    lng: String(finalList[point][coord].lng),
                    id: String(c)
                }
                coordsList.push(coordinate)
                c++
            }
        }

        var layers = [LAYER_ONE, LAYER_TWO, LAYER_THREE] //sub grids
        var coordMsg = {coordinates: coordsList, layers: layers, borderCoordinates: this.borderNodes} //SEND BORDER NODES OVER HERE *******
        this.nearest =  this.getNearestCoord(coordsList, anchors) 

        axios
        .post("/storeGridCoordinates", coordMsg)
        .then((response) => {
          const data = response.data;
          console.log("Grid stored successfully", data)
          if (full === true ) {
            this.getC(this.nearest);
          }
        })
        .catch (function (error) {
            console.log("ERROR:", error);    
        })

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([this.returned, this.nearest])
                console.log("Returned to map", this.returned, this.nearest)
            }, 14000); 
          })
 
    }

    // get nearest coordinates to the atrart and end point
    // return these points as the entry and exit poitns to the grid 
    getNearestCoord(clist, anchors) {

        if (Object.keys(anchors).length !== 0) {
            var startCoord = {lat: anchors.startLat, lng: anchors.startLng} 
            var endCoord = {lat: anchors.endLat, lng: anchors.endLng} 
            var smallestStart = Infinity
            var smallestEnd = Infinity
            var smallestS = ""
            var smallestE = ""
            for (var i=0; i<clist.length; i++) {
                if (this.getCoordDistance(startCoord, clist[i]) < smallestStart) {
                    smallestStart = this.getCoordDistance(startCoord, clist[i])
                    smallestS = clist[i]
                }
                if (this.getCoordDistance(endCoord, clist[i]) < smallestEnd) {
                    smallestEnd = this.getCoordDistance(endCoord, clist[i])
                    smallestE = clist[i]
                }
            }
           
            return {start: smallestS, end: smallestE}
        }
        else {
            return {}
        }
        
    }

    // return absolute difference between coords
    getCoordDistance(c1, c2) {
        var c1Lat = parseFloat(c1.lat)
        var c1Lng = parseFloat(c1.lng)
        var c2Lat = parseFloat(c2.lat)
        var c2Lng = parseFloat(c2.lng)

        if (c1Lat !== c2Lat && c1Lng !== c2Lng) {
            var lat = Math.abs(c1Lat - c2Lat)
            var lng = Math.abs(c1Lng - c2Lng)
        }
        return lat + lng
    }


    // call grid coordinates 
    getC(nearest) {
        var graph = new Graph();
        graph.getCoordinates(nearest).then(data => {
            this.returned = data
            console.log("Received In grid coords--->", data); 
          })
          .catch(error => {
            console.error(error);
          });

        
    }

    // return this.al
    getAl() {
        return this.al
    }

}
