 /* eslint-disable no-undef*/
  /* eslint-disable no-unused-vars*/
import axios from 'axios'

// Graph represents a grid
export class Graph {
    constructor() {
        this.nodesList = []
        this.adjacencyList = new Map(); //adjacency list contains keys are nodes and value is list of edges fron that node
        this.edges = new Map();
        this.myEdges = []
        this.returned = []
        this.nearest = {}
    }

    // add vertex
    add(v) {
        this.adjacencyList.set(v, []);
        this.edges.set(v, [])
    }

    // add edge between two vertices
    addEdge(v, w) {
        this.edges.get(v).push({
            node: w,
            weight: 1
        })
        this.edges.get(w).push({
            node: v,
            weight: 1
        })
        var e = this.adjacencyList.get(w)
        e.edges[v] = w;
    }

    // fetch grid coordinates from database and construct node objects using them
    async getCoordinates(nearest){
        var slat = parseFloat(nearest.start.lat)
        var slng = parseFloat(nearest.start.lng)
        var elat = parseFloat(nearest.end.lat)
        var elng = parseFloat(nearest.end.lng)
        this.nearest = {start: {lat:slat, lng:slng}, end: {lat: elat, lng:elng}}
        axios
        .post("/fetchGridCoordinates")
        .then((response) => {
          const data = response.data;
          for (var val in data) {
            var c =  {
                id: data[val]["id"],
                coordinate: data[val]["coordinate"],
                edges: []
            }
            var coord =  new Node()
            coord.value = c 
            coord.edges = c.edges
            this.adjacencyList.set(coord, coord.edges) //list of Node objects: key is {id, coordinate, edges} object, value is array of neighbouring Nodes
            this.nodesList.push(coord) // nodeslist is array of nodes, key is {id, coordinate, edges}
          }
        // creates links between nodes (edges between vertices)
        this.linkEdges().then(data => {
            this.returned = data
       
        }).catch(error =>{
            console.log(error)
        })

        })
        .catch (function (error) {
            console.log("ERROR:", error);    
        })

        // return to gridCoords
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log("Returned from graph", this.returned)
            }, 3000);
        })
    }

    // create edges between neighbouring vertices
    async linkEdges() {
        var edgeList = []
            for (var nouter in this.nodesList) { 
                this.nodesList[nouter].weight = 1
                this.adjacencyList.set(this.nodesList[nouter], []) 
                try {
                    for (var ninner in this.nodesList) {
                            if ( ( this.getCoordDistance(this.nodesList[nouter].value.coordinate.lat, this.nodesList[ninner].value.coordinate.lat) < 0.06) && (this.getCoordDistance(this.nodesList[nouter].value.coordinate.lng, this.nodesList[ninner].value.coordinate.lng) < 0.06) && this.nodesList[nouter].value.coordinate !== this.nodesList[ninner].value.coordinate ) {  
                                // if two vertices are neighbours
                                if (this.diagonalEdge(this.nodesList[nouter], this.nodesList[ninner])) {
                                    // if vertices are diagonal neighbours
                                    this.nodesList[ninner].weight += 1
                                }
                                edgeList.push(this.nodesList[ninner].value)
                                this.nodesList[nouter].edges.push(this.nodesList[ninner].coordinate)
                                var vals = this.adjacencyList.get(this.nodesList[nouter])
                                vals.push(this.nodesList[ninner])
                                this.adjacencyList.set(this.nodesList[nouter], vals)  //put edge between nodes
                            } 
                        }
                        this.myEdges.push(vals)
                      
                }
                catch(error){
                    console.log("Error connecting grid: --> ", error)
                }
                
            }
          
            // grid entry and exit point of flight path 
            var v = new Node({ lat: this.nearest.start.lat, lng: this.nearest.start.lng })
            var e =  new Node({lat: this.nearest.end.lat, lng: this.nearest.end.lng})
           
            return new Promise((resolve, reject) => {
                var data = this.dijkstra(e, v)
                setTimeout(() => {
                    resolve(data)
                    console.log("data in promise", data)
                }, 2000)
            })
 
    }

    // print the grid
    viewGrid() {
       
        for (var v in this.nodesList) {
        
            var node = ""
            node += this.nodesList[v].value.id
            node += "---"
            for (var n in this.nodesList[v]) {
                if (typeof this.nodesList[v][n] !== "undefined") {
                    var child = this.nodesList[v][n]
                    node += child.id
                    node += "---"
                }

            }
            console.log(node)
        }
    }

    // check if neighbours are diagonal neighbours
    diagonalEdge(n1, n2) { //neither longitude nor latitude values should be the same for diagonal neighbours
        const latDifference = Math.abs(n1.value.coordinate.lat-n2.value.coordinate.lat) 
        const lngDifference = Math.abs(n1.value.coordinate.lng-n2.value.coordinate.lng) 
    
        return latDifference > 0 && lngDifference > 0
    }

    // return absolute distance 
    getCoordDistance(c1, c2) {
        c1 = parseFloat(c1)
        c2 = parseFloat(c2)
        return Math.abs(c1 - c2)
    }

    // return adjacency list
    getAdjacencyList() {
        return this.adjacencyList
    }

    //breadth first search [*used during testing*]
    BFS(start, dest) {
        console.log("Running BFS")
        var q = []
        q.push(start)

        var visited = new Map();
        visited.set(start, true)

        while(q.length) {
            let v = q.shift();
            //console.log(v);

            console.log("v: ", v, "dest", dest, typeof v.lat, typeof dest.lat)
            if ((v.lat === dest.lat.toString())&&(v.lng === dest.lng.toString())) {
                return true;
            }

            for(let [key,val] of this.adjacencyList) {
                for (let c in val) {
                    if (visited.has(val[c].coordinate) === false) { //if node has not been visited already
                        visited.set(val[c].coordinate, true)
                        q.push(val[c].coordinate)
                        break
                    }
                }               
            }
        } console.log("done in BFS")
    }

    // return the node in adjacency list that matches the inputted start node 
    getCoord(start) { 
        for (var [key, val] of this.adjacencyList) {
           
            if (String(start.value.lat) === key.value.coordinate.lat && String(start.value.lng) === key.value.coordinate.lng) {
                return key
            }
            
        }
    }

    // dijsktra algorithm, start is the grid entry point for the flight path and end is the grid exit point
    dijkstra(start, end) {
        // set structures needed
        var distances = new Map()
        var previous = new Map();
        var visited = new Map();
        const pq = new PQ();

        // set all distances to infinity
        for (var v of this.nodesList) {   
            distances.set(v, Infinity)
            previous.set(v, null)
        }

        // fetch the coordinate objects from adjacency list
        start =  this.getCoord(start)
        end = this.getCoord(end)

        // set distances and weights
        distances.set(start, 0)
        start.weight = 0
        pq.enqueue(start, 0)

        var enqueuedList = [start]
        var dequeuedList = []
        // loop though until priority queue has no unvisited verices left
        while (!pq.isEmpty()) {
            const currentVertex = pq.dequeue()
            dequeuedList.push(currentVertex.value.value)
            if (visited.get(currentVertex.value)) {
                continue
            }
            // vertex is now visited
            visited.set(currentVertex.value, true)

            for (const n of this.adjacencyList.get(currentVertex.value)){ //n.value is the edges                    
                    enqueuedList.push(n.value.id)
                    const distance =  distances.get(currentVertex.value) + n.weight
                   
                    // if the distance of path to this vertex is shorter then update it as the new distance to this vertex
                    if (distance < distances.get(n)) {
                        distances.set(n, distance)
                        previous.set(n, currentVertex.value)
                        pq.enqueue(n, distance)
                    } 
                
            }

        }

        const path = [];
        let current = end;
        // return the shortest path by backtracking through previous
        while (current !== null) {
            path.unshift(current)
            current = previous.get(current)
        }
        this.returned = path
        return{
            path: path, 
            distance: distances.get(end)
        }

    }
}
  

// priority queue
export class PQ {
    constructor() {
        this.itemsList = []
    }

    // check if pq is empty
    isEmpty() {
        if (this.itemsList.length === 0 ) {
            return true 
        }
        return false
    }

    // print pq
    print() {
        var counter = 0;
        for (var i = 0; i < this.itemsList.length; i++) {
            console.log("item: ", this.itemsList[i], "index: ", i)
        }
    }

    // enqueue item in queue with priority
    enqueue(element, priority) {
        
        var pn = {
            value: element, // Eleement is type Node
            priority: priority
        }
        console.log("Enqueueing and itemsList: ", pn, this.itemsList)
        let added = false;
        for (let i = 0; i < this.itemsList.length; i++) {
          if (pn.priority < this.itemsList[i].priority) {
            this.itemsList.splice(i, 0, pn);
            added = true;
            break;
          }
        }
        if (!added) {
          this.itemsList.push(pn);
        }

    
    }

    // dequeue item from the queue
    dequeue() {
        if (this.itemsList.length > 0) {
            return this.itemsList.shift()
        }
        else {
            console.warn("EMPTY PQ", this.itemsList);
            return "EMPTY PQ"
        }
    }

    // return first element in queue
    getHead() {
        if (this.itemsList.length > 0) {
            return this.itemsList[0]
        }
        else {
            console.warn("EMPTY PQ", this.items)
            return "EMPTY PQ"
        }
    }

    // return last element in pq
    getTail() {
        if (this.itemsList.length > 0) {
            return this.itemsList[this.itemsList.length - 1]
        }
        else {
            console.warn("EMPTY PQ", this.items)
            return "EMPTY PQ"
        }
    }

   
}

// node 
export class Node {
    constructor(element) {
        this.value = element // coordinate {lat, lng}
        this.edges = [] // edges this node is part of
        this.weight =  0 
    }

    // return value of the node
    getValue() {
        return this.value
    }

    // retunr edges of this node
    getEdges() {
        return this.edges
    }
}
