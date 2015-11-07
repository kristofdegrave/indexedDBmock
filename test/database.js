/**
 * Created by Kristof on 16/02/2015.
 */
QUnit.start();
QUnit.module("Database");
QUnit.test("Opening/Creating Database", function (assert) {
    var done = assert.async();
    assert.expect(3);

    initionalSituation(function(){
        var request = indexedDb.open(dbName);

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
        request.onblocked = function(e){
            assert.ok(false, "Blocked database");
        };
    }, done, assert);
});
QUnit.test("Opening/Creating Database with version", function (assert) {
    var done = assert.async();
    var version = 2;
    assert.expect(5);

    initionalSituation(function(){
        var request = indexedDb.open(dbName, version);

        request.onsuccess = function(e){
            assert.equal(e.target.result.name, dbName, "Database opened/created");
            // Necessary for indexeddb who work with setVersion
            assert.equal(parseInt(e.target.result.version), version, "Database version");
            e.target.result.close();
            done();
        };
        request.onerror = function(){
            assert.ok(false, "Creating database failed");
            done();
        };
        request.onupgradeneeded = function(e){
            assert.equal(e.type, "upgradeneeded", "Upgrading database");
            assert.equal(e.oldVersion, 0, "Old version");
            assert.equal(e.newVersion, version, "New version");
        };
        request.onblocked = function(e){
            assert.ok(false, "Blocked database");
        };
    }, done, assert);
});
QUnit.test("Opening existing Database", function (assert) {
    var done = assert.async();
    assert.expect(1);

    initionalSituationDatabase(function () {
        var request = indexedDb.open(dbName);
        request.onsuccess = function(e){
            assert.equal(e.target.result.name, dbName, "Database opened/created");
            e.target.result.close();
            done();
        };
        request.onerror = function(){
            assert.ok(false, "Creating/opening database failed");
            done();
        };
        request.onupgradeneeded = function(e){
            assert.ok(false, "Upgrading database");
        };
        request.onblocked = function(e){
            assert.ok(false, "Blocked database");
        };
    }, done, assert);
});
QUnit.test("Opening existing Database with current version", function (assert) {
    var done = assert.async();
    var version = 1;
    assert.expect(2);

    initionalSituationDatabase(function () {
        var request = indexedDb.open(dbName, version);
        request.onsuccess = function(e){
            assert.equal(e.target.result.name, dbName, "Database opened/created");
            assert.equal(parseInt(e.target.result.version), version, "Database version");
            e.target.result.close();
            done();
        };
        request.onerror = function(){
            assert.ok(false, "Creating/opening database failed");
            done();
        };
        request.onupgradeneeded = function(e){
            assert.ok(false, "Upgrading database");
        };
        request.onblocked = function(e){
            assert.ok(false, "Blocked database");
        };
    }, done, assert);
});
QUnit.test("Opening existing Database with lower version", function (assert) {
    var done = assert.async();
    var version = 1;

    initionalSituationDatabaseVersion(function () {
        var request = indexedDb.open(dbName, version);

        request.onsuccess = function(e){
            assert.ok(false, "Database opened/created");
            e.target.result.close();
            done();
        };
        request.onerror = function(e){
            assert.equal(e.target.error.name, "VersionError", "Creating/Opening database failed");
            done();
        };
        request.onupgradeneeded = function(e){
            assert.ok(false, "Upgrading database");
        };
        request.onblocked = function(e){
            assert.ok(false, "Blocked database");
        };
    }, done, assert);
});
QUnit.test("Opening existing Database with higher version", function (assert) {
    var done = assert.async();
    var version = 2;
    assert.expect(5);

    initionalSituationDatabase(function () {
        var request = indexedDb.open(dbName, version);

        request.onsuccess = function(e){
            assert.equal(e.target.result.name, dbName, "Database opened/created");
            assert.equal(e.target.result.version, version, "Database version");
            e.target.result.close();
            done();
        };
        request.onerror = function(){
            assert.ok(false, "Creating/Opening database failed");
            done();
        };
        request.onupgradeneeded = function(e){
            assert.equal("upgradeneeded", e.type, "Upgrading database");
            assert.equal(e.oldVersion, 1, "Old version");
            assert.equal(e.newVersion, version, "New version");
        };
        request.onblocked = function(e){
            assert.ok(false, "Blocked database");
        };
    }, done, assert);
});
QUnit.test("Deleting existing Database", function (assert) {
    var done = assert.async();
    assert.expect(1);

    var request = indexedDb.open(dbName);

    request.onsuccess = function(e){
        e.target.result.close();
        var deleteRequest = indexedDb.deleteDatabase(dbName);

        deleteRequest.onsuccess = function(e){
            assert.ok(true, "Database removed");
            done();
        };
        deleteRequest.onerror = function(){
            assert.ok(false, "Deleting database failed: ");
            done();
        };
    };
    request.onerror = function(){
        assert.ok(false, msgCreatingInitialSituationFailed);
        done();
    };
    request.onblocked = function(e){
        assert.ok(false, "Blocked database");
    };
});
QUnit.test("Deleting non existing Database", function (assert) {
    var done = assert.async();
    assert.expect(1);

    initionalSituation(function () {
        var deleteRequest = indexedDb.deleteDatabase(dbName);

        deleteRequest.onsuccess = function(e){
            assert.ok(true, "Database removed");
            done();
        };
        deleteRequest.onerror = function(){
            assert.ok(false, "Deleting database failed: ");
            done();
        };
    }, done, assert);
});
QUnit.test("Opening database with higher version while open database connection exist.", function (assert) {
    var done = assert.async();
    var version = 2;
    assert.expect(3);

    initionalSituation(function(){
        var request = indexedDb.open(dbName, version);

        request.onsuccess = function(e){
            e.target.result.onversionchange = function(args){
                assert.equal("versionchange", args.type, "Versionchange database");
                assert.equal(args.oldVersion, version, "Old version");
                assert.equal(args.newVersion, version + 1, "New version");
                e.target.result.close();
            };
            var request2 = indexedDb.open(dbName, version+1);
            request2.onsuccess = function(args){
                e.target.result.close();
                args.target.result.close();
                done();
            };

        };
        request.onerror = function(){
            assert.ok(false, "Creating database failed");
            done();
        };
        request.onblocked = function(e){
            assert.ok(false, "Blocked database");
        };

    }, done, assert);
});
QUnit.test("Block opening database with higher version.", function (assert) {
    var done = assert.async();
    var version = 2;
    assert.expect(4);

    initionalSituation(function(){
        var request = indexedDb.open(dbName, version);

        request.onsuccess = function(e){
            e.target.result.onversionchange = function(args){
                assert.equal("versionchange", args.type, "Versionchange database");
            };
            var request2 = indexedDb.open(dbName, version+1);
            request2.onsuccess = function(args){
                args.target.result.close();
                done();
            };
            request2.onblocked = function(args){
                assert.equal("blocked", args.type, "blocked database");
                assert.equal(args.oldVersion, version, "Old version");
                assert.equal(args.newVersion, null, "New version");
                e.target.result.close();
            };
            request2.onerror = function(){
                assert.ok(false, "Creating database failed");
                done();
            };

        };
        request.onerror = function(){
            assert.ok(false, "Creating database failed");
            done();
        };
        request.onblocked = function(e){
            assert.ok(false, "Blocked database");
        };

    }, done, assert);
});

// TODO Test delete with open connections
