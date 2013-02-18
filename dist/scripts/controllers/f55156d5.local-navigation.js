'use strict';

walternateApp.controller('LocalNavigationController', ['$scope', '$rootScope', '$resource', 'localNavigationStorage', function($scope, $rootScope, $resource, localNavigationStorage) {
   $scope.configuration = $resource("/api/configuration", {format:'json'} ).get();

   $rootScope.$watch('localNavigation', function(newValue, oldValue) {
      $scope.history = newValue;
   });

   $scope.clearNavigation = function() {
      localNavigationStorage.clear();
   }
}]);
