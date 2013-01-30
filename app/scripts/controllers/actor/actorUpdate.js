
'use strict';

walternateApp.controller('ActorUpdateCtrl', function($scope, $routeParams, $http) {
  $http.get('/api/actor/update/:id').success(function(data) {
    $scope.actor = data;
  });
});
