'use strict';

describe('Controller: SearchController', function() {

   // load the controller's module
   beforeEach(module('walternateApp'));

   var SearchController, scope, httpBackend;

   // Initialize the controller and a mock scope
   beforeEach(inject(function($controller, $httpBackend) {
      scope = {};
      httpBackend = $httpBackend;

      httpBackend.whenGET('/api/configuration?format=json').respond({
         "images": {
            "base_url": "http://base.url.com"
         }
      });
      httpBackend.whenGET('/api/searchMovie/2?format=json').respond({
         "images": {
            "base_url": "http://base.url.com"
         }
      });

      httpBackend.expectGET('/api/configuration?format=json');

      SearchController = $controller('SearchController', {
         $scope: scope
      });
   }));

   afterEach(function() {
      httpBackend.flush();

      httpBackend.verifyNoOutstandingExpectation();
      httpBackend.verifyNoOutstandingRequest();
   });

   it('should update the scope of movies after an API call', function() {
      httpBackend.expectGET('/api/searchMovie/2?format=json');
      scope.search(2);
      expect(scope.movie).not.toBe(null);
   });

   it('should filter the least popular movies', function() {
      expect(scope.popular({vote_count: 50})).toBe(true);
      expect(scope.popular({vote_count: 5})).toBe(false);
   });
});
