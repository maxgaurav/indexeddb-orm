class Model {
    constructor(db, modelName, primary){
        this.name = modelName;
        this.db = db;
        this.primary = primary;

        this.tables = [];
    }

    find(id) {
        let model = this;

        return new Promise((resolve, reject) => {
            let transaction = model.db.transaction(model.tables);
            let obj = transaction.objectStore(model.name, Model.READONLY);
            let index = obj.index(model.primary);
            let result = null;
            let request = index.get(id);
            
            request.onsuccess = function (e) {
                resolve(e.target.result);
            };

            request.onerror = function (e) {
                reject(e);
            };

        });
    }

    get() {
        let model = this;

        return new Promise((reject, resolve) => {
            let transaction = model.db.transaction(model.tables);
            let obj = transaction.objectStore(model.name, Model.READONLY);
            let result = [];
            let request = obj.openCursor();

            request.onsuccess = function (e) {
                let cursor = e.target.result;

                if(cursor){
                    result.push(cursor.value);
                    //@todo add calulation
                    cursor.continue();

                }else{
                    resolve(result);
                }
            }
        });
    }

    insert(data) {
        let model = this;

        return new Promise((reject, resolve) => {
            let transaction = model.db.transaction(model.tables);

            let obj = transaction.objectStore(model.name, Model.READWRITE);

            data.createdAt = Date.now();
            data.updatedAt = Date.now();

            let request = obj.add(data);

            request.onsuccess = function (e) {
                data[model.primary] = e.target.result;
                resolve(data);
            };

            request.onerror = function (e) {
                reject(e);
            };
        });

    }

    /**
     * @return {string}
     */
    static get READWRITE() {
        return "readwrite";
    }

    /**
     * @return {string}
     */
    static get READONLY() {
        return "readonly";
    }

}
