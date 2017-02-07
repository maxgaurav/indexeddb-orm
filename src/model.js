class Model extends Builder{

    constructor(db, idbKey, modelName, primary){
        super();

        this.name = modelName;
        this.db = db;
        this.primary = primary;
        this.tables = [this.name];
        this.idbKey = idbKey;
        this.hasIdbKey = this.idbKey ? true : false;

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

    first() {
        let model = this;

        return new Promise((resolve, reject) => {
            let transaction = model.db.transaction(model.tables, Model.READONLY);
            let obj = transaction.objectStore(model.name);
            let result = null;
            let request;

            if(model.indexBuilder.type){
                request = model.getIndexResult(obj);
            }else{
                request = obj.openCursor();
            }

            request.onsuccess = function (e) {
                let cursor = e.target.result;

                if(cursor){
                    if(model.checkBuilderValue()){
                        resolve(cursor.value);
                        return false;
                    }else{
                        cursor.continue();
                    }

                }else{
                    resolve(result);
                }
            };

            request.onerror = function(e) {
                reject(e);
            }
        });
    }

    get() {
        let model = this;

        return new Promise((resolve, reject) => {
            let transaction = model.db.transaction(model.tables, Model.READONLY);
            let obj = transaction.objectStore(model.name);
            let result = [];
            let request;

            if(model.indexBuilder.type){
                request = model.getIndexResult(obj);
            }else{
                request = obj.openCursor();
            }

            request.onsuccess = function (e) {
                let cursor = e.target.result;

                if(cursor){
                    if(model.checkBuilderValue()){
                        result.push(cursor.value);
                    }
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

    getIndexResult(objectStore) {
        let builder = this;
        let range;
        let index;


        if(!builder.indexBuilder.type) {
            return objectStore.openCursor();
        }

        if(builder.indexBuilder.index !== builder.primary){
            index = objectStore.index(builder.indexBuilder.index);
        }else{
            index = objectStore;
        }

        switch (builder.indexBuilder.type) {
            case 'and' :
                range = builder.idbKey.only(builder.indexBuilder.value);
                break;

            case 'in' :
                builder.whereIn(builder.indexBuilder.index, builder.indexBuilder.value);
                let values = builder.indexBuilder.value.sort();
                range = builder.idbKey.bound(values[0], values[values.length - 1], false, false);
                break;

            case 'gte' :
                range = builder.idbKey.lowerBound(builder.indexBuilder.value, false);
                break;

            case 'gt' :
                range = builder.idbKey.lowerBound(builder.indexBuilder.value, true);
                break;

            case 'lte' :
                range = builder.idbKey.upperBound(builder.indexBuilder.value, false);
                break;

            case 'lt' :
                range = builder.idbKey.lowerBound(builder.indexBuilder.value, true);
                break;

            case 'between' :
                range = builder.idbKey.bound(builder.indexBuilder.value[0], builder.indexBuilder.value[1], false, false);
                break;
            default :
                throw 'Invalid builder type found';
        }

        return index.openCursor(range);
    }

    checkBuilderValue() {
        let builder = this;
        let condition = true;
        let i;

        for (i = 0; i < builder.length; i++){
            switch(builder.builder[i].type){
                case 'and' :
                    condition = true;
                    break;

                case 'in' :
                    condition = true;
                    break;

                case 'gte' :
                    condition = true;
                    break;

                case 'gt' :
                    condition = true;
                    break;

                case 'lte' :
                    condition = true;
                    break;

                case 'lt' :
                    condition = true;
                    break;

                case 'between' :
                    condition = true;
                    break;

                default:
                    condition = true;
            }

            if(!condition) {
                return condition;
            }
        }

        return condition;
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
