angular.module('app.services').factory('listStorageService', ['$http', '$q', function ($http, $q) {

    var service = {};

    service.init = function () {
        if (!service.db) {
            service.db = window.sqlitePlugin.openDatabase({ name: "my.storing.db" });
            service.db.executeSql('CREATE TABLE IF NOT EXISTS content_store (id integer primary key, topicId text, topicName text, sectionHtml text, sectionType text, userComment text);');
        }
    };

    return service;
}
]);