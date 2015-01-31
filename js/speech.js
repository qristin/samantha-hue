if (!('webkitSpeechRecognition' in window)) {
  alert('hallo, je hebt geen webkitSpeechRecognition beschikbaar. upgrade je browser ');
}


var recognition = new webkitSpeechRecognition();
recognition.lang = "nl-NL";
recognition.continuous = true;
recognition.interimResults = true;
recognition.maxAlternatives = 1; //default 1

var source = Rx.Observable.fromEvent(recognition, "result");
source.map(function(event){
	console.log("got something?");
	var totalTranscripts = event.results.length;
	var transcript = event.results[totalTranscripts-1][0].transcript;

/*
	event.results.filter(function(transcriptionResult){
		return transcriptionResult.

	});
*/
	return transcript;
})
.filter(function(transcript){
	// are we intersted in this?
	return transcript.lastIndexOf("weer in") > -1
})
.throttleWithTimeout(20) // ms
.map(function(transcript){
	//extract city
	var city = transcript.substring(7 + transcript.lastIndexOf("weer in")).toLowerCase();
	/* city = city.replace("wat", "");
	city = city.replace("is", "");
	city = city.replace("het", "");
	city = city.replace("weer", "");
	city = city.replace("in", "");*/
	console.log('transcript', transcript, 'city:', city);
	return city.trim();
})
.filter(function(city){
	return city != '';//no empty recognised 'weer in' strings
})
.distinctUntilChanged()//dont care about sequential amsterdams
.throttleFirst(4000) // milliseconds
.flatMap(getWeatherData) //get weather data
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
	console.error("something error happen", event);
};

recognition.onend = function(){
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
			return "sun";

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