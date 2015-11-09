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
    var IDBTransaction = function (objectStoreNames, mode, db){
        if(arguments.length === 0) return; // Clone

        this.__active = true;
        this.__aborted = false;
        this.__actions = [];

        if(!mode){
            mode = IDBTransactionMode.readonly;
        }

        if(mode !== IDBTransactionMode.versionchange && (!objectStoreNames || objectStoreNames.length === 0)){
            this.aborted = true;
            this.__checkFinished(this);
            throw {
                name: "InvalidAccessError"
            };
        }

        if(mode !== IDBTransactionMode.readonly && mode !== IDBTransactionMode.readwrite && mode !== IDBTransactionMode.versionchange)
        {
            mode = IDBTransactionMode.readonly;
        }

        this.oncomplete = undefined;
        this.onerror = undefined;
        this.onabort = undefined;

        this.error = null;
        this.mode = mode;

        this.db = db;
        this.__objectStoreNames = objectStoreNames;
        this.__id = util.guid();

        if(objectStoreNames) {
            for (var i = 0; i < objectStoreNames.length; i++) {
                if(db.objectStoreNames.indexOf(objectStoreNames[i]) === -1)
                {
                    this.__aborted = true;
                    this.__checkFinished(this);
                    throw {
                        name: "NotFoundError"
                    };
                }
            }
        }

        this.__checkFinished(this);
    };

    IDBTransaction.prototype = function () {
        function Abort(err) {
            this.__aborted = true;

            setTimeout(function(tx, er) {
                tx.error = er;
                if (util.isFunction(tx.onabort)) {
                    tx.onabort(new IAbortEvent(tx));
                }
            }, util.timeout, this, err);
        }
        function ObjectStore(name) {
            var timestamp = util.getTimestamp();
            this.__actions.push(timestamp);
            if(this.mode !== IDBTransactionMode.versionchange) {
                if (this.__objectStoreNames.indexOf(name) === -1) {
                    this.__actions.splice(this.__actions.indexOf(timestamp),1);
                    this.__checkFinished(this,undefined,timestamp);
                    throw {
                        name: "NotFoundError"
                    };
                }
            }

            for(var j = 0; j < this.db.__getObjectStores().length; j++)
            {
                if(this.db.__getObjectStores()[j].name === name){
                    var obj = this.db.__getObjectStores()[j];
                    obj.transaction = this;
                    this.__checkFinished(this,obj,timestamp);
                    return obj;
                }
            }

            this.__actions.splice(this.__actions.indexOf(timestamp),1);
            this.__checkFinished(this,undefined,timestamp);
            throw {
                name: "NotFoundError"
            };
        }

        function Commit(){
            //checkFinished(this);
            for (var i = 0; i < this.db.__getObjectStores().length; i++) {
                var timestamp = util.getTimestamp();
                this.__actions.push(timestamp);
                this.__checkFinished(this,this.db.__getObjectStores()[i], timestamp);
            }
        }
        function commitInternal(context){
            if(!context.__aborted && !context.__commited) {
                context.__commited = true;
                if(context.mode && context.mode !== IDBTransactionMode.readonly)
                {
                    context.db.__commit();
                }
                context.__active = false;
                context.__complete();
            }
        }
        function CheckFinished(context, obj, timestamp){
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
                    context.__checkFinished(context, obj, timestamp);
                }
            }, util.timeout);
        }
        function Error(err, code){
            this.error = err;
            this.errorCode = code;

            if (util.isFunction(this.onerror)) {
                this.onerror(new IErrorEvent(this));
            }
        }
        function Complete(){
            if (util.isFunction(this.oncomplete)) {
                this.oncomplete(new ICompleteEvent(this));
            }
        }

        function Clone(context){
            var clone = new IDBTransaction();

            clone.__aborted = util.clone(this.__aborted, context);
            clone.__actions = util.clone(this.__actions, context);
            clone.__active = util.clone(this.__active, context);
            clone.error = util.clone(this.error, context);
            clone.mode = util.clone(this.mode, context);
            clone.__objectStoreNames = util.clone(this.__objectStoreNames, context);
            clone.db = util.clone(this.db, context);
            clone.__id = util.clone(this.__id, context)

            return clone;
        }

        return {
            abort: Abort,
            objectStore: ObjectStore,
            __clone: Clone,
            __commit: Commit,
            __checkFinished: CheckFinished,
            __complete: Complete,
            __error: Error
        };
    }();

    return IDBTransaction;
});