'use strict';

describe('Controller: ActorViewCtrl', function() {

  // load the controller's module
  beforeEach(module('walternateApp'));

  var ActorViewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller) {
    scope = {};
    ActorViewCtrl = $controller('ActorViewCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function() {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
