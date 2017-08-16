import {Migration} from "./migration";
import {IDBStaticKeyRange, Model} from "./model";
import {Models, Settings} from "./interfaces";
import {WorkerModel} from "./worker-model";

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

        if (this.useWorker) {
            return await this.createWorkerHandler();
        } else {
            return await this.createNormalHandler();
        }
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
     * @return {Promise<Models>}
     */
    createWorkerHandler (): Promise<Models> {
        return new Promise((resolve) => {
            let worker = new Worker(this.pathToWorker);
            let ms = new MessageChannel();

            worker.postMessage({command: 'init', settings: this.settings}, [ms.port1]);
            ms.port2.onmessage = (e) => {
                if(e.data.status === 'error' || !e.data.status) {
                    ms.port2.close();
                    throw new Error(e.data.error || `Uncaught error <${JSON.stringify(e.data)}>`);
                }

                let models = {};

                this.settings.migrations.forEach((schema) => {

                    let primary = schema.primary || 'id';
                    Object.defineProperty(models, schema.name, {
                        get () {
                            return new WorkerModel(worker, schema.name, primary);
                        }
                    });
                });
                resolve(models);
                ms.port2.close();
                ms.port1.close();
            };




        });

    }

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
                    let idbKey = this.idbKey;
                    Object.defineProperty(models, schema.name, {
                        get () {
                            return new Model(e.target.result, idbKey, schema.name, primary);
                        }
                    });
                });

                resolve(models);

            };
        });


    }
}