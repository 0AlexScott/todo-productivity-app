angular.module('app.services').factory('productivityService', ['$http', '$q', '$timeout', '$rootScope', function ($http, $q, $timeout, $rootScope) {

    var service = {};

    //Init productivity serivce, create table if none exist
    service.init = function () {
        if (!service.db) {
            service.db = window.sqlitePlugin.openDatabase({ name: "my.productivityPoints.db" });
            service.db.executeSql('CREATE TABLE IF NOT EXISTS productivity_transactions (id integer primary key, pointsAwarded integer, completionDate integer);');
            service.db.executeSql('CREATE TABLE IF NOT EXISTS awards_table (id integer primary key, awardDescription text, );');

        }
    };

    //function to insert points into the database
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
    };

    service.getTotalPoints = function () {
        return $q(function (resolve, reject) {
            service.db.executeSql("SELECT * FROM productivity_transactions;", [], function (res) {
                var totalPoints = 0;
                for (var i = 0; i < res.rows.length; i++) {
                    var points = res.rows.item(i).pointsAwarded;
                    totalPoints = totalPoints + points;
                }
                console.log("Retrieved total points: " + totalPoints);
                resolve(totalPoints);
            }, function (error) {
                console.log('INSERT error: ' + error.message);
                reject(false);
            });
        });
    };    



    return service;
}
]);