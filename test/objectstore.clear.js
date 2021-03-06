/**
 * Created by Kristof on 29/03/2015.
 */

QUnit.module("Objectstore - Clear");
QUnit.test("Clearing data - delete data", function (assert) {
    var done = assert.async();
    assert.expect(2);
    var key = 1;

    initionalSituationObjectStoreNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var clearRequest = objectstore.clear();
                    clearRequest.onsuccess = function (e){
                        assert.equal(e.target.result, undefined, "Data cleared");

                        var countRequest = objectstore.count();

                        countRequest.onsuccess = function (e){
                            assert.equal(e.target.result, 0, "Data deleted");

                        };
                        countRequest.onerror = function (e){
                            assert.ok(false, "Count error");
                        };
                    };
                    clearRequest.onerror = function (e){
                        assert.ok(false, "Delete error");
                    };
                }
                catch (ex){
                    assert.ok(false, "Delete error");
                }

                transaction.oncomplete = function (e){
                    e.target.db.close();
                    done();
                };
                transaction.onabort = function (err){
                    assert.equal(err.error.name, "AbortError", "AbortError");
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
QUnit.test("Clearing data - ReadOnly transaction", function (assert) {
    var done = assert.async();
    assert.expect(1);

    initionalSituationObjectStoreNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readonly");
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var clearRequest = objectstore.clear();
                    clearRequest.onsuccess = function (e){
                        assert.ok(false, "data deleted");
                    };
                    clearRequest.onerror = function (e){
                        assert.ok(false, "delete error");
                    };
                }
                catch (ex){
                    assert.equal(ex.name, "ReadOnlyError", "ReadOnlyError");
                }

                transaction.oncomplete = function (e){
                    e.target.db.close();
                    done();
                };
                transaction.onabort = function (err){
                    assert.ok(false, "Transaction abort");
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
                assert.ok(false, "Transaction exception");
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

// TODO Add test with indexes check if data is present