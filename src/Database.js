/**
 * Created by Kristof on 5/11/2015.
 */
define('Database', [
    'IDBDatabase',
    'IDBTransaction',
    'IDBTransactionMode',
    'util'
], function(IDBDatabase,
            IDBTransaction,
            IDBTransactionMode,
            util){
    var Database = function(name){
        this.name = name;
        this.version = 0;
        this.objectStoreNames = [];
        this.objectStores = [];
        this.connections = [];
    },
    Snapshot = function(objectStores, objectStoreNames){
        this.objectStores = util.clone(objectStores);
        this.objectStoreNames = util.clone(objectStoreNames);
    };

    Snapshot.prototype = (function(){
        function AddObjectStore(objectStore){
            this.objectStores.push(objectStore);
            this.objectStoreNames.push(objectStore.name);
        }
        function RemoveObjectStore(objectStoreName){
            for (var i = 0; i < this.objectStores.length; i++) {
                if(this.objectStores[i].name === objectStoreName){
                    this.objectStores.splice(i, 1);
                    break;
                }
            }
            this.objectStoreNames.splice(this.objectStoreNames.indexOf(objectStoreName), 1);
        }

        return {
            addObjectStore: AddObjectStore,
            removeObjectStore: RemoveObjectStore
        };
    })();

    Database.prototype = (function(){
        function AddConnection(connection){
            this.connections.push(connection);
        }
        function RemoveConnection(connection){
            for (var i = 0; i < this.connections.length; i++) {
                if(this.connections[i].__connectionId === connection.__connectionId){
                    this.connections.splice(i, 1);
                    break;
                }
            }
        }
        function Upgrade(openDBRequest, version, connection, successCallback, failCallback){
            for (var i = 0; i < this.connections.length; i++) {
                if (this.connections[i].__connectionId !== connection.__connectionId) {
                    this.connections[i].__versionchange(version);
                }
            }

            upgradeInternal(this, openDBRequest, connection.version, version, connection, successCallback, failCallback);
        }
        function TakeSnapshot(){
           return new Snapshot(this.objectStores, this.objectStoreNames);
        }
        function CommitSnapshot(snapshot){
            this.objectStores = util.clone(snapshot.objectStores);
            this.objectStoreNames = util.clone(snapshot.objectStoreNames);
        }

        function upgradeInternal(db, openDBRequest, currentVersion, version, connection, successCallback, failCallback) {
            if(db.connections.length > 0 && db.connections[0].__connectionId !== connection.__connectionId){
                openDBRequest.__blocked(version, currentVersion);
                setTimeout(upgradeInternal, 10, db, openDBRequest, currentVersion, version, connection, successCallback, failCallback);
                return;
            }

            if(version !== null) { // Delete request
                connection.version = version;
                db.version = version;
                openDBRequest.__upgradeneeded(connection, connection.transaction(db.objectStoreNames, IDBTransactionMode.versionchange), version, currentVersion);
            }

            setTimeout(function (_db, _openDBRequest, _successCallback, _failCallback) {
                if(_openDBRequest.transaction && _openDBRequest.transaction.__aborted) {
                    _openDBRequest.__error({
                        name: "AbortError",
                        message: "The transaction was aborted."
                    }, 8);
                    if(util.isFunction(_failCallback)) {
                        _failCallback(_openDBRequest, _db);
                    }
                }
                else {
                    if(util.isFunction(_successCallback)) {
                        _successCallback(_openDBRequest, _db);
                    }
                }
            }, util.timeout, db, openDBRequest, successCallback, failCallback);
        }

        return {
            addConnection: AddConnection,
            removeConnection: RemoveConnection,
            snapshot: TakeSnapshot,
            commitSnapshot: CommitSnapshot,
            upgrade: Upgrade
        };
    })();

    return Database;
});
