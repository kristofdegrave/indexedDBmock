/**
 * Created by Kristof on 5/11/2015.
 */
define([
    'IDBRequest',
    'IDBRequestReadyState',
    'events/IDBVersionChangeEvent'
], function(IDBRequest,
            IDBRequestReadyState,
            IVersionChangeEvent){
    var IDBOpenDBRequest = function(){
        IDBRequest.call(this, null, null);

            this.onblocked = null;
            this.onupgradeneeded = null;
        };

    IDBOpenDBRequest.prototype = IDBRequest.prototype;

    IDBOpenDBRequest.prototype.__blocked = function (newVersion, oldVersion){
        this.readyState = IDBRequestReadyState.done;

        if (typeof this.onblocked === 'function') {
            this.onblocked(new IVersionChangeEvent("blocked", {target: this, newVersion: null, oldVersion: oldVersion}));
        }
    }
    IDBOpenDBRequest.prototype.__upgradeneeded = function (result, transaction, newVersion, oldVersion){
        this.result = result;
        this.transaction = transaction;
        this.readyState = IDBRequestReadyState.done;

        if (typeof this.onupgradeneeded === 'function') {
            this.onupgradeneeded(new IVersionChangeEvent("upgradeneeded", {target: this, newVersion: newVersion, oldVersion: oldVersion, returnValue: true}));
            transaction.__commit;
        }
    }

    return IDBOpenDBRequest;
});