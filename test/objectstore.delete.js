/**
 * Created by Kristof on 29/03/2015.
 */

QUnit.module("Objectstore - Delete");
QUnit.test("Deleting data - no data present for key", function (assert) {
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
                    var deleteRequest = objectstore.delete(key);
                    deleteRequest.onsuccess = function (e){
                        assert.equal(e.target.result, undefined, "Data undefined");

                        var countRequest = objectstore.count(key);

                        countRequest.onsuccess = function (e){
                            assert.equal(e.target.result, 0, "Data deleted");

                        };
                        countRequest.onerror = function (e){
                            assert.ok(false, "Count error");
                        };
                    };
                    deleteRequest.onerror = function (e){
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
QUnit.test("Deleting data - key", function (assert) {
    var done = assert.async();
    assert.expect(1);

    initionalSituationObjectStoreNoAutoIncrementWithData(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var deleteRequest = objectstore.delete(addData.id);
                    deleteRequest.onsuccess = function (e){
                        assert.equal(e.target.result, undefined, "Data deleted");
                    };
                    deleteRequest.onerror = function (e){
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
QUnit.test("Deleting data - key range lowerBound exclusieve", function (assert) {
    var done = assert.async();
    assert.expect(2);

    initionalSituationObjectStoreWithKeyPathAndMultipleDataNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var deleteRequest = objectstore.delete(KeyRange.lowerBound(5, true));
                    deleteRequest.onsuccess = function (e){
                        assert.equal(e.target.result, undefined, "Data deleted");

                        var countRequest = objectstore.count(KeyRange.lowerBound(5, true));

                        countRequest.onsuccess = function (e){
                            assert.equal(e.target.result, 0, "Data deleted");

                        };
                        countRequest.onerror = function (e){
                            assert.ok(false, "Count error");
                        };
                    };
                    deleteRequest.onerror = function (e){
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
QUnit.test("Deleting data - key range lowerBound inclusieve", function (assert) {
    var done = assert.async();
    assert.expect(2);

    initionalSituationObjectStoreWithKeyPathAndMultipleDataNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var deleteRequest = objectstore.delete(KeyRange.lowerBound(5));
                    deleteRequest.onsuccess = function (e){
                        assert.equal(e.target.result, undefined, "Data deleted");

                        var countRequest = objectstore.count(KeyRange.lowerBound(5));

                        countRequest.onsuccess = function (e){
                            assert.equal(e.target.result, 0, "Data deleted");

                        };
                        countRequest.onerror = function (e){
                            assert.ok(false, "Count error");
                        };
                    };
                    deleteRequest.onerror = function (e){
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
QUnit.test("Deleting data - key range upperBound exclusieve", function (assert) {
    var done = assert.async();
    assert.expect(2);

    initionalSituationObjectStoreWithKeyPathAndMultipleDataNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var deleteRequest = objectstore.delete(KeyRange.upperBound(5, true));
                    deleteRequest.onsuccess = function (e){
                        assert.equal(e.target.result, undefined, "Data deleted");

                        var countRequest = objectstore.count(KeyRange.upperBound(5, true));

                        countRequest.onsuccess = function (e){
                            assert.equal(e.target.result, 0, "Data deleted");

                        };
                        countRequest.onerror = function (e){
                            assert.ok(false, "Count error");
                        };
                    };
                    deleteRequest.onerror = function (e){
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
QUnit.test("Deleting data - key range upperBound inclusieve", function (assert) {
    var done = assert.async();
    assert.expect(2);

    initionalSituationObjectStoreWithKeyPathAndMultipleDataNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var deleteRequest = objectstore.delete(KeyRange.upperBound(5, false));
                    deleteRequest.onsuccess = function (e){
                        assert.equal(e.target.result, undefined, "Data deleted");

                        var countRequest = objectstore.count(KeyRange.upperBound(5, false));

                        countRequest.onsuccess = function (e){
                            assert.equal(e.target.result, 0, "Data deleted");

                        };
                        countRequest.onerror = function (e){
                            assert.ok(false, "Count error");
                        };
                    };
                    deleteRequest.onerror = function (e){
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
QUnit.test("Deleting data - key range only", function (assert) {
    var done = assert.async();
    assert.expect(2);

    initionalSituationObjectStoreWithKeyPathAndMultipleDataNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var deleteRequest = objectstore.delete(KeyRange.only(1));
                    deleteRequest.onsuccess = function (e){
                        assert.equal(e.target.result, undefined, "Data deleted");

                        var countRequest = objectstore.count(KeyRange.only(1));

                        countRequest.onsuccess = function (e){
                            assert.equal(e.target.result, 0, "Data deleted");

                        };
                        countRequest.onerror = function (e){
                            assert.ok(false, "Count error");
                        };
                    };
                    deleteRequest.onerror = function (e){
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
QUnit.test("Deleting data - key range between", function (assert) {
    var done = assert.async();
    assert.expect(2);

    initionalSituationObjectStoreWithKeyPathAndMultipleDataNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var deleteRequest = objectstore.delete(KeyRange.bound(1,5, false, false));
                    deleteRequest.onsuccess = function (e){
                        assert.equal(e.target.result, undefined, "Data deleted");

                        var countRequest = objectstore.count(KeyRange.bound(1,5, false, false));

                        countRequest.onsuccess = function (e){
                            assert.equal(e.target.result, 0, "Data deleted");

                        };
                        countRequest.onerror = function (e){
                            assert.ok(false, "Count error");
                        };
                    };
                    deleteRequest.onerror = function (e){
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
QUnit.test("Deleting data - key invalid", function (assert) {
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
                    var deleteRequest = objectstore.delete(function(){});
                    deleteRequest.onsuccess = function (e){
                        assert.ok(false, "Data deleted");
                    };
                    deleteRequest.onerror = function (e){
                        assert.ok(false, "Delete error");
                    };
                }
                catch (ex){
                    assert.equal(ex.name, "DataError", ex.name);
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
QUnit.test("Deleting data - no key", function (assert) {
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
                    var deleteRequest = objectstore.delete();
                    deleteRequest.onsuccess = function (e){
                        assert.ok(false, "Data deleted");
                    };
                    deleteRequest.onerror = function (e){
                        assert.ok(false, "Delete error");
                    };
                }
                catch (ex){
                    assert.equal(ex.name, "TypeError", ex.name);
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
QUnit.test("Deleting data - ReadOnly transaction", function (assert) {
    var done = assert.async();
    assert.expect(1);

    initionalSituationObjectStoreNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readonly");
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var deleteRequest = objectstore.delete(1);
                    deleteRequest.onsuccess = function (e){
                        assert.ok(false, "data deleted");
                    };
                    deleteRequest.onerror = function (e){
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