package main

import (
	"fmt"
)

//node struct
type myNode struct {
	value    string
	edges    map[edgeVs]*myNode
	priority float32
	cost     float32
}

//parent graph struct
type myGraph struct {
	nodes []*myNode
	edges []map[string]*edgeVs //edge store will be a list maps, key is edge and value is a tuple containing both vertices
}

type edgeVs struct {
	nodeNorth *myNode
	nodeSouth *myNode
	cost      float32
	name      string
}

type Queue struct {
	queue []*QueueItem
}

type QueueItem struct {
	node *myNode
	cost float32
}

type closedTuple struct {
	cost        int
	predecessor *myNode
}

//create graph instance
func New() *myGraph {
	return &myGraph{
		nodes: []*myNode{},
	}
}

func (g *myGraph) addNode(n *myNode) *myGraph {
	g.nodes = append(g.nodes, n)
	return g
}

func (g *myGraph) addEdge(m *myNode, n *myNode, edgeName string, edgeWeight float32) {
	newEdge := edgeVs{ //create the tuple containing both vertices on the edge
		nodeNorth: m,
		nodeSouth: n,
		cost:      edgeWeight,
	}
	listElement := make(map[string]*edgeVs)
	listElement[edgeName] = &newEdge //create the map and add it to graph edge list
	m.edges[newEdge] = n
	g.edges = append(g.edges, listElement) //need to append the map string:edgevs to this list
}

// func (g *myGraph) addGraph(newGraph *myGraph) {
// 	g.nodes = append(g.nodes, newGraph)
// }

func (g *myGraph) createSubGraph(start *myNode, finish *myNode) {
	// call dijkstra and return the path in a map with nodes and edges
	// parse the path create a graph containong each element
}

func (g *myGraph) generateNode(name string) *myNode {
	n := &myNode{
		value: name,
		edges: make(map[edgeVs]*myNode),
	}
	g.nodes = append(g.nodes, n)
	fmt.Println("created node")
	return n
}

func (g *myGraph) String() string { //display the graph visually
	nodes := ""
	edges := ""
	bigPicture := ""
	for _, val := range g.nodes {
		nodes += fmt.Sprintf("%v ", val.value)
	}
	for _, e := range g.edges {
		for key, values := range e {
			edges += fmt.Sprintf("%v ", key)
			bigPicture += fmt.Sprintf("\n" + values.nodeNorth.value + "----" + key + "----" + values.nodeSouth.value)
		}
	}
	return fmt.Sprintf("Nodes: %v \tEdges: %v\nBIGGRAPH: %v", nodes, edges, bigPicture)
}

func (n *myNode) String() string {
	return fmt.Sprintf(" %v ", n.value)
}

//========================================================
//##DEPTH FIRST SEARCH
func (g *myGraph) DFS(n *myNode, m *myNode) map[*myNode]string {
	marked := make(map[*myNode]string)
	return n.dfs(marked, m)
}

func (n *myNode) dfs(marked map[*myNode]string, target *myNode) map[*myNode]string {
	path := ""
	if n.value == target.value {
		fmt.Printf("%v ", marked)
		return marked
	}
	for edge, node := range n.edges {
		w := node //opposite node
		if _, ok := marked[w]; ok {
			fmt.Println("Node already in marked disctionary")
		} else {
			path += fmt.Sprintf("%s", w.value)
			marked[w] = edge.name
			w.dfs(marked, target)
		}
	}
	return marked
}

//=====================================================
//##PRIORITY QUEUE
func (q *Queue) insert(w *QueueItem) {
	fmt.Printf("Inserting %v", w.node.value)
	if w != nil {
		q.queue = append(q.queue, w)
	}
	q.sort(0, len(q.queue)-1)
}

// !!!!!Implement to HEAP sort is faster!!!!!!
func (q *Queue) sort(low int, high int) {
	for j := range q.queue {
		for i := 1; i < len(q.queue)-j; i++ {
			if q.queue[i-1].cost > q.queue[i].cost {
				temp := q.queue[i]
				q.queue[i] = q.queue[i-1]
				q.queue[i-1] = temp
			}
		}
	}
}

func (q *Queue) pop() *myNode {
	if len(q.queue) > 0 {
		minNode := q.queue[0].node
		q.queue = append(q.queue[1:len(q.queue)], q.queue[0])
		return minNode
	}
	return nil
}

func (q *Queue) editCost(n *myNode, newcost float32) {
	for _, val := range q.queue {
		if val.node.value == n.value {
			val.node.cost = newcost
		}
	}
}

func (q *Queue) check(n *myNode) bool {
	for _, val := range q.queue {
		if n == val.node {
			return true
		}
	}
	return false
}

//======================================================
//##Dijkstra

func (g *myGraph) Dijkstra(source *myNode, destination *myNode, d *myNode, e *myNode) {

	distances := make(map[*myNode]float32)  // distances to record distance between source node and all others
	visitedVertex := make(map[*myNode]bool) // marks the vertexes as visited
	prevNodes := make(map[*myNode]*myNode)
	q := Queue{queue: []*QueueItem{}} // priority queue

	wrappedSource := &QueueItem{node: source, cost: 0.0} //a start node
	current := &myNode{value: "DUMMY", edges: make(map[edgeVs]*myNode), priority: 0, cost: 0}
	q.insert(wrappedSource) // enqueue
	if len(q.queue) != 0 {
		for { //FOR LOOP ONLY GOES ONCE??????
			if visitedVertex[current] {
				return
			}
			current = q.pop() // dequeue the node from the pq
			fmt.Printf("\n%v has been popped off", q.queue[0].node.value)
			visitedVertex[current] = true // mark the current vertex as visited
			for edge, nodeToVisit := range current.edges {
				fmt.Printf("\nVisiting %v \t", nodeToVisit.value)
				if visitedVertex[nodeToVisit] == false { // check here to see that nodeToVisit isn't already visited / different syna#tax needed?????
					fmt.Printf("Marked as vsited %v %v\t", nodeToVisit.value, edge.cost)
					newcost := distances[current] + edge.cost
					if !q.check(nodeToVisit) { //if jode not already in the queue
						updateNode := &QueueItem{node: nodeToVisit, cost: newcost}
						fmt.Printf("newcost: %v", newcost)
						q.insert(updateNode)
					} else if newcost < distances[current] {
						fmt.Printf("\n%v < %v\n", distances[current]+nodeToVisit.cost, distances[current])
						prevNodes[nodeToVisit] = current
						distances[nodeToVisit] = newcost //update the cost to get to this new node
					}
				} //NOT SURE WHAT TO DO NEXT? SHOULDNT THERE BE A CORE PATH TO UPDATE WITH THE SMALLEST EDGE VALUE FROM  EACH NODE VISITED
			}
		}
	}
	for in, val := range prevNodes {
		fmt.Printf("\nNode:%v Prev:%v", in, val)
	}
}

// var open = Queue{queue: []*QueueItem{}}
// locs := make(map[*myNode]*myNode)
// closed := make(map[*myNode]*closedTuple)
// preds := make(map[*myNode]*myNode)
// preds[source] = nil

// wrappedSource := &QueueItem{
// 	node: source,
// 	cost: 0,
// }
// open.insert(wrappedSource) //insert with value of 0
// locs[source] = open.pop()
// if len(open.queue) != 0 { //while open is not empty
// 	for {
// 		removeMe := open.pop() //remove mion element and its cost from open
// 		delete(locs, removeMe) //delete the node from locs
// 		prev := preds[removeMe]
// 		delete(preds, removeMe)
// 		closed[removeMe] = &closedTuple{
// 			cost:        removeMe.cost,
// 			predecessor: prev,
// 		}
// 		for _, edge := range removeMe.edges {
// 			w := edge
// 			if _, okClosed := closed[w]; okClosed {
// 				fmt.Printf("%v", okClosed) //IGNORE
// 			} else {
// 				newcost := removeMe.cost + w.cost
// 				if _, okLocs := locs[w]; okLocs { //if w is not in locs
// 					fmt.Printf("%v", okLocs)
// 				} else if newcost < w.cost {
// 					preds[w] = removeMe
// 					open.editCost(w, newcost)
// 				} else {
// 					preds[w] = removeMe
// 					newInsert := &QueueItem{
// 						node: w,
// 						cost: newcost,
// 					}
// 					open.insert(newInsert)
// 					add := open.pop()
// 					locs[w] = add
// 				}
// 			}
// 		}
// 	}
// }
// fmt.Printf("%v", closed)

func main() {
	var graph myGraph
	a := graph.generateNode("a")
	b := graph.generateNode("b")
	c := graph.generateNode("c")
	d := graph.generateNode("d")
	e := graph.generateNode("e")
	f := graph.generateNode("f")

	graph.addEdge(a, b, "e1", 3)
	graph.addEdge(b, c, "e2", 3)
	graph.addEdge(c, d, "e3", 2)
	graph.addEdge(a, e, "e4", 2)
	graph.addEdge(e, f, "e5", 2)

	fmt.Println(&graph)

	graph.DFS(a, b)

	// one := &QueueItem{node: a, cost: 2.0}
	// two := &QueueItem{node: b, cost: 1.0}
	// three := &QueueItem{node: c, cost: 3.0}
	// four := &QueueItem{node: d, cost: 1.5}
	// myQueue := &Queue{
	// 	queue: []*QueueItem{},
	// }
	// myQueue.insert(one)
	// myQueue.insert(two)
	// myQueue.insert(three)
	// myQueue.insert(four)
	// fmt.Printf("[%v %v %v %v]", myQueue.queue[0].node.value, myQueue.queue[1].node.value, myQueue.queue[2].node.value, myQueue.queue[3].node.value)
	// current := myQueue.pop()
	// fmt.Printf("\n%v\n", current.value)
	// fmt.Printf("[%v %v %v %v]", myQueue.queue[0].node.value, myQueue.queue[1].node.value, myQueue.queue[2].node.value, myQueue.queue[3].node.value)
	// current = myQueue.pop()
	// fmt.Printf("\n%v\n", current.value)
	graph.Dijkstra(a, c, d, e)

	// graph.createSubGraph(a, d)

}
