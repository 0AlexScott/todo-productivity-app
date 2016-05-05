angular.module('app.controllers').controller('TaskViewCtrl',
    ['$scope', 'listStorageService', '$stateParams',
    function ($scope, listStorageService, $stateParams) {

        $scope.model = {};
        $scope.model.task = {};
        $scope.model.lists = [];

        $scope.init = function () {
            listStorageService.getTask($stateParams.taskId).then(function (task) {
                $scope.model.task = task;
            }, function (error) {
                console.log("Error in init, taskviewctrl")
            });

            listStorageService.getLists().then(function (lists) {
                $scope.model.lists = lists;
            }, function (error) {
                console.log("Error in init, taskviewInit")
            });
        };

        $scope.init();


    }]);
