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
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
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
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
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
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
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
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
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
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
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
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
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
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
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
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
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
QUnit.test("Inserting data - objectstore keyPath autoincrement", function (assert) {
    var done = assert.async();
    assert.expect(2);
    var data = { test: "test" };
    initionalSituationObjectStoreWithKeyPathAndAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var insertRequest = objectstore.add(data);

                    insertRequest.onsuccess = function (e){
                        ok(true, "data inserted");
                        equal(e.target.result, data.id, "Key same as provided");
                    };
                    insertRequest.onerror = function (e){
                        assert.ok(false, "Insert error");   
                    };
                }
                catch (ex){
                    assert.ok(false, "Insert error");
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
QUnit.test("Inserting data with inline key - objectstore keyPath autoincrement", function (assert) {
    var done = assert.async();
    assert.expect(2);
    var data = { test: "test", id:2 };
    initionalSituationObjectStoreWithKeyPathAndAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var insertRequest = objectstore.add(data);

                    insertRequest.onsuccess = function (e){
                        ok(true, "data inserted");
                        equal(e.target.result, data.id, "Key set by autoincrement");
                    };
                    insertRequest.onerror = function (e){
                        assert.ok(false, "Insert error");   
                    };
                }
                catch (ex){
                    assert.ok(false, "Insert error");
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
QUnit.test("Inserting data with external key - objectstore keyPath autoincrement", function (assert) {
    var done = assert.async();
    assert.expect(1);
    var data = { test: "test" };
    var key = 1;
    initionalSituationObjectStoreWithKeyPathAndAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
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
QUnit.test("Inserting data with existing external key", function (assert) {
    var done = assert.async();
    assert.expect(1);

    initionalSituationObjectStoreNoAutoIncrementWithData(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var insertRequest = objectstore.add(insertData, insertData.id);

                    insertRequest.onsuccess = function (e){
                        ok(false, "data inserted");
                    };
                    insertRequest.onerror = function (e){
                        equal(e.error.type, "ConstraintError", "ConstraintError");
                    };
                }
                catch (ex){
                    equal(ex.name, "ConstraintError", "ConstraintError");
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
QUnit.test("Inserting data with existing internal key", function (assert) {
    var done = assert.async();
    assert.expect(1);

    initionalSituationObjectStoreWithKeyPathAndDataNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var insertRequest = objectstore.add(insertData);

                    insertRequest.onsuccess = function (e){
                        ok(false, "data inserted");
                    };
                    insertRequest.onerror = function (e){
                        equal(e.error.type, "ConstraintError", "ConstraintError");
                    };
                }
                catch (ex){
                    equal(ex.name, "ConstraintError", "ConstraintError");
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
QUnit.test("Inserting data with invalid key", function (assert) {
    var done = assert.async();
    assert.expect(1);
    var data = { test: "test" };

    initionalSituationObjectStoreNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var insertRequest = objectstore.add(data, data);

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
QUnit.test("Inserting data with external key - string", function (assert) {
    var done = assert.async();
    assert.expect(2);
    var data = { test: "test" };
    var key = "key";

    initionalSituationObjectStoreNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
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
QUnit.test("Inserting data with external key - array", function (assert) {
    var done = assert.async();
    assert.expect(2);
    var data = { test: "test" };
    var key = [1,2,3];

    initionalSituationObjectStoreNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
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
QUnit.test("Inserting data with inline key - string", function (assert) {
    var done = assert.async();
    assert.expect(2);
    var data = { test: "test", id: "key" };
    initionalSituationObjectStoreWithKeyPathNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
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
QUnit.test("Inserting data with inline key - date", function (assert) {
    var done = assert.async();
    assert.expect(2);
    var data = { test: "test", id: new Date() };
    initionalSituationObjectStoreWithKeyPathNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
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
QUnit.test("Inserting data with inline key - array", function (assert) {
    var done = assert.async();
    assert.expect(2);
    var data = { test: "test", id: [1,2,3] };
    initionalSituationObjectStoreWithKeyPathNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
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
QUnit.test("Inserting data - ReadOnly transaction", function (assert) {
    var done = assert.async();
    assert.expect(1);
    var data = { test: "test" };
    var key = "key";

    initionalSituationObjectStoreNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readonly");
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var insertRequest = objectstore.add(data, key);

                    insertRequest.onsuccess = function (e){
                        ok(false, "data inserted");
                    };
                    insertRequest.onerror = function (e){
                        equal(e.error.type, "ReadOnlyError", "ReadOnlyError");
                    };
                }
                catch (ex){
                    equal(ex.name, "ReadOnlyError", "ReadOnlyError");
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
QUnit.test("Inserting data - DataCloneError", function (assert) {
    var done = assert.async();
    assert.expect(1);
    var data = { test: "test", toString: function () {
                                            return true;
                                        }
                };
    var key = "key";

    initionalSituationObjectStoreNoAutoIncrement(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            try{
                var transaction = e.target.result.transaction([objectStoreName], "readwrite");
                var objectstore = transaction.objectStore(objectStoreName);

                try{
                    var insertRequest = objectstore.add(data, key);

                    insertRequest.onsuccess = function (e){
                        ok(false, "data inserted");
                    };
                    insertRequest.onerror = function (e){
                        equal(e.error.type, "DataCloneError", "DataCloneError");
                    };
                }
                catch (ex){
                    equal(ex.name, "DataCloneError", "DataCloneError");
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

// TODO check unique index