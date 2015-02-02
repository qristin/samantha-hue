if (!('webkitSpeechRecognition' in window)) {
  alert('This demo only works in a relative new version of Chrome.');
}


var recognition = new webkitSpeechRecognition();
recognition.lang = "nl-NL";
recognition.continuous = true;
recognition.interimResults = true;
recognition.maxAlternatives = 1; //default 1, don't care in more

var source = Rx.Observable.fromEvent(recognition, "result");//wire the onresult event as an observable stream
source.map(function(event){
	console.log("recognized something...");

	/*
		the results contain all previous transcriptions 
		thus we take the last one. 
	*/
	var lastResultIndex = event.results.length - 1;
	var bestTranscriptionIndex = 0;
	return event.results[lastResultIndex][bestTranscriptionIndex].transcript;
})
.filter(function(transcript){	
	return transcript.lastIndexOf("weer in") > -1// are we intersted in this?
})
/*
 throttleWithTimeout only returns the last results after 20 ms. 
 if we get multiple results quickly after eachother all will 
 be ignored untill we have a 20ms silence on the events
*/
.throttleWithTimeout(20) //ms
.map(function(transcript){
	/*
		extract city from transcript by stripping 
		everything before including the last 'weer in'.

		Due to the fact that we are continuous listening 
		it is possible that we get multiple recognitions 
		within one transcript ('hoe is het weer in spanje hoe is het weer in amsterdam') thus the lastIndexOf.
	*/
	var city = transcript.substring(7 + transcript.lastIndexOf("weer in")).toLowerCase();
	//console.log('transcript', transcript, 'city:', city);
	return city.trim();
})
.filter(function(city){
	return city != '';//no empty recognised 'weer in' strings
})
.distinctUntilChanged()//dont care about sequential amsterdams
.throttleFirst(4 * 1000) // do not give multiple hits if we ask them within seconds of eachother
.flatMap(getWeatherData) //get weather data from API, return type of weather
.subscribe(
	function(weather){
		console.log("weather:",weather);
	recognition.continuous = false;
	recognition.continuous = true;

		//go and do the light stuff
		if(weather == "sun"){
			setSunny();
			document.getElementById("weather").innerHTML = "Sunny";
		}
		else if(weather == "clouds"){
			setCloudy();
			document.getElementById("weather").innerHTML = "Cloudy";
		}
		else if(weather == "rain"){
			setRainy();
			document.getElementById("weather").innerHTML = "Rainy";
		}
	},
	function(error){
		console.error(error);
	});

recognition.onstart = function(){
	console.log("starting to listen...");
};

recognition.onerror = function(event){
	$("#error").show();
	$('#weather').hide();
	$('#city').hide();	
	console.error("something error happen", event);
};

recognition.onend = function(){
	$("#error").show();
	$('#weather').hide();
	$('#city').hide();
	console.log('NANANA IM NOT LISTENING ANYMORE!');
};

   recognition.onspeechend = function(event) {
        console.log('onspeechend', event);
      };


function getWeatherData(city){
	console.log("going to find weather for ", city);
	document.getElementById("city").innerHTML = "In " + city + " is het: " ;
	return $.get('http://api.openweathermap.org/data/2.5/weather?q='+city+'&units=metric')
	.then(function(data){
		if(!data || !data.weather)
			return "";

		if(data.weather[0].main.toLowerCase().indexOf("rain") > -1)
			return "rain";
		else if(data.weather[0].main.toLowerCase().indexOf("rain") > -1)
			return "rain";
		else if(data.weather[0].main.toLowerCase().indexOf("clear") > -1)
			return "sun";
		else 
			return "clouds";
	});
}

$(document).ready(function(){
	recognition.start();
});