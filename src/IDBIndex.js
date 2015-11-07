/**
 * Created by Kristof on 7/11/2015.
 */
define('IDBIndex', [
    'IDBCursor',
    'IDBKeyRange'
],function (IDBCursor,
            IDBKeyRange){
    var IDBIndex = function(name, keyPath, params, objectStore){
        this.name = name;
        this.keyPath = keyPath;
        this.multiEntry = params ? params.multiEntry : undefined;
        this.unique = params ? params.unique : undefined;

        this.objectStore = objectStore;
        this.__data = {};
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

        return {
            count: Count,
            get: Get,
            getKey: GetKey,
            openCursor: OpenCursor,
            openKeyCursor: OpenKeyCursor
        };
    }();

    return IDBIndex
});