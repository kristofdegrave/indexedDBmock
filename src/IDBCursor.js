/**
 * Created by Kristof on 7/11/2015.
 */
define([
    'IDBRequest'
], function(IDBRequest){
    var IDBCursor = function(source, key, direction, primaryKey){
        this.source = source;
        this.direction = direction;
        this.key = key;
        this.primaryKey = primaryKey;
    };

    IDBCursor.prototype = (function (){
        function Update(value){
            // TODO: Implement
        }
        function Advance(count){
            // TODO: Implement
        }
        function Continue(key){
            // TODO: Implement
        }
        function Delete(){
            // TODO: Implement
        }

        return {
            update: Update,
            advance: Advance,
            continue: Continue,
            delete: Delete
        }
    })();

    return IDBCursor;
});