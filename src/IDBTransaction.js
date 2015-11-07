/**
 * Created by Kristof on 7/11/2015.
 */
define('IDBTransaction', [
    'events/IAbortEvent',
    'events/ICompleteEvent',
    'events/IErrorEvent',
    'IDBTransactionMode',
    'util'
], function(IAbortEvent,
            IErrorEvent,
            ICompleteEvent,
            IDBTransactionMode,
            util){
    var IDBTransaction = function (objectStoreNames, mode, snapshot){
        this.db = snapshot;
        this.__active = true;
        this._aborted = false;
        this.__actions = [];

        if(!mode){
            mode = IDBTransactionMode.READONLY;
        }

        if(mode !== IDBTransactionMode.VERSIONCHANGE && (!objectStoreNames || objectStoreNames.length === 0)){
            this.aborted = true;
            this.__checkFinished(this);
            throw {
                name: "InvalidAccessError"
            };
        }

        if(mode !== IDBTransactionMode.READONLY && mode !== IDBTransactionMode.READWRITE && mode !== IDBTransactionMode.VERSIONCHANGE)
        {
            mode = IDBTransactionMode.READONLY;
        }

        if(objectStoreNames) {
            for (var i = 0; i < objectStoreNames.length; i++) {
                if(snapshot.objectStoreNames.indexOf(objectStoreNames[i]) === -1)
                {
                    this.aborted = true;
                    this.__checkFinished(this);
                    throw {
                        name: "NotFoundError"
                    };
                }
            }
        }

        this.oncomplete = undefined;
        this.onerror = undefined;
        this.onabort = undefined;

        this.error = null;
        this.mode = mode;
        this.objectStoreNames = objectStoreNames;
        this.db.transaction = this;

        this.__checkFinished(this);
    };

    IDBTransaction.prototype = function () {
        function Abort(err) {
            this._aborted = true;

            setTimeout(function(tx) {
                tx.error = er;
                if (util.isFunction(tx.onabort)) {
                    tx.onabort(new IAbortEvent(tx));
                }
            }, util.timeout, this, err);
        }
        function ObjectStore(name) {
            var timestamp = util.getTimestamp();
            this.__actions.push(timestamp);
            if(this.mode !== IDBTransactionMode.VERSIONCHANGE) {
                if (this.objectStoreNames.indexOf(name) === -1) {
                    this.__actions.splice(this.__actions.indexOf(timestamp),1);
                    checkFinished(this,undefined,timestamp);
                    throw {
                        name: "NotFoundError"
                    };
                }
            }

            for(var j = 0; j < this.db._objectStores.length; j++)
            {
                if(this.db._objectStores[j].name === name){
                    var obj = this.db._objectStores[j];
                    obj.transaction = this;
                    checkFinished(this,obj,timestamp);
                    return obj;
                }
            }

            this.__actions.splice(this.__actions.indexOf(timestamp),1);
            checkFinished(this,undefined,timestamp);
            throw {
                name: "NotFoundError"
            };
        }

        function commit(){
            //checkFinished(this);
            for (var i = 0; i < this.db._objectStores.length; i++) {
                var timestamp = util.getTimestamp();
                this.__actions.push(timestamp);
                checkFinished(this,this.db._objectStores[i], timestamp);
            }
        }
        function commitInternal(context){
            if(!context._aborted && !context.__commited) {
                context.__commited = true;
                if(this.mode != IDBTransactionMode.READONLY)
                {
                    context.db.__commit();
                }
                context.__active = false;
                context.__complete();
            }
        }
        function checkFinished(context, obj, timestamp){
            setTimeout(function(){
                if(!obj){
                    if(context.__actions.length === 0){
                        commitInternal(context);
                    }
                }
                else if(obj.__finished()){
                    context.__actions.splice(context.__actions.indexOf(timestamp),1);
                    if(context.__actions.length === 0){
                        commitInternal(context);
                    }
                }
                else
                {
                    checkFinished(context, obj, timestamp);
                }
            }, util.timeout);
        }
        function error(err, code){
            this.error = err;
            this.errorCode = code;

            if (util.isFunction(this.onerror)) {
                this.onerror(new IErrorEvent(this));
            }
        }
        function complete(){
            if (util.isFunction(this.oncomplete)) {
                this.oncomplete(new ICompleteEvent(this));
            }
        }

        return {
            abort: abort,
            objectStore: objectStore,
            __commit: commit,
            __checkFinished: checkFinished,
            __complete: complete,
            __error: error
        };
    }();

    return IDBTransaction;
});