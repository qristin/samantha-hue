var normalState;
//getWeatherData();
//getLampState();

function getRequest(url, callback) {
	$.get(url, callback);
}

function putRequest(url,state) {
 	return $.ajax({
    url: url ,
    type: 'PUT',
    data: state,
    contentType: 'json'
  });
}

function getLampState(){
	var url = 'http://192.168.1.10/api/newdeveloper/lights/1'
	getRequest(url, function(data) {
		normalState = data;
		console.log(data);
	});
}

function setLightGroup(state) {
	var url = 'http://192.168.1.10/api/newdeveloper/groups/0/action'
	return putRequest(url,state);
}

function setLightLamp(lamp,state) {
	var url = 'http://192.168.1.10/api/newdeveloper/lights/' + lamp + '/state';
	putRequest(url,state);	
}


function setNormalState() {
	var state = '{"on":true,"bri":100,"sat":0,"hue":12750}';
	setLightGroup(state);
}

function setCloudy(){
	getLampState();
	var state = '{"on":true,"bri":5,"sat":110,"hue":47000}';
	setLightGroup(state);
	setTimeout(setNormalState,1500);
}

function setSunny(){
	getLampState();
	var state = '{"on":true,"bri":200,"sat":170,"hue":12750}';
	setLightGroup(state);
	setTimeout(setNormalState,1000);
}

function setRainy() {
	getLampState();
	var state = '{"on":true,"bri":120,"sat":190,"hue":46920}';
	var lampStateA = '{"on":true,"bri":200,"sat":190,"hue":40000}';
	var lampStateB = '{"on":true,"bri":10,"sat":190,"hue":46920}';
	setLightGroup(state);
	
	var count = 0;
	while(count<5) {
		setLightLamp(1,lampStateA);
		setLightLamp(2,lampStateA);
		setLightLamp(1,lampStateB);
		setLightLamp(2,lampStateB);
		count++;
		console.log(count);
	}
	setTimeout(setNormalState,1000);		
}