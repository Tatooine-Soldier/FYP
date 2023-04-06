package main

type Queue struct {
	list            []QueueItem
	GridID          string
	SubGridAltitude string
	Node            string
	WaitingTime     string //minimum
}

type QueueItem struct {
	FlightID string
}

func (q *Queue) Enqueue(item QueueItem) {
	q.list = append(q.list, item)
}

func (q *Queue) Dequeue() interface{} {
	if len(q.list) == 0 {
		return nil
	}
	item := q.list[0]
	q.list = q.list[1:]
	return item
}

// func start() {
// 	q := Queue{}
// 	var wait sync.WaitGroup
// 	go func()
// }
