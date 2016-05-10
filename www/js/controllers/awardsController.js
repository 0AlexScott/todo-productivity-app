angular.module('app.controllers').controller('AwardsCtrl',
    ['$scope', 'listStorageService', 'productivityService',
     function ($scope, listStorageService, productivityService) {

         $scope.model = {};
         $scope.model.trophies = [];
         $scope.model.records = [];

         //add a 'loader' to page as it is opening
         $scope.$on('$ionicView.beforeEnter', function (e) {
             $scope.model.trophies = [];
             $scope.model.records = [];
         });

         //init tasks and add them to their respective lists when the view is entered
         $scope.$on('$ionicView.enter', function (e) {
             productivityService.getAllAwards().then(function (awards) {
                 $scope.model.trophies = awards.slice(0, 8);
                 $scope.model.records = awards.slice(8, 12);
             }, function (error) { });
         });

     }]);
