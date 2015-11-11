(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["mock"] = factory();
	else
		root["mock"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Created by Kristof on 7/11/2015.
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(3),
	    __webpack_require__(22),
	    __webpack_require__(9),
	    __webpack_require__(17),
	    __webpack_require__(18),
	    __webpack_require__(15),
	    __webpack_require__(1),
	    __webpack_require__(14),
	    __webpack_require__(19),
	    __webpack_require__(4),
	    __webpack_require__(10),
	    __webpack_require__(16)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(
	    IDBCursor,
	    IDBCursorWithValue,
	    IDBDatabase,
	    IDBEnviroment,
	    IDBFactory,
	    IDBIndex,
	    IDBKeyRange,
	    IDBObjectStore,
	    IDBOpenDBRequest,
	    IDBRequest,
	    IDBTransaction,
	    IDBVersionChangeEvent
	){
	    var env = new IDBEnviroment();
	
	    return {
	        IDBCursor: IDBCursor,
	        IDBCursorWithValue: IDBCursorWithValue,
	        IDBDatabase: IDBDatabase,
	        IDBFactory: IDBFactory,
	        IDBIndex: IDBIndex,
	        IDBKeyRange: IDBKeyRange,
	        IDBObjectStore: IDBObjectStore,
	        IDBOpenDBRequest: IDBOpenDBRequest,
	        IDBRequest: IDBRequest,
	        IDBTransaction: IDBTransaction,
	        IDBVersionChangeEvent: IDBVersionChangeEvent,
	        indexedDB: env.indexedDB
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Created by Kristof on 5/11/2015.
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(2)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(util){
	    var IDBKeyRange = function(lower, upper, lowerOpen, upperOpen){
	        if(arguments.length === 0) return; // clone
	
	        this.lower = lower;
	        this.upper = upper;
	        this.lowerOpen = lowerOpen ? lowerOpen : false;
	        this.upperOpen = upperOpen ? upperOpen : false;
	        this.__id = util.guid();
	    };
	
	    IDBKeyRange.only = function(value){
	        if(!util.isValidKey(value)){
	            throw {
	                name: "DataError"
	                // TODO Add message
	            };
	        }
	        return new KeyRange(value, value, false, false);
	    };
	
	    IDBKeyRange.lowerBound = function(lower, open) {
	        if(!util.isValidKey(lower)){
	            throw {
	                name: "DataError"
	                // TODO Add message
	            };
	        }
	        return new KeyRange(lower, undefined, open ? open : false, true);
	    };
	
	    IDBKeyRange.upperBound = function(upper, open) {
	        if(!util.isValidKey(upper)){
	            throw {
	                name: "DataError"
	                // TODO Add message
	            };
	        }
	        return new KeyRange(undefined, upper, true, open ? open : false);
	    };
	
	    IDBKeyRange.bound = function(lower, upper, lowerOpen, upperOpen) {
	        if(!util.isValidKey(lower) || !util.isValidKey(upper) || upper < lower || (upper === lower && !!upperOpen && !!lowerOpen)){
	            throw {
	                name: "DataError"
	                // TODO Add message
	            };
	        }
	
	        return new KeyRange(lower, upper, lowerOpen ? lowerOpen : false, upperOpen ? upperOpen : false);
	    };
	
	    IDBKeyRange.prototype = function(){
	        function InRange(key){
	            if((!this.lower || key > this.lower || key === this.lower && !this.lowerOpen) && (!this.upper || key < this.upper || key === this.upper && !this.upperOpen)){
	                return true;
	            }
	            return false;
	        }
	
	        function Clone(context){
	            var clone = new IDBKeyRange();
	
	            clone.lower = util.clone(this.lower, context);
	            clone.upper = util.clone(this.upper, context);
	            clone.lowerOpen = util.clone(this.lowerOpen, context);
	            clone.upperOpen = util.clone(this.upperOpen, context);
	            clone.__id = util.clone(this.__id, context);
	
	            return clone;
	        }
	
	        return {
	            __clone: Clone,
	            __inRange: InRange
	        };
	    }();
	
	    return IDBKeyRange;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Created by Kristof on 5/11/2015.
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function(){
	    function IsValidKey(key){
	        if(typeof key === 'number' && !isNaN(key) || typeof key === 'string' || key instanceof Date && !isNaN(key)){
	            return true;
	        }
	        if(key instanceof Array)
	        {
	            for (var i = key.length - 1; i >= 0; i--) {
	                if(!IsValidKey(key[i])){
	                    return false;
	                }
	            }
	            return true;
	        }
	        return false;
	    }
	    function Cmp(first, second){
	        if(IsNumber(first) && IsNumber(second) || IsString(first) && IsString(second) || IsDate(first) && IsDate(second) || IsArray(first) && IsArray(second)){
	            if(IsArray(first)&& IsArray(second)){
	                first = first.sort(Cmp);
	                second = second.sort(Cmp);
	                var length = first.length < second.length ? first.length : second.length;
	                for (var i = 0; i < length; i++) {
	                    if ( first[i] < second[i] ){
	                        return -1;
	                    }
	                    if ( first[i] > second[i] ){
	                        return 1;
	                    }
	                }
	                if (first.length < second.length){
	                    return -1;
	                }
	                if (first.length > second.length){
	                    return 1;
	                }
	                return 0;
	            }
	            else{
	                if ( first < second ){
	                    return -1;
	                }
	                if ( first > second ){
	                    return 1;
	                }
	                return 0;
	            }
	        }
	        else if(IsArray(first)){
	            return 1;
	        }
	        else if(IsArray(second)){
	            return -1;
	        }
	        else if(IsString(first)){
	            return 1;
	        }
	        else if(IsString(second)){
	            return -1;
	        }
	        else if(IsDate(first)){
	            return 1;
	        }
	        else{
	            return -1;
	        }
	    }
	    function IsNumber(item){
	        return item && typeof item === 'number';
	    }
	    function IsString(item){
	        return item && typeof item === 'string';
	    }
	    function IsArray(item){
	        return item && item instanceof Array;
	    }
	    function IsDate(item){
	        return item && item instanceof Date;
	    }
	    function IsObject(item) {
	        return item && item.constructor.name === "Object";
	    }
	    function IsFunction(functionToCheck) {
	        var getType = {};
	        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	    }
	    function GetPropertyValue(data, propertyName) {
	        var structure = propertyName.split(".");
	        var value = data;
	        for (var i = 0; i < structure.length; i++) {
	            if (value) {
	                value = value[structure[i]];
	            }
	        }
	        return value;
	    }
	    function SetPropertyValue(data, propertyName, value) {
	        var structure = propertyName.split(".");
	        var obj = data;
	        for (var i = 0; i < structure.length; i++) {
	            if (i != (structure.length - 1)) {
	                obj[structure[i]] = {};
	                obj = obj[structure[i]];
	            }
	            else {
	                obj[structure[i]] = value;
	            }
	        }
	        return obj;
	    }
	    function ContainsFunction(data){
	        for(var prop in data){
	            if(IsFunction(data[prop])){
	                return true;
	            }
	            if(IsObject(prop)){
	                if(ContainsFunction(data[prop])){
	                    return true;
	                }
	            }
	        }
	        return false;
	    }
	    function GetTimestamp(){
	        return (new Date()).getTime();
	    }
	    function Guid() {
	        function s4() {
	            return Math.floor((1 + Math.random()) * 0x10000)
	                .toString(16)
	                .substring(1);
	        }
	        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
	            s4() + '-' + s4() + s4() + s4();
	    }
	    function clone(obj, context) {
	        var copy;
	
	        // Handle the 3 simple types, and null or undefined
	        if (null === obj || "object" != typeof obj) return obj;
	
	        context = context || {};
	
	        // Handle Date
	        if (obj instanceof Date) {
	            copy = new Date();
	            copy.setTime(obj.getTime());
	            return copy;
	        }
	
	        // Handle Array
	        if (obj instanceof Array) {
	            copy = [];
	            for (var i = 0, len = obj.length; i < len; i++) {
	                copy[i] = clone(obj[i], context);
	            }
	            return copy;
	        }
	
	        // Handle Object
	        if (obj instanceof Object) {
	            copy = {};
	            if(obj.__clone) {
	                if(obj.__id) {
	                    if(context[obj.__id]) {
	                        return context[obj.__id];
	                    }
	                    else {
	                        context[obj.__id] = copy;
	                    }
	                }
	                copy = obj.__clone(context);
	                if(obj.__id) {
	                    context[obj.__id] = copy;
	                }
	            }
	            else{
	                for (var attr in obj) {
	                    if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr], context);
	                }
	            }
	            return copy;
	        }
	
	        throw new Error("Unable to copy obj! Its type isn't supported.");
	    }
	
	    return {
	        clone: clone,
	        containsFunction: ContainsFunction,
	        cmp: Cmp,
	        isArray: IsArray,
	        isDate: IsDate,
	        isFunction: IsFunction,
	        isNumber: IsNumber,
	        isObject: IsObject,
	        isString: IsString,
	        isValidKey: IsValidKey,
	        getPropertyValue: GetPropertyValue,
	        getTimestamp: GetTimestamp,
	        guid: Guid,
	        setPropertyValue: SetPropertyValue,
	        timeout: 1
	    };
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Created by Kristof on 7/11/2015.
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(4)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(IDBRequest){
	    var IDBCursor = function(source, key, direction, primaryKey){
	        this.source = source;
	        this.direction = direction;
	        this.key = key;
	        this.primaryKey = primaryKey;
	    };
	
	    IDBCursor.prototype = (function (){
	        function Update(value){
	            // TODO: Implement
	        }
	        function Advance(count){
	            // TODO: Implement
	        }
	        function Continue(key){
	            // TODO: Implement
	        }
	        function Delete(){
	            // TODO: Implement
	        }
	
	        return {
	            update: Update,
	            advance: Advance,
	            continue: Continue,
	            delete: Delete
	        };
	    })();
	
	    return IDBCursor;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Created by Kristof on 5/11/2015.
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(5),
	    __webpack_require__(6),
	    __webpack_require__(8),
	    __webpack_require__(2)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(IDBRequestReadyState,
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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Created by Kristof on 7/11/2015.
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function(){
	    var IDBRequestReadyState = {
	        done: "done",
	        pending: "pending"
	    };
	
	    return IDBRequestReadyState;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Created by Kristof on 5/11/2015.
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(7)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(IEvent){
	    var ISuccessEvent = function(request){
	        IEvent.call(this, "success", {target: request, returnValue: true});
	    };
	
	    ISuccessEvent.prototype = IEvent.prototype;
	
	    return ISuccessEvent;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Created by Kristof on 5/11/2015.
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function(){
	    var IEvent = function(type, config){
	        this.CAPTURING_PHASE = 1;
	        this.AT_TARGET = 2;
	        this.BUBBLING_PHASE = 3;
	
	        this.bubbles = config.bubbles || false;
	        this.cancelBubble = (config.bubbles && config.cancelable) || false;
	        this.cancelable = config.cancelable || false;
	        this.currentTarget = config.target;
	        this.defaultPrevented = false;
	        this.detail = undefined;
	        this.eventPhase = this.AT_TARGET;
	        this.path = undefined;
	        this.returnValue = config.returnValue;
	        this.srcElement = config.target;
	        this.target = config.target;
	        this.timestamp = Date.now();
	        this.type = type;
	    };
	
	    IEvent.prototype = (function(){
	        function PreventDefault(){
	            this.defaultPrevented = true;
	        }
	        function StopImmediatePropagation(){
	            this.cancelBubble = true;
	        }
	
	        return {
	            preventDefault: PreventDefault,
	            stopImmediatePropagation: StopImmediatePropagation
	        };
	    })();
	
	    return IEvent;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Created by Kristof on 5/11/2015.
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(7)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(IEvent){
	    var IErrorEvent = function(request){
	        IEvent.call(this, "error", {target: request, returnValue: true});
	    };
	
	    IErrorEvent.prototype = IEvent.prototype;
	
	    return IErrorEvent;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Created by Kristof on 5/11/2015.
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(5),
	    __webpack_require__(10),
	    __webpack_require__(13),
	    __webpack_require__(14),
	    __webpack_require__(16),
	    __webpack_require__(8),
	    __webpack_require__(11),
	    __webpack_require__(2)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(IDBRequestReadyState,
	            IDBTransaction,
	            IDBTransactionMode,
	            IDBObjectStore,
	            IDBVersionChangeEvent,
	            IErrorEvent,
	            IAbortEvent,
	            util){
	    var IDBDatabase = function(db){
	        this.name = db.name;
	        this.version = db.version;
	        this.objectStoreNames = db.objectStoreNames;
	
	        this.onabort = null;
	        this.onerror = null;
	        this.onversionchange = null;
	
	        this.__db = db;
	        this.__snapshot = db.snapshot();
	        this.__connectionId = util.guid();
	    };
	
	    IDBDatabase.prototype = function () {
	        function Close() {
	            this.__db.removeConnection(this);
	        }
	        function Commit(){
	            this.__db.commitSnapshot(this.__snapshot);
	        }
	        function Transaction(objectStoreNames, mode) {
	            var transaction = new IDBTransaction(objectStoreNames, mode, this);
	            if(mode === IDBTransactionMode.versionchange){
	                this.transaction = transaction;
	            }
	            return transaction;
	        }
	        function CreateObjectStore(name, parameters){
	            if(this.transaction.mode !== IDBTransactionMode.versionchange){
	                throw {
	                    name: "InvalidStateError"
	                    // TODO: Add message
	                };
	            }
	
	            // TODO: Check valid key path?
	            if(parameters && util.isArray(parameters.keyPath))
	            {
	                for (var i = 0; i < parameters.keyPath.length; i++){
	                    if(parameters.keyPath[i] === ""){
	                        this.transaction.abort();
	                        throw {
	                            name: "InvalidAccessError"
	                            // TODO: Add message
	                        };
	                    }
	                }
	            }
	
	            var objectStore = new IDBObjectStore(name, parameters, this.transaction);
	            this.__snapshot.addObjectStore(objectStore);
	            this.objectStoreNames.push(name);
	
	            return objectStore;
	        }
	        function DeleteObjectStore(name){
	            if(this.transaction.mode !== IDBTransactionMode.versionchange){
	                throw {
	                    name: "InvalidStateError"
	                    // TODO: Add message
	                };
	            }
	
	            if(this.objectStoreNames.indexOf(name) === -1)
	            {
	                throw {
	                    name: "NotFoundError"
	                    // TODO: Add message
	                };
	            }
	
	            this.__snapshot.removeObjectStore(name);
	        }
	        function Versionchange (newVersion){
	            this.readyState = IDBRequestReadyState.done;
	
	            if (util.isFunction(this.onversionchange)) {
	                this.onversionchange(new IDBVersionChangeEvent("versionchange", {target: this, newVersion: newVersion, oldVersion: this.version}));
	            }
	        }
	        function Error(error, code){
	            this.error = error;
	            this.errorCode = code;
	            this.readyState = IDBRequestReadyState.done;
	
	            if (util.isFunction(this.onerror)) {
	                this.onerror(new IErrorEvent(this));
	            }
	        }
	        function Abort(error){
	            this.error = error;
	            if (util.isFunction(this.onabort)) {
	                this.onabort(new IAbortEvent(this));
	            }
	        }
	        function GetObjectStores(){
	            return this.__snapshot.objectStores;
	        }
	        function GetObjectStoreNames(){
	            return this.__snapshot.objectStoreNames;
	        }
	
	        return {
	            close: Close,
	            transaction: Transaction,
	            createObjectStore: CreateObjectStore,
	            deleteObjectStore: DeleteObjectStore,
	            __abort: Abort,
	            __commit: Commit,
	            __error: Error,
	            __getObjectStores: GetObjectStores,
	            __getObjectStoreNames: GetObjectStoreNames,
	            __versionchange: Versionchange
	        };
	    }();
	
	    return IDBDatabase;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Created by Kristof on 7/11/2015.
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(11),
	    __webpack_require__(12),
	    __webpack_require__(8),
	    __webpack_require__(13),
	    __webpack_require__(2)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(IAbortEvent,
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
	            clone.__id = util.clone(this.__id, context);
	
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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Created by Kristof on 5/11/2015.
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(7)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(IEvent){
	    var IAbortEvent = function(transaction){
	        IEvent.call(this, "abort", {target: transaction, returnValue: true});
	    };
	
	    IAbortEvent.prototype = IEvent.prototype;
	
	    return IAbortEvent;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Created by Kristof on 5/11/2015.
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(7)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(IEvent){
	    var ICompleteEvent = function(transaction){
	        IEvent.call(this, "complete", {target: transaction, returnValue: true});
	    };
	
	    ICompleteEvent.prototype = IEvent.prototype;
	
	    return ICompleteEvent;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Created by Kristof on 7/11/2015.
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function(){
	    var IDBTransactionMode = {
	        readonly: "readonly",
	        readwrite: "readwrite",
	        versionchange: "versionchange"
	    };
	
	    return IDBTransactionMode;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Created by Kristof on 7/11/2015.
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(4),
	    __webpack_require__(1),
	    __webpack_require__(13),
	    __webpack_require__(15),
	    __webpack_require__(2)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(IDBRequest,
	           IDBKeyRange,
	           IDBTransactionMode,
	           IDBIndex,
	           util){
	    var IDBObjectStore = function (name, params, transaction){
	        if(arguments.length === 0) return; // Clone
	
	        this.name = name;
	        this.keyPath = params ? params.keyPath : undefined;
	        this.autoIncrement = params ? params.autoIncrement : undefined;
	        this.indexNames = [];
	        this.transaction = transaction;
	
	        this._indexes = [];
	        this.__data = {};
	        this.__keys = [];
	        this.__actions = [];
	        this.__latestKey = 0;
	        this.__id = util.guid();
	    };
	
	    IDBObjectStore.prototype = function (){
	        function Get(key){
	            var timestamp = (new Date()).getTime();
	            var request = new IDBRequest(this, this.transaction);
	            var data;
	
	            this.__actions.push(timestamp);
	
	            if(!(key instanceof IDBKeyRange)){
	                if(!util.isValidKey(key)){
	                    exception(this, {
	                        name: "DataError"
	                        // TODO Add message
	                    }, timestamp);
	                }
	
	                key = IDBKeyRange.only(key);
	            }
	
	            if(this.transaction.db.objectStoreNames.indexOf(this.name) == -1){
	                error(this, request, {
	                    name: "InvalidStateError"
	                    // TODO Add message
	                });
	            }
	
	            if(key.upper === key.lower){
	                data = this.__data[key.lower];
	            }
	            else{
	                var keysSorted = this.__keys.sort(util.cmp); // todo extend with all types of keys
	                for (var i = 0; i < keysSorted.length; i++) {
	                    if(key.__inRange(keysSorted[i])){
	                        data = this.__data[keysSorted[i]];
	                        break;
	                    }
	                }
	            }
	
	            setTimeout(function (context) {
	                request.__success(data);
	                context.__actions.splice(context.__actions.indexOf(timestamp),1);
	            }, util.timeout, this);
	
	            return request;
	        }
	        function Put(data, key){
	            return persist(this, data, key, false);
	        }
	        function Add(data, key) {
	            return persist(this, data, key, true);
	        }
	        function Delete(key){
	            //TODO Implement
	        }
	        function Clear(){
	            // TODO Implement
	        }
	        function Count(key){
	            var timestamp = (new Date()).getTime();
	            var request = new IDBRequest(this, this.transaction);
	            var count;
	
	            this.__actions.push(timestamp);
	
	            if(this.transaction.db.objectStoreNames.indexOf(this.name) == -1){
	                error(this, request, {
	                    name: "InvalidStateError"
	                    // TODO Add message
	                });
	            }
	
	            if(key) {
	                if(!(key instanceof IDBKeyRange)){
	                    if(!util.isValidKey(key)){
	                        exception(this, {
	                            name: "DataError"
	                            // TODO Add message
	                        }, timestamp);
	                    }
	
	                    key = IDBKeyRange.only(key);
	                }
	                count = 0;
	
	                for (var i = 0; i < this.__keys.length; i++) {
	                    if (key.__inRange(this.__keys[i])) {
	                        count++;
	                    }
	                }
	            }
	            else{
	                count = this.__keys.length;
	            }
	
	            setTimeout(function (context) {
	                request.__success(count);
	                context.__actions.splice(context.__actions.indexOf(timestamp),1);
	            }, util.timeout, this);
	
	            return request;
	        }
	        function OpenCursor(key, direction){
	            // TODO Implement
	        }
	        function CreateIndex(name, keyPath, parameters){
	            if(this.transaction.mode !== IDBTransactionMode.versionchange){
	                exception(this, {
	                    name: "InvalidStateError"
	                    // TODO Add message
	                });
	            }
	
	            if(keyPath && util.isArray(keyPath))
	            {
	                for (var i = 0; i < keyPath.length; i++){
	                    if(keyPath[i] === ""){
	                        exception(this, {
	                            name: "InvalidStateError"
	                            // TODO Add message
	                        });
	                    }
	                }
	            }
	
	            // TODO: Import existing data in the object store
	
	            // TODO: Check valid key path?
	
	            var index = new IDBIndex(name, keyPath, parameters, this);
	            this._indexes.push(index);
	            this.indexNames.push(name);
	
	            return index;
	        }
	        function DeleteIndex(name){
	            if(this.transaction.mode !== IDBTransactionMode.versionchange){
	                exception(this, {
	                    name: "InvalidStateError"
	                    // TODO Add message
	                });
	            }
	
	            var indexIndex = this.indexNames.indexOf(name);
	            if(indexIndex === -1)
	            {
	                exception(this, {
	                    name: "NotFoundError"
	                    // TODO Add message
	                });
	            }
	            else
	            {
	                this.indexNames.splice(indexIndex, 1);
	            }
	
	            for(var j = 0; j < this._indexes.length; j++)
	            {
	                if(this._indexes[j].name === name){
	                    this._indexes.splice(j, 1);
	                }
	            }
	        }
	        function Index(name) {
	            for(var j = 0; j < this._indexes.length; j++)
	            {
	                if(this._indexes[j].name === name){
	                    //this._indexes[j].objectStore = this;
	                    return this._indexes[j];
	                }
	            }
	
	            exception(this, {
	                name: "NotFoundError"
	                // TODO Add message
	            });
	        }
	
	        function error(context, request, err){
	            setTimeout(function () {
	                request.__error(err);
	                context.transaction.__error(err);
	                context.transaction.abort(err);
	            }, util.timeout);
	
	            return request;
	        }
	        function exception(context, err, timestamp){
	            if(timestamp){
	                context.__actions.splice(context.__actions.indexOf(timestamp),1);
	            }
	            throw err;
	        }
	        function persist(context, data, key, noOverWrite){
	            var timestamp = (new Date()).getTime();
	            context.__actions.push(timestamp);
	            var request = new IDBRequest(this, this.transaction);
	            var internalKey = key;
	
	            if(context.transaction.__objectStoreNames.indexOf(context.name) == -1){
	                exception(context, {
	                    name: "InvalidStateError"
	                    // TODO Add message
	                }, timestamp);
	            }
	
	            if(context.transaction.mode == IDBTransactionMode.readonly){
	                exception(context, {
	                    name: "ReadOnlyError"
	                    // TODO Add message
	                }, timestamp);
	            }
	
	            if(!context.keyPath && !key && !context.autoIncrement || context.keyPath && (key || !data[context.keyPath] && !context.autoIncrement || !util.isObject(data))) {
	                exception(context, {
	                    name: "DataError"
	                    // TODO Add message
	                }, timestamp);
	            }
	
	            if(context.autoIncrement){
	                if(!(util.isNumber(internalKey) && internalKey > context.__latestKey))
	                {
	                    internalKey = context.__latestKey + 1;
	                    if(context.keyPath){
	                        util.setPropertyValue(data, context.keyPath, internalKey);
	                    }
	                }
	
	                if(internalKey > 9007199254740992)
	                {
	                    return error(context, request, {
	                        name: "ConstraintError"
	                        // TODO Add message
	                    });
	                }
	
	                context.__latestKey = internalKey;
	            }
	            else if(context.keyPath){
	                internalKey = util.getPropertyValue(data, context.keyPath);
	            }
	
	            if(!util.isValidKey(internalKey)) {
	                exception(context, {
	                    name: "DataError"
	                    // TODO Add message
	                }, timestamp);
	            }
	
	            if(noOverWrite && context.__data[internalKey])
	            {
	                return error(context, request, {
	                    name: "ConstraintError"
	                    // TODO Add message
	                });
	            }
	
	            if(util.containsFunction(data)){
	                exception(context, {
	                    name: "DataCloneError"
	                    // TODO Add message
	                }, timestamp);
	            }
	
	            // Check index constraints
	            for (var i = 0; i < context._indexes.length; i++) {
	                var index = context._indexes[i];
	                var indexKey = util.getPropertyValue(data, index.keyPath);
	
	                // If no value is found using the index keyPath, ignore
	                if(!indexKey){
	                    continue;
	                }
	
	                if(index.multiEntry && util.isArray(indexKey)){
	                    var keys = {};
	                    for (var l = 0; l < indexKey.length; l++) {
	                        if(util.isValidKey(indexKey[l]) && !keys[indexKey[l]]){
	                            keys[indexKey[l]] = indexKey[l];
	                            if(index.unique && index.__data[indexKey[l]]){
	                                return error(context, request, {
	                                    name: "ConstraintError"
	                                    // TODO Add message
	                                });
	                            }
	                        }
	                    }
	                }
	                else{
	                    // If the value of the index keyPath is invalid, ingore
	                    if(!util.isValidKey(indexKey)){
	                        continue;
	                    }
	                    if(index.unique && index.__data[indexKey]){
	                        return error(context, request, {
	                            name: "ConstraintError"
	                            // TODO Add message
	                        });
	                    }
	                }
	            }
	
	            // Set index data
	            for (var ii = 0; ii < context._indexes.length; ii++) {
	                var idx = context._indexes[ii];
	
	                // If noOverWrite is false remove all existing records in the index for the key
	                if(!noOverWrite){
	                    for (var j = 0; j < idx.__data.length; j++) {
	                        for (var k = 0; k < idx.__data[j].length; k++) {
	                            if(idx.__data[j][k].key == key){
	                                idx.__data[j].splice(k,1);
	                            }
	                        }
	                    }
	                }
	
	                var idxKey = util.getPropertyValue(data, idx.keyPath);
	
	                // If no value is found using the index keyPath, ignore
	                if(!idxKey){
	                    continue;
	                }
	
	                if(idx.multiEntry && util.isArray(idxKey)){
	                    var kys = {};
	                    for (var m = 0; m < idxKey.length; m++) {
	                        if(util.isNumber(idxKey[m]) && !kys[idxKey[m]]){
	                            kys[idxKey[m]] = idxKey[m];
	                            if(!idx.__data[idxKey[m]]){
	                                idx.__data[idxKey[m]] = [];
	                            }
	                            idx.__data[idxKey[m]].push({ key: key, data: data });
	                        }
	                    }
	                }
	                else{
	                    // If the value of the index keyPath is invalid, ingore
	                    if(!util.isValidKey(idxKey)){
	                        continue;
	                    }
	                    if(!idx.__data[idxKey]){
	                        idx.__data[idxKey] = [];
	                    }
	                    idx.__data[idxKey].push({ key: key, data: data });
	                }
	            }
	
	            if(noOverWrite && !context.__data[internalKey])
	            {
	                context.__keys.push(internalKey);
	            }
	            // set IDBObjectStore data
	            context.__data[internalKey] = data;
	
	            setTimeout(function () {
	                request.__success(internalKey);
	                context.__actions.splice(context.__actions.indexOf(timestamp),1);
	            }, util.timeout);
	
	            return request;
	        }
	        function finished (){
	            return this.__actions.length === 0;
	        }
	
	        function Clone(context){
	            var clone = new IDBObjectStore();
	            clone.name = util.clone(this.name, context);
	            clone.keyPath = util.clone(this.keyPath, context);
	            clone.autoIncrement = util.clone(this.autoIncrement, context);
	            clone.indexNames = util.clone(this.indexNames, context);
	
	            clone._indexes = util.clone(this._indexes, context);
	            clone.__data = util.clone(this.__data, context);
	            clone.__keys = util.clone(this.__keys, context);
	            //TODO Clone needed?
	            clone.__actions = [];
	            clone.__latestKey = util.clone(this.__latestKey, context);
	            clone.__id = util.clone(this.__id, context);
	
	            return clone;
	        }
	
	        return {
	            add: Add,
	            get: Get,
	            put: Put,
	            delete: Delete,
	            clear: Clear,
	            count: Count,
	            openCursor: OpenCursor,
	            createIndex: CreateIndex,
	            deleteIndex: DeleteIndex,
	            index: Index,
	            __finished: finished,
	            __clone: Clone
	        };
	    }();
	
	    return IDBObjectStore;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Created by Kristof on 7/11/2015.
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(3),
	    __webpack_require__(1),
	    __webpack_require__(2)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function (IDBCursor,
	            IDBKeyRange,
	            util){
	    var IDBIndex = function(name, keyPath, params, objectStore){
	        if(arguments.length === 0) return; // Clone
	
	        this.name = name;
	        this.keyPath = keyPath;
	        this.multiEntry = params ? params.multiEntry : undefined;
	        this.unique = params ? params.unique : undefined;
	
	        this.objectStore = objectStore;
	        this.__data = {};
	        this.__id = util.guid();
	    };
	
	    IDBIndex.prototype = function (){
	        function Get(key){
	            // TODO: Implement
	        }
	        function OpenCursor(key, direction){
	            // TODO: Implement
	        }
	        function OpenKeyCursor(key, direction){
	            // TODO: Implement
	        }
	        function GetKey(key){
	            // TODO: Implement
	        }
	        function Count(key){
	            // TODO: Implement
	        }
	
	        function Clone(context){
	            var clone = new IDBIndex();
	            clone.name = util.clone(this.name, context);
	            clone.keyPath = util.clone(this.keyPath, context);
	            clone.multiEntry = util.clone(this.multiEntry, context);
	            clone.unique = util.clone(this.unique, context);
	            clone.objectStore = util.clone(this.objectStore, context);
	
	            clone.__id = util.clone(this.__id, context);
	            clone.__data = util.clone(this.__data, context);
	
	            return clone;
	        }
	
	        return {
	            count: Count,
	            get: Get,
	            getKey: GetKey,
	            openCursor: OpenCursor,
	            openKeyCursor: OpenKeyCursor,
	            __clone: Clone
	        };
	    }();
	
	    return IDBIndex;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Created by Kristof on 5/11/2015.
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(7)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(IEvent){
	    var IDBVersionChangeEvent = function(type, metadata){
	        IEvent.call(this, type, metadata);
	
	        this.newVersion = metadata.newVersion;
	        this.oldVersion = metadata.oldVersion;
	    };
	
	    IDBVersionChangeEvent.prototype = IEvent.prototype;
	
	    return IDBVersionChangeEvent;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Created by Kristof on 5/11/2015.
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(18)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(IDBFactory){
	    var IDBEnviroment = function(){
	        this.indexedDB = new IDBFactory();
	    };
	
	    return IDBEnviroment;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Created by Kristof on 5/11/2015.
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(9),
	    __webpack_require__(19),
	    __webpack_require__(20),
	    __webpack_require__(21),
	    __webpack_require__(13),
	    __webpack_require__(2)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(IDBDatabase,
	            IDBOpenDBRequest,
	            Database,
	            DataProvider,
	            IDBTransactionMode,
	            util){
	    var IDBFactory = function(){
	    };
	
	    IDBFactory.prototype = (function(){
	        function Open (name, version) {
	            var db,
	                openDBRequest = new IDBOpenDBRequest();
	
	            db = DataProvider.getDatabase(name);
	
	            if(!db)
	            {
	                if(!version) {
	                    version = 1;
	                }
	                db = new Database(name);
	            }
	
	            var connection = new IDBDatabase(db);
	
	            if(version && connection.version > version){
	                setTimeout(function(){
	                    openDBRequest.__error({
	                        name: "VersionError",
	                        message: "You are trying to open the database in a lower version (" + version + ") than the current version of the database"
	                    }, "VersionError");
	                }, util.timeout);
	            }
	            else {
	                if (version && connection.version < version) {
	                    setTimeout(function () {
	                        db.upgrade(openDBRequest, version, connection, function(request, db){
	                            DataProvider.setDatabase(db.name, db);
	
	                            var newConnection = new IDBDatabase(db);
	                            db.addConnection(newConnection);
	                            request.__success(newConnection);
	                        });
	                    }, util.timeout);
	                }
	                else {
	                    setTimeout(function () {
	                        db.addConnection(connection);
	                        openDBRequest.__success(connection);
	                    }, util.timeout);
	                }
	            }
	            return openDBRequest;
	        }
	        function DeleteDatabase(name){
	            var openDBRequest = new IDBOpenDBRequest(null, null);
	            var db = DataProvider.getDatabase(name);
	
	            setTimeout(function () {
	                if(db){
	                    db.upgrade(openDBRequest, null, new IDBDatabase(db), function(request, db){
	                        DataProvider.removeDatabase(db.name);
	                        request.__success();
	                    });
	                }
	                else{
	                    openDBRequest.__success();
	                }
	
	            }, util.timeout);
	
	            return openDBRequest;
	        }
	        function Cmp(first, second) {
	            return util.cmp(first, second);
	        }
	
	        return {
	            open: Open,
	            deleteDatabase: DeleteDatabase,
	            cmp: Cmp
	        };
	    })();
	
	    return IDBFactory;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Created by Kristof on 5/11/2015.
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(4),
	    __webpack_require__(5),
	    __webpack_require__(16),
	    __webpack_require__(2)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(IDBRequest,
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
	            this.onblocked(new IVersionChangeEvent("blocked", {target: this, newVersion: null, oldVersion: oldVersion}));
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
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Created by Kristof on 5/11/2015.
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(9),
	    __webpack_require__(10),
	    __webpack_require__(13),
	    __webpack_require__(2)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(IDBDatabase,
	            IDBTransaction,
	            IDBTransactionMode,
	            util){
	    var Database = function(name){
	        this.name = name;
	        this.version = 0;
	        this.objectStoreNames = [];
	        this.objectStores = [];
	        this.connections = [];
	    },
	    Snapshot = function(objectStores, objectStoreNames){
	        this.objectStores = util.clone(objectStores);
	        this.objectStoreNames = util.clone(objectStoreNames);
	    };
	
	    Snapshot.prototype = (function(){
	        function AddObjectStore(objectStore){
	            this.objectStores.push(objectStore);
	            this.objectStoreNames.push(objectStore.name);
	        }
	        function RemoveObjectStore(objectStoreName){
	            for (var i = 0; i < this.objectStores.length; i++) {
	                if(this.objectStores[i].name === objectStoreName){
	                    this.objectStores.splice(i, 1);
	                    break;
	                }
	            }
	            this.objectStoreNames.splice(this.objectStoreNames.indexOf(objectStoreName), 1);
	        }
	
	        return {
	            addObjectStore: AddObjectStore,
	            removeObjectStore: RemoveObjectStore
	        };
	    })();
	
	    Database.prototype = (function(){
	        function AddConnection(connection){
	            this.connections.push(connection);
	        }
	        function RemoveConnection(connection){
	            for (var i = 0; i < this.connections.length; i++) {
	                if(this.connections[i].__connectionId === connection.__connectionId){
	                    this.connections.splice(i, 1);
	                    break;
	                }
	            }
	        }
	        function Upgrade(openDBRequest, version, connection, successCallback, failCallback){
	            for (var i = 0; i < this.connections.length; i++) {
	                if (this.connections[i].__connectionId !== connection.__connectionId) {
	                    this.connections[i].__versionchange(version);
	                }
	            }
	
	            upgradeInternal(this, openDBRequest, connection.version, version, connection, successCallback, failCallback);
	        }
	        function TakeSnapshot(){
	           return new Snapshot(this.objectStores, this.objectStoreNames);
	        }
	        function CommitSnapshot(snapshot){
	            this.objectStores = util.clone(snapshot.objectStores);
	            this.objectStoreNames = util.clone(snapshot.objectStoreNames);
	        }
	
	        function upgradeInternal(db, openDBRequest, currentVersion, version, connection, successCallback, failCallback) {
	            if(db.connections.length > 0 && db.connections[0].__connectionId !== connection.__connectionId){
	                openDBRequest.__blocked(null, connection.version);
	                setTimeout(upgradeInternal, 10, db, openDBRequest, currentVersion, version, connection, successCallback, failCallback);
	                return;
	            }
	
	            if(version !== null) { // Delete request
	                connection.version = version;
	                db.version = version;
	                openDBRequest.__upgradeneeded(connection, connection.transaction(db.objectStoreNames, IDBTransactionMode.versionchange), version, currentVersion);
	            }
	
	            setTimeout(function (_db, _openDBRequest, _successCallback, _failCallback) {
	                if(_openDBRequest.transaction && _openDBRequest.transaction.__aborted) {
	                    _openDBRequest.__error({
	                        name: "AbortError",
	                        message: "The transaction was aborted."
	                    }, 8);
	                    if(util.isFunction(_failCallback)) {
	                        _failCallback(_openDBRequest, _db);
	                    }
	                }
	                else {
	                    if(util.isFunction(_successCallback)) {
	                        _successCallback(_openDBRequest, _db);
	                    }
	                }
	            }, util.timeout, db, openDBRequest, successCallback, failCallback);
	        }
	
	        return {
	            addConnection: AddConnection,
	            removeConnection: RemoveConnection,
	            snapshot: TakeSnapshot,
	            commitSnapshot: CommitSnapshot,
	            upgrade: Upgrade
	        };
	    })();
	
	    return Database;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Created by Kristof on 8/11/2015.
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function(){
	    var DataProvider = function(){
	    };
	
	    DataProvider.prototype = (function(){
	        var dbs = {};
	
	        function GetDatabase(name){
	            return dbs[name];
	        }
	
	        function SetDatabase(name, database){
	            dbs[name] = database;
	        }
	
	        function RemoveDatabase(name){
	            dbs[name] = undefined;
	            delete dbs[name];
	        }
	
	        return {
	            getDatabase: GetDatabase,
	            setDatabase: SetDatabase,
	            removeDatabase: RemoveDatabase
	        };
	    })();
	
	    return new DataProvider();
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * Created by Kristof on 7/11/2015.
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
	    return {};
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }
/******/ ])
});
;
//# sourceMappingURL=indexedDBmock.js.map