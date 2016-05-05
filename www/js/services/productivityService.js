angular.module('app.services').factory('productivityService', ['$http', '$q', '$timeout', '$rootScope', function ($http, $q, $timeout, $rootScope) {

    var service = {};

    service.init = function () {
        if (!service.db) {
            service.db = window.sqlitePlugin.openDatabase({ name: "my.storage.db" });
            service.db.executeSql('CREATE TABLE IF NOT EXISTS productivity_transactions (id integer primary key, pointsAwarded integer, completionDate integer);');
            
            console.log("ListService initialising");
            if (!service.db) {
                $timeout(
                    $rootScope.$broadcast("pointsTableInitialised"),
                4000);
            } else {
                $rootScope.$broadcast("pointsTableInitialised");
            }
        }
    };

    service.awardPoints = function (points) {
        var date = new Date();
        var dateMillis = date.getTime();
        return $q(function (resolve, reject) {
            service.db.executeSql("INSERT INTO productivity_transactions (pointsAwarded, completionDate) " +
                "VALUES (?, ?);", [points, dateMillis], function (res) {
                    console.log("Points added to DB: " + points);
                    resolve(true);
                }, function (error) {
                    console.log('INSERT error: ' + error.message);
                    reject(false);
                });
        });
    }

    return service;
}
]);