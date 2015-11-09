/**
 * Created by Kristof on 5/11/2015.
 */
define('util', [], function(){
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
        if (null == obj || "object" != typeof obj) return obj;

        context = context || {}

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
});