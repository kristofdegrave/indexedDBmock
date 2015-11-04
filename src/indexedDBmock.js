/**
 * Created by Kristof on 16/02/2015.
 */

(function(global){
    var timeout = 1,
        dbs = {},
        indexeddb = {
            open: function (name, version) {
                var db,
                    openDBRequest = new Request(null, null);
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
                        openDBRequest.__error({
                            name: "VersionError",
                            message: "You are trying to open the database in a lower version (" + version + ") than the current version of the database"
                        }, "VersionError");
                    }, timeout);
                }
                else {
                    if (version && connection.version < version) {
                        setTimeout(function () {
                            for (var i = 0; i < db.connections.length; i++) {
                                if (db.connections[i]._connectionId !== connection._connectionId) {
                                    if (typeof db.connections[i].onversionchange === 'function') {
                                        db.connections[i].onversionchange(new IVersionChangeEvent("versionchange", {target: db.connections[i], newVersion: version, oldVersion: db.connections[i].version}));
                                    }
                                }
                            }
                            function upgrade(request, connection, db, version) {
                                var currentVersion = connection.version;
                                if(db.connections.length > 0 && db.connections[0]._connectionId !== connection._connectionId){
                                    openDBRequest.__blocked(null, connection.version);
                                    setTimeout(upgrade, 10, request, connection, db, version);
                                }

                                connection.version = version;
                                db.version = version;

                                openDBRequest.__upgradeneeded(connection
                                                            , new Transaction(null, TransactionTypes.VERSIONCHANGE, new Snapshot(db, connection))
                                                            , version
                                                            , currentVersion);
                            }

                            upgrade(openDBRequest, connection, db, version);

                            setTimeout(function () {
                                if(openDBRequest.transaction._aborted) {
                                    openDBRequest.__error({
                                        name: "AbortError",
                                        message: "The transaction was aborted."
                                    }, 8);
                                }
                                else {
                                    db.connections.push(connection);
                                    openDBRequest.__success(connection);
                                }
                            }, timeout);
                        }, timeout);
                    }
                    else {
                        setTimeout(function () {
                            db.connections.push(connection);
                            openDBRequest.__success(connection);
                        }, timeout);
                    }
                }
                return openDBRequest;
            },
            deleteDatabase: function(name){
                var openDBRequest = new Request(null, null);
                for(var database in dbs)
                {
                    if(database === name)
                    {
                        dbs[database] = undefined;
                        delete dbs[database];
                    }
                }

                setTimeout(function(){
                    openDBRequest.__success();
                }, timeout);

                return openDBRequest;
            },
            cmp: function(first, second) {

            }
        },
        TransactionTypes = {
            READONLY: "readonly",
            READWRITE: "readwrite",
            VERSIONCHANGE: "versionchange"
        },
        DBRequestReadyState = {
            "pending": "pending",
            "done": "done"
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

            this.oncomplete = undefined;
            this.onerror = undefined;
            this.onabort = undefined;

            this.error = null;
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
            this.__keys = [];
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
        }, 
        KeyRange = function(lower, upper, lowerOpen, upperOpen){
            this.lower = lower;
            this.upper = upper;
            this.lowerOpen = lowerOpen ? lowerOpen : false;
            this.upperOpen = upperOpen ? upperOpen : false;
        },
        IEvent = function(type, config){
            this.CAPTURING_PHASE = 1;
            this.AT_TARGET = 2;
            this.BUBBLING_PHASE = 3;

            this.bubbles = config.bubbles || false;
            this.cancelBubble = (config.bubbles && config.cancelable) || false;
            this.cancelable = config.cancelable || false;
            this.currentTarget = config.target;
            this.defaultPrevented = false;
            this.detail = undefined;
            this.eventPhase = this.AT_TARGET;
            this.path = undefined;
            this.returnValue = config.returnValue;
            this.srcElement = config.target;
            this.target = config.target;
            this.timestamp = global.Date.now();
            this.type = type;
        },
        IVersionChangeEvent = function(type, versionChangeInit){
            IEvent.call(this, type, versionChangeInit);

            this.newVersion = versionChangeInit.newVersion;
            this.oldVersion = versionChangeInit.oldVersion;
        }
        ISuccessEvent = function(request){
            IEvent.call(this, "success", {target: request, returnValue: true});
        },
        ICompleteEvent = function(transaction){
            IEvent.call(this, "complete", {target: transaction, returnValue: true});
        },
        IAbortEvent = function(transaction){
            IEvent.call(this, "abort", {target: transaction, returnValue: true});
        },
        IErrorEvent = function(request){
                IEvent.call(this, "error", {target: request, returnValue: true});
            },
        Request = function(source, transaction){
            this.error = undefined;
            this.result = undefined;
            this.source = source;
            this.transaction = transaction;
            this.readyState = DBRequestReadyState.pending;
            this.onsuccess = null;
            this.onerror = null;
        };

    IEvent.prototype = (function(){
        function preventDefault(){
            this.defaultPrevented = true;
        }
        function stopImmediatePropagation(){
            this.cancelBubble = true;
        }

        return {
            preventDefault: preventDefault,
            stopImmediatePropagation: stopImmediatePropagation
        };
    })();

    IVersionChangeEvent.prototype = IEvent.prototype;

    Connection.prototype = function () {
        function close() {
            for (var i = 0; i < this._db.connections.length; i++) {
                if (this._db.connections[i]._connectionId === this._connectionId) {
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

            // TODO: Check valid key path?
            
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
            //checkFinished(this);
            for (var i = 0; i < this.db._objectStores.length; i++) {
                var timestamp = (new Date()).getTime();
                this.__actions.push(timestamp);
                checkFinished(this,this.db._objectStores[i], timestamp);
            }
        }

        function commitInternal(context){
            if(!context._aborted && !context.__commited) {
                context.__commited = true;
                if(this.mode != "readonly")
                {
                    context.db.__commit();
                }
                context.__active = false;

                context.__complete();
            }
        }

        function abort(error) {
            this._aborted = true;

            setTimeout(function(tx) {
                this.error = error
                if (typeof tx.onabort === 'function') {
                    tx.onabort(new IAbortEvent(this));
                }
            }, timeout, this);
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

        function error(error, code){
            this.error = error;
            this.errorCode = code;

            if (typeof this.onerror === 'function') {
                this.onerror(new IErrorEvent(this));
            }
        }

        function complete(){
            if (typeof this.oncomplete === 'function') {
                this.oncomplete(new ICompleteEvent(this));
            }
        }

        return {
            abort: abort,
            objectStore: objectStore,
            __commit: commit,
            __checkFinished: checkFinished,
            __complete: complete,
            __error: error
        };
    }();

    ObjectStore.prototype = function (){
        function isObject(item) {
           return item.constructor.name === "Object";
        }

        function isFunction(functionToCheck) {
            var getType = {};
            return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
        }
            
        function getPropertyValue(data, propertyName) {
            var structure = propertyName.split(".");
            var value = data;
            for (var i = 0; i < structure.length; i++) {
                if (value) {
                    value = value[structure[i]];
                }
            }
            return value;
        }

        function setPropertyValue(data, propertyName, value) {
            var structure = propertyName.split(".");
            var obj = data;
            for (var i = 0; i < structure.length; i++) {
                if (i != (structure.length - 1)) {
                    obj[structure[i]] = {};
                    obj = obj[structure[i]];
                }
                else {
                    obj[structure[i]] = value;
                }
            }
            return obj;
        }

        function containsFunction(data){
            for(var prop in data){
                if(isFunction(data[prop])){
                    return true;
                }
                if(isObject(prop)){
                    if(containsFunction(data[prop])){
                        return true;
                    }
                }
            }
            return false;
        }

        function get(key){
            var timestamp = (new Date()).getTime();
            var context = this;
            context.__actions.push(timestamp);
            var request = new Request(this, this.transaction);
            var data;

            if(!(key instanceof KeyRange)){
                key = KeyRange.only(key);
            }

            if(context.transaction.db.objectStoreNames.indexOf(context.name) == -1){
                error(context, request, {
                    name: "InvalidStateError"
                    // TODO Add message
                });
            }

            if(key.upper === key.lower){
                data = context.__data[key.lower]; 
            }
            else{
                var keysSorted = this.__keys.sort(sortKey); // todo extend with all types of keys
                for (var i = 0; i < keysSorted.length; i++) {
                    if(key.inRange(keysSorted[i])){
                        data = context.__data[keysSorted[i]];
                        break;
                    }
                }
            }

            setTimeout(function () {
                request.__success(data);
                context.__actions.splice(context.__actions.indexOf(timestamp),1);
            }, timeout);

            return request;
        }
        function put(data, key){
            return persist(this, data, key, false);
        } 
        function add(data, key){
            return persist(this, data, key, true);
        } 

        function error(context, request, err){
            setTimeout(function () {
                request.__error(err);
                context.transaction.__error(err);
                context.transaction.abort(err);
            }, timeout);

            return request;
        }

        function exception(context, err, timestamp){
            if(timestamp){
                context.__actions.splice(context.__actions.indexOf(timestamp),1);
            }
            throw err;
        }

        function persist(context, data, key, noOverWrite){
            var timestamp = (new Date()).getTime();
            context.__actions.push(timestamp);
            var request = new Request(this, this.transaction);
            var internalKey = key;

            if(context.transaction.db.objectStoreNames.indexOf(context.name) == -1){
                exception(context, {
                    name: "InvalidStateError"
                    // TODO Add message
                }, timestamp);
            }

            if(context.transaction.mode == TransactionTypes.READONLY){
                exception(context, {
                    name: "ReadOnlyError"
                    // TODO Add message
                }, timestamp);
            }

            if(!context.keyPath && !key && !context.autoIncrement || context.keyPath && (key || !data[context.keyPath] && !context.autoIncrement || !isObject(data))) {
                exception(context, {
                    name: "DataError"
                    // TODO Add message
                }, timestamp);
            }

			if(context.autoIncrement){
				if(!(internalKey && typeof internalKey === 'number' && internalKey > context.__latestKey))
				{
					internalKey = context.__latestKey + 1;
                    if(context.keyPath){
                        setPropertyValue(data, context.keyPath, internalKey);
                    }
				}
				
				if(internalKey > 9007199254740992)
				{
                    return error(context, request, {
                        name: "ConstraintError"
                        // TODO Add message
                    });
				}
				
				context.__latestKey = internalKey;
			}
            else if(context.keyPath){
                internalKey = getPropertyValue(data, context.keyPath);
            }

            if(!isValidKey(internalKey)) {
                exception(context, {
                    name: "DataError"
                    // TODO Add message
                }, timestamp);
            }

            if(noOverWrite && context.__data[internalKey])
            {
                return error(context, request, {
                    name: "ConstraintError"
                    // TODO Add message
                });
            }

            if(containsFunction(data)){
                exception(context, {
                    name: "DataCloneError"
                    // TODO Add message
                }, timestamp);
            }

            // Check index constraints
            for (var i = 0; i < context._indexes.length; i++) {
                var index = context._indexes[i];
                var indexKey = getPropertyValue(data, index.keyPath);

                // If no value is found using the index keyPath, ignore
                if(!indexKey){
                    continue;
                }

                if(index.multiEntry && indexKey instanceof Array){
                    var keys = {};
                    for (var l = 0; l < indexKey.length; l++) {
                        if(isValidKey(indexKey[l]) && !keys[indexKey[l]]){
                            keys[indexKey[l]] = indexKey[l];
                            if(index.unique && index.__data[indexKey[l]]){
                                return error(context, request, {
                                    name: "ConstraintError"
                                    // TODO Add message
                                });
                            }
                        }
                    }
                }
                else{
                    // If the value of the index keyPath is invalid, ingore
                    if(!isValidKey(indexKey)){
                        continue;
                    }
                    if(index.unique && index.__data[indexKey]){
                        return error(context, request, {
                            name: "ConstraintError"
                            // TODO Add message
                        });
                    }
                }
            }

            // Set index data
            for (var ii = 0; ii < context._indexes.length; ii++) {
                var idx = context._indexes[ii];

                // If noOverWrite is false remove all existing records in the index for the key
                if(!noOverWrite){
                    for (var j = 0; j < idx.__data.length; j++) {
                        for (var k = 0; k < idx.__data[j].length; k++) {
                            if(idx.__data[j][k].key == key){
                                idx.__data[j].splice(k,1);
                            }
                        }
                    }
                }

                var idxKey = getPropertyValue(data, idx.keyPath);

                // If no value is found using the index keyPath, ignore
                if(!idxKey){
                    continue;
                }

                if(idx.multiEntry && idxKey instanceof Array){
                    var kys = {};
                    for (var m = 0; m < idxKey.length; m++) {
                        if(typeof idxKey[m] === 'number' && !kys[idxKey[m]]){
                            kys[idxKey[m]] = idxKey[m];
                            if(!idx.__data[idxKey[m]]){
                                idx.__data[idxKey[m]] = [];
                            }
                            idx.__data[idxKey[m]].push({ key: key, data: data });
                        }
                    }
                }
                else{
                    // If the value of the index keyPath is invalid, ingore
                    if(!isValidKey(idxKey)){
                        continue;
                    }
                    if(!idx.__data[idxKey]){
                        idx.__data[idxKey] = [];
                    }
                    idx.__data[idxKey].push({ key: key, data: data });
                }
            }

            if(noOverWrite && !context.__data[internalKey])
            {
                context.__keys.push(internalKey);
            }
            // set objectstore data
            context.__data[internalKey] = data;

            setTimeout(function () {
                request.__success(internalKey);
                context.__actions.splice(context.__actions.indexOf(timestamp),1);
            }, timeout);

            return request;
        }

        function createIndex(name, keyPath, parameters){
            if(this.transaction.mode !== TransactionTypes.VERSIONCHANGE){
                exception(this, {
                    name: "InvalidStateError"
                    // TODO Add message
                });
            }

            if(keyPath && keyPath instanceof Array)
            {
                for (var i = 0; i < keyPath.length; i++){
                    if(keyPath[i] === ""){
                        exception(this, {
                            name: "InvalidStateError"
                            // TODO Add message
                        });
                    }
                }
            }

            // TODO: Import existing data in the object store

            // TODO: Check valid key path?

            var index = new Index(name, keyPath, parameters, this);
            this._indexes.push(index);
            this.indexNames.push(name);

            return index;
        }
        function deleteIndex(name, parameters){
            if(this.transaction.mode !== TransactionTypes.VERSIONCHANGE){
                exception(this, {
                    name: "InvalidStateError"
                    // TODO Add message
                });
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
                exception(this, {
                    name: "NotFoundError"
                    // TODO Add message
                });
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
                    exception(this, {
                        name: "NotFoundError"
                        // TODO Add message
                    });
                }
            }

            for(var j = 0; j < this._indexes.length; j++)
            {
                if(this._indexes[j].name === name){
                    this._indexes[j].objectStore = this;
                    return this._indexes[j];
                }
            }

            exception(this, {
                name: "NotFoundError"
                // TODO Add message
            });
        }

        function finished (){
            return this.__actions.length === 0;
        }

        return {
            get: get,
            add: add,
            put: put,
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

    KeyRange.only = function(value){
        if(!isValidKey(value)){
            throw {
                name: "DataError"
                // TODO Add message
            };
        }
        return new KeyRange(value, value, false, false);
    };

    KeyRange.lowerBound = function(lower, open) {
        if(!isValidKey(lower)){
            throw {
                name: "DataError"
                // TODO Add message
            };
        }
        return new KeyRange(lower, undefined, open ? open : false, true);
    };

    KeyRange.upperBound = function(upper, open) {
        if(!isValidKey(upper)){
            throw {
                name: "DataError"
                // TODO Add message
            };
        }
        return new KeyRange(undefined, upper, true, open ? open : false);
    };

    KeyRange.bound = function(lower, upper, lowerOpen, upperOpen) {
        if(!isValidKey(lower) || !isValidKey(upper) || upper < lower || (upper === lower && !!upperOpen && !!lowerOpen)){
            throw {
                name: "DataError"
                // TODO Add message
            };
        }

        return new KeyRange(lower, upper, lowerOpen ? lowerOpen : false, upperOpen ? upperOpen : false);
    };

    KeyRange.prototype = function(){
        function inRange(key){
            if((!this.lower || key > this.lower || key === this.lower && !this.lowerOpen) && (!this.upper || key < this.upper || key === this.upper && !this.upperOpen)){
                return true;
            }
            return false;
        }
        return {
            inRange: inRange
        };
    }();

    Request.prototype = function () {
        function error(error, code){
            this.error = error;
            this.errorCode = code;
            this.readyState = DBRequestReadyState.done;

            if (typeof this.onerror === 'function') {
                this.onerror(new IErrorEvent(this));
            }
        }

        function success(result){
            this.result = result;
            this.readyState = DBRequestReadyState.done;

            if (typeof this.onsuccess === 'function') {
                this.onsuccess(new ISuccessEvent(this));
            }
        }

        function blocked(newVersion, oldVersion){
            this.readyState = DBRequestReadyState.done;

            if (typeof this.onblocked === 'function') {
                this.onblocked(new IVersionChangeEvent("blocked", {target: this, newVersion: null, oldVersion: oldVersion}));
            }
        }

        function upgradeneeded(result, transaction, newVersion, oldVersion){
            this.result = result;
            this.transaction = transaction;
            this.readyState = DBRequestReadyState.done;

            if (typeof this.onupgradeneeded === 'function') {
                this.onupgradeneeded(new IVersionChangeEvent("upgradeneeded", {target: this, newVersion: newVersion, oldVersion: oldVersion, returnValue: true}));
                transaction.__commit;
            }
        }
        return {
            __error: error,
            __success: success,
            // TODO Refactor in seperate object
            __blocked: blocked,
            __upgradeneeded: upgradeneeded
        }
    }();

    function isValidKey(key){
        if(typeof key === 'number' && !isNaN(key) || typeof key === 'string' || key instanceof Date && !isNaN(key)){
            return true;
        }
        if(key instanceof Array)
        {
            for (var i = key.length - 1; i >= 0; i--) {
                if(!isValidKey(key[i])){
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    function sortKey(item1,item2){
        if(typeof item1 === 'number' && typeof item2 === 'number' || typeof item1 === 'string' && typeof item2 === 'string' || item1 instanceof Date && item2 instanceof Date || item1 instanceof Array && item2 instanceof Array){
            if(item1 instanceof Array && item2 instanceof Array){
                item1 = item1.sort(sortKey);
                item2 = item2.sort(sortKey);
                var length = item1.length < item2.length ? item1.length : item2.length;
                for (var i = 0; i < length; i++) {
                    if ( item1[i] < item2[i] ){
                      return -1;
                    } 
                    if ( item1[i] > item2[i] ){
                      return 1;
                    }
                }
                if (item1.length < item2.length){
                    return -1;
                }
                if (item1.length > item2.length){
                    return 1;
                }
                return 0;
            }
            else{
                if ( item1 < item2 ){
                  return -1;
                } 
                if ( item1 > item2 ){
                  return 1;
                }
                return 0; 
            }       
        }
        else if(item1 instanceof Array){
            return 1;
        }
        else if(item2 instanceof Array){
            return -1;
        }
        else if(typeof item1 === 'string'){
            return 1;
        }
        else if(typeof item2 === 'string'){
            return -1;
        }
        else if(item1 instanceof Date){
            return 1;
        }
        else{
            return -1;
        }
    }

    global.indexedDBmock = indexeddb;
    global.IDBCursormock = Cursor;
    global.IDBDatabasemock = Snapshot;
    global.IDBTransactionmock = Transaction;
    global.IDBObjectStoremock = ObjectStore;
    global.IDBRequestmock = ObjectStore;
    global.IDBIndexmock = Index;
    global.IDBKeyRangemock = KeyRange;
    global.indexedDBmockDbs = dbs;
})(window || self);

// TODO: determine when exception is thrown.