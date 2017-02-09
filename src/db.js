class DB {

    constructor(idb, idbKey, settings, isWebWorker) {
        this.db = idb;
        this.idbKey = idbKey;
        this.settings = settings;
        this.isWebWorker = isWebWorker || false;
    }

    /**
     * Initializes database connection with indexedDB
     *
     * @returns {Promise}
     */
    connect() {
        let db = this;
        return new Promise((resolve, reject) => {

            if(db.isWebWorker){
                db.createWorkerHandler(resolve, reject);
            }else{
                db.createNormalHandler(resolve, reject);
            }
        });
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
    createWorkerHandler (resolve, reject) {
        let db = this;
        try{
            let worker = new window.Worker('/indexeddb/src/worker.js');
            let models = {};
            let timestamp = Date.now();

            worker.postMessage({
                detail : JSON.stringify(db.settings),
                action : 'initialize',
                timestamp : timestamp
            });
            
            worker.onmessage = function (e) {
                if(e.data.action === 'initialize' && e.data.timestamp === timestamp) {
                    if (e.data.detail === true) {
                        db.settings.migrations.forEach((schema) => {
                            Object.defineProperty(models, schema.name, {
                                get() {
                                    return new WorkerModelHandler(schema.name, worker, window);
                                }
                            });
                        });
                        resolve(models);
                    } else {
                        db.createNormalHandler(resolve, reject);
                    }
                }
            }

        }catch (e) {
            reject(e);
        }

    }

    /**
     * Creates normal database instance and models
     * @param resolve
     * @param reject
     */
    createNormalHandler (resolve, reject) {
        let db = this;

        let request = this.db.open(this.settings.dbName, this.settings.dbVersion);

        request.onupgradeneeded = function (e) {
            let mig = new Migration(e.target.result, e.target.transaction, db.settings.migrations);
            mig.run();
        };

        request.onerror = function (e) {
            reject(e);
        };

        request.onsuccess = function (e) {
            let models = {};

            db.settings.migrations.forEach((schema) => {
                let primary = schema.primary || 'id';
                Object.defineProperty(models, schema.name, {
                    get() {
                        return new Model(e.target.result, db.idbKey, schema.name, primary);
                    }
                });
            });

            resolve(models);
        };
    }
}