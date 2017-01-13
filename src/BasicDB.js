class BasicDB {

    constructor(settings) {
        this.webworker = {
            status : false,
            worker : ''
        };

        this.settings = settings;

        this.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

        this.checkDB();
        this.checkSettings();

        const db = {
            name : this.settings.dbName,
            version : this.settings.dbVersion
        };

        this.checkWebWorker();
        this.idb = new DB(settings, db, this.indexedDB, this.webworker);
    }

    /**
     * Function checks the whether indexedb db exists or not
     */
    checkDB() {
        if (!this.indexedDB) {
            throw new Error('IndexedDB not available');
        }
    }

    /**
     * Checks that settings array was correct or not
     */
    checkSettings() {
        if (!this.settings) {
            throw new Error('Database settings parameter not provided');
        }

        if(typeof this.settings !== "object"){
            throw new Error('Database settings parameter must be an JSON object type');
        }

        if(!this.settings.dbName){
            throw new Error('Database settings parameter must contain dbName parameter');

        }

        if(!this.settings.dbVersion){
            throw new Error('Database settings parameter must contain dbVersion parameter');
        }
    }

    /**
     * Function checks existence of Web Worker and works on it
     */
    checkWebWorker(){

        // if(this.settings.webWorkerPath){
            if(window.Worker){
                this.webworker.status = true;
                this.webworker.worker = new window.Worker('src/WebWorker.js');
            }
        // }
    }
}