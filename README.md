# angular-svg-timer

[![Build Status](https://travis-ci.org/markau/angular-svg-timer.png)](https://travis-ci.org/markau/angular-svg-timer)

This directive provides a self-contained, SVG-based timer button with visual feedback of elapsed time:

![Timer screenshots](/../screenshots/timerexample.png?raw=true "Timer screenshots")

###Background

The SVG is based on [these timers](https://jsfiddle.net/prafuitu/xRmGV/). Extending this into an Angular directive allows additional features, including the start/stop button and communication between the view and the directive so that timer events can be responded to. 

###Demo

See the [demo page](UMM WHATS THIS) for a working example.

###A note about precision

Simply counting setTimeout() intervals is an [unreliable](http://stackoverflow.com/a/985692/3003102) method of measuring time in JavaScript; a 1000ms interval might not actually be 1000ms, depending on the load on the client device (intervals can be blocked). 

This directive follows the [recommended approach](http://stackoverflow.com/a/29972322/3003102) of comparing the elapsed time of each setTimeout() interval against Date.now(), in order to calculate and adjust for any drift. This use of system time ensures reliable results across devices.

##Usage

The directive is implemented as an element. 

###Installation

1. Install with bower:

    `bower install angular-svg-timer`

2. Include the scripts in your main index.html file:

    ````
    <script src="bower_components/moment/moment.js"></script>
    <script src="bower_components/angular-moment/angular-moment.js"></script>
    <script src="bower_components/angular-svg-timer/timer.js"></script>
    ````

3. Register the module dependency in your main app.js file:

    `var App = angular.module('App', ['markau.timer']);`

###Quick start
The minimal declaration is:

````<markau-timer time="20" />````

###Options

The directive uses an isolate scope with 2-way binding on provided attributes, so the view remains aware of changes in timer state. 

The directive takes the following attributes:

* Time: countdown time (in milliseconds). Required.

* Status: 
    * notstarted
    * running
    * complete
    * \<something else\> (based on events below)

* Events: the directive takes an array of objects in the form `{ 'time': '<event>' }`. This is intended to allow the timer to check for \<event\> milestones and update the status accordingly. So far, the only event implemented is `{ 'time': 'half' }`. In this case, when the countdown is half way through, the status attribute changes from 'running' to 'halftime'. Other useful events may include 1/4 and 3/4 time, '10 seconds remaining' etc.

###Example

Instantiate scope variables, e.g.:

````
$scope.time = 20;
$scope.status = 'notstarted';
$scope.events: [{ 'time': 'half' }];
````

And then bind to the attributes using the full declaration:

````
<h2>Timer status: {{status}}</h2>

<markau-timer time="time" status="status" events="events" />
````

The `h2` will show the changing timer status.

More advanced use cases may involve a `$watch` on the `$scope.status` variable, or use of `ng-class` to show different content depending on the status. The [demo page](DEMO) shows this in action.

###Style

The directive uses an html template which exposes the `svg-container` and `svg-timer-text` classes. You can change the style on the countdown text by overriding the class:

    .svg-timer-text {
        fill: #262626; /* 'fill' is the svg version of 'color' */
        font-size: 42px;
    }

###Size

Being an SVG, the timer scales to fill the containing DOM element (effectively, width: 100%). Place it inside a width-constrained block element to control the size of the timer.

##Compatability

It should work on anything that supports SVG. It has been tested on Android 4.2 and iOS 6 / 7 in a Phonegap project. 

##License

MIT



