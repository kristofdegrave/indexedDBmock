/**
 * Created by Kristof on 5/11/2015.
 */
define([
    'IEvent'
], function(IEvent){
    var IAbortEvent = function(transaction){
        IEvent.call(this, "abort", {target: transaction, returnValue: true});
    };

    IAbortEvent.prototype = IEvent.prototype;

    return IAbortEvent;
});