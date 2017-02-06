class Model {
    constructor(db, modelName, primary){
        this.name = modelName;
        this.db = db;
        this.primary = primary;
        this.tables = [this.name];
        this.attributes = {};
    }

    find(id) {
        let model = this;

        return new Promise((resolve, reject) => {
            let transaction = model.db.transaction(model.tables, Model.READONLY);
            let obj = transaction.objectStore(model.name);
            let request = obj.get(id);
            
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

        return new Promise((resolve, reject) => {
            let transaction = model.db.transaction(model.tables, Model.READONLY);
            let obj = transaction.objectStore(model.name);
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
            };

            request.onerror = function(e) {
                reject(e);
            }
        });
    }

    create(data) {
        let model = this;

        return new Promise((resolve, reject) => {
            let transaction = model.db.transaction(model.tables, Model.READWRITE);

            let obj = transaction.objectStore(model.name);

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

    createMultiple (dataRecords) {
        let model = this;

        return new Promise((resolve, reject) => {
            let transaction = model.db.transaction(model.tables, Model.READWRITE);

            let obj = transaction.objectStore(model.name);
            let createdAt = Date.now();
            let updatedAt = Date.now();
            let result = [];

            dataRecords.forEach((data) => {
                data.createdAt = createdAt;
                data.updatedAt = updatedAt;

                let request = obj.add(data);

                request.onerror = function(e) {
                    reject(e);
                };

                request.onsuccess = function(e) {
                    data[model.primary] = e.target.result;

                    result.push(data);

                    if(result.length === dataRecords.length){
                        resolve(result);
                    }
                };
            })
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
