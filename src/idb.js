window.idb = function (settings, useWebWorker, pathToWebWorker){
    "use strict";

    useWebWorker = useWebWorker === undefined ? true : useWebWorker;

    let idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    let idbKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    if(!idb){
        throw "IndexedDB not supported";
    }

    if(!checkSettingsConfig(settings)){
        throw "settings parameter is incorrectly structured";
    }

    return new DB(idb, idbKeyRange, settings, checkWebWorker(), pathToWebWorker);

    function checkSettingsConfig(settings) {
        return true;
    }

    function checkWebWorker(){
        if(!useWebWorker) {
            return false;
        }

        return (window.Blob && window.Worker);
    }

};
