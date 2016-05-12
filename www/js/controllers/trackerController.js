angular.module('app.controllers').controller('TrackerCtrl',
    ['$scope', 'listStorageService', 'productivityService',
     function ($scope, listStorageService, productivityService) {

         $scope.model = {};
         $scope.labels = ['0', '1', '2', '3', '4', '5'];
         $scope.data = [];
         $scope.message = "";

         //add a 'loader' to page as it is opening
         $scope.$on('$ionicView.beforeEnter', function (e) {
         });

         //init tasks and add them to their respective lists when the view is entered
         $scope.$on('$ionicView.enter', function (e) {
             productivityService.getPointsOverXWeeks(6).then(function (pointsByWeek) {
                 $scope.data = [pointsByWeek];
                 $scope.createMessage();
             }, function (error) { });
         });


         //generate complimentary message
         $scope.createMessage = function () {
             if ($scope.data[0][0] > $scope.data[0][5]) {
                 var x = $scope.data[0][0] - $scope.data[0][5];
                 $scope.message = "Congratulations!<br/>Your productivity has boosted by " + x + "<img src=\"img/pp.png\" style=\"width:16px;height:16px;\" /> since 5 weeks ago!";
             } else {
                 $scope.message = "Well done, keep up the good work!";
             }
         };

     }]);
