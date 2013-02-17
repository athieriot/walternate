'use strict';


walternateApp.controller('RelationsController', function($scope, $resource) {
   $scope.graphdb = $resource("/query/:id", {id:'@id', format:'json'} );

   $scope.searchReco = function(id) {
      $scope.relations = $scope.graphdb.query({id: id});
   }
});

