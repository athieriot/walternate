'use strict';

walternateApp.controller('RelationsController', ['$scope', '$resource', '$routeParams', 'localNavigationStorage', function($scope, $resource, $routeParams, localNavigationStorage) {
   $scope.configuration = $resource("/api/configuration", {format:'json'} ).get();

   $scope.graphdb = $resource("/query/:id", {id:'@id', format:'json'} );

   $scope.relations = $scope.graphdb.query({id: $routeParams.movieId});
   
   localNavigationStorage.add($routeParams.movieId);
}]);

