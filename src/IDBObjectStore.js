/**
 * Created by Kristof on 7/11/2015.
 */
define('IDBObjectStore', [
    'IDBRequest',
    'IDBKeyRange',
    'IDBTransactionMode',
    'IDBIndex',
    'util'
],function(IDBRequest,
           IDBKeyRange,
           IDBTransactionMode,
           IDBIndex,
           util){
    var IDBObjectStore = function (name, params, transaction){
        if(arguments.length === 0) return; // Clone

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
        this.__id = util.guid();
    };

    IDBObjectStore.prototype = function (){
        function Get(key){
            var timestamp = (new Date()).getTime();
            var request = new IDBRequest(this, this.transaction);
            var data;

            this.__actions.push(timestamp);

            if(!(key instanceof IDBKeyRange)){
                key = IDBKeyRange.only(key);
            }

            if(this.transaction.db.objectStoreNames.indexOf(this.name) == -1){
                error(this, request, {
                    name: "InvalidStateError"
                    // TODO Add message
                });
            }

            if(key.upper === key.lower){
                data = this.__data[key.lower];
            }
            else{
                var keysSorted = this.__keys.sort(util.cmp); // todo extend with all types of keys
                for (var i = 0; i < keysSorted.length; i++) {
                    if(key.__inRange(keysSorted[i])){
                        data = this.__data[keysSorted[i]];
                        break;
                    }
                }
            }

            setTimeout(function (context) {
                request.__success(data);
                context.__actions.splice(context.__actions.indexOf(timestamp),1);
            }, util.timeout, this);

            return request;
        }
        function Put(data, key){
            return persist(this, data, key, false);
        }
        function Add(data, key) {
            return persist(this, data, key, true);
        }
        function Delete(key){
            //TODO Implement
        }
        function Clear(){
            // TODO Implement
        }
        function Count(key){
            var timestamp = (new Date()).getTime();
            var request = new IDBRequest(this, this.transaction);
            var count;

            this.__actions.push(timestamp);

            if(this.transaction.db.objectStoreNames.indexOf(this.name) == -1){
                error(this, request, {
                    name: "InvalidStateError"
                    // TODO Add message
                });
            }

            if(key) {
                if(!(key instanceof IDBKeyRange)){
                    key = IDBKeyRange.only(key);
                }
                count = 0;

                for (var i = 0; i < this.__keys.length; i++) {
                    if (key.__inRange(this.__keys[i])) {
                        count++;
                    }
                }
            }
            else{
                count = this.__keys.length;
            }

            setTimeout(function (context) {
                request.__success(count);
                context.__actions.splice(context.__actions.indexOf(timestamp),1);
            }, util.timeout, this);

            return request;
        }
        function OpenCursor(key, direction){
            // TODO Implement
        }
        function CreateIndex(name, keyPath, parameters){
            if(this.transaction.mode !== IDBTransactionMode.versionchange){
                exception(this, {
                    name: "InvalidStateError"
                    // TODO Add message
                });
            }

            if(keyPath && util.isArray(keyPath))
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

            var index = new IDBIndex(name, keyPath, parameters, this);
            this._indexes.push(index);
            this.indexNames.push(name);

            return index;
        }
        function DeleteIndex(name){
            if(this.transaction.mode !== IDBTransactionMode.versionchange){
                exception(this, {
                    name: "InvalidStateError"
                    // TODO Add message
                });
            }

            var indexIndex = this.indexNames.indexOf(name);
            if(indexIndex === -1)
            {
                exception(this, {
                    name: "NotFoundError"
                    // TODO Add message
                });
            }
            else
            {
                this.indexNames.splice(indexIndex, 1);
            }

            for(var j = 0; j < this._indexes.length; j++)
            {
                if(this._indexes[j].name === name){
                    this._indexes.splice(j, 1);
                }
            }
        }
        function Index(name) {
            for(var j = 0; j < this._indexes.length; j++)
            {
                if(this._indexes[j].name === name){
                    //this._indexes[j].objectStore = this;
                    return this._indexes[j];
                }
            }

            exception(this, {
                name: "NotFoundError"
                // TODO Add message
            });
        }

        function error(context, request, err){
            setTimeout(function () {
                request.__error(err);
                context.transaction.__error(err);
                context.transaction.abort(err);
            }, util.timeout);

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
            var request = new IDBRequest(this, this.transaction);
            var internalKey = key;

            if(context.transaction.__objectStoreNames.indexOf(context.name) == -1){
                exception(context, {
                    name: "InvalidStateError"
                    // TODO Add message
                }, timestamp);
            }

            if(context.transaction.mode == IDBTransactionMode.readonly){
                exception(context, {
                    name: "ReadOnlyError"
                    // TODO Add message
                }, timestamp);
            }

            if(!context.keyPath && !key && !context.autoIncrement || context.keyPath && (key || !data[context.keyPath] && !context.autoIncrement || !util.isObject(data))) {
                exception(context, {
                    name: "DataError"
                    // TODO Add message
                }, timestamp);
            }

            if(context.autoIncrement){
                if(!(util.isNumber(internalKey) && internalKey > context.__latestKey))
                {
                    internalKey = context.__latestKey + 1;
                    if(context.keyPath){
                        util.setPropertyValue(data, context.keyPath, internalKey);
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
                internalKey = util.getPropertyValue(data, context.keyPath);
            }

            if(!util.isValidKey(internalKey)) {
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

            if(util.containsFunction(data)){
                exception(context, {
                    name: "DataCloneError"
                    // TODO Add message
                }, timestamp);
            }

            // Check index constraints
            for (var i = 0; i < context._indexes.length; i++) {
                var index = context._indexes[i];
                var indexKey = util.getPropertyValue(data, index.keyPath);

                // If no value is found using the index keyPath, ignore
                if(!indexKey){
                    continue;
                }

                if(index.multiEntry && util.isArray(indexKey)){
                    var keys = {};
                    for (var l = 0; l < indexKey.length; l++) {
                        if(util.isValidKey(indexKey[l]) && !keys[indexKey[l]]){
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
                    if(!util.isValidKey(indexKey)){
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

                var idxKey = util.getPropertyValue(data, idx.keyPath);

                // If no value is found using the index keyPath, ignore
                if(!idxKey){
                    continue;
                }

                if(idx.multiEntry && util.isArray(idxKey)){
                    var kys = {};
                    for (var m = 0; m < idxKey.length; m++) {
                        if(util.isNumber(idxKey[m]) && !kys[idxKey[m]]){
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
                    if(!util.isValidKey(idxKey)){
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
            // set IDBObjectStore data
            context.__data[internalKey] = data;

            setTimeout(function () {
                request.__success(internalKey);
                context.__actions.splice(context.__actions.indexOf(timestamp),1);
            }, util.timeout);

            return request;
        }
        function finished (){
            return this.__actions.length === 0;
        }

        function Clone(context){
            var clone = new IDBObjectStore();
            clone.name = util.clone(this.name, context);
            clone.keyPath = util.clone(this.keyPath, context);
            clone.autoIncrement = util.clone(this.autoIncrement, context);
            clone.indexNames = util.clone(this.indexNames, context);

            clone._indexes = util.clone(this._indexes, context);
            clone.__data = util.clone(this.__data, context);
            clone.__keys = util.clone(this.__keys, context);
            //TODO Clone needed?
            clone.__actions = [];
            clone.__latestKey = util.clone(this.__latestKey, context);
            clone.__id = util.clone(this.__id, context);

            return clone;
        }

        return {
            add: Add,
            get: Get,
            put: Put,
            delete: Delete,
            clear: Clear,
            count: Count,
            openCursor: OpenCursor,
            createIndex: CreateIndex,
            deleteIndex: DeleteIndex,
            index: Index,
            __finished: finished,
            __clone: Clone
        };
    }();

    return IDBObjectStore;
});