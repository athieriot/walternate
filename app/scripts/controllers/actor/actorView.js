
'use strict';

walternateApp.controller('ActorViewCtrl', function($scope, $routeParams, $http) {
  $http.get('/api/actor/view/:id').success(function(data) {
    $scope.actor = data;
  });
});
