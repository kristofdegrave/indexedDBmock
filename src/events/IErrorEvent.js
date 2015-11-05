/**
 * Created by Kristof on 5/11/2015.
 */
define([
    'IEvent'
], function(IEvent){
    var IErrorEvent = function(request){
        IEvent.call(this, "error", {target: request, returnValue: true});
    };

    IErrorEvent.prototype = IEvent.prototype;

    return IErrorEvent;
});