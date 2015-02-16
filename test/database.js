/**
 * Created by Kristof on 16/02/2015.
 */

    QUnit.start();
    QUnit.module("Database");
    QUnit.test("Opening/Creating Database", function (assert) {
        var done = assert.async();
        var dbName = "database";
        assert.expect(3);

        var request = window.indexedDBmock.open(dbName);

        request.onsuccess = function(e){
            assert.equal(e.target.result.name, dbName, "Database opened/created");
            // Necessary for indexeddb who work with setVersion
            assert.equal(parseInt(e.target.result.version), 1, "Database opened/created");
            e.target.result.close();
            done();
        };
        request.onerror = function(){
            assert.ok(false, "Creating database failed");
            done();
        };
        request.onupgradeneeded = function(e){
            assert.equal(e.type, "upgradeneeded", "Upgrading database");
        };
    });
