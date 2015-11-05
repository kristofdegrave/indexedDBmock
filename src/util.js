/**
 * Created by Kristof on 5/11/2015.
 */
define([], function(){
    function isValidKey(key){
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

    return {
        isValidKey: isValidKey
    }
});