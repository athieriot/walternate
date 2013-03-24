'use strict';

walternateApp.controller('SearchController', ['$scope', '$resource', function($scope, $resource) {
   $scope.configuration = $resource("/api/configuration", {format:'json'} ).get();

   $scope.moviedb = $resource("/api/searchMovie/:title", {title:'@title', format:'json'});

   $scope.search = function(movieTitle) {
      $scope.movies = $scope.moviedb.get({title: movieTitle});
   }

   $scope.clear = function() {
      $scope.movies = {};
   }
}]);
