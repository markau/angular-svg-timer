// Karma configuration
module.exports = function (config) {
  config.set({
    basePath: '',
    files: [
      'bower_components/angular/angular.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/moment/moment.js',
      'bower_components/angular-moment/angular-moment.js',
      'timer.js',
      '*.spec.js',
      'timer.html'
    ],

    // generate js files from html templates
    preprocessors: {
      'timer.html': 'ng-html2js'
    },

    ngHtml2JsPreprocessor: {
    	// Add the path to the template that the directive is expecting
    	prependPrefix: 'bower_components/angular-svg-timer/'
    },

    reporters: ['progress'],

    port: 9876,
    colors: true,

    logLevel: config.LOG_INFO,

    browsers: ['Chrome'],
    frameworks: ['jasmine'],

    captureTimeout: 60000,

    autoWatch: true,
    singleRun: false
  });
};
