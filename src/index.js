import { DB } from './db';
window.idb = function (settings, useWorker, pathToWorker) {
    if (useWorker === void 0) { useWorker = false; }
    if (pathToWorker === void 0) { pathToWorker = ''; }
    // noinspection TypeScriptUnresolvedVariable
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    // noinspection TypeScriptUnresolvedVariable
    var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    if (!indexedDB) {
        throw "Indexed DB not supported";
    }
    if (!IDBKeyRange) {
        throw "IDBKeyRange not available";
    }
    return new DB(indexedDB, IDBKeyRange, settings, useWorker, pathToWorker);
};
