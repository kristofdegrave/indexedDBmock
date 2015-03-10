/**
 * Created by Kristof on 17/02/2015.
 */
var dbName = "TestDatabase";
var msgCreatingInitialSituationFailed = "Creating initial situation failed";

function initionalSituation(callBack, done, assert) {
    var request = window.indexedDBmock.deleteDatabase(dbName);

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
        var request = window.indexedDBmock.open(dbName);
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
        var request = window.indexedDBmock.open(dbName, 2);
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