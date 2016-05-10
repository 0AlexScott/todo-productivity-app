angular.module('app.services').factory('productivityService', ['$http', '$q', '$timeout', '$rootScope', '$state', '$ionicPopup', function ($http, $q, $timeout, $rootScope, $state, $ionicPopup) {

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
        service.createAward('Partially Productive', 'Obtained PP THREE days in a row', service.dayInMillis * 3);     //1
        service.createAward('Powerfully Productive', 'Obtained PP SEVEN days in a row', service.dayInMillis * 7);    //2
        service.createAward('Productivity Slugger', 'Obtained PP FOURTEEN days in a row', service.dayInMillis * 14); //3
        service.createAward('Grafter', 'Worked for 200 PP in ONE day', service.dayInMillis);                         //4
        service.createAward('Hard worker', 'Worked for 500 PP in ONE day!', service.dayInMillis);                    //5
        service.createAward('What a day!', 'Completed 10 tasks in one day', service.dayInMillis);                    //6
        service.createAward('Completionist', 'Completed 30 tasks in a week', service.dayInMillis * 7);               //7
        service.createAward('Smashing records', 'Earned more PP than week before', service.dayInMillis * 7);         //8
        service.createAward('Record', 'Most tasks completed in one day', service.dayInMillis);                       //9
        service.createAward('Record', 'Most tasks completed in one week', service.dayInMillis * 7);                  //10
        service.createAward('Record', 'PP gained in one day', service.dayInMillis);                                  //11
        service.createAward('Record', 'PP gained in one week', service.dayInMillis * 7);                             //12
    };

    //check for completed Awards
    service.checkForAwardCompletion = function () {
        return $q(function (resolve, reject) {
            service.getAllAwards().then(function (awards) {
                service.getAllTransactions().then(function (transactions) {
                    var newAwards = [];

                    var d = new Date();
                    var yesterday = new Date(d.getTime() - service.dayInMillis);

                    if (service.canBeAwarded(awards[0])) {
                        var toaward = true;

                        var twodaysago = new Date(d.getTime() - 2 * service.dayInMillis);
                        var threedaysago = new Date(d.getTime() - 3 * service.dayInMillis);
                        var timeFrames = [d, yesterday, twodaysago, threedaysago];
                        for (var i = 0; i < timeFrames.length - 1; i++) {
                            var complete = false;
                            for (var j = 0; j < transactions.length; j++) {
                                if (transactions[j].completionDate > timeFrames[i] && transactions[j] < timeFrames[i + 1]) {
                                    complete = true;
                                }
                            }
                            if (complete == false) {
                                toaward = false;
                            }
                        }
                        if (toaward) {
                            service.updateAward(awards[0].id, awards[0].count + 1, d.getTime());
                            newAwards.push(awards[0]);
                        }
                    }

                    if (service.canBeAwarded(awards[3])) {
                        var totalPPSinceYesterday = 0;

                        for (var i = 0; i < transactions.length; i++) {
                            if (transactions[i].completionDate > yesterday && transactions[i].completionDate < d) {
                                totalPPSinceYesterday += transactions[i].pointsAwarded;
                            }
                        }

                        if (totalPPSinceYesterday >= 200) {
                            service.updateAward(awards[3].id, awards[3].count + 1, d.getTime());
                            newAwards.push(awards[3]);
                        }
                    }

                    if (newAwards.length > 0) {
                        var confirmPopup = $ionicPopup.confirm({
                            title: 'New awards!!!',
                            template: 'You have recieved a new award!<br/><i class="icon ion-trophy"></i><br/>Would you like to visit the awards page?',
                        });

                        confirmPopup.then(function (res) {
                            if (res) {
                                $state.go('app.awards');
                            } else {

                            }
                        });
                    }

                    resolve(true);
                }, function (error) {
                    reject(false);
                })
            }, function (error) {
                reject(false);
            })
        })
    };

    service.canBeAwarded = function (award) {
        var d = new Date();
        var nextAwardDate = new Date(award.lastAwarded.getTime() + award.timeDelay);

        if (d > nextAwardDate) {
            return true;
        }
        return false;
    };

    //create award
    service.createAward = function (awardName, awardDescription, timeDelay) {
        var d = new Date(0);
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
                    service.checkForAwardCompletion();
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