/**
 * Created by Kristof on 16/02/2015.
 */

(function(global){
    var timeout = 1,
        dbs = {},
        indexeddb = {
            open: function (name, version) {
                var db,
                    returnObj = {};
                for(var database in dbs)
                {
                    if(database === name)
                    {
                        db = dbs[database];
                    }
                }

                if(!db)
                {
                    if(!version) {
                        version = 1;
                    }
                    db = new Database(name);

                    dbs[name] = db;
                }

                var connection = new Connection(db);

                if(version && connection.version > version){
                    setTimeout(function(){
                        if(typeof returnObj.onerror === 'function'){
                            returnObj.target = returnObj;
                            returnObj.target.errorCode = "VersionError";
                            returnObj.target.error = {
                                name: "VersionError"
                            };
                            returnObj.target.readyState = "done";
                            returnObj.onerror(returnObj);
                        }
                    }, timeout);
                }
                else {
                    if (version && connection.version < version) {
                        setTimeout(function () {
                            returnObj.target = returnObj;
                            returnObj.target.readyState = "done";
                            returnObj.target.type = "upgradeneeded";
                            returnObj.target.newVersion = version;
                            returnObj.target.oldVersion = connection.version;
                            returnObj.target.transaction = new Transaction(null, TransactionTypes.VERSIONCHANGE, new Snapshot(db, connection));

                            // Upgrade version
                            returnObj.target.transaction.db.version = version;
                            connection.version = version;
                            db.version = version;

                            if (typeof returnObj.onupgradeneeded === 'function') {
                                returnObj.onupgradeneeded(returnObj);
                                returnObj.target.transaction.__commit();
                            }

                            setTimeout(function () {
                                if(returnObj.target.transaction._aborted) {
                                    if (typeof returnObj.onerror === 'function') {
                                        returnObj.target = returnObj;
                                        returnObj.target.errorCode = 8;
                                        returnObj.target.error = {
                                            name: "AbortError",
                                            message: "The transaction was aborted."
                                        };
                                        returnObj.target.readyState = "done";

                                        returnObj.onerror(returnObj);
                                    }
                                }
                                else if (typeof returnObj.onsuccess === 'function') {
                                    returnObj.target = returnObj;
                                    returnObj.target.result = connection;
                                    returnObj.target.readyState = "done";

                                    db.connections.push(connection);

                                    returnObj.onsuccess(returnObj);
                                }

                                for (var i = 0; i < db.connections.length; i++) {
                                    if (db.connections[i]._connectionId !== connection._connectionId) {
                                        if (typeof db.connections[i].onversionchange === 'function') {
                                            db.connections[i].target = db.connections[i];
                                            db.connections[i].target.readyState = "done";
                                            db.connections[i].target.type = TransactionTypes.VERSIONCHANGE;
                                            db.connections[i].target.version = version;

                                            db.connections[i].onversionchange(db.connections[i]);
                                        }
                                    }
                                }
                            }, timeout);
                        }, timeout);
                    }
                    else {
                        setTimeout(function () {
                            if (typeof returnObj.onsuccess === 'function') {
                                returnObj.target = returnObj;
                                returnObj.target.result = connection;
                                returnObj.target.readyState = "done";

                                db.connections.push(connection);

                                returnObj.onsuccess(returnObj);
                            }
                        }, timeout);
                    }
                }
                return returnObj;
            },
            deleteDatabase: function(name){
                var returnObj = {};
                for(var database in dbs)
                {
                    if(database === name)
                    {
                        dbs[database] = undefined;
                        delete dbs[database];
                    }
                }

                setTimeout(function(){
                    if(typeof returnObj.onsuccess === 'function'){
                        returnObj.target = returnObj;
                        returnObj.target.readyState = "done";

                        returnObj.onsuccess(returnObj);
                    }
                }, timeout);

                return returnObj;
            },
            cmp: function(first, second) {

            }
        },
        TransactionTypes = {
            READONLY: "readonly",
            READWRITE: "readwrite",
            VERSIONCHANGE: "versionchange"
        },
        Database = function(name){
            this.name = name;
            this.version = 0;
            this.objectStoreNames = [];
            this.objectStores = [];
            this.connections = [];
            this.transactions = [];
        },
        Connection = function(db) {
            this.name = db.name;
            this.version = db.version;
            this.objectStoreNames = db.objectStoreNames;
            this._connectionId = db.connections.length;
            this._db = db;
        },
        Snapshot = function(db, connection){
            this.name = db.name;
            this.version = db.version;
            this.objectStoreNames = db.objectStoreNames;
            this._db = db;
            this._connection = connection;
            this._objectStores = db.objectStores || [];
        },
        Transaction = function (objectStoreNames, mode, snapshot){
            this.db = snapshot;
            this.__active = true;
            this._aborted = false;
            this.__actions = [];

            if(!mode){
                mode = TransactionTypes.READONLY;
            }

            if(mode !== TransactionTypes.VERSIONCHANGE && (!objectStoreNames || objectStoreNames.length === 0)){
                this.aborted = true;
                this.__checkFinished(this);
                throw {
                    name: "InvalidAccessError"
                };
            }

            if(mode !== TransactionTypes.READONLY && mode !== TransactionTypes.READWRITE && mode !== TransactionTypes.VERSIONCHANGE)
            {
                mode = TransactionTypes.READONLY;
            }

            if(objectStoreNames) {
                for (var i = 0; i < objectStoreNames.length; i++) {
                    var objectStoreFound = false;

                    for(var j = 0; j < snapshot.objectStoreNames.length; j++)
                    {
                        if(snapshot.objectStoreNames[j] === objectStoreNames[i]){
                            objectStoreFound = true;
                        }
                    }

                    if(!objectStoreFound)
                    {
                        this.aborted = true;
                        this.__checkFinished(this);
                        throw {
                            name: "NotFoundError"
                        };
                    }
                }
            }

            this.mode = mode;
            this.objectStoreNames = objectStoreNames;
            this.db.transaction = this;

            this.__checkFinished(this);
        },
        ObjectStore = function (name, params, transaction){
            this.name = name;
            this.keyPath = params ? params.keyPath : undefined;
            this.autoIncrement = params ? params.autoIncrement : undefined;
            this.indexNames = [];
            this.transaction = transaction;

            this._indexes = [];
            this.__data = {};
            this.__actions = [];
			this.__latestKey = 0;
        },
        Cursor = function(){},
        Index = function(name, keyPath, params, objectStore){
            this.name = name;
            this.keyPath = keyPath;
            this.multiEntry = params ? params.multiEntry : undefined;
            this.unique = params ? params.unique : undefined;

            this.objectStore = objectStore;
            this.__data = {};
        };

    Connection.prototype = function () {
        function close() {
            for (var i = 0; i < this._db.connections.length; i++) {
                if (this._db.connections[i].connectionId === this._connectionId) {
                    this._db.connections.splice(i, 1);
                }
            }
        }
        function transaction(objectStoreNames, mode) {
            var trans = new Transaction(objectStoreNames, mode, new Snapshot(this._db, this));
            return trans;
        }

        return {
            close: close,
            transaction: transaction
        };
    }();

    Snapshot.prototype = function () {
        function close() {
            this._connection.close();
        }
        function commit(){
            this._db.objectStores = this._objectStores;
            this._db.objectStoreNames = this.objectStoreNames;
        }
        function transaction(objectStoreNames, mode) {
            return this._connection.transaction(objectStoreNames, mode);
        }
        function createObjectStore(name, parameters){
            if(this.transaction.mode !== TransactionTypes.VERSIONCHANGE){
                throw {
                    name: "InvalidStateError"
                };
            }

            if(parameters && parameters.keyPath instanceof Array)
            {
                for (var i = 0; i < parameters.keyPath.length; i++){
                    if(parameters.keyPath[i] === ""){
                        this.transaction.abort();
                        throw {
                            name: "InvalidAccessError"
                        };
                    }
                }
            }

            var objectStore = new ObjectStore(name, parameters, this.transaction);
            this._objectStores.push(objectStore);
            this.objectStoreNames.push(name);

            return objectStore;
        }
        function deleteObjectStore(name){
            if(this.transaction.mode !== TransactionTypes.VERSIONCHANGE){
                throw {
                    name: "InvalidStateError"
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
                };
            }

            for(var j = 0; j < this._objectStores.length; j++)
            {
                if(this._objectStores[j].name === name){
                    this._objectStores.splice(j, 1);
                }
            }
        }

        return {
            close: close,
            transaction: transaction,
            createObjectStore: createObjectStore,
            deleteObjectStore: deleteObjectStore,
            __commit: commit
        };
    }();

    Transaction.prototype = function () {
        function commit(){
            checkFinished(this);
        }

        function commitInternal(context){
            if(!context._aborted && !context.__commited) {
                context.__commited = true;
                context.db.__commit();
                context.__active = false;

                if (typeof context.oncomplete === 'function') {
                    context.target = context;
                    context.target.result = context;
                    context.target.readyState = "done";

                    context.oncomplete(context);
                }
            }
        }

        function abort() {
            this._aborted = true;

            var trans = this;

            setTimeout(function() {
                if (typeof trans.onabort === 'function') {
                    trans.target = trans;
                    trans.target.errorCode = 8;
                    trans.target.error = {
                        name: "AbortError",
                        message: "The transaction was aborted."
                    };
                    trans.target.readyState = "done";
                    trans.onabort(trans);
                }
            }, timeout);
        }

        function objectStore(name) {
            var timestamp = (new Date()).getTime();
            this.__actions.push(timestamp);
            if(this.mode !== TransactionTypes.VERSIONCHANGE) {
                var objectStoreFound = false;

                for (var i = 0; i < this.objectStoreNames.length; i++) {
                    if (this.objectStoreNames[i] === name) {
                        objectStoreFound = true;
                    }
                }

                if (!objectStoreFound) {
                    this.__actions.splice(this.__actions.indexOf(timestamp),1);
                    checkFinished(this,undefined,timestamp);
                    throw {
                        name: "NotFoundError"
                    };
                }
            }

            for(var j = 0; j < this.db._objectStores.length; j++)
            {
                if(this.db._objectStores[j].name === name){
                    var obj = this.db._objectStores[j];
                    obj.transaction = this;
                    checkFinished(this,obj,timestamp);
                    return obj;
                }
            }

            this.__actions.splice(this.__actions.indexOf(timestamp),1);
            checkFinished(this,undefined,timestamp);
            throw {
                name: "NotFoundError"
            };
        }

        function checkFinished(context, obj, timestamp){
            setTimeout(function(){
                if(!obj){
                    if(context.__actions.length === 0){
                        commitInternal(context);
                    }
                }
                else if(obj.__finished()){
                    context.__actions.splice(context.__actions.indexOf(timestamp),1);
                    if(context.__actions.length === 0){
                        commitInternal(context);
                    }
                }
                else
                {
                    checkFinished(context, obj, timestamp);
                }
            }, timeout);
        }

        return {
            abort: abort,
            objectStore: objectStore,
            __commit: commit,
            __checkFinished: checkFinished
        };
    }();

    ObjectStore.prototype = function (){
        function get(){

        }
        function add(data, key){
            var context = this;
            var timestamp = (new Date()).getTime();
            context.__actions.push(timestamp);
            var returnObj = {};
			
			if(this.autoIncrement){
				if(!(key && typeof key === 'number' && key > this.__latestKey))
				{
					key = this.__latestKey + 1;
				}
				
				if(key > 9007199254740992)
				{
					context.__actions.splice(context.__actions.indexOf(timestamp),1);
					throw {
						name: "ConstraintError"
					};
				}
				
				this.__latestKey = key;
			}

            if(!key && !this.keyPath || key && this.keyPath || this.keyPath && !data[this.keyPath]) {
                context.__actions.splice(context.__actions.indexOf(timestamp),1);
                throw {
                    name: "DataError"
                };
            }

            if(key) {
                context.__data[key] = data;
            }

            setTimeout(function () {
                if (typeof returnObj.onsuccess === 'function') {
                    returnObj.target = returnObj;
                    returnObj.target.result = key;
                    returnObj.target.readyState = "done";

                    returnObj.onsuccess(returnObj);
                    context.__actions.splice(context.__actions.indexOf(timestamp),1);
                }
            }, timeout);

            return returnObj;
        }

        function createIndex(name, keyPath, parameters){
            if(this.transaction.mode !== TransactionTypes.VERSIONCHANGE){
                throw {
                    name: "InvalidStateError"
                };
            }

            if(keyPath && keyPath instanceof Array)
            {
                for (var i = 0; i < keyPath.length; i++){
                    if(keyPath[i] === ""){
                        this.transaction.abort();
                        throw {
                            name: "InvalidAccessError"
                        };
                    }
                }
            }

            var index = new Index(name, keyPath, parameters, this);
            this._indexes.push(index);
            this.indexNames.push(name);

            return index;
        }
        function deleteIndex(name, parameters){
            if(this.transaction.mode !== TransactionTypes.VERSIONCHANGE){
                throw {
                    name: "InvalidStateError"
                };
            }

            var indexFound = false;

            for(var i = 0; i < this.indexNames.length; i++)
            {
                if(this.indexNames[i] === name){
                    this.indexNames.splice(i, 1);
                    indexFound = true;
                }
            }

            if(!indexFound)
            {
                throw {
                    name: "NotFoundError"
                };
            }

            for(var j = 0; j < this._indexes.length; j++)
            {
                if(this._indexes[j].name === name){
                    this._indexes.splice(j, 1);
                }
            }
        }
        function index(name) {
            if(this.mode !== TransactionTypes.VERSIONCHANGE) {
                var indexFound = false;

                for (var i = 0; i < this.indexNames.length; i++) {
                    if (this.indexNames[i] === name) {
                        indexFound = true;
                    }
                }

                if (!indexFound) {
                    throw {
                        name: "NotFoundError"
                    };
                }
            }

            for(var j = 0; j < this._indexes.length; j++)
            {
                if(this._indexes[j].name === name){
                    this._indexes[j].objectStore = this;
                    return this._indexes[j];
                }
            }

            throw {
                name: "NotFoundError"
            };
        }

        function finished (){
            return this.__actions.length === 0;
        }

        return {
            get: get,
            add: add,
            createIndex:createIndex,
            deleteIndex:deleteIndex,
            index: index,
            __finished: finished
        };
    }();

    Index.prototype = function (){
        function get(){

        }

        return {
            get: get
        };
    }();

    global.indexedDBmock = indexeddb;
    global.IDBCursormock = Cursor;
    global.IDBDatabasemock = Snapshot;
    global.IDBTransactionmock = Transaction;
    global.IDBObjectStoremock = ObjectStore;
    global.IDBRequestmock = ObjectStore;
    global.IDBIndexmock = Index;
    global.indexedDBmockDbs = dbs;
})(window || self);
