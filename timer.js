/*
 * angular-svg-timer v0.1.0
 * (c) 2015 Mark Andrews <URL>
 * License: MIT
 */

'use strict';

angular.module('markau.timer', []).

directive('markauTimer', function($timeout) {
    return {        
        restrict: 'E',
        replace: true,
        templateUrl: 'bower_components/angular-svg-timer/timer.html',
        scope: {
            time: '=time',
            status: '=status',
            events: '=events',
        },
        controllerAs: 'timerController',
        //bindToController: true,          
        controller: function ($scope, $element, $attrs, $timeout) {

        	// Private properties
            var go;
            var missedTicks;
            var interval;
            var startTime;
            var pauseTime;
            var finalTime;
            var durationMsec;
            var time;
            var elapsed;
            var totalTime;
            var goalTimeMillis;
            var myTimeout = null;
            var degrees;
            var hasHalftimeEvent = false;
			var _this = this;

            // Format milliseconds as a string.
             var formatMillisToTime = function (millis) {
                // Handles when the timer reaches 0 and goes negative (displays + not -)
                var response = '';
                if (millis < 0) {
                    response = "+";
                }
                // Calculations (ensuring +ve numbers)
                var duration = moment.duration(millis);
                var minutes = ('00' + Math.abs(duration.minutes())).slice(-2);
                var seconds = ('00' + Math.abs(duration.seconds())).slice(-2);

                response += (minutes + ':' + seconds);
                return response;
            };

            var init = function () {
                go = false;
                missedTicks = null;
                interval = 10;
                startTime = 0;
                pauseTime = 0;
                finalTime = 0;
                durationMsec = 0;
                time = 0;
                elapsed = 0;
                totalTime = 0;

                goalTimeMillis = parseInt($scope.time) * 1000;
                _this.formattedTime = formatMillisToTime(goalTimeMillis);
                degrees = 360 / goalTimeMillis;

                _this.playVisibility = 1;
                _this.pauseVisibility = 0;

                // Determine which events to subscribe to
                if ($scope.events) {
					$scope.events.forEach(function(event) {
	                    if (event.time === 'half') {
	                        hasHalftimeEvent = true;
	                    }
	                });
                }
            };

            init();

            // Play / Pause button visibility
            this.startPauseTimer = function() {
                if (_this.timerRunning) {
                    //$scope.status = 'paused';
                    pause();
                    _this.playVisibility = 1;
                    _this.pauseVisibility  = 0;
                } else {
                    if (($scope.status !== 'halftime') && ($scope.status !== 'complete')) {
                        $scope.status = 'running';
                    }
                    _this.playVisibility = 0;
                    _this.pauseVisibility  = 1;
                    if (startTime === 0) {
                        start(goalTimeMillis);
                    } else {
                        start(pauseTime);           
                    }
                }
            };

            function start(time) {
                _this.timerRunning = true;
                startTime = time;
                startCountdown(time);
            }

            function stop() {
              _this.timerRunning = false;
              go = false;
              $timeout.cancel(myTimeout);
              finalTime = durationMsec - time;
            }

            function startCountdown(duration) {
              durationMsec = duration;
              startTime = Date.now();
              // end_time = startTime + durationMsec;
              time = 0;
              elapsed = '0.0';
              go = true;
              _tick();
            }

            function pause() {
                pauseTime = lap();
                stop();
            }

            function lap() {
                if (go) {
                    var now;
                    now = durationMsec - (Date.now() - startTime);
                    return now;
                }
                return pauseTime || finalTime;
            }


            /**
             * Called every tick for countdown clocks.
             * i.e. once every this.interval ms
             */
            function _tick() {
                time += interval;
                totalTime += interval;

                var t = this;
                var diff = (Date.now() - startTime) - time;
                var nextIntervalIn = interval - diff;

                var isComplete = false;

                // Check for complete
                if (totalTime === goalTimeMillis) {
                    $scope.status = 'complete';
                    // console.log('complete: ' + lap());
                    update(359, totalTime / 1000);
                } 

                // Check for Half-time event
                if (hasHalftimeEvent) {
                    if (totalTime === (goalTimeMillis / 2)) {
                        $scope.status = 'halftime';
                        // console.log('halftime: ' + lap());
                    }                                    
                }

                // Other events here


                // Show the new time  
                _this.formattedTime = formatMillisToTime(lap());

                // Draw more of the timer circle if not complete
                if (totalTime < goalTimeMillis) {
                    update(totalTime * degrees, totalTime / 1000);
                }

                // Calculate drift and call a new interval
                if (nextIntervalIn <= 0) {
                    missedTicks = Math.floor(Math.abs(nextIntervalIn) / interval);
                    time += missedTicks * interval;
                    totalTime += missedTicks * interval;
                    if (go) {
                        _tick();
                    }
                } else {
                    if (go) {
                        myTimeout = $timeout(_tick, nextIntervalIn);
                    }
                }

            }

            // Check for changes to time based on prep work
            $scope.$watch('time', function(newValue, oldValue){
                $scope.time = newValue;
                init();
            });


            // SVG drawing
            function update(deg, sec) {
                var RGB  = [];
                _this.draw = drawCoord(radius, deg);
                
                col_H = 120 - Math.round(deg / 3);
                RGB   = hsl2rgb(col_H, col_S, col_L);
            }


            var radius = 60;
            var offset = 10;
            
            var col_H = 120;
            var col_S = 95;
            var col_L = 48;
            
            function hue2rgb(t1, t2, t3) {
                if (t3 < 0) { t3 += 1; }
                if (t3 > 1) { t3 -= 1; }
                
                if (t3 * 6 < 1) { return t2 + (t1 - t2) * 6 * t3; }
                if (t3 * 2 < 1) { return t1; }
                if (t3 * 3 < 2) { return t2 + (t1 - t2) * (2 / 3 - t3) * 6; }
                
                return t2;
            }

            function hsl2rgb(H, S, L){
                var R, G, B;
                var t1, t2;
                
                H = H / 360;
                S = S / 100;
                L = L / 100;
                
                if ( S === 0 ) {
                    R = G = B = L;
                } else {
                    
                    t1 = (L < 0.5) ? L * (1 + S) : L + S - L * S;
                    t2 = 2 * L - t1;
                    
                    R = hue2rgb(t1, t2, H + 1/3);
                    G = hue2rgb(t1, t2, H);
                    B = hue2rgb(t1, t2, H - 1/3);
                }
                
                return [
                    Math.round(R * 255), 
                    Math.round(G * 255), 
                    Math.round(B * 255)
                ];
            }
            
            function drawCoord(radius, degrees) {
                var radians = degrees * Math.PI / 180;
                
                var rX = radius + offset + Math.sin(radians) * radius;
                var rY = radius + offset - Math.cos(radians) * radius;
                
                var dir = (degrees > 180) ? 1 : 0;
                
                var coord = 'M' + (radius + offset) + ',' + (radius + offset) + ' ' + 
                            'L' + (radius + offset) + ',' + offset + ' ' +
                            'A' + radius + ',' + radius + ' 0 ' + dir + ',1 ' +
                            rX + ',' + rY;
                
                return coord;
            }

            // Ensure $timeouts are cleared
            $scope.$on('$destroy', function(){
                $timeout.cancel(myTimeout);
            });
        }
    };

});
