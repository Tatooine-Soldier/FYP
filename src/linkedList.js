export class Node {
    constructor(element) {
        this.element = element
        this.next = null
        this.prev = null
    }
}

export class LinkedList {
    constructor(head, tail){
        this.head = new Node(head)
        this.size = 0
        this.tail = new Node(tail)
    }

    add(element) {
        // creates a new node
        var node = new Node(element);
        var current;
    
        current = this.head;
    
        // iterate to the end of the list
        while (current.next) {
                current = current.next;
        }
        current.next = node; //point forward to the node
        node.prev = current; //point back at the previous last node

        node.next = this.tail //point forward at the tail
        this.tail.prev = node; //point back at the node
        this.size++;
    }

    getNodes() {
        var nodeList = []
        var current = this.head;
        nodeList.push(current.element)
        while (current.next) {
            current =  current.next
            nodeList.push(current.element)
        }
        return nodeList
    }

}