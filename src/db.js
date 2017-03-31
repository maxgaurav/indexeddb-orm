class DB {

    constructor(idb, idbKey, settings, useWebWorker, pathToWebWorker, Q) {
        this.db = idb;
        this.idbKey = idbKey;
        this.settings = settings;
        this.useWebWorker = useWebWorker || false;
        this.isWebWorker = false;
        this.pathToWebWorker = pathToWebWorker;
        this.Promise = Q;
    }

    /**
     * Initializes database connection with indexedDB
     *
     * @returns {Promise}
     */
    connect() {
        let db = this;
        return new db.Promise((resolve, reject) => {

            if(db.useWebWorker){
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
            let worker = new window.Worker(db.pathToWebWorker);
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
                                    return new WorkerModelHandler(schema.name, worker, db.Promise);
                                }
                            });
                        });

                        db.isWebWorker = true;
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
                        return new Model(e.target.result, db.idbKey, schema.name, primary, db.Promise);
                    }
                });
            });

            db.transaction = db.setTransactionHandler(e.target.result);

            resolve(models);
        };
    }

    /**
     * Function creates the transaction handler to work in transactional level with database
     * @param database
     * @returns {Function}
     */
    setTransactionHandler(database) {
        let db = this;

        return function (tables, func) {

            if(typeof func !== 'function'){
                throw "Second parameter must be a type of function";
            }

            let transaction = database.transaction(tables, 'readwrite');
            let models = {};

            tables.forEach((table) => {

                Object.defineProperty(models, table, {
                    get() {

                        let schema = db.settings.migrations.filter((mig) => {
                            return mig.name === table;
                        });

                        let primary = schema.primary || 'id';

                        let model = new Model(database, db.idbKey, table, primary, db.Promise);
                        model.setTransaction(transaction);

                        return model;
                    }
                });
            });

            func(models, transaction);
        }
    }
}