describe('markauTimer', function() {

  var elm, scope;

  // Load the directive JavaScript
  beforeEach(module('markau.timer'));

  // load the template
  beforeEach(module('bower_components/angular-svg-timer/timer.html'));

  // render the directive
  beforeEach(inject(function($rootScope, $compile) {
    elm = angular.element('<markau-timer time="20" />');
    scope = $rootScope;
    $compile(elm)(scope);
    scope.$digest();
  }));

  it('should work as an element', function () {
    expect(elm.html()).toContain('<svg version="1.1" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 150 200" ng-click="timerController.startPauseTimer()">');
    // expect(elm.html()).toContain('<text id="seconds_2" x="70" y="178" text-anchor="middle" fill="#000" class="svg-timer-text ng-binding">00:20</text>');
  });

});
