/**
 * Created by Kristof on 5/11/2015.
 */
define('IDBOpenDBRequest', [
    'IDBRequest',
    'IDBRequestReadyState',
    'events/IDBVersionChangeEvent',
    'util'
], function(IDBRequest,
            IDBRequestReadyState,
            IVersionChangeEvent,
            util){
    var IDBOpenDBRequest = function(){
        IDBRequest.call(this, null, null);

            this.onblocked = null;
            this.onupgradeneeded = null;
        };

    IDBOpenDBRequest.prototype = IDBRequest.prototype;

    IDBOpenDBRequest.prototype.__blocked = function (newVersion, oldVersion){
        this.readyState = IDBRequestReadyState.done;

        if (util.isFunction(this.onblocked)) {
            this.onblocked(new IVersionChangeEvent("blocked", {target: this, newVersion: newVersion, oldVersion: oldVersion}));
        }
    };
    IDBOpenDBRequest.prototype.__upgradeneeded = function (result, transaction, newVersion, oldVersion){
        this.result = result;
        this.transaction = transaction;
        this.readyState = IDBRequestReadyState.done;

        if (util.isFunction(this.onupgradeneeded)) {
            this.onupgradeneeded(new IVersionChangeEvent("upgradeneeded", {target: this, newVersion: newVersion, oldVersion: oldVersion, returnValue: true}));
            transaction.__commit();
        }
    };

    IDBOpenDBRequest.prototype.__clone = function(context) {
        var clone = new IDBOpenDBRequest();

        clone.error = util.clone(this.error, context);
        clone.result = util.clone(this.result, context);
        clone.source = util.clone(this.source, context);
        clone.transaction = util.clone(this.transaction, context);
        clone.readyState = util.clone(this.readyState, context);
        clone.__id = util.clone(this.__id, context);

        return clone;
    };

    return IDBOpenDBRequest;
});
