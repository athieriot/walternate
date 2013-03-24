'use strict';

var walternateApp = angular.module('walternateApp', ['ngResource'])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/Relations/:movieId', {
        templateUrl: 'views/relations.html',
        controller: 'RelationsController'
      })
      .when('/Relations/:movieId/graph', {
        templateUrl: 'views/graph.html',
        controller: 'GraphController'
      })
      .otherwise({
        redirectTo: '/'
      });
  }])
  .run(['localNavigationStorage', function(localNavigationStorage) {
       localNavigationStorage.init();
  }]);
