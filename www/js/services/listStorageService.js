angular.module('app.services').factory('listStorageService', ['$http', '$q', '$timeout', '$rootScope', function ($http, $q, $timeout, $rootScope) {

    var service = {};

    service.init = function () {
        if (!service.db) {
            service.db = window.sqlitePlugin.openDatabase({ name: "my.storage.db" });
            service.db.executeSql('CREATE TABLE IF NOT EXISTS list_table (id integer primary key, listName text, deletable integer);');
            service.db.executeSql('CREATE TABLE IF NOT EXISTS task_table (id integer primary key, listId integer, taskName text, subTasks text, completionDate integer, productivityPoints integer, reminder integer);');

            console.log("ListService initialising");
            if (!service.db) {
                $timeout(
                    service.firstTimeOpen(),
                4000);
            } else {
                service.firstTimeOpen();
            }
        }
    };

    service.firstTimeOpen = function () {
        return $q(function (resolve, reject) {
            service.db.executeSql("SELECT id FROM list_table;", [], function (res) {
                if (res.rows.length > 0) {
                    console.log("FirstTimeOpen = false, no new lists");
                    $rootScope.$broadcast("listStorageInitialised");
                    resolve(true);
                } else {
                    console.log("FirstTimeOpen = true, lists being initialised");
                    service.createList('Todo: Next few days', 0);
                    service.createList('Todo: Some day', 0);
                    service.createList('Incomplete tasks', 0);
                    var d = new Date();
                    var milli = d.getTime();
                    service.createTask(1, 'Make new list', '[{\"name\":\"Create list from side menu\"}, {\"name\":\"Open list and add new task\"}]', milli, 50, 0);
                    $rootScope.$broadcast("listStorageInitialised");
                    resolve(true);
                }
            }, function (error) {
                reject(console.log('SELECT error in $scope.firstTimeOpen'));
            });
        });



    };

    service.createList = function (listName, deletable) {
        return $q(function (resolve, reject) {
            service.db.executeSql("INSERT INTO list_table (listName, deletable) " +
                "VALUES (?, ?);", [listName, deletable], function (res) {
                    resolve(true);
                }, function (error) {
                    console.log('INSERT error: ' + error.message);
                    reject(false);
                });
        });
    };

    service.getLists = function () {
        return $q(function (resolve, reject) {
            service.db.executeSql("SELECT * FROM list_table;", [], function (res) {
                var rows = res.rows;
                var sanitizedRows = [];
                for (var i = 0; i < rows.length; i++) {
                    sanitizedRows[i] = rows.item(i);
                }
                console.log("Get Lists executed in listStorageService");
                resolve(sanitizedRows);
            }, function (error) {
                reject(console.log('SELECT error in getLists'));
            });
        });
    };

    service.createTask = function (listId, taskName, subTasks, completionDate, productivityPoints, reminder) {
        return $q(function (resolve, reject) {
            service.db.executeSql("INSERT INTO task_table (listId, taskName, subTasks, completionDate, productivityPoints, reminder) " +
                "VALUES (?, ?, ?, ?, ?, ?);", [listId, taskName, subTasks, completionDate, productivityPoints, reminder], function (res) {
                    console.log("Task created with time: " + completionDate);
                    resolve(true);
                }, function (error) {
                    console.log('INSERT error: ' + error.message);
                    reject(false);
                });
        });
    };

    service.updateTask = function (id, listId, taskName, subTasks, completionDate, productivityPoints, reminder) {
        return $q(function (resolve, reject) {
            service.db.executeSql("UPDATE task_table SET [listId] = ?, [taskName] = ?, [subTasks] = ?, [completionDate] = ?, [productivityPoints] = ?, [reminder] = ? " +
                "WHERE id=?);"
                , [listId, taskName, subTasks, completionDate, productivityPoints, reminder, id], function (res) {
                    resolve(true);
                }, function (error) {
                    console.log('INSERT error: ' + error.message);
                    reject(false);
                });
        });
    };

    service.getTasksInList = function (listId) {
        return $q(function (resolve, reject) {
            service.db.executeSql("SELECT * FROM task_table WHERE listId=?;", [listId], function (res) {
                var rows = res.rows;
                var sanitizedRows = [];
                for (var i = 0; i < rows.length; i++) {
                    sanitizedRows[i] = rows.item(i);
                    sanitizedRows[i].subTasks = angular.fromJson(rows.item(i).subTasks);
                    sanitizedRows[i].completionDate = new Date(parseInt(rows.item(i).completionDate, 10));                    
                }
                console.log("Tasks in list retrieved");
                resolve(sanitizedRows);
            }, function (error) {
                reject(console.log('SELECT error in getTasksInList'));
            });
        });
    };

    service.getTask = function (taskId) {
        return $q(function (resolve, reject) {
            service.db.executeSql("SELECT * FROM task_table WHERE id=?;", [taskId], function (res) {
                var rows = res.rows;
                var sanitizedRow = rows.item(0);
                sanitizedRow.subTasks = angular.fromJson(rows.item(0).subTasks);
                sanitizedRow.completionDate = new Date(parseInt(rows.item(0).completionDate, 10));                
                console.log("Task retrieved with id " + taskId);
                resolve(sanitizedRow);
            }, function (error) {
                reject(console.log('SELECT error in getTasksInList'));
            });
        });
    };

    service.deleteTask = function (taskId) {
        return $q(function (resolve, reject) {
            service.db.executeSql("DELETE FROM task_table WHERE id=?;", [taskId], function (res) {
                resolve(true);
            }, function (error) {
                reject(console.log('SELECT error: ' + error.message));
            });
        });
    };


    return service;
}
]);