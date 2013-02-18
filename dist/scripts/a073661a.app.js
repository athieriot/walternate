'use strict';

var walternateApp = angular.module('walternateApp', ['ngResource', 'LocalStorageModule'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/Relations/:movieId', {
        templateUrl: 'views/relations.html',
        controller: 'RelationsController'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
