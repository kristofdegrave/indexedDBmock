/**
 * Created by Kristof on 5/11/2015.
 */
define('ICompleteEvent', [
    'IEvent'
], function(IEvent){
    var ICompleteEvent = function(transaction){
        IEvent.call(this, "complete", {target: transaction, returnValue: true});
    };

    ICompleteEvent.prototype = IEvent.prototype;

    return ICompleteEvent;
});