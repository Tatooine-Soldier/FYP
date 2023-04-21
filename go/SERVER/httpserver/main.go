package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math"
	"net/http"
	"os"
	"strconv"
	"text/template"
	"time"

	"crypto/rand"
	"crypto/sha256"

	"github.com/google/uuid"
	"github.com/gorilla/sessions"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Head struct {
	ContentType string
	Status      int
}

type HTML struct {
	Head      Head
	Name      string
	Templates *template.Template
}

type LoginSuccessObj struct {
	Name      string `json:"name"`
	Result    bool   `json:"result"`
	Id        string `json:"id"`
	SessionID string `json:"session_id"`
}

type Flight struct {
	ID          string `json:"id"`
	Date        string `json:"date"`
	Hour        string `json:"hour"`
	Minute      string `json:"minute"`
	Srclat      string `json:"srclat"`
	Srclng      string `json:"srclng"`
	Destlat     string `json:"destlat"`
	Destlng     string `json:"destlng"`
	Speed       string `json:"speed"`
	EndTime     string `json:"endtime"`
	Altitude    string `json:"altitude"`
	Orientation string `json:"orientation"`
	Corridor    string `json:"corridor"`
	Drone       Drone  `json:"drone"`
	Subgrid     string `json:"subgrid"`
}

type Drone struct {
	Name   string `json:"name"`
	Model  string `json:"model"`
	Weight string `json:"weight"`
}

type SegmentedFlightData struct {
	SegmentedTimes []interface{} `json:"segmentTimes"`
	SegmentedList  []interface{} `json:"segmentList"`
	Date           string        `json:"date"`
	SubGrid        string        `json:"subGrid"`
	Speed          string        `json:"speed"`
	EntryPoint     Coordinate    `json:"entryPoint"`
	ExitPoint      Coordinate    `json:"exitPoint"`
	UAVName        string        `json:uavName"`
	ID             string        `json:"id"`
}

type TimeComparisonObj struct {
	SegmentedTimes  []string
	SegmentedCoords []Coordinate
}

type TimeUpdate struct {
	Id     string `json:"id"`
	Date   string `json:"date"`
	Hour   string `json:"hour"`
	Minute string `json:minute"`
}

type GridofCoordinates struct {
	Coordinates  []interface{} `json:"coordinates"`
	Layers       []string      `json:"layers"` //layers are confined to only 3 due to height restrictions imposed by the IAA at 120metres maximum
	BorderCoords []string      `json:"borderCoordinates"`
}

type MidCoord interface {
	get() map[string]interface{}
}

type Coordinate struct {
	Id        string `json:"id"`
	Latitude  string `json:"lat"`
	Longitude string `json:"lng"`
}

type StripCoordinate struct {
	Latitude  string `json:"lat"`
	Longitude string `json:"lng"`
}

type TimeRecord struct {
	Id     string `json:"id"`
	Hour   string `json:"hour"`
	Minute string `json:"minute"`
}

type FlightSegmented struct {
	Id          string
	Date        string
	Coordinates []Coordinate
	EntryPoint  Coordinate
	ExitPoint   Coordinate
	Times       []string
	SubGrid     string
	Speed       string
}

type QueryDate struct {
	Date  string `json:"date"`
	ID    string `json:"id"`
	Reset bool   `json:"reset"`
}

type ResponseData struct {
	Message string `json:"message"`
}

type ResponseDataDate struct {
	Message []string `json:"message"`
}

type Userobj struct {
	Name     string `json:"name"`
	Password string `json:"password"`
}

type GridData struct {
	ID     string          `json:"id"`
	Coord  StripCoordinate `json:"coordinate`
	Layer  string          `json:"layer"`
	gridID string          `json:"gridID"`
}

type UserSignobj struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type QueueStorage struct {
	id         string
	coordinate Coordinate
	layer      string
	flights    []string
}

var GRID_INCREMENT int
var LAYER_ONE = "60"
var LAYER_TWO = "90"
var LAYER_THREE = "120"
var queueReleaseInterval = 120 //2 minutes intervals of release
var densityThreshold = .5      // threshold grid density
var queueLimit = 10            // max size of queue
var safetyMargin = 180         // 3 minutes safety margin for contentions

// Insert the input Document into the input Collection
func insertDB(ctx context.Context, client *mongo.Client, user primitive.D, collection string) (err error) {
	usersCollection := client.Database("fyp_test").Collection(collection)
	result, err := usersCollection.InsertOne(ctx, user)
	if err != nil {
		fmt.Printf("%v", err)
		panic(err)
	}
	fmt.Printf("%v", result)
	return err
}

// Insert the input Documents into the inputted Collection
func insertManyDB(ctx context.Context, client *mongo.Client, user []interface{}, collection string) (err error) {
	usersCollection := client.Database("fyp_test").Collection(collection)
	result, err := usersCollection.InsertMany(ctx, user)
	if err != nil {
		fmt.Printf("%v", err)
		panic(err)
	}
	fmt.Printf("%v", result)
	return err
}

// Check if the user exists already at signup
func checkDBSignup(ctx context.Context, client *mongo.Client, user string, collection string) (init bool) {
	fmt.Printf("\nCHECKING %v\n", user)
	usersCollection := client.Database("fyp_test").Collection(collection)
	usercheck := bson.D{{"fullName", user}}
	cursor, err := usersCollection.Find(context.TODO(), usercheck)

	var results []bson.D
	if err = cursor.All(context.TODO(), &results); err != nil {
		panic(err)
	}

	if len(results) != 0 {
		return true
	}
	return false
}

// Check if user exists at in database given provided details
func checkDBLogin(ctx context.Context, client *mongo.Client, data primitive.D, collection string) (init bool) {
	usersCollection := client.Database("fyp_test").Collection(collection)

	cursor, err := usersCollection.Find(context.TODO(), data)

	var results []bson.D
	if err = cursor.All(context.TODO(), &results); err != nil {
		panic(err)
	}

	if len(results) != 0 {
		fmt.Println("user exists")
		return true
	}

	return false
}

// Retrieves the ID of the username passed in
func getID(ctx context.Context, client *mongo.Client, user Userobj) string {
	//use filter to get all id records where name = user.name
	usersCollection := client.Database("fyp_test").Collection("users")
	filter := bson.D{{"fullName", user.Name}}
	result, err := usersCollection.Find(ctx, filter)
	var results []bson.M
	if err = result.All(context.TODO(), &results); err != nil {
		panic(err)
	}

	var returnId = ""
	var temp []interface{}
	for _, doc := range results {
		temp = append(temp, doc)
		returnId = fmt.Sprint(doc["id"])
		return returnId
	}

	return returnId

}

// handle the login request
func loginRequest(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}
	log.Println("BODY:", string(body))

	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		panic(err)
	}

	var user Userobj
	err = json.Unmarshal(body, &user)
	fmt.Printf("User in main.go:", user)

	username := user.Name
	var password []string
	password = append(password, user.Password)

	itemByted := encodeToByte(password)

	hashedVal := sha256.New()
	hashedVal.Write([]byte(itemByted))

	userDoc := bson.D{{"fullName", username}, {"password", hashedVal.Sum(nil)}}
	if userExists := checkDBLogin(context.TODO(), client, userDoc, "users"); userExists {
		fmt.Printf("User exists %v", userExists)
		returnLoginSucces(w, r, user, true)
		return
	} else {
		returnLoginSucces(w, r, user, false)
		return
	}
}

// Return user data if login successful
func returnLoginSucces(w http.ResponseWriter, r *http.Request, user Userobj, success bool) {
	if success {
		client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
		if err != nil {
			panic(err)
		}
		uid := getID(context.TODO(), client, user)

		//CREATE A SESSION /////////////////////////////////////////
		session, err := store.Get(r, "session-name")
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// Generate session ID
		sessionID := make([]byte, 32)
		_, err = rand.Read(sessionID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		sessionIDStr := base64.URLEncoding.EncodeToString(sessionID)

		session.Values["user_id"] = uid
		err = session.Save(r, w)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		session.Values["session_id"] = sessionIDStr
		session.Options.MaxAge = 86400 // Set session expiration to 1 day
		err = session.Save(r, w)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		////////////////////////////////////////////////////////////////

		l := &LoginSuccessObj{Name: user.Name, Result: success, Id: uid, SessionID: sessionIDStr}
		b, err := json.Marshal(l)
		if err != nil {
			return
		}

		fmt.Fprintf(w, string(b))
		return
	} else {
		fmt.Fprintf(w, "", success)
	}

}

// Fetch past flight data for the user logged in
func userProfileHandler(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session_id")
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}
	sessionID := cookie.Value
	fmt.Print("Received cookie", sessionID)

	// Get the user ID from the session
	session, err := store.Get(r, "session-name")
	if err != nil {
		http.Error(w, "Unauthorized name", http.StatusUnauthorized)
		return
	}

	userID, ok := session.Values["user_id"].(string)
	fmt.Printf("user_id %v", userID)
	if !ok {
		http.Error(w, "Unauthorized user id", http.StatusUnauthorized)
		return
	}

	userIDstring := userID
	//Retrieve the user's data from the database
	user, err := getUserByID(userIDstring)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}
	fmt.Print("Returning User-->", user["fullName"])

	userFlights, err := getUserFlightDetails(userIDstring)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	jsonBytes, err := json.Marshal(userFlights)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	userIDstring = user["fullName"].(string)

	// send the JSON byte array as the response
	w.Header().Set("Content-Type", "application/json")
	fmt.Fprintf(w, "%s|%s", userIDstring, jsonBytes)

}

// Return id number of the username passed in
func getUserByID(userid string) (primitive.M, error) {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		panic(err)
	}
	usersCollection := client.Database("fyp_test").Collection("users")
	filter := bson.D{{"id", bson.D{{"$eq", userid}}}}

	var result bson.M
	err = usersCollection.FindOne(context.Background(), filter).Decode(&result)
	if err != nil {
		panic("ERROR retriveing user")
	}

	return result, err
}

// Fetch flight data for username passed as input
func getUserFlightDetails(userid string) ([]primitive.M, error) {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		panic(err)
	}
	usersCollection := client.Database("fyp_test").Collection("flights")
	filter := bson.D{{"userID", bson.D{{"$eq", userid}}}}

	cursor, err := usersCollection.Find(context.Background(), filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var results []primitive.M
	err = cursor.All(context.Background(), &results)
	if err != nil {
		return nil, err
	}
	return results, nil

}

// Marshal BSON data into a User struct
func bsonToUser(bsonObj bson.M) (User, error) {
	var user User
	bsonBytes, err := bson.Marshal(bsonObj)
	if err != nil {
		return user, err
	}
	err = bson.Unmarshal(bsonBytes, &user)
	if err != nil {
		return user, err
	}
	return user, nil
}

// Handle the sign up request, insert in user db if user doesn't exisdt already
func signupRequest(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}
	log.Println("BODY:", string(body))

	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		panic(err)
	}

	var user UserSignobj
	err = json.Unmarshal(body, &user)

	username := user.Name
	email := user.Email
	var password []string
	password = append(password, user.Password)

	itemByted := encodeToByte(password)

	hashedVal := sha256.New()
	hashedVal.Write([]byte(itemByted))

	uid := uuid.New()
	id := fmt.Sprintf("%v", uid)

	userDoc := bson.D{{"fullName", username}, {"email", email}, {"password", hashedVal.Sum(nil)}, {"id", id}}

	alreadySignedUp := checkDBSignup(context.TODO(), client, username, "users")
	if alreadySignedUp {
		// user already exists
		returnSignupSuccess(w, r, user, false)
		return
	} else {
		insertDB(context.TODO(), client, userDoc, "users")
		returnSignupSuccess(w, r, user, true)
	}
}

// Return user data if signup is successful
func returnSignupSuccess(w http.ResponseWriter, r *http.Request, user UserSignobj, success bool) {
	if success {
		l := &LoginSuccessObj{Name: user.Name, Result: success}
		b, err := json.Marshal(l)
		if err != nil {
			return
		}
		fmt.Fprintf(w, string(b))
		return
	} else {
		fmt.Fprintf(w, "", success)
	}
}

var store = sessions.NewCookieStore([]byte("super-secret"))

func main() {
	fs := http.FileServer(http.Dir("../../../dist")) // hookup frontend build

	// endpoints
	http.Handle("/", fs)
	http.HandleFunc("/login", loginRequest)
	http.HandleFunc("/signup", signupRequest)
	http.HandleFunc("/getAllTimes", getAllTimes)
	http.HandleFunc("/storeFlight", storeFlight)
	http.HandleFunc("/getDateFlight", getDateFlight)
	http.HandleFunc("/storeGridCoordinates", storeGridCoordinates)
	http.HandleFunc("/fetchGridCoordinates", fetchGridCoordinates)
	http.HandleFunc("/storeSegmentedFlight", storeSegmentedFlight)
	http.HandleFunc("/getFlightsWithinRadius", getFlightsWithinRadius)
	http.HandleFunc("/updateFlightTime", updateFlightTime)
	http.HandleFunc("/userProfile", userProfileHandler)
	http.HandleFunc("/getGrid", getGrid)

	// local port
	listenerErr := http.ListenAndServe(":3333", nil)
	fmt.Printf("%v", listenerErr)
}

func getGrid(w http.ResponseWriter, r *http.Request) {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		panic(err)
	}

	ctx := context.TODO()
	usersCollection := client.Database("fyp_test").Collection("grid")
	filter := bson.D{{"layer", "60"}}

	result, err := usersCollection.Find(ctx, filter)
	var results []bson.M
	if err = result.All(context.TODO(), &results); err != nil {
		panic(err)
	}

	var sendBack []string
	for _, doc := range results {
		jsonBytes, err := json.Marshal(doc)
		if err != nil {
			panic(err)
		}
		jsonString := string(jsonBytes)
		sendBack = append(sendBack, jsonString)
		sendBack = append(sendBack, ",")
	}
	sendBack[len(sendBack)-1] = ""
	sendBackString := fmt.Sprintf("%v", sendBack)

	fmt.Fprintf(w, sendBackString)
}

// Route endpoint, points to routes defined in frontend
func handle(w http.ResponseWriter, r *http.Request, name string) {
	fs := http.FileServer(http.Dir("../../../dist"))
	url := fmt.Sprintf("//%v", name)
	http.Handle(url, fs)
}

// Store the data of the segmentented flight
func storeSegmentedFlight(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}

	var d SegmentedFlightData
	err = json.Unmarshal(body, &d)

	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		panic(err)
	}

	slist := []Coordinate{}
	for _, val := range d.SegmentedList {
		t := val.(map[string]interface{})
		var lat = t["lat"].(string)
		var lng = t["lng"].(string)

		var coord Coordinate
		coord.Latitude = lat
		coord.Longitude = lng
		coord.Id = d.ID

		slist = append(slist, coord)
	}
	// array of coordinates which the flight path passes through
	slist = reverseSegments(slist)

	timesList := []TimeRecord{}
	for _, val := range d.SegmentedTimes {
		t := val.(map[string]interface{})
		var hour = t["hour"].(string)
		var minute = t["minute"].(string)

		var timeRecord TimeRecord
		timeRecord.Id = d.ID
		timeRecord.Hour = hour
		timeRecord.Minute = minute

		// array of times at which coordinate at the corresponding index in array are passed through
		timesList = append(timesList, timeRecord)
	}
	if len(d.Date) == 0 {
		d.Date = "0"
	}

	gridEntryPoint := bson.D{{"lat", d.EntryPoint.Latitude}, {"lng", d.EntryPoint.Longitude}}
	gridExitPoint := bson.D{{"lat", d.ExitPoint.Latitude}, {"lng", d.ExitPoint.Longitude}}
	gridDoc := bson.D{{"id", d.ID}, {"date", d.Date}, {"gridEntryPoint", gridEntryPoint}, {"gridExitPoint", gridExitPoint}, {"subGrid", d.SubGrid}, {"speed", d.Speed}, {"segments", slist}, {"times", timesList}, {"uav", d.UAVName}}

	err = insertDB(context.TODO(), client, gridDoc, "segmentedFlight")
}

// Check if Document passed in as BSON exists in database
func documentExists(collection *mongo.Collection, filter bson.M) (bool, error) {
	var result bson.M
	err := collection.FindOne(context.Background(), filter).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

// Update the flight time with the time sent in the request body
func updateFlightTime(w http.ResponseWriter, r *http.Request) {
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}

	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		panic(err)
	}

	var updateTime TimeUpdate
	err = json.Unmarshal(body, &updateTime)

	ctx := context.TODO()
	usersCollection := client.Database("fyp_test").Collection("flights")
	filter := bson.D{{"id", bson.D{{"$eq", updateTime.Id}}}}

	fullTime := updateTime.Hour + ":" + updateTime.Minute
	update := bson.D{{"$set", bson.D{{"date", updateTime.Date}, {"time", fullTime}}}}

	_, err = usersCollection.UpdateOne(ctx, filter, update)
	if err != nil {
		panic(err)
	}

	returnTime := fullTime + "," + updateTime.Date
	fmt.Fprintf(w, returnTime)
}

// Used to schedule flight paths
func getFlightsWithinRadius(w http.ResponseWriter, r *http.Request) {
	// Create Logfile for this function to see steps taken in the scheduling process
	file, err := os.Create("mylog.log")
	if err != nil {
		panic(err)
	}
	defer file.Close()

	// Set log output to the file
	log.SetOutput(file)

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}

	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		panic(err)
	}

	var queryDate QueryDate
	err = json.Unmarshal(body, &queryDate)

	//Query data and id are passed into the function, query date is used to find all other flights(segmented) that occur on this date
	//#############################################################################################################################
	//THIS SECTION FOCUSES ON SEGMENTED FLIGHTS ALREADY IN THE DATABASE FOR THIS DATE WHICH ARE COMPARED AGAINST. LIKE A "WATCHLIST" OF FLIGHTS
	ctx := context.TODO()
	usersCollection := client.Database("fyp_test").Collection("segmentedFlight")
	filterForAllFlights := bson.D{{"date", bson.D{{"$eq", queryDate.Date}}}}

	result, err := usersCollection.Find(ctx, filterForAllFlights)
	var results []bson.M
	if err = result.All(context.TODO(), &results); err != nil {
		panic(err)
	}

	var segs interface{}                            // segmented coordinates
	var times interface{}                           // segmented times
	var reservedFlightsOnThisDate []FlightSegmented // watchlist of flights already scheduled to be flown on this date

	for _, doc := range results {
		var timesStringList []string
		var coordStringList []Coordinate
		fmt.Printf("\nRESERVEDdoc:===:=== %v", doc)
		times = doc["times"]
		for _, x := range times.(primitive.A) {
			f := x.(primitive.M)
			var timeStr = f["hour"].(string) + ":" + f["minute"].(string)
			timesStringList = append(timesStringList, timeStr)
		}
		segs = doc["segments"]
		for _, y := range segs.(primitive.A) {
			f := y.(primitive.M)
			var c Coordinate
			c.Id = f["id"].(string)
			c.Latitude = f["latitude"].(string)
			c.Longitude = f["longitude"].(string)
			coordStringList = append(coordStringList, c)
		}
		var c FlightSegmented
		entry := doc["gridEntryPoint"]
		exit := doc["gridExitPoint"]
		var coordEntry Coordinate
		var coordExit Coordinate
		if entry != nil && exit != nil {
			mEntry := entry.(primitive.M)
			mExit := exit.(primitive.M)

			coordEntry.Latitude = mEntry["lat"].(string)
			coordEntry.Longitude = mEntry["lng"].(string)

			coordExit.Latitude = mExit["lat"].(string)
			coordExit.Longitude = mExit["lng"].(string)

			c.EntryPoint = coordEntry
			c.ExitPoint = coordExit
		}

		c.Id = doc["id"].(string)
		c.Date = doc["date"].(string)
		c.SubGrid = doc["subGrid"].(string)
		c.Speed = doc["speed"].(string)
		c.Coordinates = coordStringList
		c.Times = timesStringList
		reservedFlightsOnThisDate = append(reservedFlightsOnThisDate, c)
	}

	//reservedFlightsOnThisDate array contains the segmented data of all flights already reserved on this date
	log.Printf("Flights on this date:")
	for _, n := range reservedFlightsOnThisDate {
		log.Printf("Flight Number: %v", n.Id)
	}

	//################################################################################################################################
	//THIS SECTION BELOW FOCUSES ON THE INTENDED FLIGHT DATA, GETS THE INTENDED FLIGHT
	time.Sleep(2 * time.Second)
	filterIntendedFlight := bson.D{{"id", bson.D{{"$eq", queryDate.ID}}}}
	resultIntendedFlight, err := usersCollection.Find(ctx, filterIntendedFlight)
	if resultIntendedFlight.Next(context.Background()) { // cursor is not empty

	} else { // cursor is empty, segmented flight data is not in database
		return
	}

	// convert intended flight data into BSON
	var resultsIntendedFlight []bson.M
	if err = resultIntendedFlight.All(context.TODO(), &resultsIntendedFlight); err != nil {
		panic(err)
	}

	// marshal the intended flight data into a Flight Segment so it can be compared with flights in the watchlist
	var intendedTimesList []string
	var intendedCoordsList []Coordinate
	var intendedFlight FlightSegmented
	var uavName string = ""
	for _, d := range resultsIntendedFlight {
		uavName = d["uav"].(string)
		t := d["times"]
		for _, a := range (t).(primitive.A) {
			f := a.(primitive.M)
			var timeStr = f["hour"].(string) + ":" + f["minute"].(string)
			intendedTimesList = append(intendedTimesList, timeStr)
		}
		s := d["segments"]
		for _, b := range (s).(primitive.A) {
			f := b.(primitive.M)
			var c Coordinate
			c.Id = f["id"].(string)
			c.Latitude = f["latitude"].(string)
			c.Longitude = f["longitude"].(string)
			intendedCoordsList = append(intendedCoordsList, c)
		}

		intendedFlight.Id = d["id"].(string)
		intendedFlight.Date = d["date"].(string)
		intendedFlight.SubGrid = d["subGrid"].(string)
		intendedFlight.Speed = d["speed"].(string)
		intendedFlight.Coordinates = intendedCoordsList
		intendedFlight.Times = reverseTimes(intendedTimesList)
		fmt.Printf("\nIntended Object-->%v", intendedFlight)

	}
	if len(results) == 0 { //if no flights on this date
		fmt.Fprintf(w, "%v %v", intendedFlight.Times[0], intendedFlight.SubGrid)
		return
	}
	log.Println("\n#################################\n ")
	//##########################################################################################################################
	// Check that the chosen UAV is not scheduled to fly at this time in another flight
	if checkUAVAvailability(uavName, intendedFlight) {
		fmt.Fprint(w, "Cannot fly, UAV scheduled for use in an alternative path at this time")
	}

	// Reduce the watchlist flight Set to check only flights which occur in the same subgrid as the intended flight
	var flightWatchList []FlightSegmented
	log.Println("Checking flights occuring within the same subgrid(altitude) as the intended flight ")
	for _, f := range reservedFlightsOnThisDate {
		if intendedFlight.Id != f.Id {
			if checkSubGridLevel(intendedFlight.SubGrid, f.SubGrid) {
				log.Printf("Flight Number %v occurs within the same subgrid", f.Id)
				flightWatchList = append(flightWatchList, f) //flights occuring in the same sub grid on the same date
			}
		}
	}

	log.Println("\n#################################\n ")
	var unavailableTimes = schedule(intendedFlight, flightWatchList)
	fmt.Printf("\nOriginal time check %v  intended: %v", unavailableTimes, intendedFlight.Times)
	if len(unavailableTimes) > 0 {
		// if there is a contention detected in the current sub grid, check availability in other subgrids
		log.Printf("\n* Contention possible in current grid, change to a different subgrid(altitude) *\n\n")
		availableGrids, gridIsEmpty := checkOtherSubGridAvailability(intendedFlight.SubGrid)
		fmt.Printf("received after function call Empty grids:%v %v", availableGrids, gridIsEmpty)
		if gridIsEmpty {
			//if the grid is empty schedule in the grid closest to the flights speed and return success
			closestGrid := getClosestGridToCurrentSpeed(availableGrids, intendedFlight.Speed)
			intendedFlight.SubGrid = closestGrid
			updateFlight(intendedFlight)

			log.Printf("---> Flight path available at intended time in subgrid %v", closestGrid)
			log.Printf("---> SCHEDULED flight at %v in sub grid %v ", intendedFlight.Times[len(intendedFlight.Times)-1], intendedFlight.SubGrid)
			fmt.Printf("Scheduled flight at %v in sub grid %v ", intendedFlight.Times[0], intendedFlight.SubGrid)
			fmt.Fprintf(w, "%v %v %v %v", intendedFlight.Times[0], intendedFlight.Times[len(intendedFlight.Times)-1], intendedFlight.SubGrid, intendedFlight.Speed)
		} else {
			//if other grids are not empty, wait for 5 minutes in current grid
			//add 5 minutes onto each of these times and then rerun the schedule function in  the currect sub grid
			var fiveMinuteWaitSegments []string
			for _, segTime := range intendedFlight.Times {
				if len(segTime) < 5 {
					segTime = segTime[0:3] + "0" + segTime[3:4]
				}
				timePlusFive, err := time.Parse("15:04", segTime)
				if err != nil {
					fmt.Printf("Error parsing %v as a time: %v", timePlusFive, err)
					return
				}
				timePlusFive = timePlusFive.Add(5 * time.Minute)
				timeStr := timePlusFive.String()
				timeStr = timeStr[10:16]
				fiveMinuteWaitSegments = append(fiveMinuteWaitSegments, timeStr)
			}
			intendedFlight.Times = fiveMinuteWaitSegments
			log.Printf("\n\n* No other subgrid altitude available, delayed flight start time by 5 minutes *\n")
			unavailableTimes = schedule(intendedFlight, flightWatchList) //need to update time stored

			if len(unavailableTimes) == 0 {
				// if no contentions detected after delaying for 5 minutes in current sub grid return success
				log.Printf("---> SCHEDULED flight at %v in sub grid %v after 5 minute delay ", intendedFlight.Times[0], intendedFlight.SubGrid)
				fmt.Fprintf(w, "%v %v %v %v", intendedFlight.Times[0], intendedFlight.Times[len(intendedFlight.Times)-1], intendedFlight.SubGrid, intendedFlight.Speed)
			} else {
				// else enqueue the flight at nearest border node if density of flights in the grid is high
				if getGridDensity(intendedFlight) > densityThreshold {
					success, f := addToQueue(intendedFlight)
					if success {
						// if the queue is not full
						unavailableTimes = schedule(f, flightWatchList)
						if len(unavailableTimes) == 0 {
							fmt.Fprintf(w, "%v %v %v %v", intendedFlight.Times[0], intendedFlight.Times[len(intendedFlight.Times)-1], intendedFlight.SubGrid, intendedFlight.Speed)
						} else {
							fmt.Fprintf(w, "none")
						}
					} else {
						// if the queue is full
						fmt.Fprintf(w, "none")
					}
				} else {
					fmt.Fprintf(w, "none")
				}
			}
		}

	} else { //if no collisions int he intended grid, it good
		log.Println("---> No contentions predicted with intended flight path and time")
		log.Printf("---> SCHEDULED flight at %v in sub grid %v ", intendedFlight.Times[len(intendedFlight.Times)-1], intendedFlight.SubGrid)
		fmt.Fprintf(w, "%v %v %v %v", intendedFlight.Times[0], intendedFlight.Times[len(intendedFlight.Times)-1], intendedFlight.SubGrid, intendedFlight.Speed)
	}

}

// Return the ratio of flights scheduled in the grid with the size of the grid
func getGridDensity(flight FlightSegmented) float64 {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		panic(err)
	}
	ctx := context.TODO()

	sTime := flight.Times[0]
	eTime := flight.Times[len(flight.Times)-1]
	layout := "15:04"

	// parse the time string using the layout
	startTime, err := time.Parse("2006-01-02 "+layout, "0001-01-01 "+sTime)
	endTime, err := time.Parse("2006-01-02 "+layout, "0001-01-01 "+eTime)

	filter := bson.D{{"date", flight.Date}, {"times", bson.M{"$elemMatch": bson.M{"$gte": startTime.Format("15:04:05"), "$lte": endTime.Format("15:04:05")}}}}
	gridCollection := client.Database("fyp_test").Collection("segmentedFlight")
	results, err := gridCollection.Find(ctx, filter)
	if err != nil {
		panic(err)
	}
	defer results.Close(context.Background())

	numberOfFlights := 0.0
	for results.Next(context.Background()) {
		numberOfFlights++
	}

	//###########################################
	filter = bson.D{{}}
	gridCollection = client.Database("fyp_test").Collection("grid")
	results, err = gridCollection.Find(ctx, filter)
	if err != nil {
		panic(err)
	}
	defer results.Close(context.Background())

	numberOfNodes := 0.0
	for results.Next(context.Background()) {
		numberOfNodes++
	}
	//get all the flight which are occuring at this time inthe the grid and divide it by the size of the grid
	return numberOfNodes / numberOfFlights
}

// Return true if there is space for flight to be enqueued
func addToQueue(flight FlightSegmented) (bool, FlightSegmented) {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		panic(err)
	}

	queueLocation := flight.EntryPoint
	queueCollection := client.Database("fyp_test").Collection("queues")

	queueSize := getQueueSize(client, queueCollection, queueLocation)
	if queueSize < queueLimit {
		//take the time the flight is being enqueued at and add the amount of time it will remain in the queue
		timeEnqueued := time.Now()

		minutesEnqueued := (queueReleaseInterval / 60) * queueSize //time spent waiting in the queue depending on the queue size
		newTime := timeEnqueued.Add(time.Duration(minutesEnqueued))
		timeEnqueuedString := newTime.Format("2006-01-02 15:04:05")

		flight.Times = updateFlightTimes(flight, minutesEnqueued) //update the segmented times to include time spent waiting in the queue
		queueItem := QueueItem{                                   //store the flight and the time it is being enqueued at
			Flight:       flight,
			TimeEnqueued: timeEnqueuedString,
		}

		ctx := context.TODO()
		filter := bson.D{{"queueCoord", queueLocation}}
		enqueue := bson.M{"$push": bson.D{{"queue", queueItem}}}

		_, err = queueCollection.UpdateOne(ctx, filter, enqueue)
		if err != nil {
			panic(err)
		}
		return true, flight
	}
	return false, flight

}

// Return the number of flights enqueued at the queue located at coordinate inputted
func getQueueSize(client *mongo.Client, collection *mongo.Collection, queue Coordinate) int {
	var size string

	ctx := context.TODO()
	filter := bson.D{{"queueCoord", queue}}
	err := collection.FindOne(ctx, filter).Decode(&size)
	if err != nil {
		panic(err)
	}

	num, err := strconv.Atoi(size)
	return num
}

// Update the segmented flight subgrid and date of the inputted flight in the database
func updateFlight(flight FlightSegmented) {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		panic(err)
	}

	ctx := context.TODO()
	usersCollection := client.Database("fyp_test").Collection("segmentedFlight")
	filter := bson.D{{"id", bson.D{{"$eq", flight.Id}}}}

	update := bson.D{{"$set", bson.D{{"id", flight.Id}, {"subGrid", flight.SubGrid}, {"date", flight.Date}}}}

	result, err := usersCollection.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Updated %v", result)
}

// Update the time segments of a flight by adding the number of minutes passed in to each time
func updateFlightTimes(flight FlightSegmented, timeToAdd int) []string {
	var updatedFlightTimes []string
	duration := timeToAdd

	// Loop through the list of times and update each one
	for _, timeStr := range flight.Times {
		t, err := time.Parse("15:04", timeStr)
		if err != nil {
			fmt.Printf("Error parsing time string: %v\n", err)
			continue
		}

		// Add the desired duration to the time.Time object
		newT := t.Add(time.Duration(duration) * time.Minute)
		newTStr := newT.Format("15:04")
		updatedFlightTimes = append(updatedFlightTimes, newTStr)
	}
	return updatedFlightTimes
}

// Check for availability of t=other subgrids
func checkOtherSubGridAvailability(gridLevel string) ([]string, bool) {
	fmt.Println("\n\n*Checking other grids: *")
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		panic(err)
	}

	collection := client.Database("fyp_test").Collection("segmentedFlight")

	layers := [3]string{LAYER_ONE, LAYER_TWO, LAYER_THREE}
	var availableGrids []string
	isEmpty := false //returns true if any of the other grids is empty
	for _, l := range layers {
		if l != gridLevel { //only check grids that haven't been checked already
			filter := bson.M{"subGrid": l}
			cursor, err := collection.Find(context.Background(), filter)
			if err != nil {
				fmt.Println(err)
			}
			defer cursor.Close(context.Background())

			if cursor.Next(context.Background()) {
				fmt.Println("CURSOR CHECK-->cursor not empty")
			} else {
				// cursor is empty
				fmt.Println("CURSOR CHECK-->cursor is empty")
				availableGrids = append(availableGrids, l)
				isEmpty = true
			}

			if err = cursor.Err(); err != nil {
				if err == mongo.ErrNoDocuments { //if grid is empty
					fmt.Printf("\nSubGrid empty %v\n", l)
					isEmpty = true
				}
				fmt.Println(err)
			} else {
				fmt.Printf("%v Sub grid not empty", availableGrids)
				continue
			}
			if isEmpty {
				availableGrids = append(availableGrids, l)
			}
		}

	}
	return availableGrids, isEmpty
}

//For each segmented coordinate of intended flight, check all other segmented flights coordinates to see if any contain the same coordinates
//If there is a coordinate macth, check what time both occur at this coordinate
func schedule(intendedFlight FlightSegmented, flightWatchList []FlightSegmented) []string {
	var unavailableTimes []string
	log.Printf("These are the coordinates of the intended flight to check for a collision at:  %v ", intendedFlight.Coordinates)

	for i := 0; i < len(intendedFlight.Coordinates); i++ { //for segmented coord in intended flight path
		for _, val := range flightWatchList {
			g := intendedFlight.Coordinates[i]
			log.Printf("Checking for possible coordinate contentions with Flight Number %v at coordinate %v ", val.Id, g)
			ifCollisions := checkCoordinatesRadius(g, val) //index, times at which coordinate collisions will occur
			if ifCollisions != 0.0 {
				collisionTimeOfIntendedFlight := intendedFlight.Times[i]
				collisionTimeOfResrvedFlight := val.Times[ifCollisions]
				if checkTimeCollisions(collisionTimeOfIntendedFlight, collisionTimeOfResrvedFlight, intendedFlight.Date) {
					unavailableTimes = append(unavailableTimes, collisionTimeOfIntendedFlight)
					log.Printf("  --> * Timing contention AND coordinate contention at %v at %v *", collisionTimeOfIntendedFlight, g)
					break
				} else {
					log.Printf("   --->Coordinate contention but no timing collision")
				}
			} else {
				fmt.Printf("\nNO Coordinate COLLISIONS PREDICTED")
			}
		}
	}
	return unavailableTimes
}

//returns true if one of the reserved coordinates is within 120m of one of the indended coordinate
func checkCoordinatesRadius(intended Coordinate, reserved FlightSegmented) int {
	intendedLat, err := strconv.ParseFloat(intended.Latitude, 64)
	if err != nil {
		fmt.Println("can't convert")
	}
	intendedLng, err := strconv.ParseFloat(intended.Longitude, 64)
	if err != nil {
		fmt.Println("can't convert")
	}
	for j, flightCoord := range reserved.Coordinates {
		reservedLat, err := strconv.ParseFloat(flightCoord.Latitude, 64)
		if err != nil {
			fmt.Println("can't convert")
		}
		reservedLng, err := strconv.ParseFloat(flightCoord.Longitude, 64)
		if err != nil {
			fmt.Println("can't convert")
		}
		if calculateCoordDistance(intendedLat, intendedLng, reservedLat, reservedLng) < .120 { //if two coordinates are within 120 metres of eachother
			log.Printf("---> Coordinate contention at  %v %v", intendedLat, intendedLng)
			fmt.Printf("\n\nReturned True for these coordinates, flight IDs (%v %v) \tcoords: (%v %v)\t(%v %v) \n", intended.Id, reserved.Id, intendedLat, intendedLng, reservedLat, reservedLng)
			return j //return time that the collision occured at

		}
	}
	return 0.0
}

// *THIS FUNCTION IS FREELY AVAILABLE AND HAS BEEN TAKEN FROM https://www.geodatasource.com/developers/go	*
func calculateCoordDistance(lat1 float64, lng1 float64, lat2 float64, lng2 float64) float64 {
	const PI float64 = 3.141592653589793

	radlat1 := float64(PI * lat1 / 180)
	radlat2 := float64(PI * lat2 / 180)

	theta := float64(lng1 - lng2)
	radtheta := float64(PI * theta / 180)

	dist := math.Sin(radlat1)*math.Sin(radlat2) + math.Cos(radlat1)*math.Cos(radlat2)*math.Cos(radtheta)

	if dist > 1 {
		dist = 1
	}

	dist = math.Acos(dist)
	dist = dist * 180 / PI
	dist = dist * 60 * 1.1515
	dist = dist * 1.609344 //Convert to km

	return dist
}

// Return True if times are greater than the safety margin
func checkTimeCollisions(intendedTime string, reservedTime string, date string) bool {
	fmt.Printf("both times", reservedTime, intendedTime)
	if len(intendedTime) < 5 {
		intendedTime = intendedTime[0:3] + "0" + intendedTime[3:4]
	}
	if len(reservedTime) < 5 && len(reservedTime) > 3 {
		reservedTime = reservedTime[0:3] + "0" + reservedTime[3:4]
	}
	if len(reservedTime) <= 3 {
		panic("TIME IS TOO SHORT")
	}

	fullIntended := date + " " + intendedTime + ":00"
	layout := "2006-01-02 15:04:05" // Example layout string
	t, err := time.Parse(layout, fullIntended)
	if err != nil {
		fmt.Println("Error parsing time:", err)
	}
	intendedEpochTime := t.Unix()

	fullReserved := date + " " + reservedTime + ":00"
	f, err := time.Parse(layout, fullReserved)
	if err != nil {
		fmt.Println("Error parsing time:", err)
	}
	reservedEpochTime := f.Unix()

	fmt.Printf("Checking %v %v", fullIntended, fullReserved)

	//check if UAV passes through this coordinate three minutes(60*3=180) safety margin befor or after the intended flight, this ensures no collision if there is an unexpected delay
	if math.Abs(float64(reservedEpochTime-intendedEpochTime)) <= float64(safetyMargin) {
		log.Printf("-->Timing contention at %v %v, times too close in proximity", intendedTime, reservedTime)
		return true
	}
	if math.Abs(float64(intendedEpochTime-reservedEpochTime)) <= float64(safetyMargin) {
		log.Printf("-->Timing contention at %v %v, times too close in proximity", intendedTime, reservedTime)
		return true
	}

	if intendedTime == reservedTime { //need to expand this 3 minutes either side(before and after)
		log.Printf("-->Timing contention at %v %v", intendedTime, reservedTime)
		return true
	}

	fmt.Printf("\nNO TIME COLLISION --> %v\n", math.Abs(float64(reservedEpochTime-intendedEpochTime)))
	return false
}

// Return True if both sub grid altitudes are equal
func checkSubGridLevel(intendedSubGrid string, reservedSubGrid string) bool {
	if intendedSubGrid == reservedSubGrid {
		return true
	}
	return false
}

// Return the grid with the closest speed range permissable to the speed inputted
func getClosestGridToCurrentSpeed(grid []string, speed string) string {
	cursor := math.Inf(1)
	diffGrid := ""
	if len(grid) > 1 {
		speedInt, err := strconv.ParseFloat(speed, 32)
		if err != nil {
			fmt.Println("Error converting speed to int value")
		}
		for i := 0; i < len(grid); i++ {
			gridInt, err := strconv.ParseFloat(grid[i], 32)
			if err != nil {
				fmt.Println("Error converting grid to int value")
			}
			diff := math.Abs(gridInt - speedInt)

			if diff < cursor {
				cursor = diff
				diffGrid = grid[i]
			}
		}
		return diffGrid
	} else {
		return grid[0]
	}

}

// Retrun true if the UAV passed in is not already scheduled at this time and date
func checkUAVAvailability(uavName string, intendedFlight FlightSegmented) bool {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		panic(err)
	}

	collection := client.Database("fyp_test").Collection("flights")

	startTime := intendedFlight.Times[0]
	endTime := intendedFlight.Times[len(intendedFlight.Times)-1]
	id := intendedFlight.Id

	filter := bson.M{"uav": uavName, "id": id, "date": bson.M{"$gt": startTime, "$lt": endTime}}
	cursor, err := collection.Find(context.Background(), filter)
	if err != nil {
		fmt.Println(err)
	}
	defer cursor.Close(context.Background())

	if cursor.Next(context.Background()) {
		// cursor is not empty
		return true
	}
	return false
}

// Formate time
func dateTimeCheck(hour string, minute string) {
	if len(minute) < 2 {
		minute = "0" + minute
	}

}

// Reverse the segmented coordinates array
func reverseSegments(s []Coordinate) []Coordinate {
	for i, j := 0, len(s)-1; i < j; i, j = i+1, j-1 {
		s[i], s[j] = s[j], s[i]
	}
	return s
}

// Reverse the segmented times array
func reverseTimes(s []string) []string {
	for i, j := 0, len(s)-1; i < j; i, j = i+1, j-1 {
		s[i], s[j] = s[j], s[i]
	}
	return s
}

// Return the grid coordinates stored in the grid database to the frontend
func fetchGridCoordinates(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		panic("GET method not permitted")
	} else {
		r.ParseForm()
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}
	log.Println("BODY fetch:", string(body))

	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		panic(err)
	}

	ctx := context.TODO()
	usersCollection := client.Database("fyp_test").Collection("grid")
	filter := bson.M{}
	result, err := usersCollection.Find(ctx, filter)
	var results []bson.M
	if err = result.All(context.TODO(), &results); err != nil {
		panic(err)
	}

	var temp []interface{}
	for _, doc := range results {
		temp = append(temp, doc)
	}
	c := &GridofCoordinates{
		Coordinates: temp,
	}

	j, err := json.Marshal(c.Coordinates)
	if err != nil {
		fmt.Println(err)
		return
	}

	jstr := string(j)
	fmt.Printf("%v<---jstr", jstr)

	fmt.Printf("\n'%v' matching docs found\n", len(results))
	fmt.Fprintf(w, jstr)

}

// Store the grid coordinates sent in request in the database
func storeGridCoordinates(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		panic("GET method not permitted")
	} else {
		r.ParseForm()
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}
	log.Println("BODY grid storeGridCoords:", string(body))

	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		panic(err)
	}

	usersCollection := client.Database("fyp_test").Collection("grid")
	filter := bson.M{}
	_, err = usersCollection.DeleteMany(context.TODO(), filter) //delete grid coordinates used in older grids
	if err != nil {
		panic(err)
	}

	borderCollection := client.Database("fyp_test").Collection("queues")
	filter = bson.M{}
	_, err = borderCollection.DeleteMany(context.TODO(), filter) //delete grid coordinates used in older grids
	if err != nil {
		panic(err)
	}

	var grid GridofCoordinates
	err = json.Unmarshal(body, &grid)

	GRID_INCREMENT++
	var gridID = fmt.Sprintf("%d", GRID_INCREMENT)

	for _, layer := range grid.Layers {
		var coord Coordinate
		for _, val := range grid.Coordinates {
			//convert from interface to map[string]interface{}
			t := val.(map[string]interface{})
			coord.Id = t["id"].(string)
			coord.Latitude = t["lat"].(string)
			coord.Longitude = t["lng"].(string)

			//build mongo record to store all coordinates in the grid
			gridCoord := bson.D{{"lat", coord.Latitude}, {"lng", coord.Longitude}}
			gridDoc := bson.D{{"id", coord.Id}, {"coordinate", gridCoord}, {"layer", layer}, {"gridID", gridID}}
			err = insertDB(context.TODO(), client, gridDoc, "grid")
			if err != nil {
				panic(err)
			}

			//assign an empty queue to each border node
			if containsBorderNode(coord, grid.BorderCoords) {
				var queueOfFlights []FlightSegmented
				queueDoc := bson.D{{"id", coord.Id}, {"queueCoord", coord}, {"layer", layer}, {"gridID", gridID}, {"queueReleaseInterval", queueReleaseInterval}, {"queue", queueOfFlights}}
				err = insertDB(context.TODO(), client, queueDoc, "queues")
				if err != nil {
					panic(err)
				}
			}

		}

	}
	fmt.Fprint(w, "stored")
}

// Return true if the coordinate passed in has the same lat or lng val as the max/min lng lat values for this grid
func containsBorderNode(c Coordinate, slist []string) bool {
	for _, val := range slist {
		if c.Latitude == val {
			return true
		}
		if c.Longitude == val {
			return true
		}
	}
	return false
}

// Return the start times of all flights on the date requested in the request
func getDateFlight(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		panic("GET method not permitted")
	} else {
		r.ParseForm()
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}
	log.Println("BODY:", string(body))

	// connect to client
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		panic(err)
	}

	var queryDate QueryDate
	err = json.Unmarshal(body, &queryDate)

	ctx := context.TODO()
	usersCollection := client.Database("fyp_test").Collection("flights")
	filter := bson.D{{"date", bson.D{{"$eq", queryDate.Date}}}}

	result, err := usersCollection.Find(ctx, filter)
	var results []bson.M
	if err = result.All(context.TODO(), &results); err != nil {
		panic(err)
	}

	for _, d := range results {
		fmt.Printf("MATCHING DOC: %v\n", d)
	}

	var times []interface{} // for the dates
	var time []interface{}  //for the actual hours and minutes
	for _, doc := range results {
		times = append(times, doc["date"])
		time = append(time, doc["time"])
	}

	//convert times (type interface) to type string
	var timesStr []string
	for _, v := range times {
		valStr := fmt.Sprint(v)
		timesStr = append(timesStr, valStr)
	}

	var timeStr []string
	for _, x := range time {
		valStr := fmt.Sprint(x)
		timeStr = append(timeStr, valStr)
	}

	var pairs []string
	for i, _ := range timeStr {
		timeval := timeStr[i]
		timesval := timesStr[i]
		timeval = timeval + " " + timesval
		pairs = append(pairs, timeval)
		fmt.Fprintf(w, timeval+",")
	}
}

// Store the flight details entered by the user on thr frontend in the database
func storeFlight(w http.ResponseWriter, r *http.Request) {
	if r.Method == "GET" {
		panic("GET method not permitted")
	} else {
		r.ParseForm()
	}
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}

	// connect to client
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		panic(err)
	}

	// unmarshal the json into a Flight struct
	var flight Flight
	err = json.Unmarshal(body, &flight)

	session, err := store.Get(r, "session-name")
	if err != nil {
		http.Error(w, "Unauthorized name", http.StatusUnauthorized)
		return
	}

	userID, ok := session.Values["user_id"].(string)
	fmt.Printf("user_id %v", userID)
	if !ok {
		http.Error(w, "Unauthorized user id", http.StatusUnauthorized)
		return
	}

	userIDstring := userID
	// Retrieve the user's data from the database
	_, err = getUserByID(userIDstring)
	if err != nil {
		return
	}

	////////////////////////////////////////////////////

	ftime := flight.Hour + ":" + flight.Minute
	startCoord := bson.D{{"lat", flight.Srclat}, {"lng", flight.Srclng}}
	destCoord := bson.D{{"lat", flight.Destlat}, {"lng", flight.Destlng}}
	flightDoc := bson.D{{"id", flight.ID}, {"userID", userIDstring}, {"date", flight.Date}, {"time", ftime}, {"startCoord", startCoord}, {"destCoord", destCoord}, {"endTime", flight.EndTime}, {"speed", flight.Speed}, {"corridor", flight.Corridor}, {"subGridLayer", flight.Subgrid}, {"altitude", flight.Altitude}, {"orientation", flight.Orientation}, {"drone", flight.Drone.Name}}
	err = insertDB(context.TODO(), client, flightDoc, "flights")

	droneDoc := bson.D{{"name", flight.Drone.Name}, {"model", flight.Drone.Model}, {"weight", flight.Drone.Weight}}
	err = insertDB(context.TODO(), client, droneDoc, "drones")

	fmt.Fprint(w, "stored")
}

// Return the start time of all flights in the database
func getAllTimes(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI("mongodb://localhost:27017"))
	if err != nil {
		panic(err)
	}

	ctx := context.TODO()

	usersCollection := client.Database("fyp_test").Collection("flights")
	filter := bson.M{}

	result, err := usersCollection.Find(ctx, filter)
	var results []bson.M
	if err = result.All(context.TODO(), &results); err != nil {
		panic(err)
	}

	var times []interface{} // for the dates
	var time []interface{}  //for the actual hours and minutes
	for _, doc := range results {
		times = append(times, doc["date"])
		time = append(time, doc["time"])
	}

	//convert times (type interface) to type string
	var timesStr []string
	for _, v := range times {
		valStr := fmt.Sprint(v)
		timesStr = append(timesStr, valStr)
	}

	var timeStr []string
	for _, x := range time {
		valStr := fmt.Sprint(x)
		timeStr = append(timeStr, valStr)
	}

	var pairs []string
	for i, _ := range timeStr {
		timeval := timeStr[i]
		timesval := timesStr[i]
		timeval = timeval + " " + timesval
		pairs = append(pairs, timeval)
		fmt.Fprintf(w, timeval+",")
	}

}
