// import {Migration} from 'migration';

class DB {

    constructor(idb, settings) {
        this.db = idb;
        this.settings = settings;
    }

    connect() {
        let db = this;
        return new Promise((resolve, reject) => {
            let request = this.db.open(this.settings.dbName, this.settings.dbVersion);

            request.onupgradeneeded = function (e) {
                let mig = new Migration(e.target.result, db.settings.migrations);
                mig.run();
            };

            request.onerror = function (e) {
                reject(e);
            };

            request.onsuccess = function (e) {
                let models = {};

                db.settings.migrations.forEach((schema) => {
                    let primary = schema.primary || 'id';
                    models[schema.name] = new Model(e.target.result, schema.name, primary);
                });

                resolve(models);
            };
        });
    }

    destroy(dbName) {
        console.info('database ' + dbName + ' deleted');
        this.db.deleteDatabase(dbName);
    }
}