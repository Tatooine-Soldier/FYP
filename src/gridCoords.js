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
    // formula for number of nodes in the grid is ((n*2)+1)^2 where n is the size passed into the grid
    generateCoords(centerList, full, anchors={} ) {  
        var center;
        var j;
        for (var i = 0; i < this.size; i++) { //creates a "crucifix" pattern, n e s w

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
                        this.elist.push(snext)
                    }
                    

                    var wlat = centerList[center][j].lat
                    var wlng = centerList[center][j].lng - this.gap
                    var wnext = {lat: wlat, lng: wlng}
                    if (checkRedAreas(wnext)) {
                        this.elist.push(wnext)
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
            for (var point in this.nlist) { //north rows for west columns and east columns
                
                wlat = this.nlist[point].lat
                wlng = this.nlist[point].lng - this.gap
                wnext = {lat: wlat, lng: wlng}
                if (checkRedAreas(wnext)) {
                    this.elist.push(wnext)
                }

                elat = this.nlist[point].lat
                elng = this.nlist[point].lng + this.gap
                enext = {lat: elat, lng: elng}
                if (checkRedAreas(enext)) {
                    this.elist.push(enext)
                }
            }

            for (point in this.slist) { //north rows for west columns and east columns
            
                wlat = this.slist[point].lat
                wlng = this.slist[point].lng - this.gap
                wnext = {lat: wlat, lng: wlng}
                if (checkRedAreas(wnext)) {
                    this.elist.push(wnext)
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
        console.log("centerList", centerList)
        coordsList.push( //add the center point of the grid
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

        console.log("borderNodes--->", this.borderNodes)
        var layers = [LAYER_ONE, LAYER_TWO, LAYER_THREE] //sub grids
        var coordMsg = {coordinates: coordsList, layers: layers, borderCoordinates: this.borderNodes} //SEND BORDER NODES OVER HERE *******
        this.nearest =  this.getNearestCoord(coordsList, anchors) // return this with this.returned???
       // console.log("this.nearest", this.nearest)
        
        // DO NOT DELETE THIS //
        var al;
        axios
        .post("/storeGridCoordinates", coordMsg)
        .then((response) => {
          const data = response.data;
          console.log("STORED GRID SUCCESSFUL: ",data);
          //al = this.getC()
          console.log("full--->", full)
          if (full === true ) {
            
            this.getC(this.nearest);
          }
        //   return new Promise((resolve, reject) => {
        //     setTimeout(() => {
        //         resolve(this.returned)
        //         console.log("Returned to map", this.returned)
        //     }, 5100);
        //   })

        //   while(typeof al === "undefined") {
        //     al = graph.getAdjacencyList();
        //     if (typeof al !== "undefined") {
        //         console.log("returning al --->" ,al)
        //         this.al = al
        //         return [finalList, al]
        //     }    
          
        //   }
        })
        .catch (function (error) {
            console.log("ERROR:", error);    
        })

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve([this.returned, this.nearest])
                console.log("Returned to map", this.returned, this.nearest)
            }, 14000); //might need to make this bigger
          })
        //add a function that drops the grid collection first  so then this can be left commented in
 
    }

    getNearestCoord(clist, anchors) {
        if (Object.keys(anchors).length !== 0) {
            console.log("anchors", anchors)
            var startCoord = {lat: anchors.startLat, lng: anchors.startLng} 
            var endCoord = {lat: anchors.endLat, lng: anchors.endLng} 
            var smallestStart = Infinity
            var smallestEnd = Infinity
            var smallestS = ""
            var smallestE = ""
            for (var i=0; i<clist.length; i++) {
                console.log("anchors", anchors)
                if (this.getCoordDistance(startCoord, clist[i]) < smallestStart) {
                    smallestStart = this.getCoordDistance(startCoord, clist[i])
                    smallestS = clist[i]
                }
                if (this.getCoordDistance(endCoord, clist[i]) < smallestEnd) {
                    smallestEnd = this.getCoordDistance(endCoord, clist[i])
                    smallestE = clist[i]
                }
            }
            console.log("Closest grid coord to start is: ", smallestS, "\nClosest grid coord to start is: ", smallestE)
            return {start: smallestS, end: smallestE}
        }
        else {
            return {}
        }
        
    }

    getCoordDistance(c1, c2) {
        //console.log("c1", c1, c2)
        var c1Lat = parseFloat(c1.lat)
        var c1Lng = parseFloat(c1.lng)
        var c2Lat = parseFloat(c2.lat)
        var c2Lng = parseFloat(c2.lng)

        if (c1Lat !== c2Lat && c1Lng !== c2Lng) {
            var lat = Math.abs(c1Lat - c2Lat)
            var lng = Math.abs(c1Lng - c2Lng)
           // console.log("lat+lng", lat+lng)
           
        }
        return lat + lng
    }


    getC(nearest) {
        var graph = new Graph();
        // var al = graph.getCoordinates()
        // console.log("al", al)
        graph.getCoordinates(nearest).then(data => {
            this.returned = data
            console.log("Received In grid coords--->", data); 
          })
          .catch(error => {
            console.error(error);
          });
        // console.log("al after return? --->", al)
        // return al
        
    }

    getAl() {
        return this.al
    }

}
