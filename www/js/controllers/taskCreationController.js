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

        $scope.popup1 = {
            opened: false
        };

        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };

        $scope.dateOptions = {
            //dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1,
            placement: 'auto top'
        };




        $scope.init();


    }]);
