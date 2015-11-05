/**
 * Created by Kristof on 5/11/2015.
 */
define([
    'util'
], function(util){
    var IDBKeyRange = function(lower, upper, lowerOpen, upperOpen){
        this.lower = lower;
        this.upper = upper;
        this.lowerOpen = lowerOpen ? lowerOpen : false;
        this.upperOpen = upperOpen ? upperOpen : false;
    }

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
        if(!util.isValidKey(lower) || !isValidKey(upper) || upper < lower || (upper === lower && !!upperOpen && !!lowerOpen)){
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
        return {
            __inRange: InRange
        };
    }();

    return IDBKeyRange;
});