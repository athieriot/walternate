'use strict';

var walternateApp = angular.module('walternateApp', [])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/api/actor/index', {
        templateUrl: 'views/actor/actorIndex.html',
        controller: 'ActorIndexCtrl'
      })
      .when('/api/actor/create', {
        templateUrl: 'views/actor/actorCreate.html',
        controller: 'ActorCreateCtrl'
      })
      .when('/api/actor/update/:id', {
        templateUrl: 'views/actor/actorUpdate.html',
        controller: 'ActorUpdateCtrl'
      })
      .when('/api/actor/view/:id', {
        templateUrl: 'views/actor/actorView.html',
        controller: 'ActorViewCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
