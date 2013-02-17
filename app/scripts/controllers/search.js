'use strict';

walternateApp.controller('SearchController', function($scope, $resource) {

   $scope.moviedb = $resource("/api/searchMovie/:title", {title:'@title', format:'json'});

   $scope.search = function(movieTitle) {
      $scope.movies = $scope.moviedb.get({title: movieTitle});
   }

   $scope.popular = function(movie) {
      return movie.vote_count > 10;
   }
});
