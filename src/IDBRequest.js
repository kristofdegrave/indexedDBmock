/**
 * Created by Kristof on 5/11/2015.
 */
define('IDBRequest', [
    'IDBRequestReadyState',
    'events/ISuccessEvent',
    'events/IErrorEvent',
    'util'
], function(IDBRequestReadyState,
            ISuccessEvent,
            IErrorEvent,
            util){
    var IDBRequest = function(source, transaction){
            if(arguments.length === 0) return; // Clone

            this.error = undefined;
            this.result = undefined;
            this.source = source;
            this.transaction = transaction;
            this.readyState = IDBRequestReadyState.pending;
            this.onsuccess = null;
            this.onerror = null;
            this.__id = util.guid();
        };

    IDBRequest.prototype = function () {
        function Error(error, code){
            this.error = error;
            this.errorCode = code;
            this.readyState = IDBRequestReadyState.done;

            if (util.isFunction(this.onerror)) {
                this.onerror(new IErrorEvent(this));
            }
        }

        function Success(result){
            this.result = result;
            this.readyState = IDBRequestReadyState.done;

            if (util.isFunction(this.onsuccess)) {
                this.onsuccess(new ISuccessEvent(this));
            }
        }

        function Clone(context){
            var clone = new IDBRequest();

            clone.error = util.clone(this.error, context);
            clone.result = util.clone(this.result, context);
            clone.source = util.clone(this.source, context);
            clone.transaction = util.clone(this.transaction, context);
            clone.readyState = util.clone(this.readyState, context);
            clone.__id = util.clone(this.__id, context);

            return clone;
        }

        return {
            __clone: Clone,
            __error: Error,
            __success: Success
        };
    }();

    return IDBRequest;
});