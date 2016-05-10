angular.module('app.controllers').controller('OutOfDateListCtrl',
    ['$scope', 'listStorageService', '$stateParams',
     function ($scope, listStorageService, $stateParams) {

         $scope.model = {};
         $scope.model.tasks = [];

         //add a 'loader' to page as it is opening
         $scope.$on('$ionicView.beforeEnter', function (e) {
             $(".pageSpinner").show();
             $(".page-content").hide();
             $scope.model.pageLoaded = false;
         });

         //init tasks and add them to their respective lists when the view is entered
         $scope.$on('$ionicView.enter', function (e) {
             $scope.model.tasks = [];
             $scope.loadTasks($stateParams.listId);

         });

         //load tasks in the list, and assign them to a timespan
         $scope.loadTasks = function (listId) {
             listStorageService.getOutOfDateTasksInList(listId).then(function (rows) {
                 $scope.model.tasks = rows;
                 $(".pageSpinner").hide();
                 $(".page-content").show();

             }, function (error) { console.log("Error in $scope.loadTasks") });
         };


     }]);
