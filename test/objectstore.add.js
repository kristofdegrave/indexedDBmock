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
QUnit.test("Inserting data - objectstore autoincrement", function (assert) {
    var done = assert.async();
    assert.expect(1);
    var data = { test: "test" };
    initionalSituationObjectStoreWithAutoIncrement(function () {
		var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName]);
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var insertRequest = objectstore.add(data);

                    insertRequest.onsuccess = function (e){
                        ok(true, "data inserted");
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
QUnit.test("Inserting data with external key - objectstore autoincrement", function (assert) {
    var done = assert.async();
    assert.expect(2);
	var data = { test: "test" };
	var key = 1;
	initionalSituationObjectStoreWithAutoIncrement(function () {
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
QUnit.test("Inserting data with external key (increase autoincrement) - objectstore autoincrement", function (assert) {
    var done = assert.async();
    assert.expect(3);
	var data = { test: "test" };
	initionalSituationObjectStoreWithAutoIncrement(function () {
		var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName]);
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var insertRequest = objectstore.add(data);

                    insertRequest.onsuccess = function (e){
                        ok(true, "data inserted");
                        var key = e.target.result;
						
						try{
							var insertRequest2 = objectstore.add(data, (key + 3));

							insertRequest2.onsuccess = function (e){
								equal(e.target.result, (key + 3), "Key same as provided");
                                try{
                                    var insertRequest3 = objectstore.add(data);

                                    insertRequest3.onsuccess = function (e){
                                        equal(e.target.result, (key + 4), "Key increased after add with provided key");
                                    };
                                    insertRequest3.onerror = function (e){
                                        ok(false, "insert error");
                                    };
                                }
                                catch (ex){
                                    ok(false, "insert error");
                                }
							};
							insertRequest2.onerror = function (e){
								ok(false, "insert error");
							};
						}
						catch (ex){
							ok(false, "insert error");
						}
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
QUnit.test("Inserting data - objectstore keyPath", function (assert) {
    var done = assert.async();
    assert.expect(1);
	var data = { test: "test" };
	initionalSituationObjectStoreWithKeyPathNoAutoIncrement(function () {
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
QUnit.test("Inserting data with inline key - objectstore keyPath", function (assert) {
    var done = assert.async();
    assert.expect(2);
    var data = { test: "test", id: 1 };
    initionalSituationObjectStoreWithKeyPathNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName]);
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var insertRequest = objectstore.add(data);

                    insertRequest.onsuccess = function (e){
                        ok(true, "data inserted");
                        equal(e.target.result, data.id, "Key same as provided");
                    };
                    insertRequest.onerror = function (e){
                    assert.ok(false, "insert error");
                    };
                }
                catch (ex){
                    assert.ok(false, "insert error");
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
QUnit.test("Inserting data with external key - objectstore keyPath", function (assert) {
    var done = assert.async();
    assert.expect(1);
    var data = { test: "test" };
    var key = 1;
    initionalSituationObjectStoreWithKeyPathNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName]);
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var insertRequest = objectstore.add(data, key);

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