'use strict';

describe('Controller: ActorUpdateCtrl', function() {

  // load the controller's module
  beforeEach(module('walternateApp'));

  var ActorUpdateCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    scope = {};
    ActorUpdateCtrl = $controller('ActorUpdateCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
