class Model extends Builder{

    constructor(db, idbKey, modelName, primary, Q){
        super();

        this.name = modelName;
        this.db = db;
        this.primary = primary;
        this.tables = [this.name];
        this.idbKey = idbKey;
        this.hasIdbKey = this.idbKey ? true : false;
        this.transaction = null;
        this.attributes = {};
        this.Promise = Q;
    }

    /**
     * Finds the result on the primary key defined
     * @param id
     * @returns {Promise}
     */
    find(id) {
        let model = this;

        return new model.Promise((resolve, reject) => {
            let transaction = model.getTransaction(model.tables, Model.READONLY);
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

    /**
     * Searches for first value in database and returns that
     * @returns {Promise}
     */
    first() {
        let model = this;

        return new model.Promise((resolve, reject) => {
            let transaction = model.getTransaction(model.tables, Model.READONLY);
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
                    if(model.checkBuilderValue(cursor.value)){
                        let relationsCompleted = 0;

                        result = cursor.value;

                        if(model.relations.length > 0 && (result !== null || result !== undefined)){


                            model.relations.forEach((relation) => {

                                let relationRequest = model.getRelationships(relation, model.transaction, model.getMainResult(result, relation.localKey, false), false);

                                relationRequest.then((relationResult) => {

                                    relationsCompleted++;

                                    let defaultValue = model.getDefaultRelationValue(relation.type);
                                    result[relation.modelName] = result[relation.modelName] || defaultValue;

                                    switch (relation.type) {
                                        case Model.RELATIONS.hasOne :
                                            if (relationResult !== undefined) {
                                                result[relation.modelName] = relationResult[relation.foreignKey] == result[relation.localKey] ? relationResult : result[relation.modelName];
                                            }

                                            break;
                                        case Model.RELATIONS.hasMany :
                                            if (relationResult.length > 0) {
                                                result[relation.modelName] = relationResult.filter((relationResultItem) => {
                                                    return relationResultItem[relation.foreignKey] == result[relation.localKey];
                                                });
                                            }
                                            break;
                                    }

                                    if (relationsCompleted == model.relations.length) {
                                        resolve(result);
                                    }

                                }).catch((err) => {
                                    reject(err);
                                });
                            });
                        }else{
                            resolve(cursor.value);
                            return false;
                        }
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

    /**
     * Function searches throughout the database and returns a array of result
     * @returns {Promise}
     */
    get() {
        let model = this;

        return new model.Promise((resolve, reject) => {
            let transaction = model.getTransaction(model.tables, Model.READONLY);
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
                    if(model.checkBuilderValue(cursor.value)){
                        result.push(cursor.value);
                    }
                    cursor.continue();

                }else{
                    let mainResult, relationsCompleted = 0;

                    if(model.relations.length > 0 && result.length > 0){


                        model.relations.forEach((relation) => {

                            let relationRequest = model.getRelationships(relation, model.transaction, model.getMainResult(result, relation.localKey, true), true);

                            relationRequest.then((relationResult) => {

                                relationsCompleted++;

                                result = result.map(item => {

                                    let defaultValue = model.getDefaultRelationValue(relation.type);
                                    item[relation.modelName] = item[relation.modelName] || defaultValue;

                                    switch (relation.type) {
                                        case Model.RELATIONS.hasOne :
                                            if(relationResult !== undefined) {
                                                item[relation.modelName] = relationResult[relation.foreignKey] == item[relation.localKey] ? relationResult : item[relation.modelName];
                                            }

                                            break;
                                        case Model.RELATIONS.hasMany :
                                            if(relationResult.length > 0) {
                                                item[relation.modelName] = relationResult.filter((relationResultItem) => {
                                                    return relationResultItem[relation.foreignKey] == item[relation.localKey];
                                                });
                                            }
                                            break;
                                    }

                                    return item;
                                });

                                if(relationsCompleted == model.relations.length){
                                    resolve(result);
                                }

                            }).catch((err) => {
                                reject(err);
                            })
                        });
                    }else{
                        resolve(result);
                    }
                }
            };

            request.onerror = function(e) {
                reject(e);
            }
        });
    }

    /**
     * Function creates a single record
     * @param data
     * @returns {Promise}
     */
    create(data) {
        let model = this;

        return new model.Promise((resolve, reject) => {
            let transaction = model.getTransaction(model.tables, Model.READWRITE);

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

    /**
     * Function creates list of records passed
     * @param dataRecords
     * @returns {Promise}
     */
    createMultiple (dataRecords) {
        let model = this;

        return new model.Promise((resolve, reject) => {
            let transaction = model.getTransaction(model.tables, Model.READWRITE);

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
     * Function updates the various records with matching values
     * @param data
     * @returns {Promise}
     */
    update(data) {

        let model = this;
        let updatedAt = Date.now();

        return new model.Promise((resolve, reject) => {
            let transaction = model.getTransaction(model.tables, Model.READWRITE);
            let obj = transaction.objectStore(model.name);
            let request, totalRecordsBeingUpdated = 0, totalRecordsUpdated = 0;

            if(model.indexBuilder.type){
                request = model.getIndexResult(obj);
            }else{
                request = obj.openCursor();
            }

            request.onsuccess = function (e) {
                let cursor = e.target.result;

                if(cursor){
                    if(model.checkBuilderValue(cursor.value)){
                        totalRecordsBeingUpdated++;

                        let id = cursor.value[model.primary];
                        let createdAt = cursor.value.createdAt;

                        let result = Model.helpers.replaceNestedValues(data, cursor.value);
                        result[model.primary] = id;
                        result.createdAt = createdAt;
                        result.updatedAt = updatedAt;

                        let updateRequest = cursor.update(result);

                        updateRequest.onsuccess = function() {
                            totalRecordsUpdated++;

                            if(totalRecordsUpdated === totalRecordsBeingUpdated){
                                resolve(true);
                            }
                        };

                        updateRequest.onerror = function(err) {
                            transaction.abort();
                            reject(err);
                        };

                    }
                    cursor.continue();

                }else{
                    resolve();
                }
            };

            request.onerror = function(e) {
                reject(e);
            }
        });
    }

    /**
     * Function updates the record at the given id
     * @param id
     * @param data
     * @returns {Promise}
     */
    save(id, data) {
        let model = this;
        let updatedAt = Date.now();

        return new model.Promise((resolve, reject) => {

            model.find(id).then((result) => {

                if(!result){
                    reject('No record found');
                }

                let transaction = model.getTransaction(model.tables, Model.READWRITE, true);
                let obj = transaction.objectStore(model.name);

                let id = result[model.primary];
                let createdAt = result.createdAt;

                result = Model.helpers.replaceNestedValues(data, result);
                result[model.primary] = id;
                result.createdAt = createdAt;
                result.updatedAt = updatedAt;

                let request = obj.put(result);

                request.onsuccess = function () {
                    resolve(true);
                };

                request.onerror = function(e) {
                    reject(e);
                }
            }).catch((err) => {
                reject(err);
            });

        });
    }

    /**
     * Function deletes the entries at the given point
     * @param id
     * @returns {Promise}
     */
    destroyId(id) {
        let model = this;


        return new model.Promise((resolve, reject) => {
            model.find(id).then((result) => {

                if(!result){
                    reject('result at id does not exists');
                }

                let transaction = model.getTransaction(model.tables, Model.READWRITE, true);
                let obj = transaction.objectStore(model.name);
                let request = obj.delete(id);

                request.onsuccess = function (e) {
                    resolve(e.target.result);
                };

                request.onerror = function (e) {
                    reject(e);
                };
            }).catch(err => {
                reject(err);
            });


        });
    }

    /**
     * Function deletes the entries
     * @returns {Promise}
     */
    destroy() {
        let model = this;

        return new model.Promise((resolve, reject) => {
            let transaction = model.getTransaction(model.tables, Model.READWRITE);
            let obj = transaction.objectStore(model.name);
            let request, totalRecordsBeingDeleted = 0, totalRecordsDeleted = 0;

            if (model.indexBuilder.type) {
                request = model.getIndexResult(obj);
            } else {
                request = obj.openCursor();
            }

            request.onsuccess = function (e) {
                let cursor = e.target.result;

                if (cursor) {
                    if (model.checkBuilderValue(cursor.value)) {
                        totalRecordsBeingDeleted++;

                        let deleteRequest = cursor.delete();

                        deleteRequest.onsuccess = function () {
                            totalRecordsDeleted++;

                            if (totalRecordsDeleted === totalRecordsBeingDeleted) {
                                resolve(true);
                            }
                        };

                        deleteRequest.onerror = function (err) {
                            transaction.abort();
                            reject(err);
                        };

                    }
                    cursor.continue();

                } else {
                    resolve();
                }
            };

            request.onerror = function (e) {
                reject(e);
            }
        });
    }

    /**
     * Function counts the number of records
     * @returns {Promise}
     */
    count() {
        let model = this;

        return new model.Promise((resolve, reject) => {
            let transaction = model.getTransaction(model.tables, Model.READONLY);
            let obj = transaction.objectStore(model.name);
            let result = 0;
            let request;

            if(model.indexBuilder.type){
                request = model.getIndexResult(obj);
            }else{
                request = obj.openCursor();
            }

            request.onsuccess = function (e) {
                let cursor = e.target.result;

                if(cursor){
                    if(model.checkBuilderValue(cursor.value)){
                        result++;
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

    /**
     * Function averages the numeric value at the given point
     * @param attribute
     * @returns {Promise}
     */
    average (attribute) {
        let model = this;

        return new model.Promise((resolve, reject) => {
            let transaction = model.getTransaction(model.tables, Model.READONLY);
            let obj = transaction.objectStore(model.name);
            let result = 0, totalRecords = 0;
            let request;

            if(model.indexBuilder.type){
                request = model.getIndexResult(obj);
            }else{
                request = obj.openCursor();
            }

            request.onsuccess = function (e) {
                let cursor = e.target.result;

                if(cursor){
                    if(model.checkBuilderValue(cursor.value)){
                        totalRecords++;
                        let tempResult = Model.helpers.getNestedAttribute(attribute, cursor.value);
                        tempResult = parseFloat(tempResult);
                        tempResult = isNaN(tempResult) ? 0 : tempResult;
                        result += tempResult;
                    }

                    cursor.continue();

                }else{
                    resolve(result/totalRecords);
                }
            };

            request.onerror = function(e) {
                reject(e);
            }
        });
    }

    /**
     * Reduce function is called with each passing iterator value and reduced value is returned
     * @param func
     * @param defaultCarry
     * @returns {Promise}
     */
    reduce (func, defaultCarry) {
        let model = this;

        if(typeof func !== 'function'){
            throw "Parameter should be a function type";
        }

        return new model.Promise((resolve, reject) => {
            let transaction = model.getTransaction(model.tables, Model.READONLY);
            let obj = transaction.objectStore(model.name);
            let result = defaultCarry;
            let request;

            if(model.indexBuilder.type){
                request = model.getIndexResult(obj);
            }else{
                request = obj.openCursor();
            }

            request.onsuccess = function (e) {
                let cursor = e.target.result;

                if(cursor){
                    if(model.checkBuilderValue(cursor.value)){
                        result = func(cursor.value, result);
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

    /**
     * Sets the index search criteria
     * @param objectStore
     * @returns {*}
     */
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

    /**
     * Checks common search criteria other than the index values
     * @param value
     * @returns {boolean}
     */
    checkBuilderValue(value) {
        let builder = this;
        let result = true;
        let i,j;
        for (i = 0; i < builder.builder.length; i++){

            let condition = builder.builder[i];
            switch(condition.type){

                case 'and' : //case for one to one search
                    if(!Model.helpers.checkNestedAttribute(condition.attribute, value, condition.value)){
                        return false;
                    }
                    break;

                case 'in' : //case for list search
                    let tempCheck = false;
                    for(j = 0; j < condition.value.length; j++) {
                        result = Model.helpers.checkNestedAttribute(condition.attribute, value, condition.value[j]);
                        if(result !== undefined && result !== false) {
                            tempCheck = true;
                        }
                    }

                    if(!tempCheck){
                        return false;
                    }

                    result = true;

                    break;

                case 'gte' : //case for checking the value is greater than or is equal to the same
                    result = Model.helpers.getNestedAttribute(condition.attribute, value);

                    if(result === undefined) {
                        return false;
                    }

                    if(result < condition.value){
                        return false;
                    }

                    result = true;
                    break;

                case 'gt' : //case for checking the value is greater than the same

                    result = Model.helpers.getNestedAttribute(condition.attribute, value);

                    if(result === undefined) {
                        return false;
                    }

                    if(result <= condition.value){
                        return false;
                    }

                    result = true;
                    break;

                case 'lte' : //case for checking the value is less than or is equal to the same
                    result = Model.helpers.getNestedAttribute(condition.attribute, value);

                    if(result === undefined) {
                        return false;
                    }

                    if(result > condition.value){
                        return false;
                    }
                    result = true;
                    break;

                case 'lt' : //case for checking the value is less than the same
                    result = Model.helpers.getNestedAttribute(condition.attribute, value);

                    if(result === undefined) {
                        return false;
                    }

                    if(result >= condition.value){
                        return false;
                    }
                    result = true;
                    break;

                case 'between' : //case for checking the value is between the given range(ONLY WORKS FOR NUMERIC)
                    result = Model.helpers.getNestedAttribute(condition.attribute, value);

                    if(result === undefined) {
                        return false;
                    }

                    if(condition.value[0] >= result && condition.value[1] <= result){
                        return false
                    }
                    result = true;
                    break;

                default:
                    result = true;
            }
        }

        return result;
    }

    /**
     * Creates a transaction
     * @param tables
     * @param mode
     */
    createTransaction(tables, mode) {
        this.transaction = this.db.transaction(tables, mode)
    }

    /**
     * Sets IDBTransaction obejct to current model scope
     * @param transaction
     */
    setTransaction(transaction) {
        this.transaction = transaction
    }

    /**
     * Returns the IDBTransaction object set in current scope
     * @param {Array} tables
     * @param {String} mode
     * @param {boolean} overwrite
     * @returns {*|null}
     */
    getTransaction(tables, mode, overwrite) {
        overwrite = overwrite === undefined ? false : overwrite;

        if(!this.transaction || overwrite === true) {
            this.createTransaction(tables, mode);
        }

        return this.transaction;
    }

    /**
     * Returns the array or direct key value against the input give for the key specified
     * @param result
     * @param key
     * @param isArray
     * @returns {*}
     */
    getMainResult (result, key, isArray) {
        if(isArray){
            return result.map((item) => {
                return item[key];
            });
        }else{
            return result[key];
        }
    }

    /**
     * Searches for relationships assigned with builder and fetches them
     * @param relation
     * @param transaction
     * @param mainResult
     * @param isArray
     * @returns {Promise}
     */
    getRelationships (relation, transaction, mainResult, isArray) {

        isArray = isArray || false;

        let model = this;
        let primary = relation.primary || 'id';

        /**
         * @var Model relationModel
         */
        let relationModel = new Model(model.db, model.idbKey, relation.modelName, relation.primary);

        //setting the relation transaction same as parent transaction
        relationModel.setTransaction(transaction);

        //if a secondry builder function was defined
        if(relation.func){
            let tempBuilder = new Builder();

            tempBuilder = relation.func(tempBuilder);

            relationModel.tables = tempBuilder.tables;
            relationModel.tables.push(relationModel.name);
            relationModel.relations = tempBuilder.relations;
            relationModel.builder = tempBuilder.builder;
        }

        //checking type of parent result
        if(isArray){
            relationModel.whereIndexIn(relation.foreignKey, mainResult);
        }else{
            relationModel.whereIndex(relation.foreignKey, mainResult);
        }

        return new model.Promise((relationResolve, relationReject) => {

            let result;

            //if relation type mentioned
            switch (relation.type) {
                case Model.RELATIONS.hasOne :
                    result = relationModel.first();
                    break;
                case Model.RELATIONS.hasMany :
                    result = relationModel.get();
                    break;
                default :
                    throw "Invalid relation type provided";
            }

            result.then(r => {
                relationResolve(r);
            }).catch(err => {
                relationReject(err);
            });

        });
    }

    /**
     * Gets the default value of result. Null for hasOne and array for hasMany
     * @param type
     * @returns {*}
     */
    getDefaultRelationValue(type) {
    switch (type) {
        case Model.RELATIONS.hasOne :
            return null;
        case Model.RELATIONS.hasMany :
            return [];
        default :
            return null;
    }
}


    /**
     * Readwrite parameter of indexedDB
     * @return {string}
     */
    static get READWRITE() {
        return "readwrite";
    }

    /**
     * Readonly parameter of indexedDB
     * @return {string}
     */
    static get READONLY() {
        return "readonly";
    }

}
