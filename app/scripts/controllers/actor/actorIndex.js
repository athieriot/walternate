
'use strict';

walternateApp.controller('ActorIndexCtrl', function($scope, $routeParams, $http) {
  $http.get('/api/actor/index').success(function(data) {
    $scope.actor = data;
  });
});
