import {DB} from './db';
import {IDBStaticKeyRange, Settings} from "./interfaces";

declare global {
    interface Window {
        idb(settings: Settings, useWorker?: boolean, pathToWorker?: string) : DB,
        DB,
        mozIndexedDB: IDBFactory,
        webkitIndexedDB: IDBFactory,
        msIndexedDB: IDBFactory,
        IDBKeyRange: IDBKeyRange,
        webkitIDBKeyRange: IDBKeyRange,
        msIDBKeyRange: IDBKeyRange
    }
}

window.DB = DB;

window.idb = (settings: Settings, useWorker : boolean = false, pathToWorker: string = '') : DB => {

    // noinspection TypeScriptUnresolvedVariable
    let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    // noinspection TypeScriptUnresolvedVariable
    let IDBKeyRange = <IDBStaticKeyRange>(window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange);

    if(!indexedDB) {
        throw "Indexed DB not supported";
    }

    if(!IDBKeyRange) {
        throw "IDBKeyRange not available";
    }

    return new DB(indexedDB, IDBKeyRange, settings, useWorker, pathToWorker);

};




