angular.module('app.controllers').controller('MenuCtrl',
    ['$scope', 'listStorageService', '$timeout', '$state', 'productivityService',
     function ($scope, listStorageService, $timeout, $state, productivityService) {

         $scope.model = {};
         $scope.model.totalPP = 0;
         $scope.model.lists = [];

         $scope.$on('$ionicView.enter', function (e) {
             productivityService.getTotalPoints().then(function (points) {
                 $scope.model.totalPP = points;
             }, function (error) { });

             listStorageService.getLists().then(function (lists) {
                 $scope.model.lists = lists;
             }, function (error) { });
         });

         $scope.$on("listStorageInitialised", function () {
             
         });





     }]);
