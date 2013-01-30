'use strict';

describe('Controller: ActorCreateCtrl', function() {

  // load the controller's module
  beforeEach(module('walternateApp'));

  var ActorCreateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    scope = {};
    ActorCreateCtrl = $controller('ActorCreateCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
