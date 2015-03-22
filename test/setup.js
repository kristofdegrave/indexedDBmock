/**
 * Created by Kristof on 17/02/2015.
 */
var indexedDb = window.indexedDBmock;
var dbName = "TestDatabase";
var objectStoreName = "objectStore";
var anOtherObjectStoreName = "anOtherObjectStoreName";
var indexProperty = "name";
var insertData = { test: "insertData", name: "name", id: 1 };
var msgCreatingInitialSituationFailed = "Creating initial situation failed";

function initionalSituation(callBack, done, assert) {
    var request = indexedDb.deleteDatabase(dbName);

    request.onsuccess = function(){
        callBack();
    };
    request.onerror = function(){
        assert.ok(false, msgCreatingInitialSituationFailed);
        done();
    };
}
function initionalSituationDatabase(callBack, done, assert) {
    initionalSituation(function(){
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            e.target.result.close();
            callBack();
        };
        request.onerror = function(){
            assert.ok(false, msgCreatingInitialSituationFailed);
            done();
        };
    }, done, assert);
}
function initionalSituationDatabaseVersion(callBack, done, assert) {
    initionalSituation(function(){
        var request = indexedDb.open(dbName, 2);
        request.onsuccess = function(e){
            e.target.result.close();
            callBack();
        };
        request.onerror = function(){
            assert.ok(false, msgCreatingInitialSituationFailed);
            done();
        };
    }, done, assert);
}
function initionalSituationObjectStore(callBack, done, assert) {
    initionalSituation(function(){
        var request = indexedDb.open(dbName, 1);
        request.onsuccess = function(e){
            e.target.result.close();
            callBack();
        };
        request.onerror = function(){
            assert.ok(false, msgCreatingInitialSituationFailed);
            done();
        };
        request.onupgradeneeded = function(e){
            if (e.type == "upgradeneeded") {
                try {
                    e.target.transaction.db.createObjectStore(objectStoreName);
                }
                catch (ex) {
                    assert.ok(false, msgCreatingInitialSituationFailed);
                    done();
                }
            }
        };
    }, done, assert);
}
function initionalSituation2ObjectStore(callBack, done, assert) {
    initionalSituation(function(){
        var request = indexedDb.open(dbName, 1);
        request.onsuccess = function(e){
            e.target.result.close();
            callBack();
        };
        request.onerror = function(){
            assert.ok(false, msgCreatingInitialSituationFailed);
            done();
        };
        request.onupgradeneeded = function(e){
            if (e.type == "upgradeneeded") {
                try {
                    e.target.transaction.db.createObjectStore(objectStoreName);
                    e.target.transaction.db.createObjectStore(anOtherObjectStoreName);
                }
                catch (ex) {
                    assert.ok(false, msgCreatingInitialSituationFailed);
                    done();
                }
            }
        };
    }, done, assert);
}
function initionalSituationObjectStoreNoAutoIncrement(callBack, done, assert) {
    initionalSituation(function() {
        var request = indexedDb.open(dbName, 1);
        request.onsuccess = function (e) {
            e.target.result.close();
            callBack();
        };
        request.onerror = function () {
            assert.ok(false, msgCreatingInitialSituationFailed);
            done();
        };
        request.onupgradeneeded = function (e) {
            if (e.type == "upgradeneeded") {
                try {
                    e.target.transaction.db.createObjectStore(objectStoreName, {autoIncrement: false});
                }
                catch (ex) {
                    assert.ok(false, msgCreatingInitialSituationFailed);
                    done();
                }
            }
        };
    });
}
function initionalSituationObjectStoreWithAutoIncrement(callBack, done, assert) {
    initionalSituation(function () {
        var request = indexedDb.open(dbName, 1);
        request.onsuccess = function (e) {
            e.target.result.close();
            callBack();
        };
        request.onerror = function () {
            assert.ok(false, msgCreatingInitialSituationFailed);
            done();
        };
        request.onupgradeneeded = function (e) {
            if (e.type == "upgradeneeded") {
                try {
                    e.target.transaction.db.createObjectStore(objectStoreName, { autoIncrement: true });
                }
                catch (ex) {
                    assert.ok(false, msgCreatingInitialSituationFailed);
                    done();
                }
            }
        };
    });
}
function initionalSituationObjectStoreWithKeyPathNoAutoIncrement(callBack, done, assert) {
    initionalSituation(function() {
        var request = indexedDb.open(dbName, 1);
        request.onsuccess = function (e) {
            e.target.result.close();
            callBack();
        };
        request.onerror = function () {
            assert.ok(false, msgCreatingInitialSituationFailed);
            done();
        };
        request.onupgradeneeded = function (e) {
            if (e.type == "upgradeneeded") {
                try {
                    e.target.transaction.db.createObjectStore(objectStoreName, {keyPath: "id", autoIncrement: false});
                }
                catch (ex) {
                    assert.ok(false, msgCreatingInitialSituationFailed);
                    done();
                }
            }
        };
    });
}
function initionalSituationObjectStoreWithKeyPathAndAutoIncrement(callBack, done, assert) {
    initionalSituation(function() {
        var request = indexedDb.open(dbName, 1);
        request.onsuccess = function (e) {
            e.target.result.close();
            callBack();
        };
        request.onerror = function () {
            assert.ok(false, msgCreatingInitialSituationFailed);
            done();
        };
        request.onupgradeneeded = function (e) {
            if (e.type == "upgradeneeded") {
                try {
                    e.target.transaction.db.createObjectStore(objectStoreName, {keyPath: "id", autoIncrement: true});
                }
                catch (ex) {
                    assert.ok(false, msgCreatingInitialSituationFailed);
                    done();
                }
            }
        };
    });
}
function initionalSituationObjectStoreNoAutoIncrementWithData(callBack, done, assert) {
    initionalSituation(function() {
        var request = indexedDb.open(dbName, 1);
        request.onsuccess = function (e) {
            e.target.result.close();
            callBack();
        };
        request.onerror = function () {
            assert.ok(false, msgCreatingInitialSituationFailed);
            done();
        };
        request.onupgradeneeded = function (e) {
            if (e.type == "upgradeneeded") {
                try {
                    var objectstore = e.target.transaction.db.createObjectStore(objectStoreName, { autoIncrement: false });
                    objectstore.add(insertData, insertData.id);
                }
                catch (ex) {
                    assert.ok(false, msgCreatingInitialSituationFailed);
                    done();
                }
            }
        };
    });
}
function initionalSituationObjectStoreWithKeyPathAndDataNoAutoIncrement(callBack, done, assert) {
    initionalSituation(function() {
        var request = indexedDb.open(dbName, 1);
        request.onsuccess = function (e) {
            e.target.result.close();
            callBack();
        };
        request.onerror = function () {
            assert.ok(false, msgCreatingInitialSituationFailed);
            done();
        };
        request.onupgradeneeded = function (e) {
            if (e.type == "upgradeneeded") {
                try {
                    var objectstore = e.target.transaction.db.createObjectStore(objectStoreName, {keyPath: "id", autoIncrement: false});
                    objectstore.add(insertData);
                }
                catch (ex) {
                    assert.ok(false, msgCreatingInitialSituationFailed);
                    done();
                }
            }
        };
    });
}
function initionalSituationIndex(callBack, done, assert) {
    initionalSituation(function(){
        var request = indexedDb.open(dbName, 1);
        request.onsuccess = function(e){
            e.target.result.close();
            callBack();
        };
        request.onerror = function(){
            assert.ok(false, msgCreatingInitialSituationFailed);
            done();
        };
        request.onupgradeneeded = function(e){
            if (e.type == "upgradeneeded") {
                try {
                    var objectstore = e.target.transaction.db.createObjectStore(objectStoreName);
                    objectstore.createIndex(indexProperty, indexProperty);
                }
                catch (ex) {
                    assert.ok(false, msgCreatingInitialSituationFailed);
                    done();
                }
            }
        };
    }, done, assert);
}

function initionalSituationIndexUniqueIndexWithData(callBack, done, assert) {
    initionalSituation(function(){
        var request = indexedDb.open(dbName, 1);
        request.onsuccess = function(e){
            e.target.result.close();
            callBack();
        };
        request.onerror = function(){
            assert.ok(false, msgCreatingInitialSituationFailed);
            done();
        };
        request.onupgradeneeded = function(e){
            if (e.type == "upgradeneeded") {
                try {
                    var objectstore = e.target.transaction.db.createObjectStore(objectStoreName);
                    objectstore.createIndex(indexProperty, indexProperty, { unique: true });
                    objectstore.add(insertData, insertData.id);
                }
                catch (ex) {
                    assert.ok(false, msgCreatingInitialSituationFailed);
                    done();
                }
            }
        };
    }, done, assert);
}