/**
 * Created by Kristof on 5/11/2015.
 */
define([], function(){
    var Database = function(name){
        this.name = name;
        this.version = 0;
        this.objectStoreNames = [];
        this.objectStores = [];
        this.connections = [];
        this.transactions = [];
    };

    return Database;
});