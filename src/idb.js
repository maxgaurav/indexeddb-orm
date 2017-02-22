window.idb = function (config){
    "use strict";

    let useWebWorker = config.useWebWorker === undefined ? false : config.useWebWorker;

    if(useWebWorker && !config.pathToWebWorker){
        throw "Path to worker not defined";
    }

    if(!config.window){
        config.window = window
    }

    if(!config.promise){
        config.promise = window.Promise
    }

    if(!config.promise){
        throw "Promises not supported by the borwser";
    }

    let idb = config.window.indexedDB || config.window.mozIndexedDB || config.window.webkitIndexedDB || config.window.msIndexedDB;
    let idbKeyRange = config.window.IDBKeyRange || config.window.webkitIDBKeyRange || config.window.msIDBKeyRange;
    if(!idb){
        throw "IndexedDB not supported";
    }

    if(!checkSettingsConfig(config.settings)){
        throw "settings parameter is incorrectly structured";
    }

    return new DB(idb, idbKeyRange, config.settings, checkWebWorker(), config.pathToWebWorker, config.promise);

    function checkSettingsConfig(settings) {
        return true;
    }

    function checkWebWorker(){
        if(!config.useWebWorker) {
            return false;
        }

        return (config.window.Worker);
    }

};
