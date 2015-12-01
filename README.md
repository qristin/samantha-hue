# samantha-hue

This repository contains a prototype for a smart room setup created during a one day hackathon hosted by the [Girls in Tech](http://girlsintech.nl/). In the future you want to ask questions to your home and receive feedback. By the use of the [Philips Hue lightbulbs](http://www2.meethue.com/) we can use the lights in your home as visualiser for information.

This demo uses the [speech recognition api in Chrome](http://shapeshed.com/html5-speech-recognition-api/) to recognize when you request the weather in a city (in dutch 'Hoe is het weer in XXXX'). It will retrieve the weather information from [OpenWeatherMap](http://openweathermap.org/api) and display it on the lightbulbs:

- Sunny - Yellow lights
- Cloudy - Grey / bluehish
- Rainy - Blue with flashes of white/greyish

# Usage

If you have the Philips Hue hackaton kit at your disposal follow the connection guide first.  Otherwise readup [how to connect your Hue bridge locally on your network here](http://www.developers.meethue.com/documentation/getting-started). If required update the bridge IP address and user in the `/js/weather.js` file.

create a local server at the location of the index file with: `python -m SimpleHTTPServer 8080`

open index.html in your browser from a local webserver (for isntance, use the python oneliner `python -m SimpleHTTPServer 8080 .` to run one in the source folder)

Say ["Hoe is het weer in Barcelona"](https://translate.google.com/#nl/en/Hoe%20is%20het%20weer%20in%20barcelona) with your best dutch accent.

# Demo

This is a short demo of the output for sunny Barcelona: [Youtube](https://www.youtube.com/watch?v=XCGF6LPfTuU)

# Changes

The openweathermap api has changed, so you need to create an account and add the appid as a querystring into the request

# License

MIT
