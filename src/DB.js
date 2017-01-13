class DB {
    constructor(settings) {
        this.settings = settings;
        this.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

        this.checkDB();
        this.checkSettings();
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
}