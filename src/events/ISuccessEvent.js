/**
 * Created by Kristof on 5/11/2015.
 */
define('ISuccessEvent', [
    'events/IEvent'
], function(IEvent){
    var ISuccessEvent = function(request){
        IEvent.call(this, "success", {target: request, returnValue: true});
    };

    ISuccessEvent.prototype = IEvent.prototype;

    return ISuccessEvent;
});