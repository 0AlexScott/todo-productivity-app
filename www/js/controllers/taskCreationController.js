angular.module('app.controllers').controller('TaskCreationCtrl',
    ['$scope', 'listStorageService', '$timeout', '$stateParams',
    function ($scope, listStorageService, $timeout, $stateParams) {

        $scope.model = {};
        $scope.model.newTask = {};
        $scope.model.newTask.productivityPoints = 20;
        $scope.model.newTask.subTasks = [{name: ''}];

        $scope.init = function () {
        };

        $scope.addNewSubTask = function () {
            $scope.model.newTask.subTasks.push({ name: '' });
        };

        $scope.checkValid = function () {
            if ($scope.model.newTask.name != '' && $scope.model.newTask.completionDate && $scope.model.newTask.subTasks[0].name != '') {
                return false;
            }
            return true;
        };

        $scope.saveTask = function () {
            var subTasks = angular.toJson($scope.model.newTask.subTasks);
            listStorageService.createTask($stateParams.listId, $scope.model.newTask.name, subTasks, $scope.model.newTask.completionDate.getTime(), $scope.model.newTask.productivityPoints, false)
                .then(function (success) {
                    if (success) {
                        //use toast for prompt
                        //move to previous screen
                    }
                }, function (error) { 
                    console.log("Error in $scope.saveTask")
                });
        };


        //Method obtained from github.com/dalelotts/angular-bootstrap-datetimepicker to disable previous datetimes on picker
        $scope.timepickerBeforeRender = function($view, $dates, $leftDate, $upDate, $rightDate) {

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

            var minuteViewDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours() , currentDate.getMinutes());
            var minuteViewDateValue = minuteViewDate.getTime() ;  

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
        }



        $scope.init();


    }]);
