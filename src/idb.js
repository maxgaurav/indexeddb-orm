function idb(settings){
    "use strict";

    let idb = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

    if(!idb){
        throw "IndexedDB not supported";
    }

    if(!checkSettingsConfig(settings)){
        throw "settings parameter is incorrectly structured";
    }

    return new DB(idb, settings, checkWebWorker());

    function checkSettingsConfig(settings) {
        return true;
    }

    function checkWebWorker(){
        return window.Worker;
    }

}
