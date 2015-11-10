/**
 * Created by Kristof on 5/11/2015.
 */
define('IDBFactory', [
    'IDBDatabase',
    'IDBOpenDBRequest',
    'Database',
    'DataProvider',
    'IDBTransactionMode',
    'util'
], function(IDBDatabase,
            IDBOpenDBRequest,
            Database,
            DataProvider,
            IDBTransactionMode,
            util){
    var IDBFactory = function(){
    };

    IDBFactory.prototype = (function(){
        function Open (name, version) {
            var db,
                openDBRequest = new IDBOpenDBRequest();

            db = DataProvider.getDatabase(name);

            if(!db)
            {
                if(!version) {
                    version = 1;
                }
                db = new Database(name);
            }

            var connection = new IDBDatabase(db);

            if(version && connection.version > version){
                setTimeout(function(){
                    openDBRequest.__error({
                        name: "VersionError",
                        message: "You are trying to open the database in a lower version (" + version + ") than the current version of the database"
                    }, "VersionError");
                }, util.timeout);
            }
            else {
                if (version && connection.version < version) {
                    setTimeout(function () {
                        db.upgrade(openDBRequest, version, connection, function(request, db){
                            DataProvider.setDatabase(db.name, db);

                            var newConnection = new IDBDatabase(db);
                            db.addConnection(newConnection);
                            request.__success(newConnection);
                        });
                    }, util.timeout);
                }
                else {
                    setTimeout(function () {
                        db.addConnection(connection);
                        openDBRequest.__success(connection);
                    }, util.timeout);
                }
            }
            return openDBRequest;
        }
        function DeleteDatabase(name){
            var openDBRequest = new IDBOpenDBRequest(null, null);
            var db = DataProvider.getDatabase(name);

            setTimeout(function () {
                if(db){
                    db.upgrade(openDBRequest, null, new IDBDatabase(db), function(request, db){
                        DataProvider.removeDatabase(db.name);
                        request.__success();
                    });
                }
                else{
                    openDBRequest.__success();
                }

            }, util.timeout);

            return openDBRequest;
        }
        function Cmp(first, second) {
            return util.cmp(first, second);
        }

        return {
            open: Open,
            deleteDatabase: DeleteDatabase,
            cmp: Cmp
        };
    })();

    return IDBFactory;
});