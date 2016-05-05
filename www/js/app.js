// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'app.controllers', 'app.services', 'ui.bootstrap', 'ui.bootstrap.datetimepicker'])

.run(['$ionicPlatform', 'listStorageService', '$rootScope', 'productivityService', function ($ionicPlatform, listStorageService, $rootScope, productivityService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  document.addEventListener("deviceready", onDeviceReady, false);

  function onDeviceReady() {
      listStorageService.init();
      productivityService.init();
  }

  $rootScope.previousState;
  $rootScope.previousStateParams;

  $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
      $rootScope.previousState = from.name;
      $rootScope.previousStateParams = fromParams;
      console.log('Previous state:' + $rootScope.previousState + '. Params: ' + fromParams);
  });


}])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html'
  })
    .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl'
        }
      }
    })
    .state('app.taskCreation', {
        url: '/taskCreation',
        views: {
            'menuContent': {
                templateUrl: 'templates/taskCreation.html',
                controller: 'TaskCreationCtrl'
            }
        },
        cache: false,
        params:{listId: 1}
    })
    .state('app.taskView', {
        url: '/taskView?taskId',
        views: {
            'menuContent': {
                templateUrl: 'templates/taskView.html',
                controller: 'TaskViewCtrl'
            }
        },
        cache: false
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});


angular.module('app.controllers', ['ui.bootstrap']);
angular.module('app.services', []);