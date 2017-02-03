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
                console.log(this.result);
                resolve(e.target.result);
            };
        });
    }

    destroy(dbName) {
        console.info('database ' + dbName + ' deleted');
        this.db.deleteDatabase(dbName);
    }
}