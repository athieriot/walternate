
'use strict';

walternateApp.controller('ActorCreateCtrl', function($scope, $routeParams, $http) {
  $http.get('/api/actor/create').success(function(data) {
    $scope.actor = data;
  });
});
