angular.module('app.controllers').controller('HomeCtrl', ['$scope', 'listStorageService', '$timeout', function($scope, listStorageService, $timeout) {

  
    

    $scope.model = {};
    $scope.model.tasks = [];
    $scope.model.timeFrames = [];
    
    $("#pageSpinner").show();
    $("#page-content").hide();

    $scope.$on('$ionicView.enter', function (e) {
        $("#pageSpinner").show();
        $("#page-content").hide();

        $scope.loadTasks(1);
        
    });

    //$scope.$on("listStorageInitialised", function () {
    //    $scope.loadTasks(1);
                
    //});

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
            $scope.model.tasks = [];
            for (var i = 0; i < rows.length; i++) {
                console.log(rows.item(i));
                $scope.model.tasks[i] = rows.item(i);
                $scope.model.tasks[i].subTasks = angular.fromJson(rows.item(i).subTasks);
                $scope.model.tasks[i].completionDate = new Date(parseInt(rows.item(i).completionDate, 10));
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

    $scope.init();


}]);
