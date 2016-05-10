angular.module('app.services').factory('productivityService', ['$http', '$q', '$timeout', '$rootScope', function ($http, $q, $timeout, $rootScope) {

    var service = {};
    service.dayInMillis = 86400000;

    //Init productivity serivce, create table if none exist
    service.init = function () {
        if (!service.db) {
            service.db = window.sqlitePlugin.openDatabase({ name: "my.productivityPoints.db" });
            service.db.executeSql('CREATE TABLE IF NOT EXISTS productivity_transactions (id integer primary key, pointsAwarded integer, completionDate integer);');
            service.db.executeSql('CREATE TABLE IF NOT EXISTS awards_table (id integer primary key, awardName text, awardDescription text, count integer, lastAwarded integer, timeDelay integer);');
            service.getAllAwards().then(function (rows) {
                if (rows.length < 12) {
                    service.populateAwards();
                }
            }, function (error) { });
        }
    };

    //first time the DB is opened, awards must be instantiated
    service.populateAwards = function () {
        console.log("FirstTimeOpen = true, awards being initialised");
        service.createAward('Partially Productive','Obtained PP THREE days in a row', service.dayInMillis * 3);     //1
        service.createAward('Powerfully Productive','Obtained PP SEVEN days in a row', service.dayInMillis * 7);    //2
        service.createAward('Productivity Slugger','Obtained PP FOURTEEN days in a row', service.dayInMillis * 14); //3
        service.createAward('Grafter','Worked for 200 PP in ONE day', service.dayInMillis);                         //4
        service.createAward('Hard worker','Worked for 500 PP in ONE day!', service.dayInMillis);                    //5
        service.createAward('What a day!','Completed 10 tasks in one day', service.dayInMillis);                    //6
        service.createAward('Completionist','Completed 30 tasks in a week', service.dayInMillis * 7);               //7
        service.createAward('Smashing records','Earned more PP than week before', service.dayInMillis * 7);         //8
        service.createAward('Record','Most tasks completed in one day', service.dayInMillis);                       //9
        service.createAward('Record','Most tasks completed in one week', service.dayInMillis * 7);                  //10
        service.createAward('Record','PP gained in one day', service.dayInMillis);                                  //11
        service.createAward('Record','PP gained in one week', service.dayInMillis * 7);                             //12
    };

    //check for completed Awards
    service.checkForAwardCompletion = function () {
        service.getAllAwards().then(function (awards) {
            service.getAllTransactions().then(function(transactions){
                var d = new Date();
                var newAwards = [];



                resolve();
            }, function (error) {
                reject(false);
            })
        }, function (error) {
            reject(false);
        })
    };

    //create award
    service.createAward = function (awardName, awardDescription, timeDelay) {
        var d = new Date();
        var t = d.getTime();
        return $q(function (resolve, reject) {
            service.db.executeSql("INSERT INTO awards_table (awardName, awardDescription, count, lastAwarded, timeDelay) " +
                "VALUES (?, ?, ?, ?, ?);", [awardName, awardDescription, 0, t, timeDelay], function (res) {
                    console.log("Award added to DB: " + awardName);
                    resolve(true);
                }, function (error) {
                    console.log('INSERT error: ' + error.message);
                    reject(false);
                });
        });
    };

    //gets all awards from table
    service.getAllAwards = function () {
        return $q(function (resolve, reject) {
            service.db.executeSql("SELECT * FROM awards_table;", [], function (res) {
                var rows = res.rows;
                var sanitizedRows = [];
                for (var i = 0; i < rows.length; i++) {
                    sanitizedRows[i] = rows.item(i);
                    sanitizedRows[i].lastAwarded = new Date(parseInt(rows.item(i).lastAwarded, 10));
                }
                console.log("All awards selected");
                resolve(sanitizedRows);
            }, function (error) {
                console.log('INSERT error: ' + error.message);
                reject(false);
            });
        });
    };

    //function to update an award
    service.updateAward = function (id, count, lastAwarded) {
        return $q(function (resolve, reject) {
            service.db.executeSql("UPDATE awards_table SET [count] = ?, [lastAwarded] = ?" +
                "WHERE id=?;", [count, lastAwarded, id], function (res) {
                    resolve(true);
                }, function (error) {
                    console.log('INSERT error: ' + error.message);
                    reject(false);
                });
        });
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

    //return all PP transactions
    service.getAllTransactions = function () {
        return $q(function (resolve, reject) {
            service.db.executeSql("SELECT * FROM productivity_transactions;", [], function (res) {
                var rows = res.rows;
                var sanitizedRows = [];
                for (var i = 0; i < rows.length; i++) {
                    sanitizedRows[i] = rows.item(i);
                    sanitizedRows[i].completionDate = new Date(parseInt(rows.item(i).completionDate, 10));
                }
                resolve(sanitizedRows);
            }, function (error) {
                console.log('INSERT error: ' + error.message);
                reject(false);
            });
        });
    };

    //return total PP
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