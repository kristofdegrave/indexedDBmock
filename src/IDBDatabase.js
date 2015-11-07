/**
 * Created by Kristof on 5/11/2015.
 */
define([
    'IDBRequestReadyState',
    'IDBTransactionMode',
    'IDBObjectStore',
    'events/IVersionChangeEvent',
    'events/IErrorEvent',
    'events/IAbortEvent'
], function(IDBRequestReadyState,
            IDBTransactionMode,
            IVersionChangeEvent,
            IErrorEvent,
            IAbortEvent){
    var IDBDatabase = function(db, connection){
        this.name = db.name;
        this.version = db.version;
        this.objectStoreNames = db.objectStoreNames;

        this.onabort = null;
        this.onerror = null;
        this.onversionchange = null;

        this._db = db;
        this._connection = connection;
        this._objectStores = db.objectStores || [];
    };

    IDBDatabase.prototype = function () {
        function Close() {
            this._connection.close();
        }
        function Commit(){
            this._db.objectStores = this._objectStores;
            this._db.objectStoreNames = this.objectStoreNames;
        }
        function Transaction(objectStoreNames, mode) {
            return this._connection.transaction(objectStoreNames, mode);
        }
        function CreateObjectStore(name, parameters){
            if(this.transaction.mode !== IDBTransactionMode.VERSIONCHANGE){
                throw {
                    name: "InvalidStateError"
                    // TODO: Add message
                };
            }

            // TODO: Check valid key path?

            if(parameters && parameters.keyPath instanceof Array)
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
            this._objectStores.push(objectStore);
            this.objectStoreNames.push(name);

            return objectStore;
        }
        function DeleteObjectStore(name){
            if(this.transaction.mode !== IDBTransactionMode.VERSIONCHANGE){
                throw {
                    name: "InvalidStateError"
                    // TODO: Add message
                };
            }

            var objectStoreFound = false;

            for(var i = 0; i < this.objectStoreNames.length; i++)
            {
                if(this.objectStoreNames[i] === name){
                    this.objectStoreNames.splice(i, 1);
                    objectStoreFound = true;
                }
            }

            if(!objectStoreFound)
            {
                throw {
                    name: "NotFoundError"
                    // TODO: Add message
                };
            }

            for(var j = 0; j < this._objectStores.length; j++)
            {
                if(this._objectStores[j].name === name){
                    this._objectStores.splice(j, 1);
                }
            }
        }

        function Versionchange (newVersion){
            this.readyState = IDBRequestReadyState.done;

            if (typeof this.onversionchange === 'function') {
                this.onversionchange(new IVersionChangeEvent("versionchange", {target: this, newVersion: newVersion, oldVersion: this.version}));
            }
        }
        function Error(error, code){
            this.error = error;
            this.errorCode = code;
            this.readyState = IDBRequestReadyState.done;

            if (typeof this.onerror === 'function') {
                this.onerror(new IErrorEvent(this));
            }
        }

        function Abort(error){
            this.error = error;
            if (typeof this.onabort === 'function') {
                this.onabort(new IAbortEvent(this));
            }
        }

        return {
            close: Close,
            transaction: Transaction,
            createObjectStore: CreateObjectStore,
            deleteObjectStore: DeleteObjectStore,
            __abort: Abort,
            __commit: Commit,
            __error: Error,
            __versionchange: Versionchange
        };
    }();

    return IDBDatabase;
});