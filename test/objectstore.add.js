/**
 * Created by Kristof on 10/03/2015.
 */

QUnit.module("Insert");
QUnit.test("Inserting data", function (assert) {
    var done = assert.async();
    assert.expect(1);
    var data = { test: "test" };

    initionalSituationObjectStoreNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName]);
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var insertRequest = objectstore.add(data);

                    insertRequest.onsuccess = function (e){
                        ok(false, "data inserted");
                    };
                    insertRequest.onerror = function (e){
                        equal(e.error.type, "DataError", "DataError");
                    };
                }
                catch (ex){
                    equal(ex.name, "DataError", "DataError");
                }

                transaction.oncomplete = function (e){
                    e.target.db.close();
                    done();
                };
                transaction.onabort = function (){
                    assert.ok(false, "Transaction aborted");
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
    });
});
QUnit.test("Inserting data with external key", function (assert) {
    var done = assert.async();
    assert.expect(2);
    var data = { test: "test" };
    var key = 1;

    initionalSituationObjectStoreNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName]);
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var insertRequest = objectstore.add(data, key);

                    insertRequest.onsuccess = function (e){
                        ok(true, "data inserted");
                        equal(e.target.result, key, "Key ok");
                    };
                    insertRequest.onerror = function (e){
                        ok(false, "insert error");
                    };
                }
                catch (ex){
                    ok(false, "insert error");
                }

                transaction.oncomplete = function (e){
                    e.target.db.close();
                    done();
                };
                transaction.onabort = function (){
                    assert.ok(false, "Transaction aborted");
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
    });
});