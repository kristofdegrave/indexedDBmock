/**
 * Created by Kristof on 16/10/2015.
 */

QUnit.module("Objectstore - Count");
QUnit.test("Counting data - Count all", function (assert) {
    var done = assert.async();
    assert.expect(1);
    var key = 1;

    initionalSituationObjectStoreWithKeyPathAndMultipleDataNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var countRequest = objectstore.count();
                    countRequest.onsuccess = function (e){
                        assert.equal(e.target.result, 10, "Count");
                    };
                    countRequest.onerror = function (e){
                        assert.ok(false, "Count error");
                    };
                }
                catch (ex){
                    assert.ok(false, "Count error");
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
QUnit.test("Counting data - key range lowerBound exclusieve", function (assert) {
    var done = assert.async();
    assert.expect(1);

    initionalSituationObjectStoreWithKeyPathAndMultipleDataNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var countRequest = objectstore.count(KeyRange.lowerBound(5, true));
                    countRequest.onsuccess = function (e){
                        assert.deepEqual(e.target.result, 5, "Count");
                    };
                    countRequest.onerror = function (e){
                        assert.ok(false, "Count error");
                    };
                }
                catch (ex){
                    assert.ok(false, "Count error");
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
QUnit.test("Counting data - key range lowerBound inclusieve", function (assert) {
    var done = assert.async();
    assert.expect(1);

    initionalSituationObjectStoreWithKeyPathAndMultipleDataNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var countRequest = objectstore.count(KeyRange.lowerBound(5));
                    countRequest.onsuccess = function (e){
                        assert.deepEqual(e.target.result, 6, "Count");
                    };
                    countRequest.onerror = function (e){
                        assert.ok(false, "Count error");
                    };
                }
                catch (ex){
                    assert.ok(false, "Count error");
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
QUnit.test("Counting data - key range upperBound exclusieve", function (assert) {
    var done = assert.async();
    assert.expect(1);

    initionalSituationObjectStoreWithKeyPathAndMultipleDataNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var countRequest = objectstore.count(KeyRange.upperBound(5, true));
                    countRequest.onsuccess = function (e){
                        assert.deepEqual(e.target.result, 4, "Count");
                    };
                    countRequest.onerror = function (e){
                        assert.ok(false, "Count error");
                    };
                }
                catch (ex){
                    assert.ok(false, "Count error");
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
QUnit.test("Counting data - key range upperBound inclusieve", function (assert) {
    var done = assert.async();
    assert.expect(1);

    initionalSituationObjectStoreWithKeyPathAndMultipleDataNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var countRequest = objectstore.count(KeyRange.upperBound(5, false));
                    countRequest.onsuccess = function (e){
                        assert.deepEqual(e.target.result, 5, "Count");
                    };
                    countRequest.onerror = function (e){
                        assert.ok(false, "Count error");
                    };
                }
                catch (ex){
                    assert.ok(false, "Count error");
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
QUnit.test("Counting data - key range only", function (assert) {
    var done = assert.async();
    assert.expect(1);

    initionalSituationObjectStoreWithKeyPathAndMultipleDataNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var countRequest = objectstore.count(KeyRange.only(1));
                    countRequest.onsuccess = function (e){
                        assert.deepEqual(e.target.result, 1, "Count");
                    };
                    countRequest.onerror = function (e){
                        assert.ok(false, "Count error");
                    };
                }
                catch (ex){
                    assert.ok(false, "Count error");
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
QUnit.test("Counting data - key range between", function (assert) {
    var done = assert.async();
    assert.expect(1);

    initionalSituationObjectStoreWithKeyPathAndMultipleDataNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var countRequest = objectstore.count(KeyRange.bound(1,5, false, false));
                    countRequest.onsuccess = function (e){
                        assert.deepEqual(e.target.result, 5, "Count");
                    };
                    countRequest.onerror = function (e){
                        assert.ok(false, "Count error");
                    };
                }
                catch (ex){
                    assert.ok(false, "Count error");
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
QUnit.test("Counting data - non key range", function (assert) {
    var done = assert.async();
    assert.expect(1);
    var key = 1;

    initionalSituationObjectStoreWithKeyPathAndMultipleDataNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var countRequest = objectstore.count(2);
                    countRequest.onsuccess = function (e){
                        assert.equal(e.target.result, 1, "Count");
                    };
                    countRequest.onerror = function (e){
                        assert.ok(false, "Count error");
                    };
                }
                catch (ex){
                    assert.ok(false, "Count error");
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
QUnit.test("Retrieving data - key invalid", function (assert) {
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
                    var countRequest = objectstore.count(function(){});
                    countRequest.onsuccess = function (e){
                        assert.ok(false, "Data counted");
                    };
                    countRequest.onerror = function (e){
                        assert.ok(false, "Count error");
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