angular.module('app.controllers').controller('TaskViewCtrl',
    ['$scope', 'listStorageService', '$stateParams', '$ionicPopup', '$rootScope', '$state',
    function ($scope, listStorageService, $stateParams, $ionicPopup, $rootScope, $state) {

        $scope.model = {};
        $scope.model.task = {};
        $scope.model.initialTask = {};
        $scope.model.lists = [];

        $scope.init = function () {
            listStorageService.getTask($stateParams.taskId).then(function (task) {
                $scope.model.task = task;
                $scope.model.initialTask = task;
            }, function (error) {
                console.log("Error in init, taskviewctrl")
            });

            listStorageService.getLists().then(function (lists) {
                $scope.model.lists = lists;
            }, function (error) {
                console.log("Error in init, taskviewInit")
            });
        };

        $scope.saveChanges = function () {
            $scope.model.initialTask = $scope.model.task;
            var task = $scope.model.task;
            var subTasks = angular.toJson(task.subTasks);
            var completionDate = task.completionDate.getTime();
            listStorageService.updateTask(task.id, task.listId, task.taskName, subTasks, completionDate, task.productivityPoints, task.reminder)
                .then(function (success) {
                    window.plugins.toast.showLongCenter('Task updated successfully!');
                    console.log("Update task successful");
                }, function (error) { });

        };

        $scope.repeatTaskOneDayLater = function () {
            var task = $scope.model.initialTask;
            var newDate = task.completionDate.getTime() + 86400000;
            var subTasks = angular.toJson(task.subTasks);
            listStorageService.createTask(task.listId, task.taskName, subTasks, newDate, task.productivityPoints, task.reminder)
                .then(function (success) {
                    window.plugins.toast.showLongCenter('Task created successfully!');
                    console.log("Repeat task successful");
                }, function (error) { });
        };

        $scope.deleteTask = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Delete task',
                template: 'Are you sure you want to permanently delete this task?'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    listStorageService.deleteTask($scope.model.task.id).then(function (success) {
                        if (success) {
                            window.plugins.toast.showLongCenter('Task deleted');
                            console.log("Task deleted successfully");
                            $state.go($rootScope.previousState, $rootScope.previousStateParams);
                        }
                    }, function (error) { });
                } 
            });
        };

        $scope.completeTask = function () {
            //popup
            //yes - award points, delete, provide toast and redirect
            //no - do nothing
        };

        $scope.init();


    }]);
