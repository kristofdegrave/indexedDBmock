/**
 * Created by Kristof on 7/11/2015.
 */
define('IDBIndex', [
    'IDBCursor',
    'IDBKeyRange',
    'util'
],function (IDBCursor,
            IDBKeyRange,
            util){
    var IDBIndex = function(name, keyPath, params, objectStore){
        if(arguments.length === 0) return; // Clone

        this.name = name;
        this.keyPath = keyPath;
        this.multiEntry = params ? params.multiEntry : undefined;
        this.unique = params ? params.unique : undefined;

        this.objectStore = objectStore;
        this.__data = {};
        this.__id = util.guid();
    };

    IDBIndex.prototype = function (){
        function Get(key){
            // TODO: Implement
        }
        function OpenCursor(key, direction){
            // TODO: Implement
        }
        function OpenKeyCursor(key, direction){
            // TODO: Implement
        }
        function GetKey(key){
            // TODO: Implement
        }
        function Count(key){
            // TODO: Implement
        }

        function Clone(context){
            var clone = new IDBIndex();
            clone.name = util.clone(this.name, context);
            clone.keyPath = util.clone(this.keyPath, context);
            clone.multiEntry = util.clone(this.multiEntry, context);
            clone.unique = util.clone(this.unique, context);
            clone.objectStore = util.clone(this.objectStore, context);

            clone.__id = util.clone(this.__id, context);
            clone.__data = util.clone(this.__data, context);

            return clone;
        }

        return {
            count: Count,
            get: Get,
            getKey: GetKey,
            openCursor: OpenCursor,
            openKeyCursor: OpenKeyCursor,
            __clone: Clone
        };
    }();

    return IDBIndex;
});