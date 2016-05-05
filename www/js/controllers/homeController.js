angular.module('app.controllers').controller('HomeCtrl',
    ['$scope', 'listStorageService', '$timeout', '$state', 
     function($scope, listStorageService, $timeout, $state) {

    $scope.model = {};
    $scope.model.tasks = [];
    $scope.model.timeFrames = [];
    
    $("#pageSpinner").show();
    $("#page-content").hide();

    $scope.$on('$ionicView.enter', function (e) {
        $("#pageSpinner").show();
        $("#page-content").hide();

        $scope.init();
        $scope.loadTasks(1);
        
    });
         
    $scope.init = function () {
        var date = new Date();
        var today = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        var tomorrow = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0);
        var after = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 2, 0, 0, 0);
        $scope.model.timeFrames[0] = { name: 'Today', time: today, tasks: [] };
        $scope.model.timeFrames[1] = { name: 'Tomorrow', time: tomorrow, tasks: [] };
        $scope.model.timeFrames[2] = { name: 'After', time: after, tasks: [] };
    }

    $scope.loadTasks = function (listId) {
        listStorageService.getTasksInList(listId).then(function (rows) {
            $scope.model.tasks = rows;
            for (var i = 0; i < $scope.model.tasks.length; i++) {
                $scope.addTaskToTimeFrame($scope.model.tasks[i]);
            }            
            $("#pageSpinner").hide();
            $("#page-content").show();
        }, function (error) { console.log("Error in $scope.loadTasks") });
    };

    $scope.addTaskToTimeFrame = function (task) {
        for (var i = $scope.model.timeFrames.length -1; i > -1; i--) {
            if (task.completionDate > $scope.model.timeFrames[i].time) {
                $scope.model.timeFrames[i].tasks.push(task);
                return 0;
            }
        }
    };

    //$scope.openTaskDetails = function (taskId) {
    //    $state.go('app.taskView', { taskId: taskId });
    //};


}]);
