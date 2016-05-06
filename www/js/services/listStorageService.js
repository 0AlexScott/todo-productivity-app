angular.module('app.services').factory('listStorageService', ['$http', '$q', '$timeout', '$rootScope', function ($http, $q, $timeout, $rootScope) {

    var service = {};

    //Init db
    service.init = function () {
        if (!service.db) {
            service.db = window.sqlitePlugin.openDatabase({ name: "my.listAndTask.db" });
            service.db.executeSql('CREATE TABLE IF NOT EXISTS list_table (id integer primary key, listName text UNIQUE, listType text, deletable integer);');
            service.db.executeSql('CREATE TABLE IF NOT EXISTS task_table (id integer primary key, listId integer, taskName text, subTasks text, completionDate integer, productivityPoints integer, reminder integer);');

            console.log("ListService initialising");
            if (!service.db) {
                console.log("List Service timing 4000ms");
                $timeout(
                    service.firstTimeOpen(),
                4000);
            } else {
                console.log("List Service executing first time open");
                service.firstTimeOpen();
            }
        }
    };

    //If the database has just been created - we need to create a number of default lists
    service.firstTimeOpen = function () {
        return $q(function (resolve, reject) {
            service.db.executeSql("SELECT id FROM list_table;", [], function (res) {
                if (res.rows.length > 0) {
                    console.log("FirstTimeOpen = false, no new lists");
                    $rootScope.$broadcast("listStorageInitialised");
                    resolve(true);
                } else {
                    console.log("FirstTimeOpen = true, lists being initialised");
                    service.createList('Todo: Next few days', 'daily', 0);
                    service.createList('Todo: Some day', 'simple', 0);
                    service.createList('Incomplete tasks', 'simple', 0);
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

    //function to add list to table
    service.createList = function (listName, listType, deletable) {
        return $q(function (resolve, reject) {
            service.db.executeSql("INSERT INTO list_table (listName, listType, deletable) " +
                "VALUES (?, ?, ?);", [listName, listType, deletable], function (res) {
                    service.db.executeSql("SELECT * FROM list_table WHERE listName=?;", [listName], function (res) {
                        resolve(res.rows.item(0).id);
                    }, function (error) {
                        console.log('Select error in createList')
                        reject(false);
                    });
                }, function (error) {
                    console.log('INSERT error: ' + error.message);
                    reject(false);
                });
        });
    };

    //function to retrieve all lists
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

    //function to retrieve specific list
    service.getListById = function (listId) {
        return $q(function (resolve, reject) {
            service.db.executeSql("SELECT * FROM list_table WHERE id=?;", [listId], function (res) {
                console.log("List retrieved with id " + listId);
                resolve(res.rows.item(0));
            }, function (error) {
                reject(console.log('SELECT error in getLists'));
            });
        });
    };

    //function to create a task
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

    //function to update a task
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

    //get all tasks in list
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

    //get single task
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

    //delete task
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