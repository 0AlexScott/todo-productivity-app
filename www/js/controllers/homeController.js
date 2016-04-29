angular.module('app.controllers').controller('HomeCtrl', ['$scope', 'listStorageService', '$timeout', function($scope, listStorageService, $timeout) {

  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

    $scope.model = {};
    $scope.model.tasks = [];
    $scope.model.pageReady = false;

    $scope.$on("listStorageInitialised", function () {
        $scope.loadTasks(1);
        $scope.model.pageReady = true;
    });

    $scope.loadTasks = function (listId) {
        listStorageService.getTasksInList(listId).then(function (rows) {
            $scope.model.tasks = [];
            for (var i = 0; i < rows.length; i++) {
                $scope.model.tasks[i] = rows.item(i);
                $scope.model.tasks[i].subTasks = angular.fromJson(rows.item(i).subTasks);
            }
        }, function (error) {console.log("Error in $scope.loadTasks")});
    }


}]);
