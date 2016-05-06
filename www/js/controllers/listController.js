angular.module('app.controllers').controller('ListCtrl',
    ['$scope', 'listStorageService', '$timeout', '$state', '$stateParams',
     function ($scope, listStorageService, $timeout, $state, $stateParams) {

         $scope.model = {};
         $scope.model.list = {};
         $scope.model.tasks = [];
         $scope.model.timeFrames = [];
         $scope.model.pageLoaded = false;

         //add a 'loader' to page as it is opening
         $scope.$on('$ionicView.beforeEnter', function (e) {
             $("#pageSpinner").show();
             $("#page-content").hide();
             $scope.model.pageLoaded = false;
         });

         //init tasks and add them to their respective lists when the view is entered
         $scope.$on('$ionicView.enter', function (e) {
             $scope.init();
             $scope.loadTasks($stateParams.listId);

         });

         $scope.$on("listStorageInitialised", function () {
             $scope.init();
             $scope.loadTasks($stateParams.listId);
         });

         $scope.init = function () {
             //set timespans for view in page
             var date = new Date();
             var today = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
             var tomorrow = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0);
             var after = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 2, 0, 0, 0);
             $scope.model.timeFrames[0] = { name: 'Today', time: today, tasks: [] };
             $scope.model.timeFrames[1] = { name: 'Tomorrow', time: tomorrow, tasks: [] };
             $scope.model.timeFrames[2] = { name: 'After', time: after, tasks: [] };
         };

         //load tasks in the list, and assign them to a timespan
         $scope.loadTasks = function (listId) {
             listStorageService.getTasksInList(listId).then(function (rows) {
                 $scope.model.tasks = rows;
                 for (var i = 0; i < $scope.model.tasks.length; i++) {
                     $scope.addTaskToTimeFrame($scope.model.tasks[i]);
                 }
                 $("#pageSpinner").hide();
                 $("#page-content").show();
                 $scope.model.pageLoaded = true;
             }, function (error) { console.log("Error in $scope.loadTasks") });
         };

         //init tasks into groups to display easier
         $scope.addTaskToTimeFrame = function (task) {
             for (var i = $scope.model.timeFrames.length - 1; i > -1; i--) {
                 if (task.completionDate > $scope.model.timeFrames[i].time) {
                     $scope.model.timeFrames[i].tasks.push(task);
                     return 0;
                 }
             }
         };

         $scope.getList = function (listId) {

         };
     }]);
