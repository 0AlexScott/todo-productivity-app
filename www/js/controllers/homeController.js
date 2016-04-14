angular.module('app.controllers').controller('HomeCtrl', ['$scope', function($scope) {

  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

    $scope.model = {};
    $scope.model.helloWorld = "Hello, world!";

}]);
