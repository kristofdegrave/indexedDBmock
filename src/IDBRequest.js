/**
 * Created by Kristof on 5/11/2015.
 */
define('IDBRequest', [
    'IDBRequestReadyState',
    'events/ISuccessEvent',
    'events/IErrorEvent'
], function(IDBRequestReadyState,
            ISuccessEvent,
            IErrorEvent){
    var IDBRequest = function(source, transaction){
            this.error = undefined;
            this.result = undefined;
            this.source = source;
            this.transaction = transaction;
            this.readyState = IDBRequestReadyState.pending;
            this.onsuccess = null;
            this.onerror = null;
        };

    IDBRequest.prototype = function () {
        function Error(error, code){
            this.error = error;
            this.errorCode = code;
            this.readyState = IDBRequestReadyState.done;

            if (typeof this.onerror === 'function') {
                this.onerror(new IErrorEvent(this));
            }
        }

        function Success(result){
            this.result = result;
            this.readyState = IDBRequestReadyState.done;

            if (typeof this.onsuccess === 'function') {
                this.onsuccess(new ISuccessEvent(this));
            }
        }

        return {
            __error: Error,
            __success: Success
        }
    }();

    return IDBRequest
})