angular.module('app.services').factory('listStorageService', ['$http', '$q', '$timeout', function ($http, $q, $timeout) {

    var service = {};

    service.init = function () {
        if (!service.db) {
            service.db = window.sqlitePlugin.openDatabase({ name: "my.storage.db" });
            service.db.executeSql('CREATE TABLE IF NOT EXISTS list_table (id integer primary key, listName text, deletable integer);');
            service.db.executeSql('CREATE TABLE IF NOT EXISTS task_table (id integer primary key, listId integer, taskName text, subTasks text, completionDate text, productivityPoints integer, reminder integer);');
            service.firstTimeOpen();
        }
    };

    service.firstTimeOpen = function () {
        //1: check if any lists are in list_table
        //2: if yes, do nothing
        //3: if no, create two lists and add task to list
        return $q(function (resolve, reject) {
            service.db.executeSql("SELECT * FROM list_table;", function (res) {
                if (res.rows.length > 0) {
                    return 0;
                } else {
                    service.createList('Todo: Next few days', 0);
                    service.createList('Todo: Some day', 0);
                    var d = new Date();
                    var n = d.getDate();
                    var m = d.getMonth();
                    var date = n + "/" + m;
                    service.createTask(1, 'Make new list', '[{\"name\":\"Create list from side menu\"}, {\"name\":\"Open list and add new task\"}]', date, 50, 0);
                }
            }, function (error) {
                reject(console.log('SELECT error: ' + error.message));
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

    service.createTask = function (listId, taskName, subTasks, completionDate, productivityPoints, reminder) {
        return $q(function (resolve, reject) {
            service.db.executeSql("INSERT INTO task_table (listId, taskName, subTasks, completionDate, productivityPoints, reminder) " +
                "VALUES (?, ?, ?, ?, ?, ?);", [listId, taskName, subTasks, completionDate, productivityPoints, reminder], function (res) {
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
                resolve(res.rows);
            }, function (error) {
                reject(console.log('SELECT error: ' + error.message));
            });
        });
    };


    return service;
}
]);