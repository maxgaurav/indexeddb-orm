class DB {
    constructor(settings, db, indexeDB, worker) {
        this.settings = settings;
        this.db = db;
        this.indexedDB = indexeDB;
        this.worker = worker;
        this.webWorkerHelper = new WebWorkerHelper(this.worker.worker);
    }

    async open() {
        if (await this.webWorkerHelper.checkIndexedDB()) {
            console.log('indexeddb exists');
        }else{
            this.worker.status = false;
        }
    }


    openIndexedDB() {
        return window.Promise((resolve, reject) => {

        });
    }
}