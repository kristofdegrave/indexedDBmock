/**
 * Created by Kristof on 5/11/2015.
 */
define([], function(){
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
});