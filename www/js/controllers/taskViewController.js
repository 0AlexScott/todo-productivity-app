angular.module('app.controllers').controller('TaskViewCtrl',
    ['$scope', 'listStorageService', '$stateParams', '$ionicPopup', '$rootScope', '$state', 'productivityService',
    function ($scope, listStorageService, $stateParams, $ionicPopup, $rootScope, $state, productivityService) {

        //Init variables used in this scope
        $scope.model = {};
        $scope.model.task = {};
        $scope.model.initialTask = {};
        $scope.model.lists = [];

        
        $scope.init = function () {
            //Get task from store
            listStorageService.getTask($stateParams.taskId).then(function (task) {
                $scope.model.task = task;
                $scope.model.initialTask = task;
            }, function (error) {
                console.log("Error in init, taskviewctrl")
            });

            //grab the lists for dropdown selector
            listStorageService.getLists().then(function (lists) {
                $scope.model.lists = lists;
            }, function (error) {
                console.log("Error in init, taskviewInit")
            });
        };

        //Save changes to task via list service
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

        //Set the tasks date one day in the future and create a new task
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

        //Confirm the user wishes to delete the task, then remove it and redirect them
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

        //Confirm the user has completed the task, then award the points, delete it and redirect them
        $scope.completeTask = function () {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Task completed?',
                template: 'Once you complete this task you will recieve points and it will be permanently removed, do you wish to continue?'
            });

            confirmPopup.then(function (res) {
                if (res) {
                    productivityService.awardPoints($scope.model.task.productivityPoints)
                        .then(function (res) {
                            listStorageService.deleteTask($scope.model.task.id).then(function (success) {
                                if (success) {
                                    window.plugins.toast.showLongCenter('You have been awarded ' + $scope.model.task.productivityPoints + ' productivity points!!\n\nWell done!!');
                                    console.log("Task deleted successfully");
                                    $state.go($rootScope.previousState, $rootScope.previousStateParams);
                                }
                            }, function (error) { });
                        }, function (error) { });
                }
            });
        };
        
        //Function taken from ionic-date-time-picker github forum so disable past datesS
        $scope.timepickerBeforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {

            var currentDate = new Date();
            var currentDateValue = currentDate.getTime();

            var yearViewDate = new Date(currentDate.getFullYear(), 0);
            var yearViewDateValue = yearViewDate.getTime();

            var monthViewDate = new Date(currentDate.getFullYear(), currentDate.getMonth());
            var monthViewDateValue = monthViewDate.getTime();

            var dayViewDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
            var dayViewDateValue = dayViewDate.getTime();

            var hourViewDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours());
            var hourViewDateValue = hourViewDate.getTime();

            var minuteViewDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes());
            var minuteViewDateValue = minuteViewDate.getTime();

            for (var index = 0; index < $dates.length; index++) {

                var date = $dates[index];

                // Disable if it's in the past
                var dateValue = date.localDateValue();
                switch ($view) {

                    case 'year':
                        if (dateValue < yearViewDateValue) {
                            date.selectable = false;
                        }
                        break;

                    case 'month':
                        if (dateValue < monthViewDateValue) {
                            date.selectable = false;
                        }
                        break;

                    case 'day':
                        if (dateValue < dayViewDateValue) {
                            date.selectable = false;
                        }
                        break;

                    case 'hour':
                        if (dateValue < hourViewDateValue) {
                            date.selectable = false;
                        }
                        break;

                    case 'minute':
                        if (dateValue < minuteViewDateValue) {
                            date.selectable = false;
                        }
                        break;
                }
            }
        };

        $scope.init();


    }]);
