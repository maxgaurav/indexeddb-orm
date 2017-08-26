import {Builder, Relation} from './builder';
import {ModelInterface, Models} from "./interfaces";

/**
 * Normal result fetch event target which contains the main result
 */
interface IDBResultEventTarget extends EventTarget {
    result: any
}

/**
 * Cursor fetch event target containing the result value
 */
interface IDBCursorEventTarget extends EventTarget {
    result: IDBCursorWithValue
}

/**
 * Main result event on normal operations
 */
interface IDBResultEvent extends Event {
    target: IDBResultEventTarget
}

/**
 * Main result event on IDB cursor open events
 */
interface IDBCursorEvent extends Event {
    target: IDBCursorEventTarget
}

/**
 * Static IDBKeyRange
 */
export interface IDBStaticKeyRange extends IDBKeyRange {
    /**
     * Bound's the search result query builder within the given values.
     * @param x
     * @param y
     * @param {boolean} notContainX
     * @param {boolean} notContainY
     * @returns {IDBKeyRange}
     */
    bound(x: any, y: any, notContainX?: boolean, notContainY?: boolean): IDBKeyRange,

    /**
     * Checks whether the key exists in the database
     * @param key
     * @returns {boolean}
     */
    includes(key: any): boolean,

    /**
     *
     * @param x
     * @param {boolean} notContainX
     * @returns {IDBKeyRange}
     */
    lowerBound(x: any, notContainX?: boolean): IDBKeyRange,
    upperBound(x: any, notContainX?: boolean): IDBKeyRange,
    only(x: any): IDBKeyRange
}

/**
 * Main Model class
 */
export class Model extends Builder implements ModelInterface{

    public tables: string[] = [];
    public hasIDBKey: boolean = false;
    private transaction: IDBTransaction;

    constructor(public db: IDBDatabase, public idbKey: IDBStaticKeyRange, public name: string, public primary: string = '_id') {
        super();

        this.tables.push(this.name);
        this.hasIDBKey = !!this.idbKey;
    }

    /**
     * Finds the result on the primary key defined
     * @param id
     * @returns {Promise}
     */
    find(id: number): Promise<any> {

        return new Promise((resolve, reject) => {
            let transaction = this.getTransaction(this.allTables(), Model.READONLY);
            let obj = transaction.objectStore(this.name);
            let request = obj.get(id);

            request.onsuccess = (e: IDBResultEvent) => {
                let relationsCompleted = 0;

                let result = e.target.result;
                if (this.relations.length <= 0 || !result) {
                    resolve(result);
                    return;
                }

                this.relations.forEach(async (relation) => {

                    let relationResult: any = await this.getRelationships(relation, this.transaction, this.getMainResult(result, relation.localKey, false), false);

                    relationsCompleted++;

                    let defaultValue = this.getDefaultRelationValue(relation.type);
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

                        case Model.RELATIONS.hasManyMultiEntry:
                            if(relationResult.length > 0) {
                                result[relation.modelName] = relationResult.filter(relationResultItem => {
                                    return result[relation.localKey].indexOf(relationResultItem[relation.foreignKey]) !== -1;
                                });
                            }
                            break;
                    }

                    if (relationsCompleted == this.relations.length) {
                        resolve(result);
                    }

                });
            };

            request.onerror = (e: ErrorEvent) => {
                reject(e.message);
            };

        });
    }

    /**
     * Searches for first value in database and returns that
     * @returns {Promise}
     */
    first(): Promise<any> {

        return new Promise((resolve, reject) => {

            let transaction: IDBTransaction = this.getTransaction(this.allTables(), Model.READONLY);
            let obj = transaction.objectStore(this.name);
            let result: any = null;
            let request: IDBRequest = this.indexBuilder.type ? this.getIndexResult(obj) : obj.openCursor();

            request.onsuccess = (e: IDBCursorEvent) => {
                let cursor = e.target.result;

                if (!cursor) {
                    resolve(result);
                    return;
                }

                if (!this.checkBuilderValue(cursor.value)) {
                    cursor.continue();
                }

                let relationsCompleted = 0;

                result = cursor.value;
                if (this.relations.length <= 0 || !result) {
                    resolve(result);
                    return;
                }

                this.relations.forEach(async (relation) => {

                    let relationResult: any = await this.getRelationships(relation, this.transaction, this.getMainResult(result, relation.localKey, false), false);

                    relationsCompleted++;

                    let defaultValue = this.getDefaultRelationValue(relation.type);
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
                        case Model.RELATIONS.hasManyMultiEntry:
                            if(relationResult.length > 0) {
                                result[relation.modelName] = relationResult.filter(relationResultItem => {
                                    return result[relation.localKey].indexOf(relationResultItem[relation.foreignKey]) !== -1;
                                });
                            }
                            break;
                    }

                    if (relationsCompleted == this.relations.length) {
                        resolve(result);
                    }

                });

            };

            request.onerror = function (e: ErrorEvent) {
                reject(e.message);
            }
        });
    }

    /**
     * Function searches throughout the database and returns a array of result
     * @returns {Promise}
     */
    get(): Promise<any[]> {

        return new Promise((resolve, reject) => {
            let transaction = this.getTransaction(this.allTables(), Model.READONLY);
            let obj = transaction.objectStore(this.name);
            let result = [];

            let request: IDBRequest = this.indexBuilder.type ? this.getIndexResult(obj) : obj.openCursor();

            request.onsuccess = (e: IDBResultEvent) => {
                let cursor = e.target.result;

                if (cursor) {
                    if (this.checkBuilderValue(cursor.value)) {
                        result.push(cursor.value);
                    }

                    cursor.continue();
                    return;
                }

                let relationsCompleted = 0;

                if (this.relations.length <= 0 || result.length <= 0) {
                    resolve(result);
                    return;
                }

                this.relations.forEach(async (relation) => {

                    let relationResult: any = await this.getRelationships(relation, this.transaction, this.getMainResult(result, relation.localKey, true), true);

                    relationsCompleted++;

                    result = result.map(item => {

                        let defaultValue = this.getDefaultRelationValue(relation.type);

                        item[relation.modelName] = item[relation.modelName] || defaultValue;

                        switch (relation.type) {
                            case Model.RELATIONS.hasOne :
                                if (relationResult !== undefined) {
                                    item[relation.modelName] = relationResult[relation.foreignKey] == item[relation.localKey] ? relationResult : item[relation.modelName];
                                }

                                break;
                            case Model.RELATIONS.hasMany :
                                if (relationResult.length > 0) {
                                    item[relation.modelName] = relationResult.filter((relationResultItem) => {
                                        return relationResultItem[relation.foreignKey] == item[relation.localKey];
                                    });
                                }
                                break;
                            case Model.RELATIONS.hasManyMultiEntry:
                                if(relationResult.length > 0) {
                                    item[relation.modelName] = relationResult.filter(relationResultItem => {
                                        return item[relation.localKey].indexOf(relationResultItem[relation.foreignKey]) !== -1;
                                    });
                                }
                                break;
                        }

                        return item;
                    });

                });
            };

            request.onerror = (e: ErrorEvent) => {
                reject(e.message);
            }
        });
    }

    /**
     * Function creates a single record
     * @param data
     * @returns {Promise}
     */
    create(data): Promise<any> {

        return new Promise((resolve, reject) => {
            let transaction = this.getTransaction(this.allTables(), Model.READWRITE);

            let obj = transaction.objectStore(this.name);

            data.createdAt = Date.now();
            data.updatedAt = Date.now();

            let request = obj.add(data);

            request.onsuccess = (e: IDBResultEvent) => {
                data[this.primary] = e.target.result;
                resolve(data);
            };

            request.onerror = (e: ErrorEvent) => {
                reject(e.message);
            };
        });

    }

    /**
     * Function creates list of records passed
     * @param dataRecords
     * @returns {Promise}
     */
    createMultiple(dataRecords: any[]): Promise<any[]> {
        return new Promise((resolve, reject) => {
            let transaction = this.getTransaction(this.allTables(), Model.READWRITE);

            let obj = transaction.objectStore(this.name);
            let createdAt = Date.now();
            let updatedAt = Date.now();
            let result = [];

            dataRecords.forEach((data) => {
                data.createdAt = createdAt;
                data.updatedAt = updatedAt;

                let request = obj.add(data);

                request.onerror = function (e) {
                    reject(e);
                };

                request.onsuccess = (e: IDBResultEvent) => {
                    data[this.primary] = e.target.result;

                    result.push(data);

                    if (result.length === dataRecords.length) {
                        resolve(result);
                    }
                };

                request.onerror = (e: ErrorEvent) => {
                    transaction.abort();
                    reject(e.message);
                }
            })
        });
    }

    /**
     * Function updates the various records with matching values
     * @param data
     * @returns {Promise}
     */
    update(data): Promise<number> {

        let updatedAt = Date.now();

        return new Promise((resolve, reject) => {
            let transaction = this.getTransaction(this.allTables(), Model.READWRITE);
            let obj = transaction.objectStore(this.name);
            let totalRecordsBeingUpdated = 0, totalRecordsUpdated = 0;

            let request: IDBRequest = this.indexBuilder.type ? this.getIndexResult(obj) : obj.openCursor();

            request.onsuccess = (e: IDBResultEvent) => {
                let cursor = e.target.result;

                if (!cursor) {
                    resolve(totalRecordsUpdated);
                    return;
                }

                if (this.checkBuilderValue(cursor.value)) {
                    totalRecordsBeingUpdated++;

                    let id = cursor.value[this.primary];
                    let createdAt = cursor.value.createdAt;

                    let result = Model.helpers.replaceNestedValues(data, cursor.value);
                    result[this.primary] = id;
                    result.createdAt = createdAt;
                    result.updatedAt = updatedAt;

                    let updateRequest = cursor.update(result);

                    updateRequest.onsuccess = () => {
                        totalRecordsUpdated++;

                        if (totalRecordsUpdated === totalRecordsBeingUpdated) {
                            resolve(totalRecordsUpdated);
                        }
                    };

                    updateRequest.onerror = function (err: ErrorEvent) {
                        transaction.abort();
                        reject(err.message);
                    };

                }

                cursor.continue();
            };

            request.onerror = function (e: ErrorEvent) {
                reject(e.message);
            }
        });
    }

    /**
     * Function updates the record at the given id
     * @param idd
     * @param data
     * @returns {Promise}
     */
    save(idd: number, data: any): Promise<boolean> {
        let updatedAt = Date.now();

        return new Promise(async (resolve, reject) => {

            let result = await this.find(idd);

            if (!result) {
                reject('No record found');
            }

            let transaction = this.getTransaction(this.allTables(), Model.READWRITE);
            let obj = transaction.objectStore(this.name);

            let id = result[this.primary];
            let createdAt = result.createdAt;

            result = Model.helpers.replaceNestedValues(data, result);
            result[this.primary] = id;
            result.createdAt = createdAt;
            result.updatedAt = updatedAt;

            let request = obj.put(result);

            request.onsuccess = () => {
                resolve(true);
            };

            request.onerror = (e: ErrorEvent) => {
                reject(e.message);
            }

        });
    }

    /**
     * Function deletes the entries at the given point
     * @param id
     * @returns {Promise}
     */
    destroyId(id): Promise<any> {

        return new Promise(async (resolve, reject) => {
            let result = await this.find(id);

            if (!result) {
                reject('result at id does not exists');
            }

            let transaction = this.getTransaction(this.allTables(), Model.READWRITE);
            let obj = transaction.objectStore(this.name);
            let request = obj.delete(id);

            request.onsuccess = (e: IDBResultEvent) => {
                resolve(e.target.result);
            };

            request.onerror = (e: ErrorEvent) => {
                reject(e.message);
            };

        });
    }

    /**
     * Function deletes the entries
     * @returns {Promise}
     */
    destroy(): Promise<any> {

        return new Promise((resolve, reject) => {
            let transaction = this.getTransaction(this.allTables(), Model.READWRITE);
            let obj = transaction.objectStore(this.name);
            let request, totalRecordsBeingDeleted = 0, totalRecordsDeleted = 0;

            if (this.indexBuilder.type) {
                request = this.getIndexResult(obj);
            } else {
                request = obj.openCursor();
            }

            request.onsuccess = function (e) {
                let cursor = e.target.result;

                if (cursor) {
                    if (this.checkBuilderValue(cursor.value)) {
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
    count(): Promise<number> {

        return new Promise((resolve, reject) => {
            let transaction = this.getTransaction(this.allTables(), Model.READONLY);
            let obj = transaction.objectStore(this.name);
            let result = 0;
            let request: IDBRequest = this.indexBuilder.type ? this.getIndexResult(obj) : obj.openCursor();

            request.onsuccess = (e: IDBResultEvent) => {
                let cursor = e.target.result;

                if (!cursor) {
                    resolve(result);
                    return;
                }

                if (this.checkBuilderValue(cursor.value)) {
                    result++;
                }

                cursor.continue();
            };

            request.onerror = (e: ErrorEvent) => {
                reject(e.message);
            }
        });
    }

    /**
     * Function averages the numeric value at the given point
     * @param attribute
     * @returns {Promise}
     */
    average(attribute: string): Promise<number> {

        return new Promise((resolve, reject) => {
            let transaction = this.getTransaction(this.allTables(), Model.READONLY);
            let obj = transaction.objectStore(this.name);
            let result = 0, totalRecords = 0;
            let request: IDBRequest = this.indexBuilder.type ? this.getIndexResult(obj) : obj.openCursor();

            request.onsuccess = (e: IDBResultEvent) => {
                let cursor = e.target.result;

                if (!cursor) {
                    resolve(result / totalRecords);
                    return;
                }

                if (this.checkBuilderValue(cursor.value)) {
                    let tempResult = Model.helpers.getNestedAttribute(attribute, cursor.value);

                    totalRecords++;
                    tempResult = parseFloat(tempResult);
                    tempResult = isNaN(tempResult) ? 0 : tempResult;
                    result += tempResult;
                }

                cursor.continue();
            };

            request.onerror = (e: ErrorEvent) => {
                reject(e.message);
            }
        });
    }

    /**
     * Reduce function is called with each passing iterator value and reduced value is returned
     * @param func
     * @param defaultCarry
     * @returns {Promise}
     */
    reduce(func: (value: any, result: any) => any, defaultCarry: any): Promise<any> {

        if (typeof func !== 'function') {
            throw "Parameter should be a function type";
        }

        return new Promise((resolve, reject) => {
            let transaction = this.getTransaction(this.allTables(), Model.READONLY);
            let obj = transaction.objectStore(this.name);
            let result = defaultCarry;
            let request;

            if (this.indexBuilder.type) {
                request = this.getIndexResult(obj);
            } else {
                request = obj.openCursor();
            }

            request.onsuccess = function (e: IDBResultEvent) {
                let cursor = e.target.result;

                if (!cursor) {
                    resolve(result);
                    return;
                }
                if (this.checkBuilderValue(cursor.value)) {
                    result = func(cursor.value, result);
                }

                cursor.continue();
            };

            request.onerror = (e:ErrorEvent) => {
                reject(e.message);
            }
        });
    }

    /**
     * Sets the index search criteria
     * @param objectStore
     * @returns {*}
     */
    private getIndexResult(objectStore: IDBObjectStore): IDBRequest {
        let range;
        let index;

        if (!this.indexBuilder.type) {
            return objectStore.openCursor();
        }

        if (this.indexBuilder.index !== this.primary) {
            index = objectStore.index(this.indexBuilder.index);
        } else {
            index = objectStore;
        }

        switch (this.indexBuilder.type) {
            case 'and' :
                range = this.idbKey.only(this.indexBuilder.value);
                break;

            case 'in' :
                this.whereIn(this.indexBuilder.index, this.indexBuilder.value);
                let values = this.indexBuilder.value.sort();
                range = this.idbKey.bound(values[0], values[values.length - 1], false, false);
                break;

            case 'gte' :
                range = this.idbKey.lowerBound(this.indexBuilder.value, false);
                break;

            case 'gt' :
                range = this.idbKey.lowerBound(this.indexBuilder.value, true);
                break;

            case 'lte' :
                range = this.idbKey.upperBound(this.indexBuilder.value, false);
                break;

            case 'lt' :
                range = this.idbKey.lowerBound(this.indexBuilder.value, true);
                break;

            case 'between' :
                range = this.idbKey.bound(this.indexBuilder.value[0], this.indexBuilder.value[1], false, false);
                break;
            default :
                throw 'Invalid builder type given';
        }

        return index.openCursor(range);
    }

    /**
     * Checks common search criteria other than the index values
     * @param value
     * @returns {boolean}
     */
    private checkBuilderValue(value): boolean {
        let result = true;
        let i: number, j: number;

        for (i = 0; i < this.builder.length; i++) {

            let condition = this.builder[i];
            switch (condition.type) {

                case 'and' : //case for one to one search
                    if (!Model.helpers.checkNestedAttribute(condition.attribute, value, condition.value)) {
                        return false;
                    }
                    break;

                case 'in' : //case for list search
                    let tempCheck = false;
                    for (j = 0; j < condition.value.length; j++) {
                        result = Model.helpers.checkNestedAttribute(condition.attribute, value, condition.value[j]);
                        if (result !== undefined && result !== false) {
                            tempCheck = true;
                        }
                    }

                    if (!tempCheck) {
                        return false;
                    }

                    result = true;

                    break;

                case 'gte' : //case for checking the value is greater than or is equal to the same
                    result = Model.helpers.getNestedAttribute(condition.attribute, value);

                    if (result === undefined) {
                        return false;
                    }

                    if (result < condition.value) {
                        return false;
                    }

                    result = true;
                    break;

                case 'gt' : //case for checking the value is greater than the same

                    result = Model.helpers.getNestedAttribute(condition.attribute, value);

                    if (result === undefined) {
                        return false;
                    }

                    if (result <= condition.value) {
                        return false;
                    }

                    result = true;
                    break;

                case 'lte' : //case for checking the value is less than or is equal to the same
                    result = Model.helpers.getNestedAttribute(condition.attribute, value);

                    if (result === undefined) {
                        return false;
                    }

                    if (result > condition.value) {
                        return false;
                    }
                    result = true;
                    break;

                case 'lt' : //case for checking the value is less than the same
                    result = Model.helpers.getNestedAttribute(condition.attribute, value);

                    if (result === undefined) {
                        return false;
                    }

                    if (result >= condition.value) {
                        return false;
                    }
                    result = true;
                    break;

                case 'between' : //case for checking the value is between the given range(ONLY WORKS FOR NUMERIC)
                    result = Model.helpers.getNestedAttribute(condition.attribute, value);

                    if (result === undefined) {
                        return false;
                    }

                    if (condition.value[0] >= result && condition.value[1] <= result) {
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
    public createTransaction(tables, mode): IDBTransaction {
        this.transaction = this.db.transaction(tables, mode);
        return this.transaction;
    }

    /**
     * Sets IDBTransaction obejct to current model scope
     * @param transaction
     */
    public setTransaction(transaction: IDBTransaction) {
        this.transaction = transaction;
    }

    /**
     * Returns the IDBTransaction object set in current scope
     * @param {Array} tables
     * @param {String} mode
     * @param {boolean} overwrite
     * @returns {*|null}
     */
    getTransaction(tables: string[], mode:string, overwrite: boolean = false): IDBTransaction {

        if (!this.transaction || overwrite === true) {
            return this.createTransaction(tables, mode);
        }

        return this.transaction;
    }

    /**
     * Opens a transaction and creates models encapsulated in the transaction so that all operations occur within the transaction
     * @param {ModelInterface[]} models
     * @param {(transaction: IDBTransaction, models: Models, passableData?: any) => Promise<any>} func
     * @param passableData
     * @return {Promise}
     */
    public openTransaction(models: ModelInterface[],func: (transaction: IDBTransaction, models: Models, passableData?:any) => Promise<any>, passableData: any = null): Promise<any> {

        let tables = models.map(model => model.name);

        let transaction = this.getTransaction(tables, Model.READWRITE);
        let m = {};

        models.forEach((model: Model) => {
            Object.defineProperty(m, model.name, {
                get () {
                    let newModel = new Model(model.db, model.idbKey, model.name, model.primary);
                    newModel.setTransaction(transaction);

                    return newModel;
                }
            });
        });


        return func(transaction, m, passableData);
    }

    /**
     * Returns the array or direct key value against the input give for the key specified
     * @param result
     * @param key
     * @param isArray
     * @returns {*}
     */
    private getMainResult(result, key, isArray) {
        if (isArray) {
            return result.map((item) => {
                return item[key];
            });
        } else {
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
    private getRelationships(relation: Relation, transaction: IDBTransaction, mainResult, isArray: boolean = false): Promise<any> {
        let relationModel = new Model(this.db, this.idbKey, relation.modelName, relation.primary);

        //setting the relation transaction same as parent transaction
        relationModel.setTransaction(transaction);

        //if a secondary builder function was defined
        if (relation.func) {
            let tempBuilder = new Builder();

            tempBuilder = relation.func(tempBuilder);

            relationModel.tables = tempBuilder.tables;
            relationModel.tables.push(relationModel.name);
            relationModel.relations = tempBuilder.relations;
            relationModel.builder = tempBuilder.builder;
            relationModel.primary = relation.primary || '_id';
        }

        //checking type of parent result
        isArray ? relationModel.whereIndexIn(relation.foreignKey, mainResult) : relationModel.whereIndex(relation.foreignKey, mainResult);

        return new Promise((relationResolve, relationReject) => {

            let result;

            //if relation type mentioned
            switch (relation.type) {
                case Model.RELATIONS.hasOne :
                    result = relationModel.first();
                    break;
                case Model.RELATIONS.hasMany :
                    result = relationModel.get();
                    break;
                case Model.RELATIONS.hasManyMultiEntry :

                    let multiEntries: any[] = [];
                    if(isArray) {
                         multiEntries = mainResult.reduce((content, carry) => {
                            content.forEach(c => carry.push(c));
                            return carry;
                        },[]);
                    }else{
                        multiEntries = mainResult
                    }

                    result = relationModel.whereIndexIn(relation.foreignKey, multiEntries).get();

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

    // noinspection JSMethodCanBeStatic
    /**
     * Gets the default value of result. Null for hasOne and array for hasMany
     * @param type
     * @returns {*}
     */
    private getDefaultRelationValue(type:string) {
        switch (type) {
            case Model.RELATIONS.hasOne :
                return null;
            case Model.RELATIONS.hasMany :
            case Model.RELATIONS.hasManyMultiEntry :
                return [];
            default :
                return null;
        }
    }


    /**
     * Readwrite parameter of indexedDB
     * @return {string}
     */
    static get READWRITE(): string {
        return "readwrite";
    }

    /**
     * Readonly parameter of indexedDB
     * @return {string}
     */
    static get READONLY(): string {
        return "readonly";
    }

    /**
     * Function creates list of tables to be used in transaction for all relations
     * @return {string[]}
     */
    private allTables(): string[] {

        this.tables = [this.name];
        this.tables = this.tables.concat(this.getRelationTables(this.relations));

        return this.tables;
    }

    /**
     * Function returns a list of tables called in nested query builder of relation
     * @param {Relation[]} relations
     * @return {Array}
     */
    private getRelationTables(relations: Relation[]) {
        let tables = [];
        relations.forEach(relation => {
            tables.push(relation.modelName);
            if(relation.func) {
                let builder = relation.func(new Builder);
                tables = tables.concat(this.getRelationTables(builder.relations));

            }
        });

        return tables;
    }

}
