angular.module('app.controllers').controller('ListCtrl',
    ['$scope', 'listStorageService', '$timeout', '$state', '$stateParams',
     function ($scope, listStorageService, $timeout, $state, $stateParams) {

         $scope.model = {};
         $scope.model.list = {id: 0};
         $scope.model.tasks = [];
         $scope.model.timeFrames = [];
         $scope.model.pageLoaded = false;

         //add a 'loader' to page as it is opening
         $scope.$on('$ionicView.beforeEnter', function (e) {
             $(".pageSpinner").show();
             $(".page-content").hide();
             $scope.model.pageLoaded = false;
         });

         //init tasks and add them to their respective lists when the view is entered
         $scope.$on('$ionicView.enter', function (e) {
             if ($stateParams.listId != $scope.model.list.id) {
                    $scope.initTimeFramesAndLoadTasks();
             } else {
                    $scope.loadTasks($stateParams.listId);
             }
         });

         $scope.$on("listStorageInitialised", function () {
             $scope.initTimeFramesAndLoadTasks();
         });

         $scope.initTimeFramesAndLoadTasks = function () {
             listStorageService.getListById($stateParams.listId)
                .then(function (list) {
                    $scope.model.list = list;
                    $scope.model.timeFrames = [];

                    var date = new Date();
                    var early = new Date(0);
                    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
                    var tomorrow = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0);
                    var dayAfter = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 2, 0, 0, 0);
                    var weekday = new Array(7);
                    weekday[0] = "Sunday";
                    weekday[1] = "Monday";
                    weekday[2] = "Tuesday";
                    weekday[3] = "Wednesday";
                    weekday[4] = "Thursday";
                    weekday[5] = "Friday";
                    weekday[6] = "Saturday";                    

                    var nextDay = weekday[dayAfter.getDay()] + ' ' + $scope.getDateString(dayAfter);
                    var after = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 3, 0, 0, 0);


                    if (list.listType == 'simple') {
                        $scope.model.timeFrames[0] = { name: 'All Tasks', time: early, tasks: [] };
                    } else if (list.listType == 'daily') {
                        $scope.model.timeFrames[0] = { name: 'Today', time: today, tasks: [] };
                        $scope.model.timeFrames[1] = { name: 'Tomorrow', time: tomorrow, tasks: [] };
                        $scope.model.timeFrames[2] = { name: nextDay, time: dayAfter, tasks: [] };
                        $scope.model.timeFrames[3] = { name: 'After', time: after, tasks: [] };
                    } else if (list.listType == 'weekly') {
                    }
                        

                    $scope.loadTasks(list.id);
                }, function (error) { });
         };

         $scope.getDateString = function (date) {
             var d = date.getDate();
             var dS  = d.toString();
             var sS = dS.substring(dS.length-1, dS.length);
             var arr = parseInt(sS);
             var endings = new Array(4);
             endings[0] = "st";
             endings[1] = "nd";
             endings[2] = "rd";
             endings[3] = "th";
             if (arr >= 4) {
                 return d + endings[3];
             } else {
                 return d + endings[arr];
             }
         }

         //load tasks in the list, and assign them to a timespan
         $scope.loadTasks = function (listId) {
             for (var i = 0; i < $scope.model.timeFrames.length; i++) {
                 $scope.model.timeFrames[i].tasks = [];
             }
             listStorageService.getTasksInList(listId).then(function (rows) {
                 $scope.model.tasks = rows;
                 for (var i = 0; i < $scope.model.tasks.length; i++) {
                     $scope.addTaskToTimeFrame($scope.model.tasks[i]);
                 }
                 $(".pageSpinner").hide();
                 $(".page-content").show();
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


     }]);
