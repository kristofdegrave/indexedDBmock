/**
 * Created by Kristof on 8/11/2015.
 */
define('DataProvider', [], function(){
    var DataProvider = function(){
    };

    DataProvider.prototype = (function(){
        var dbs = {};

        function GetDatabase(name){
            return dbs[name];
        }

        function SetDatabase(name, database){
            dbs[name] = database;
        }

        function RemoveDatabase(name){
            dbs[name] = undefined;
            delete dbs[name];
        }

        return {
            getDatabase: GetDatabase,
            setDatabase: SetDatabase,
            removeDatabase: RemoveDatabase
        };
    })();

    return new DataProvider();
});