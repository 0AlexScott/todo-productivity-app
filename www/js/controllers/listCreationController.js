angular.module('app.controllers').controller('ListCreationCtrl',
    ['$scope', 'listStorageService', '$timeout', '$stateParams', '$state', '$rootScope',
    function ($scope, listStorageService, $timeout, $stateParams, $state, $rootScope) {

        //Init variables in task creation
        $scope.model = {};
        $scope.model.listTypes = [{ name: 'Simple Task List', savedAs: 'simple' }, { name: 'Tasks Day by Day', savedAs: 'daily' }, { name: 'Tasks Week by Week', savedAs: 'weekly' }]
        $scope.list = {listName: ''};

        $scope.init = function () {
        };


        //This is used to disable the save button if properties are incorrect
        $scope.checkValid = function () {
            if ($scope.list.listName != '') {
                return false;
            }
            return true;
        };

        //Save the list and redirect the user to its containing page
        $scope.saveList = function () {
            listStorageService.createList($scope.list.listName, $scope.list.listType, true)
                .then(function (listId) {
                    console.log("List created with ID" + listId);
                    window.plugins.toast.show('List created successfully.\n\nRedirecting...', '1000', 'center');
                    $state.go('app.list', ({listId: listId}))
                }, function (error) { console.log("Error in saveList") });
        };


        $scope.init();
    }]);
