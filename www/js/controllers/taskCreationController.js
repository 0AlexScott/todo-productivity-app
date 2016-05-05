angular.module('app.controllers').controller('TaskCreationCtrl',
    ['$scope', 'listStorageService', '$timeout', '$stateParams', '$state',
    function ($scope, listStorageService, $timeout, $stateParams, $state) {

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
                        window.plugins.toast.showLongTop('Task created successfully!');
                        $state.go('app.home');
                    }
                }, function (error) { 
                    console.log("Error in $scope.saveTask")
                });
        };


        

        $scope.init();


    }]);
