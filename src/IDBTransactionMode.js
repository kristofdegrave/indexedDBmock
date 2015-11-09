/**
 * Created by Kristof on 7/11/2015.
 */
define('IDBTransactionMode', [], function(){
    var IDBTransactionMode = {
        readonly: "readonly",
        readwrite: "readwrite",
        versionchange: "versionchange"
    };

    return IDBTransactionMode;
});