/**
 * Created by Kristof on 5/11/2015.
 */
define('IDBDatabase', [
    'IDBRequestReadyState',
    'IDBTransaction',
    'IDBTransactionMode',
    'IDBObjectStore',
    'events/IDBVersionChangeEvent',
    'events/IErrorEvent',
    'events/IAbortEvent',
    'util'
], function(IDBRequestReadyState,
            IDBTransaction,
            IDBTransactionMode,
            IDBObjectStore,
            IDBVersionChangeEvent,
            IErrorEvent,
            IAbortEvent,
            util){
    var IDBDatabase = function(db){
        this.name = db.name;
        this.version = db.version;
        this.objectStoreNames = db.objectStoreNames;

        this.onabort = null;
        this.onerror = null;
        this.onversionchange = null;

        this.__db = db;
        this.__snapshot = db.snapshot();
        this.__connectionId = util.guid();
    };

    IDBDatabase.prototype = function () {
        function Close() {
            this.__db.removeConnection(this);
        }
        function Commit(){
            this.__db.commitSnapshot(this.__snapshot);
        }
        function Transaction(objectStoreNames, mode) {
            var transaction = new IDBTransaction(objectStoreNames, mode, this);
            if(mode === IDBTransactionMode.versionchange){
                this.transaction = transaction;
            }
            return transaction;
        }
        function CreateObjectStore(name, parameters){
            if(this.transaction.mode !== IDBTransactionMode.versionchange){
                throw {
                    name: "InvalidStateError"
                    // TODO: Add message
                };
            }

            // TODO: Check valid key path?
            if(parameters && util.isArray(parameters.keyPath))
            {
                for (var i = 0; i < parameters.keyPath.length; i++){
                    if(parameters.keyPath[i] === ""){
                        this.transaction.abort();
                        throw {
                            name: "InvalidAccessError"
                            // TODO: Add message
                        };
                    }
                }
            }

            var objectStore = new IDBObjectStore(name, parameters, this.transaction);
            this.__snapshot.addObjectStore(objectStore);
            this.objectStoreNames.push(name);

            return objectStore;
        }
        function DeleteObjectStore(name){
            if(this.transaction.mode !== IDBTransactionMode.versionchange){
                throw {
                    name: "InvalidStateError"
                    // TODO: Add message
                };
            }

            if(this.objectStoreNames.indexOf(name) === -1)
            {
                throw {
                    name: "NotFoundError"
                    // TODO: Add message
                };
            }

            this.__snapshot.removeObjectStore(name);
        }
        function Versionchange (newVersion){
            this.readyState = IDBRequestReadyState.done;

            if (util.isFunction(this.onversionchange)) {
                this.onversionchange(new IDBVersionChangeEvent("versionchange", {target: this, newVersion: newVersion, oldVersion: this.version}));
            }
        }
        function Error(error, code){
            this.error = error;
            this.errorCode = code;
            this.readyState = IDBRequestReadyState.done;

            if (util.isFunction(this.onerror)) {
                this.onerror(new IErrorEvent(this));
            }
        }
        function Abort(error){
            this.error = error;
            if (util.isFunction(this.onabort)) {
                this.onabort(new IAbortEvent(this));
            }
        }
        function GetObjectStores(){
            return this.__snapshot.objectStores;
        }
        function GetObjectStoreNames(){
            return this.__snapshot.objectStoreNames;
        }

        return {
            close: Close,
            transaction: Transaction,
            createObjectStore: CreateObjectStore,
            deleteObjectStore: DeleteObjectStore,
            __abort: Abort,
            __commit: Commit,
            __error: Error,
            __getObjectStores: GetObjectStores,
            __getObjectStoreNames: GetObjectStoreNames,
            __versionchange: Versionchange
        };
    }();

    return IDBDatabase;
});