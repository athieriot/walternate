'use strict';

var walternateApp = angular.module('walternateApp', ['ngResource'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/relations.html',
        controller: 'RelationsController'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
