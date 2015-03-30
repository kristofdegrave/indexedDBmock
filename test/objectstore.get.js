/**
 * Created by Kristof on 29/03/2015.
 */

QUnit.module("Get");
QUnit.test("Retrieving data - no data present for key", function (assert) {
    var done = assert.async();
    assert.expect(1);
    var key = 1;

    initionalSituationObjectStoreNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var getRequest = objectstore.get(key);
                    getRequest.onsuccess = function (e){
                        equal(e.target.result, undefined, "Data undefined");
                    };
                    getRequest.onerror = function (e){
                        assert.ok(false, "Get error");
                    };
                }
                catch (ex){
                    assert.ok(false, "Get error");
                }

                transaction.oncomplete = function (e){
                    e.target.db.close();
                    done();
                };
                transaction.onabort = function (err){
                    equal(err.error.name, "AbortError", "AbortError");
                    e.target.result.close();
                    done();
                };
                transaction.onerror = function (){
                    assert.ok(false, "Transaction error");
                    e.target.result.close();
                    done();
                };
            }
            catch (ex) {
                assert.ok(false, "Transaction error");
                e.target.result.close();
                done();
            }
        };
        request.onerror = function(){
            assert.ok(false, "Database error");
            done();
        };
    }, done, assert);
});