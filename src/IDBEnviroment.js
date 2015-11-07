/**
 * Created by Kristof on 5/11/2015.
 */
define('IDBEnviroment', [
    'IDBFactory'
], function(IDBFactory){
    var IDBEnviroment = function(){
        this.indexedDB = new IDBFactory();
    }

    return IDBEnviroment;
});