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
                    var getRequest = objectstore.count();
                    getRequest.onsuccess = function (e){
                        assert.equal(e.target.result, 10, "Count");
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
                    var getRequest = objectstore.count(KeyRange.lowerBound(5, true));
                    getRequest.onsuccess = function (e){
                        assert.deepEqual(e.target.result, 5, "Count");
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
                    var getRequest = objectstore.count(KeyRange.lowerBound(5));
                    getRequest.onsuccess = function (e){
                        assert.deepEqual(e.target.result, 6, "Count");
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
                    var getRequest = objectstore.count(KeyRange.upperBound(5, true));
                    getRequest.onsuccess = function (e){
                        assert.deepEqual(e.target.result, 4, "Count");
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
                    var getRequest = objectstore.count(KeyRange.upperBound(5, false));
                    getRequest.onsuccess = function (e){
                        assert.deepEqual(e.target.result, 5, "Count");
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
                    var getRequest = objectstore.count(KeyRange.only(1));
                    getRequest.onsuccess = function (e){
                        assert.deepEqual(e.target.result, 1, "Count");
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
                    var getRequest = objectstore.count(KeyRange.bound(1,5, false, false));
                    getRequest.onsuccess = function (e){
                        assert.deepEqual(e.target.result, 5, "Count");
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

