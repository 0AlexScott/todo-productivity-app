angular.module('app.controllers').controller('TaskCreationCtrl',
    ['$scope', 'listStorageService', '$timeout', '$stateParams', '$state', '$rootScope',
    function ($scope, listStorageService, $timeout, $stateParams, $state, $rootScope) {

        //Init variables in task creation
        $scope.model = {};
        $scope.model.newTask = {};
        $scope.model.newTask.productivityPoints = 20;
        $scope.model.newTask.subTasks = [{name: ''}];

        $scope.init = function () {
        };

        $scope.addNewSubTask = function () {
            $scope.model.newTask.subTasks.push({ name: '' });
        };

        //This is used to disable the save button if properties are incorrect
        $scope.checkValid = function () {
            if ($scope.model.newTask.name != '' && $scope.model.newTask.completionDate && $scope.model.newTask.subTasks[0].name != '') {
                return false;
            }
            return true;
        };

        //Save task to service
        $scope.saveTask = function () {
            //remove empty sub tasks
            for (var i = 0; i < $scope.model.newTask.subTasks.length; i++) {
                if ($scope.model.newTask.subTasks[i].name == '') {
                    $scope.model.newTask.subTasks.splice(i, 1);
                    i--;
                }
            }
            var subTasks = angular.toJson($scope.model.newTask.subTasks);
            listStorageService.createTask($stateParams.listId, $scope.model.newTask.taskName, subTasks, $scope.model.newTask.completionDate.getTime(), $scope.model.newTask.productivityPoints, false)
                .then(function (success) {
                    if (success) {
                        window.plugins.toast.showLongCenter('Task created successfully!');
                        $state.go($rootScope.previousState, $rootScope.previousStateParams);
                    }
                }, function (error) { 
                    console.log("Error in $scope.saveTask")
                });
        };

        //Function used to disable past dates in date time picker
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
