'use strict';

walternateApp.factory('localNavigationStorage', ['$rootScope', '$resource', function($rootScope, $resource) {
   var STORAGE_ID = 'walternate-history';

   var movieResource = $resource("/api/movieInfo/:id", {id:'@id', format:'json'} );

   var get = function() {
      return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
   }

   return {
      get: get,
      add: function(movieId) {
         movieResource.get({id: movieId}, function(movie) {
            var array = get();
            if (_.isEmpty(array) || movie.id != array[0].id) {
               array.unshift(movie);
            }

            localStorage.setItem(STORAGE_ID, JSON.stringify(array));
            $rootScope.localNavigation = get();
         });
      },
      clear: function() {
         localStorage.removeItem(STORAGE_ID);
         $rootScope.localNavigation = [];
      }
   };
}]);
