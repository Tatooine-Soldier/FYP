 /* eslint-disable no-undef*/
  /* eslint-disable no-unused-vars*/
  import axios from 'axios'

export class Graph {
    constructor() {
        this.nodesList = []
        this.adjacencyList = new Map(); //adjacency list contains keys are nodes and value is list of edges fron that node
        this.edges = new Map();
        this.myEdges = []
        this.returned = []
        this.nearest = {}
    }

    add(v) {
        this.adjacencyList.set(v, []);
        this.edges.set(v, [])
    }

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

    async getCoordinates(nearest){
        console.log("nearest", nearest)
        var slat = parseFloat(nearest.start.lat)
        var slng = parseFloat(nearest.start.lng)
        var elat = parseFloat(nearest.end.lat)
        var elng = parseFloat(nearest.end.lng)
        this.nearest = {start: {lat:slat, lng:slng}, end: {lat: elat, lng:elng}}
        //console.log("nearest", this.nearest)
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
            // console.log(coord)
            //console.log("Node created:", coord)
            this.adjacencyList.set(coord, coord.edges) //list of Node objects: key is {id, coordinate, edges} object, value is array of neighbouring Nodes
            this.nodesList.push(coord) // nodeslist is array of nodes, key is {id, coordinate, edges}
            //console.log("Adjacency List:", this.adjacencyList, "\nthis.nodesList:", this.nodesList)
            
          }
          
        this.linkEdges().then(data => {
            console.log("Received after Timeout--->", data)
            this.returned = data
            // var a = this.getReturned()
            // return a
        }).catch(error =>{
            console.log(error)
        })

        // return this.getReturned()
          
        //   while(typeof al !== "undefined") {
        //     console.log("returning al", al)
        //     return al
        //   }
          
          //write function here that loops through the adjacency list and add edges to nodes that are less than .5 away from eachother
        })
        .catch (function (error) {
            console.log("ERROR:", error);    
        })

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(this.returned)
                console.log("Returned from graph", this.returned)
            }, 3000);
        })
    }

    // getReturned() {
    //     return new Promise((resolve, reject) => {
    //         setTimeout(() => {
    //             resolve(this.returned)
    //             console.log("Returned from graph", this.returned)
    //         }, 100);
    //     })
    // }
    
    // getReturned() {
    //     return new Promise((resolve, reject) => {
    //         var data = this.returned
    //         setTimeout(() => {
    //             resolve(data)
    //             console.log("Returned", data)
    //         }, 100);
    //     })
    // }
    //for each node in the graph, create a edge between any node thats less than .5 away 
    async linkEdges() {
        var edgeList = []
        console.log("Calling link edges")
        var counter = 0;

            for (var nouter in this.nodesList) { 
                this.nodesList[nouter].weight = 1
                this.adjacencyList.set(this.nodesList[nouter], []) 
                try {
                    //console.log("nouter this.nodesList[nouter]", this.nodesList[nouter].coordinate.lat) 
                    for (var ninner in this.nodesList) {
                        //console.log("nouter this.nodesList[nouter], ninner this.nodesList[ninner]", this.nodesList[nouter].value.id, this.nodesList[ninner].value.id)
                            //console.log("ninner this.nodesList[ninner]", this.nodesList[ninner])
                            //console.log(typeof this.nodesList[nouter].value.coordinate.lat, this.nodesList[ninner].value.coordinate.lat, this.getCoordDistance(this.nodesList[nouter].value.lat, this.nodesList[ninner].value.lat))
                            if ( ( this.getCoordDistance(this.nodesList[nouter].value.coordinate.lat, this.nodesList[ninner].value.coordinate.lat) < 0.06) && (this.getCoordDistance(this.nodesList[nouter].value.coordinate.lng, this.nodesList[ninner].value.coordinate.lng) < 0.06) && this.nodesList[nouter].value.coordinate !== this.nodesList[ninner].value.coordinate ) {
                                edgeList.push(this.nodesList[ninner].value)
                                this.nodesList[nouter].edges.push(this.nodesList[ninner].coordinate)
                                //this.edges.set(nodesList[nouter], this.edges.get(this.nodesList).push(this.nodesList[ninner]))
                                var vals = this.adjacencyList.get(this.nodesList[nouter])
                                vals.push(this.nodesList[ninner])
                                //console.log("Added edges here for ",this.nodesList[nouter], this.nodesList[ninner], vals)
                                this.adjacencyList.set(this.nodesList[nouter], vals)  //put edge between niodes
                            //    console.log("added edge between ", this.nodesList[nouter].value.coordinate, " and ", this.nodesList[ninner].value.coordinate)
                                //console.log("adjacenecylist[nouter] ", this.adjacencyList.get(this.nodesList[nouter])) //the adjacenecy list value for nouter should be updataded to include ninner in the list
                            
                            } 
                        }
                        this.myEdges.push(vals)
                        //console.log("\nthis.nodesList[nouter] with edges", this.adjacencyList.get[this.nodesList[nouter]])
                }
                catch(error){
                    console.log("Error connecting grid: --> ", error)
                }
                
            }
            // console.log("EdgeList", edgeList)
            // console.log("done")

            var v = new Node({ lat: this.nearest.start.lat, lng: this.nearest.start.lng })
            var e =  new Node({lat: this.nearest.end.lat, lng: this.nearest.end.lng})
            //edgeList = this.dijkstra(v, e)
            //this.BFS({lat: 53.531386134765576, lng: -7.925040162129355}, {lat: 53.431386134765575, lng: -8.075040162129355})
            //this.viewGrid()
            console.log("EdgeList--->", edgeList)
            return new Promise((resolve, reject) => {
                var data = this.dijkstra(e, v)
                setTimeout(() => {
                    resolve(data)
                    console.log("data in promise", data)
                }, 2000)
            })
        //return edgeList
    }

    viewGrid() {
        console.log("nodesList", this.nodesList)
        for (var v in this.nodesList) {
           // console.log("nodesList edges", this.nodesList[v].edges)
            var node = ""
            node += this.nodesList[v].value.id
            node += "---"
            for (var n in this.nodesList[v]) {
                if (typeof this.nodesList[v][n] !== "undefined") {
                    var child = this.nodesList[v][n]
                    //console.log("child", this.nodesList[v][n])
                    node += child.id
                    node += "---"
                }

            }
            console.log(node)
        }
    }

    getCoordDistance(c1, c2) {
        c1 = parseFloat(c1)
        c2 = parseFloat(c2)
        return Math.abs(c1 - c2)
    }

    getAdjacencyList() {
        console.log("this.adjacencyList", this.adjacencyList)
        return this.adjacencyList
    }

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

    getCoord(start) { //;loop through adjacency list and find the node.coordinates that matches the start coordinates
        for (var [key, val] of this.adjacencyList) {
            //console.log(" key:", key.value.coordinate.lat, "val:", val)
            if (String(start.value.lat) === key.value.coordinate.lat && String(start.value.lng) === key.value.coordinate.lng) {
                return key
            }
            
        }
    }

    dijkstra(start, end) {

        console.log("Starting node in dijkstra: ", start)

        var distances = new Map()
        var previous = new Map();
        var visited = new Map();
        const pq = new PQ();
        console.log("\n*this.adjacencyList*\n", this.adjacencyList)

        for (var v of this.nodesList) {   
            distances.set(v, Infinity)
            previous.set(v, null)
            // pq.enqueue(v, Infinity)
        }


        start =  this.getCoord(start)
        end = this.getCoord(end)

      
        // start.weight = 0
        console.log("start-->", start)

        distances.set(start, 0)
        start.weight = 0
        pq.enqueue(start, 0)

        var enqueuedList = [start]
        var dequeuedList = []
        while (!pq.isEmpty()) {
            const currentVertex = pq.dequeue()
            dequeuedList.push(currentVertex.value.value)
            // console.log("\ncurrentVertex.value.value.id\n", currentVertex.value.value.id)
            // if (currentVertex.value.value.id === "32") {
            //     alert("32")
            //     console.log("edges-->",currentVertex.value)
            // }
            //console.log("currentVertex", currentVertex.value)
            //maybe check if visited?
            if (visited.get(currentVertex.value)) {
                continue
            }
            visited.set(currentVertex.value, true)

            for (const n of this.adjacencyList.get(currentVertex.value)){ //n.value is the edges
                //console.log("***this.adjacencyList.get List of edges---->",currentVertex.value, this.adjacencyList.get(currentVertex.value))
                //console.log("***this.adjacencyList***", this.adjacencyList)
                
                    //console.log("this.adjacencyList.get(currentVertex)", this.adjacencyList.get(currentVertex.value)) //use nodeslist instead of this
                    //console.log("n", n)
                    
                    enqueuedList.push(n.value.id)
                     //USE NODES LIST INSTEAD OF ADJACENCY LIST
                    //console.log("distances(should be list of nodes and each distance eg Infinity):", distances)
                    const distance =  distances.get(currentVertex.value) + n.weight
                    //console.log("distance & n.weight: ", distance, n.weight)
                    if (distance < distances.get(n)) {
                        distances.set(n, distance)
                        previous.set(n, currentVertex.value)
                        pq.enqueue(n, distance)
                        console.log("distances:", distances)
                    } 
                    // ELSE?????? meaybe there not be updated therefore remain INFINITY
                
                 
    
            }

            //So its adding all of the neighbours to the PQ but is only dequeueing the first one neighbour of each set of neighbours added. Its as if its being reset each time
            

        }
        const path = [];
        let current = end;
        while (current !== null) {
            path.unshift(current)
            current = previous.get(current)
        }
        console.log("enqueued nodes-->", enqueuedList)
        console.log("dequeued nodes-->", dequeuedList)
        console.log(path)
        this.returned = path
        return{
            path: path, 
            distance: distances.get(end)
        }

    }
}
  


export class PQ {
    constructor() {
        this.itemsList = []
    }

    // runDemo() {
    //     var n1 = new Node({lat:53.42513900150771, lng: -5.787576783223105})
    //     var n2 = new Node({lat:52.62513900150771, lng: -6.797489472894278})
    //     var n3 = new Node({lat:56.52513900150771, lng: -5.000489472894278})
    //     this.enqueue(n1, 0)
    //     this.enqueue(n2, 4)
    //     this.enqueue(n3, 2)
    //     this.print()
    //     this.dequeue()
    //     this.print()
    //     this.getHead();
    // }

    isEmpty() {
        if (this.itemsList.length === 0 ) {
            return true 
        }
        return false
    }

    print() {
        var counter = 0;
        for (var i = 0; i < this.itemsList.length; i++) {
            console.log("item: ", this.itemsList[i], "index: ", i)
        }
    }

    enqueue(element, priority) {
        console.log("ENQUEUE===>", element)
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
        

        // if (this.itemsList.length === 0) {
        //     this.itemsList.push(pn)
        // }
        // else {
        //     var size = this.itemsList.length-1
        //     size++
        //     for (var i = 0; i < size; i++) {
        //         if (this.itemsList[i].priority > pn.priority) {
        //             this.itemsList.splice(i, 0, pn);
        //             break
        //         } 
        //         if (this.itemsList[i].priority < pn.priority) {
        //             this.itemsList.splice(i+1, 0, pn);
        //             break
        //         } 
        //     }
        // }

    
    }

    dequeue() {
        if (this.itemsList.length > 0) {
            console.log("DEQUEUING", this.itemsList[0])
            return this.itemsList.shift()
        }
        else {
            console.warn("EMPTY PQ", this.itemsList);
            return "EMPTY PQ"
        }
    }

    getHead() {
        if (this.itemsList.length > 0) {
            console.log("head", this.itemsList[0])
            return this.itemsList[0]
        }
        else {
            console.warn("EMPTY PQ", this.items)
            return "EMPTY PQ"
        }
    }

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

export class Node {
    constructor(element) {
        this.value = element
        this.edges = []
        this.weight =  0 //cost
    }

    getValue() {
        return this.value
    }

    getEdges() {
        return this.edges
    }
}



class Corridor { //maybe pass in a list of nodes here and create a linked list 
    constructor(nodes) { //points in the corridor 
        this.nodes = nodes
    }

    getStartPoint() {
        return nodes[0]
    }

    getFinishPoint() {
        return nodes[this.nodes.length-1]
    }
}
