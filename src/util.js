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
                if(!isValidKey(key[i])){
                    return false;
                }
            }
            return true;
        }
        return false;
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

    return {
        containsFunction: ContainsFunction,
        isArray: IsArray,
        isDate: IsDate,
        isFunction: IsFunction,
        isNumber: IsNumber,
        isObject: IsObject,
        isString: IsString,
        isValidKey: IsValidKey,
        getPropertyValue: GetPropertyValue,
        getTimestamp: GetTimestamp,
        setPropertyValue: SetPropertyValue,
        timeout: 1
    };
});