var bridgeIpAddress = '192.168.1.10';
var bridgeUser = 'newdeveloper';

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

var normalState;
function getInitialLampState(){
	var url = 'http://'+bridgeIpAddress+'/api/'+bridgeUser+'/lights/1'
	getRequest(url, function(data) {
		normalState = data;
		console.log(data);
	});
}

function setLightGroup(state) {
	var url = 'http://'+bridgeIpAddress+'/api/'+bridgeUser+'/groups/0/action'
	return putRequest(url,state);
}

function setLightLamp(lamp,state) {
	var url = 'http://'+bridgeIpAddress+'/api/'+bridgeUser+'/lights/' + lamp + '/state';
	putRequest(url,state);	
}


function setNormalState() {
	// TODO - use the getInitialLampState to store original settings so we can push those back to the lights afterwards instead.
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
	}
	setTimeout(setNormalState,1000);		
}