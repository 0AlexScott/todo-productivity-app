angular.module('app.controllers').controller('TrackerCtrl',
    ['$scope', 'listStorageService', 'productivityService',
     function ($scope, listStorageService, productivityService) {

         $scope.model = {};
         $scope.labels = ['6', '5', '4', '3', '2', '1', '0'];

         $scope.data = [];

         //add a 'loader' to page as it is opening
         $scope.$on('$ionicView.beforeEnter', function (e) {
         });

         //init tasks and add them to their respective lists when the view is entered
         $scope.$on('$ionicView.enter', function (e) {
             productivityService.getPointsOverXWeeks(7).then(function (pointsByWeek) {
                 $scope.data = [pointsByWeek];
             }, function (error) { });
         });

     }]);
