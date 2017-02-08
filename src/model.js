class Model extends Builder{

    constructor(db, idbKey, modelName, primary){
        super();

        this.name = modelName;
        this.db = db;
        this.primary = primary;
        this.tables = [this.name];
        this.idbKey = idbKey;
        this.hasIdbKey = this.idbKey ? true : false;
        this.transaction = null;
        this.attributes = {};
    }

    find(id) {
        let model = this;

        return new Promise((resolve, reject) => {
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

    first() {
        let model = this;

        return new Promise((resolve, reject) => {
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

    create(data) {
        let model = this;

        return new Promise((resolve, reject) => {
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

    createMultiple (dataRecords) {
        let model = this;

        return new Promise((resolve, reject) => {
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

    createTransaction(tables, mode) {
        this.transaction = this.db.transaction(tables, mode)
    }

    setTransaction(transaction) {
        this.transaction = transaction
    }

    getTransaction(tables, mode) {

        if(!this.transaction) {
            this.createTransaction(tables, mode);
        }

        return this.transaction;
    }

    getMainResult (result, key, isArray) {
        if(isArray){
            return result.map((item) => {
                return item[key];
            });
        }else{
            return result[key];
        }
    }

    getRelationships (relation, transaction, mainResult, isArray) {

        isArray = isArray || false;

        let model = this;
        let primary = relation.primary || 'id';

        /**
         * @var Model relationModel
         */
        let relationModel = new Model(model.db, model.idbKey, relation.modelName, relation.primary);

        relationModel.setTransaction(transaction);
        transaction = relationModel.getTransaction(model.tables, Model.READONLY);

        if(relation.func){
            let tempBuilder = new Builder();

            tempBuilder = relation.func(tempBuilder);

            relationModel.tables = tempBuilder.tables;
            relationModel.tables.push(relationModel.name);
            relationModel.relations = tempBuilder.relations;
            relationModel.builder = tempBuilder.builder;
        }

        if(isArray){
            relationModel.whereIndexIn(relation.foreignKey, mainResult);
        }else{
            relationModel.whereIndex(relation.foreignKey, mainResult);
        }

        return new Promise((relationResolve, relationReject) => {

            let result;
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

            // let obj = transaction.objectStore(relationModel.name);
            // let request;
            // let relationResult = relationModel.getDefaultRelationValue(relation.type);
            //
            // if((isArray && mainResult.length === 0) || (!isArray && (mainResult === undefined || mainResult === null))){
            //     relationResolve(relationResult);
            // }
            //
            //
            //
            // request = relationModel.getIndexResult(obj);
            //
            // request.onsuccess = function (e) {
            //     let relationCursor = e.target.result;
            //
            //     if(relationCursor) {
            //         if(!relationModel.checkBuilderValue(relationCursor.value)){
            //             relationCursor.continue();
            //             return false;
            //         }
            //
            //         switch (relation.type) {
            //             case Model.RELATIONS.hasOne :
            //                 relationResult = relationCursor.value;
            //                 relationResolve(relationResult);
            //                 return false;
            //                 break;
            //
            //             case Model.RELATIONS.hasMany :
            //                 relationResult.push(relationCursor.value);
            //                 break;
            //
            //             default :
            //                 throw "Correct Relation was not provided";
            //         }
            //         relationCursor.continue();
            //     }else{
            //
            //
            //
            //         relationResolve(relationResult);
            //     }
            //
            // };
            //
            // request.onerror = function(e) {
            //     relationReject(e);
            // };

        });
    }

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
