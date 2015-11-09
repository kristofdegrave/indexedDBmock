/**
 * Created by Kristof on 7/11/2015.
 */
define([
    'IDBCursor',
    'IDBCursorWithValue',
    'IDBDatabase',
    'IDBEnviroment',
    'IDBFactory',
    'IDBIndex',
    'IDBKeyRange',
    'IDBObjectStore',
    'IDBOpenDBRequest',
    'IDBRequest',
    'IDBTransaction',
    'events/IDBVersionChangeEvent'
], function(
    IDBCursor,
    IDBCursorWithValue,
    IDBDatabase,
    IDBEnviroment,
    IDBFactory,
    IDBIndex,
    IDBKeyRange,
    IDBObjectStore,
    IDBOpenDBRequest,
    IDBRequest,
    IDBTransaction,
    IDBVersionChangeEvent
){
    var env = new IDBEnviroment();

    return {
        IDBCursor: IDBCursor,
        IDBCursorWithValue: IDBCursorWithValue,
        IDBDatabase: IDBDatabase,
        IDBFactory: IDBFactory,
        IDBIndex: IDBIndex,
        IDBKeyRange: IDBKeyRange,
        IDBObjectStore: IDBObjectStore,
        IDBOpenDBRequest: IDBOpenDBRequest,
        IDBRequest: IDBRequest,
        IDBTransaction: IDBTransaction,
        IDBVersionChangeEvent: IDBVersionChangeEvent,
        indexedDB: env.indexedDB
    };
});