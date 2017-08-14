import {Migration} from "./migration";
import {IDBStaticKeyRange, Model} from "./model";
import {Models, Settings} from "./interfaces";

interface IDBEventTarget extends EventTarget {
    result: IDBDatabase,
    transaction: IDBTransaction | null
}

interface DBVersionChangeEvent extends IDBVersionChangeEvent {
    target: IDBEventTarget
}

interface DBSuccessEvent extends Event {
    target: IDBEventTarget
}

export class DB {

    public idb: IDBDatabase;
    public migration: Migration;


    constructor(public db: IDBFactory, public idbKey: IDBStaticKeyRange, public settings: Settings, private useWorker: boolean = false, private pathToWorker: string = '') {
    }

    /**
     * Initializes database connection with indexedDB
     *
     * @returns {Promise}
     */
    public async connect(): Promise<Models> {

        // return new db.Promise((resolve, reject) => {
        //
        //     if(db.useWebWorker){
        //         db.createWorkerHandler(resolve, reject);
        //     }else{
        return await this.createNormalHandler();
        // }
        // });
    }

    /**
     * Destroys/Deletes the databaase
     * @param dbName
     */
    destroy(dbName) {
        console.info('database ' + dbName + ' deleted');
        this.db.deleteDatabase(dbName);
    }

    /**
     * Creates connection in web worker space and if web worker fails
     * then creates normal database connection instance
     * @param resolve
     * @param reject
     */
    // createWorkerHandler (resolve, reject) {
    //     let db = this;
    //     try{
    //         let worker = new Worker(db.pathToWebWorker);
    //         let models = {};
    //         let timestamp = Date.now();
    //
    //         worker.postMessage({
    //             detail : JSON.stringify(db.settings),
    //             action : 'initialize',
    //             timestamp : timestamp
    //         });
    //
    //         worker.onmessage = function (e) {
    //             if(e.data.action === 'initialize' && e.data.timestamp === timestamp) {
    //                 if (e.data.detail === true) {
    //                     db.settings.migrations.forEach((schema) => {
    //                         Object.defineProperty(models, schema.name, {
    //                             get() {
    //                                 return new WorkerModelHandler(schema.name, worker, db.Promise);
    //                             }
    //                         });
    //                     });
    //
    //                     db.isWebWorker = true;
    //                     resolve(models);
    //                 } else {
    //                     db.createNormalHandler(resolve, reject);
    //                 }
    //             }
    //         }
    //
    //     }catch (e) {
    //         reject(e);
    //     }
    //
    // }

    /**
     * Function creates/opens database connection in main javascript thread
     * @returns {Promise<Models>}
     */
    private createNormalHandler(): Promise<Models> {

        return new Promise((resolve, reject) => {
            let request: IDBOpenDBRequest = this.db.open(this.settings.name, this.settings.version);

            request.onupgradeneeded = (e: DBVersionChangeEvent) => {
                this.idb = e.target.result;
                this.migration = new Migration(this.idb, e.target.transaction, this.settings.migrations);
                this.migration.run();
            };

            request.onerror = function (e: ErrorEvent) {
                reject(e.message);
            };

            request.onsuccess = (e: DBSuccessEvent) => {

                let models: Models = {};

                this.settings.migrations.forEach((schema) => {

                    let primary = schema.primary || 'id';
                    Object.defineProperty(models, schema.name, {
                        get() {
                            return new Model(e.target.result, this.idbKey, schema.name, primary);
                        }
                    });
                });

                resolve(models)

            };
        });


    }
}