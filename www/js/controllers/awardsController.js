angular.module('app.controllers').controller('AwardsCtrl',
    ['$scope', 'listStorageService',
     function ($scope, listStorageService) {

         $scope.model = {};
         $scope.model.hello = "ello ello ello";

         //add a 'loader' to page as it is opening
         $scope.$on('$ionicView.beforeEnter', function (e) {
         });

         //init tasks and add them to their respective lists when the view is entered
         $scope.$on('$ionicView.enter', function (e) {
         });

     }]);
