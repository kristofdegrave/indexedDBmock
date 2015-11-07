/**
 * Created by Kristof on 5/11/2015.
 */
define('IDBVersionChangeEventInit', [], function(){
    var IDBVersionChangeEventInit = function(){
        this.oldVersion = 0;
        this.newVersion = null;
    }

    return IDBVersionChangeEventInit;
});