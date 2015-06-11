# angular-svg-timer

[![Build Status](https://travis-ci.org/markau/angular-svg-timer.png)](https://travis-ci.org/markau/angular-svg-timer)

An Angular directive to provide a self-contained, SVG-based timer button with visual feedback of elapsed time:

![Timer screenshots](/../screenshots/timerexample.png?raw=true "Timer screenshots")

The SVG is based on [this fiddle](https://jsfiddle.net/prafuitu/xRmGV/). Extending this into an Angular directive allows additional features, including the start/stop button (works with touch) and communication between the directive and the view so that timer events can be handled. 

###Demo

See the [demo page](http://timerdemo.azurewebsites.net) for a working example.

##Usage

1. Install with bower:

    `bower install angular-svg-timer`

2. Include the scripts in your main index.html file:

    ````
    <script src="bower_components/moment/moment.js"></script>
    <script src="bower_components/angular-moment/angular-moment.js"></script>
    <script src="bower_components/angular-svg-timer/timer.js"></script>
    ````

3. Register the module dependency in your main app.js file, e.g.:

    `var App = angular.module('App', ['markau.timer']);`

###Quick start
The minimal declaration is:

````<markau-timer time="20" />````

###Options

The directive uses an isolate scope with 2-way binding on provided attributes, so the view can remain aware of changes in timer state. 

The directive exposes the following attributes:

* Time: countdown time (in milliseconds). Required.
* Status: 
    * notstarted
    * running
    * complete
    * \<something else\> (based on events below)
* Events: an array of objects in the form `{ 'time': '<event>' }`. This is intended to allow the timer to check for \<event\> milestones and update the status accordingly. The one event supported so far is `{ 'time': 'half' }`; when the countdown is half way through, the status attribute changes from 'running' to 'halftime'. Other useful events may include 1/4 and 3/4 time, '10 seconds remaining' etc.

###Example

Instantiate scope variables:

````
$scope.time = 20;
$scope.status = 'notstarted';
$scope.events: [{ 'time': 'half' }];
````

Bind the scope variables to attributes on the element:

````
<markau-timer time="time" status="status" events="events" />
````

Add a placeholder to show the current value of the scope variable:

````
<h2>Timer status: {{status}}</h2>
````

More advanced use cases involve a `$watch` on the `$scope.status` variable, or use of `ng-class` to show different content depending on the status. The [demo page](http://timerdemo.azurewebsites.net) shows this in action.

###Style

The directive uses an html template which exposes the `svg-container` and `svg-timer-text` classes. You can change the style on the countdown text by overriding the class:

    .svg-timer-text {
        fill: #262626; /* 'fill' is the svg version of 'color' */
        font-size: 42px;
    }

###Size

Being an SVG, the timer scales to fill the containing DOM element (effectively, width: 100%). Place it inside a width-constrained block element to control the size of the timer.

##A note on precision

Counting setTimeout() intervals is an [unreliable](http://stackoverflow.com/a/985692/3003102) method of measuring time in JavaScript; a 1000ms interval is not necessarily 1000ms, up to 200-300ms, depending on the load on the client device (intervals can be blocked). 

This directive follows [an approach](http://stackoverflow.com/a/29972322/3003102) of comparing the elapsed time of each setTimeout() interval against Date.now(), in order to calculate and adjust for any drift. This use of system time ensures reliable results across devices.

##Compatability

This has been tested on Android 4.2 and iOS 6 / 7 in a Phonegap project, in addition to a variety of modern desktop browsers. 

##License

MIT



