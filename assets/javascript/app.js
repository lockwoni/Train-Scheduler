//SETUP VARIABLES
/**Current time**/

var currentTime = moment().format('HH:mm');
var trainName = "";
var dest = "";
var firstTime = "";
var frequency = 0;

/**Initialize Firebase**/
var config = {
  apiKey: "AIzaSyCkuNzN_b_J1x-6griN-Vjn4qmVS8p6aX8",
  authDomain: "train-scheduler-76bec.firebaseapp.com",
  databaseURL: "https://train-scheduler-76bec.firebaseio.com",
  storageBucket: "train-scheduler-76bec.appspot.com",
  messagingSenderId: "682548763881"
};

firebase.initializeApp(config);

/**Create a variable to reference the database**/
var database = firebase.database();

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//FUNCTIONS
/**Function for adding train times**/
function submitForm() {
	$("#add-train-btn").on("click", function(event) {
		event.preventDefault();

		// Grabbing user input
		trainName = $("#train-name-input").val().trim();
		dest = $("#destination-input").val().trim();
		firstTime = $("#first-time-input").val().trim();
		frequency = $("#frequency-input").val().trim();

		// Creating local "temporary" objects for holding train data
		var newTrain = {
			name: trainName,
			dest: dest,
			time: firstTime,
			freq: frequency
		};

		// Uploading train data to the database
		database.ref().push(newTrain);

		// Console logging everything
		console.log(newTrain.name);
		console.log(newTrain.dest);
		console.log(newTrain.time);
		console.log(newTrain.freq);

		// Clearing the form
		$("#train-name-input").val("");
		$("#destination-input").val("");
		$("#first-time-input").val("");
		$("#frequency-input").val("");
	});
};

/**Function for adding data in Firebase to the webpage**/
function trainTable() {
	database.ref().on("child_added", function(childSnapshot, prevChildKey) {
		console.log(childSnapshot.val());

		// Storing everything into a variable
		trainName = childSnapshot.val().name;
		dest = childSnapshot.val().dest;
		firstTime = childSnapshot.val().time;
		frequency = childSnapshot.val().freq;

		// Calculating next train (pushing the first train back one year to ensure it comes before the current time)
  	var convertedFirstTime = moment(firstTime, 'HH:mm').subtract(1, 'years');
  	console.log("First: " + firstTime);
  	console.log(convertedFirstTime);

  	///// Difference between current time & first train
  	var diffTime = moment().diff(moment(convertedFirstTime), "minutes");
  	console.log("Difference in Time: " + diffTime);

  	///// Time apart (remainder)
  	var tRemainder = diffTime % frequency;
  	console.log(tRemainder);

  	///// Minutes until the train
  	var minAway = frequency - tRemainder;
  	console.log("Minutes to train: " + minAway);

  	///// Next train
  	var nextTrain = moment().add(minAway, "minutes");
  	console.log("Arrival time: " + moment(nextTrain).format("HH:mm"));

		// Adding each train's data into the table
		$("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + dest + "</td><td>" + frequency + "</td><td>" + moment(nextTrain).format("HH:mm") + "</td><td>" + minAway + "</td></tr>")
	});
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
//MAIN PROCESSES
$(document).ready(function() {
 	submitForm();
 	trainTable();
 	console.log("Time: " + currentTime);
 });