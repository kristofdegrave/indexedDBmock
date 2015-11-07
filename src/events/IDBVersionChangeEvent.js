/**
 * Created by Kristof on 5/11/2015.
 */
define('IDBVersionChangeEvent', [
    'events/IEvent'
], function(IEvent){
    var IDBVersionChangeEvent = function(type, metadata){
        IEvent.call(this, type, metadata);

        this.newVersion = metadata.newVersion;
        this.oldVersion = metadata.oldVersion;
    };

    IDBVersionChangeEvent.prototype = IEvent.prototype;

    return IDBVersionChangeEvent;
});