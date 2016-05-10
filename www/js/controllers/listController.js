angular.module('app.controllers').controller('ListCtrl',
    ['$scope', 'listStorageService', '$timeout', '$state', '$stateParams', '$rootScope', '$ionicPopup', '$ionicHistory',
     function ($scope, listStorageService, $timeout, $state, $stateParams, $rootScope, $ionicPopup, $ionicHistory) {

         $scope.model = {};
         $scope.model.list = { id: 0 };
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
             if ($rootScope.servicesLoaded) {
                 if ($stateParams.listId != $scope.model.list.id) {
                     $scope.initTimeFramesAndLoadTasks();
                 } else {
                     $scope.loadTasks($stateParams.listId);
                 }
             }
         });

         //we wait for the service to get initialised before loading the initial task (for homepage)
         $scope.$on("listStorageInitialised", function () {
             $scope.initTimeFramesAndLoadTasks();
             $rootScope.servicesLoaded = true;
         });

         $scope.initTimeFramesAndLoadTasks = function () {
             listStorageService.getListById($stateParams.listId)
                .then(function (list) {
                    $scope.model.list = list;
                    $scope.model.timeFrames = [];

                    //the following code sets up the 'timeframes' which will be used to present the tasks to the user based on the type of list

                    var date = new Date();
                    var early = new Date(0);
                    var today = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
                    var tomorrow = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 0, 0, 0);
                    var dayAfter = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 2, 0, 0, 0);
                   
                    var nextDay = $scope.getDateString(dayAfter);
                    var after = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 3, 0, 0, 0);

                    var nextWeek = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7, 0, 0, 0);
                    var twoWeeks = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 14, 0, 0, 0);
                    var threeWeeks = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 21, 0, 0, 0);

                    if (list.listType == 'simple') {
                        $scope.model.timeFrames[0] = { name: 'All Tasks', time: early, tasks: [] };
                    } else if (list.listType == 'daily') {
                        $scope.model.timeFrames[0] = { name: 'Today', time: today, tasks: [] };
                        $scope.model.timeFrames[1] = { name: 'Tomorrow', time: tomorrow, tasks: [] };
                        $scope.model.timeFrames[2] = { name: nextDay, time: dayAfter, tasks: [] };
                        $scope.model.timeFrames[3] = { name: 'After', time: after, tasks: [] };
                    } else if (list.listType == 'weekly') {
                        $scope.model.timeFrames[0] = { name: $scope.getWeeklyDateString(today, nextWeek), time: today, tasks: [] };
                        $scope.model.timeFrames[1] = { name: $scope.getWeeklyDateString(nextWeek, twoWeeks), time: nextWeek, tasks: [] };
                        $scope.model.timeFrames[2] = { name: $scope.getWeeklyDateString(twoWeeks, threeWeeks), time: twoWeeks, tasks: [] };
                        $scope.model.timeFrames[3] = { name: $scope.getDateString(threeWeeks) + ' onwards', time: threeWeeks, tasks: [] };
                    }


                    $scope.loadTasks(list.id);
                }, function (error) { });
         };

         //getweeklydate
         $scope.getWeeklyDateString = function (date1, date2) {
             return $scope.getDateString(date1) + ' - ' + $scope.getDateString(date2);
         };

         //function to return the date + 'th' from a given date to prettify it in view
         $scope.getDateString = function (date) {
             var weekday = new Array(7);
             weekday[0] = "Sunday";
             weekday[1] = "Monday";
             weekday[2] = "Tuesday";
             weekday[3] = "Wednesday";
             weekday[4] = "Thursday";
             weekday[5] = "Friday";
             weekday[6] = "Saturday";

             var d = date.getDate();
             var dS = d.toString();
             var sS = dS.substring(dS.length - 1, dS.length);
             var arr = parseInt(sS);
             var endings = new Array(4);
             endings[0] = "st";
             endings[1] = "nd";
             endings[2] = "rd";
             endings[3] = "th";
             if (arr >= 4 || arr == 0) {
                 return weekday[date.getDay()] + ' ' + d + endings[3];
             } else {
                 return weekday[date.getDay()] + ' ' + d + endings[arr-1];
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

         //Show sub-menu for deleting list and handling out of date tasks
         $scope.openMenu = function () {
             $scope.prompt = $ionicPopup.show({
                 template: '<div style="text-align:center;"><button class="button button-full button-positive" ng-disabled="model.list.listType == \'simple\'" ng-click="viewOutOfDateTodos()">' +
                     'View missed todo\'s</button><br/><button class="button button-full button-assertive" ng-disabled="!model.list.deletable" ng-click="removeList()">Delete List<i class="icon ion-trash-a"></i></button><br/><button class="button button-light" ng-click="closeMenu()">Close</button></div>',
                 scope: $scope,
                 title: 'List Menu'
             });
         };

         $scope.viewOutOfDateTodos = function () {
             $scope.prompt.close();

             $state.go('app.outOfDateTasks', { listId: $scope.model.list.id });
         };

         $scope.closeMenu = function () {
             $scope.prompt.close();
         };

         $scope.removeList = function () {
             $scope.prompt.close();

             var confirmPopup = $ionicPopup.confirm({
                 title: 'Delete?',
                 template: 'Are you sure you wish to delete list: {{model.list.listName}}??',
                 scope: $scope
             });

             confirmPopup.then(function (res) {
                 if (res) {
                     listStorageService.deleteList($scope.model.list.id)
                        .then(function (deleted) {
                            if (deleted) {
                                window.plugins.toast.showShortCenter('List deleted');
                                $ionicHistory.nextViewOptions({
                                    disableBack: true
                                });
                                $state.go('app.list', { listId: 1 });
                            }
                        }, function (error) { });
                 } else {
                     console.log('You are not sure');
                 }
             });

         };


     }]);
