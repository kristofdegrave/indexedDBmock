/**
 * Created by Kristof on 4/11/2015.
 */
(function(global){
    var Request = function(source, transaction){
            this.error = undefined;
            this.result = undefined;
            this.source = source;
            this.transaction = transaction;
            this.readyState = global.IDBRequestReadyStatemock.pending;
            this.onsuccess = null;
            this.onerror = null;
        },
        OpenDBRequest = function(){
            Request.call(this, null, null);

            this.onblocked = null;
            this.onupgradeneeded = null;
        };

    Request.prototype = function () {
        function error(error, code){
            this.error = error;
            this.errorCode = code;
            this.readyState = global.IDBRequestReadyStatemock.done;

            if (typeof this.onerror === 'function') {
                this.onerror(new IErrorEvent(this));
            }
        }

        function success(result){
            this.result = result;
            this.readyState = global.IDBRequestReadyStatemock.done;

            if (typeof this.onsuccess === 'function') {
                this.onsuccess(new ISuccessEvent(this));
            }
        }

        return {
            __error: error,
            __success: success,
        }
    }();

    OpenDBRequest.prototype = Request.prototype;

    OpenDBRequest.prototype.__blocked = function (newVersion, oldVersion){
        this.readyState = global.IDBRequestReadyStatemock.done;

        if (typeof this.onblocked === 'function') {
            this.onblocked(new global.IVersionChangeEvent("blocked", {target: this, newVersion: null, oldVersion: oldVersion}));
        }
    }
    OpenDBRequest.prototype.__upgradeneeded = function (result, transaction, newVersion, oldVersion){
        this.result = result;
        this.transaction = transaction;
        this.readyState = global.IDBRequestReadyStatemock.done;

        if (typeof this.onupgradeneeded === 'function') {
            this.onupgradeneeded(new global.IVersionChangeEvent("upgradeneeded", {target: this, newVersion: newVersion, oldVersion: oldVersion, returnValue: true}));
            transaction.__commit;
        }
    }

})(window || self);