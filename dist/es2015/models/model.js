import { DEFAULT_PRIMARY_ID, RelationTypes, TransactionModes } from "./model.interface.js";
import { Aggregate } from "./aggregate.js";
import { HasOne } from "../relations/has-one.js";
import { HasMany } from "../relations/has-many.js";
import { HasManyMulti } from "../relations/has-many-multi.js";
import { HasManyThroughMulti } from "../relations/has-many-through-multi.js";
import { mergeDeep as _mergeDeep } from "../utils.js";
import { NotFound } from "../errors/not-found.js";
import { InvalidTransaction } from "../errors/invalid-transaction.js";
export class Model extends Aggregate {
    constructor(db, table, connector) {
        super(db, table);
        this.db = db;
        this.table = table;
        this.connector = connector;
        this.transaction = null;
    }
    all() {
        const tables = this.tableNames(this.connector.migrationSchema.tables).concat(this.table.name);
        const transaction = this.getTransaction(tables, TransactionModes.ReadOnly);
        const objectStore = transaction.objectStore(this.table.name);
        const request = this.request(objectStore);
        return new Promise((resolve, reject) => {
            let results = [];
            request.addEventListener("success", async (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    if (!this.allowedToProcess(cursor.value)) {
                        return cursor.continue();
                    }
                    results.push(cursor.value);
                    return cursor.continue();
                }
                if (results.length === 0 || this.relations.length === 0) {
                    resolve(results);
                }
                const relations = this.loadRelations(results);
                await Promise.all(relations);
                resolve(results);
            });
            request.addEventListener("error", (error) => reject(error));
        });
    }
    first() {
        const tables = this.tableNames(this.connector.migrationSchema.tables).concat(this.table.name);
        const transaction = this.getTransaction(tables, TransactionModes.ReadOnly);
        const objectStore = transaction.objectStore(this.table.name);
        const request = this.request(objectStore);
        return new Promise((resolve, reject) => {
            let result;
            request.addEventListener("success", async (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    if (!this.allowedToProcess(cursor.value)) {
                        return cursor.continue();
                    }
                    result = cursor.value;
                }
                if (!result || this.relations.length === 0) {
                    resolve(result || null);
                }
                const relations = this.loadRelations([result]);
                await Promise.all(relations);
                resolve(result);
            });
            request.addEventListener("error", (error) => reject(error));
        });
    }
    async firstOrFail() {
        const record = await this.first();
        if (!record) {
            throw new NotFound();
        }
        return record;
    }
    find(id) {
        const tables = this.tableNames(this.connector.migrationSchema.tables).concat(this.table.name);
        const transaction = this.getTransaction(tables, TransactionModes.ReadOnly);
        const objectStore = transaction.objectStore(this.table.name);
        const request = objectStore.get(id);
        return new Promise((resolve, reject) => {
            request.addEventListener("success", async (event) => {
                const result = event.target.result;
                if (!result || this.relations.length === 0) {
                    resolve(result || null);
                }
                const relations = this.loadRelations([result]);
                await Promise.all(relations);
                resolve(result || null);
            });
            request.addEventListener("error", (error) => reject(error));
        });
    }
    async findOrFail(id) {
        const record = await this.find(id);
        if (!record) {
            throw new NotFound();
        }
        return record;
    }
    findIndex(indexName, id) {
        this.resetBuilder();
        const tables = this.tableNames(this.connector.migrationSchema.tables).concat(this.table.name);
        const transaction = this.getTransaction(tables, TransactionModes.ReadOnly);
        const objectStore = transaction.objectStore(this.table.name);
        const request = objectStore.index(indexName).get(id);
        return new Promise((resolve, reject) => {
            request.addEventListener("success", async (event) => {
                const result = event.target.result;
                if (!result || this.relations.length === 0) {
                    resolve(result || null);
                }
                const relations = this.loadRelations([result]);
                await Promise.all(relations);
                resolve(result);
            });
            request.addEventListener("error", (error) => reject(error));
        });
    }
    async findIndexOrFail(indexName, id) {
        const record = await this.findIndex(indexName, id);
        if (!record) {
            throw new NotFound();
        }
        return record;
    }
    findAllIndex(indexName, id) {
        this.resetBuilder();
        this.whereIndex(indexName, id);
        return this.all();
    }
    create(data) {
        const tables = this.tableNames(this.connector.migrationSchema.tables).concat(this.table.name);
        const transaction = this.getTransaction(tables, TransactionModes.Write);
        const objectStore = transaction.objectStore(this.table.name);
        const request = objectStore.add(data);
        return new Promise((resolve, reject) => {
            request.addEventListener("success", (event) => {
                data[this.primaryId] = event.target.result;
                resolve(data);
            });
            request.addEventListener("error", (error) => reject(error));
        });
    }
    createMultiple(entries) {
        const tables = this.tableNames(this.connector.migrationSchema.tables).concat(this.table.name);
        const transaction = this.getTransaction(tables, TransactionModes.Write);
        const objectStore = transaction.objectStore(this.table.name);
        const promises = [];
        for (const entry of entries) {
            const promise = new Promise((resolve, reject) => {
                const request = objectStore.add(entry);
                request.addEventListener("success", (event) => {
                    entry[this.primaryId] = event.target.result;
                    resolve(entry);
                });
                request.addEventListener("error", (error) => {
                    reject(error);
                    transaction.abort();
                });
            });
            promises.push(promise);
        }
        return Promise.all(promises);
    }
    async firstOrCreate(data) {
        const tables = this.tableNames(this.connector.migrationSchema.tables).concat(this.table.name);
        const transaction = this.createTransaction(tables, TransactionModes.Write);
        if (transaction.mode !== TransactionModes.Write) {
            throw new InvalidTransaction('Transaction not in write mode');
        }
        const record = await this.first();
        if (!record) {
            return this.create(data);
        }
        return record;
    }
    async findOrCreate(id, data) {
        const tables = this.tableNames(this.connector.migrationSchema.tables).concat(this.table.name);
        const transaction = this.createTransaction(tables, TransactionModes.Write);
        if (transaction.mode !== TransactionModes.Write) {
            throw new InvalidTransaction('Transaction not in write mode');
        }
        this.setTransaction(transaction);
        const record = await this.find(id);
        if (!record) {
            return this.create(data);
        }
        return record;
    }
    async findIndexOrCreate(indexName, id, data) {
        const tables = this.tableNames(this.connector.migrationSchema.tables).concat(this.table.name);
        const transaction = this.createTransaction(tables, TransactionModes.Write);
        if (transaction.mode !== TransactionModes.Write) {
            throw new InvalidTransaction('Transaction not in write mode');
        }
        const record = await this.findIndex(indexName, id);
        if (!record) {
            return this.create(data);
        }
        return record;
    }
    /**
     * Deletes matching entry.
     * If no builder/index for filtering is provided then throws error.
     */
    destroy() {
        const tables = [this.table.name];
        const transaction = this.getTransaction(tables, TransactionModes.Write);
        const objectStore = transaction.objectStore(this.table.name);
        let request;
        if (this.builder.length === 0 && this.indexBuilder === null) {
            throw new Error('Deletion without builder is not allowed. Call truncate if you want to delete all records.');
        }
        if (this.builder.length === 0 && this.indexBuilder !== null && this.primaryId === this.indexBuilder.index) {
            request = objectStore.delete(this.keyRange(this.indexBuilder));
        }
        else {
            request = this.request(objectStore);
        }
        return new Promise((resolve, reject) => {
            const deletePromises = [];
            request.addEventListener("success", async (event) => {
                if (this.builder.length === 0 && this.indexBuilder !== null && this.primaryId === this.indexBuilder.index) {
                    return resolve(true);
                }
                const cursor = event.target.result;
                if (cursor) {
                    if (!this.allowedToProcess(cursor.value)) {
                        return cursor.continue();
                    }
                    deletePromises.push(this.delete(cursor.value[this.primaryId]));
                    return cursor.continue();
                }
                await Promise.all(deletePromises);
                resolve(true);
            });
            request.addEventListener("error", (error) => reject(error));
        });
    }
    /**
     * Delete record at id of primary key
     * @param id
     */
    async delete(id) {
        const tables = [this.table.name];
        const transaction = this.getTransaction(tables, TransactionModes.Write);
        const objectStore = transaction.objectStore(this.table.name);
        const request = objectStore.delete(id);
        return new Promise((resolve, reject) => {
            request.addEventListener("success", () => resolve(true));
            request.addEventListener("error", (error) => reject(error));
        });
    }
    /**
     * Delete records matching index.
     * @param indexName
     * @param value
     * @param isMulti
     */
    deleteIndex(indexName, value, isMulti = false) {
        this.resetBuilder();
        if (isMulti) {
            this.whereIndex(indexName, value);
        }
        else {
            this.whereMultiIndexIn(indexName, [value]);
        }
        return this.destroy();
    }
    /**
     * Clears entire object store
     */
    truncate() {
        const tables = [this.table.name];
        const transaction = this.getTransaction(tables, TransactionModes.Write);
        const objectStore = transaction.objectStore(this.table.name);
        const request = objectStore.clear();
        return new Promise((resolve, reject) => {
            request.addEventListener("success", () => resolve(true));
            request.addEventListener("error", (error) => reject(error));
        });
    }
    /**
     * Delete record at id
     *
     * @deprecated
     * @param id
     */
    destroyId(id) {
        return this.delete(id);
    }
    /**
     * Updates all matching records.
     * By default deep merges the input data with existing data records.
     * @param data
     * @param mergeDeep
     */
    update(data, mergeDeep = true) {
        const tables = [this.table.name];
        const transaction = this.getTransaction(tables, TransactionModes.Write);
        const objectStore = transaction.objectStore(this.table.name);
        const request = this.request(objectStore);
        return new Promise((resolve, reject) => {
            let totalUpdatedRecords = 0;
            const updatePromises = [];
            request.addEventListener('success', async (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    if (!this.allowedToProcess(cursor.value)) {
                        return cursor.continue();
                    }
                    updatePromises.push(this.save(cursor.value[this.primaryId], data, mergeDeep));
                    totalUpdatedRecords++;
                    cursor.continue();
                }
                await Promise.all(updatePromises);
                resolve(totalUpdatedRecords);
            });
            request.addEventListener('error', (event) => reject(event));
        });
    }
    /**
     * Updates the records at id
     * By default deep merges the input data with existing data record.
     *
     * @param id
     * @param data
     * @param mergeDeep
     * @throws NotFound
     */
    async save(id, data, mergeDeep = true) {
        const tables = [this.table.name];
        const transaction = this.getTransaction(tables, TransactionModes.Write);
        const record = await this.findOrFail(id);
        const objectStore = transaction.objectStore(this.table.name);
        const saveData = mergeDeep ? _mergeDeep(record, data) : data;
        saveData[this.primaryId] = id;
        const request = objectStore.put(saveData);
        return new Promise((resolve, reject) => {
            request.addEventListener("success", () => {
                resolve(true);
            });
            request.addEventListener("error", (error) => reject(error));
        });
    }
    /**
     * Retrieves current transaction and if ne transaction exists then creates new one.
     *
     * @param stores
     * @param mode
     * @param overwrite
     */
    getTransaction(stores, mode, overwrite = false) {
        if (this.transaction === null || overwrite) {
            this.transaction = this.createTransaction(stores, mode);
        }
        return this.transaction;
    }
    /**
     * Sets transaction for the model
     * @param transaction
     */
    setTransaction(transaction) {
        this.transaction = transaction;
    }
    /**
     * Creates new transaction
     * @param stores
     * @param mode
     */
    createTransaction(stores, mode) {
        const transaction = this.db.transaction(stores, mode);
        this.setTransaction(transaction);
        return transaction;
    }
    /**
     * Opens new transaction for all models and returns transaction instance
     * @param mode
     */
    openTransaction(mode) {
        const transaction = this.db.transaction(this.connector.migrationSchema.tables.map(table => table.name));
        const models = {};
        for (const table of this.connector.migrationSchema.tables) {
            Object.defineProperty(models, table.name, {
                get: () => {
                    const model = new Model(this.db, table, this.connector);
                    model.setTransaction(transaction);
                    return model;
                }
            });
        }
        return { models, transaction };
    }
    /**
     * Opens IDBRequest to perform action on object store
     * @param objectStore
     */
    request(objectStore) {
        const direction = this.cursor || undefined;
        if (this.indexBuilder) {
            const keyRange = this.keyRange(this.indexBuilder);
            const cursor = this.indexBuilder.index !== this.primaryId ? objectStore.index(this.indexBuilder.index) : objectStore;
            return cursor.openCursor(keyRange, direction);
        }
        else {
            return objectStore.openCursor(undefined, direction);
        }
    }
    /**
     * Loads relations against the model results
     *
     * @param results
     */
    loadRelations(results) {
        const relationsArray = [];
        for (const relation of this.relations) {
            let loader;
            switch (relation.type) {
                case RelationTypes.HasOne:
                    loader = new HasOne(this.db, this.connector, this, relation);
                    relationsArray.push(loader.fetch(results));
                    break;
                case RelationTypes.HasMany:
                    loader = new HasMany(this.db, this.connector, this, relation);
                    relationsArray.push(loader.fetch(results));
                    break;
                case RelationTypes.HasManyMultiEntry:
                    loader = new HasManyMulti(this.db, this.connector, this, relation);
                    relationsArray.push(loader.fetch(results));
                    break;
                case RelationTypes.HasManyThroughMultiEntry:
                    loader = new HasManyThroughMulti(this.db, this.connector, this, relation);
                    relationsArray.push(loader.fetch(results));
                    break;
                default:
                    throw new Error(`Unknown relation ${relation.type}`);
            }
        }
        return relationsArray.concat(this.loadCustomRelations(results));
    }
    /**
     * The primary key of the model
     */
    get primaryId() {
        return this.table.primary || DEFAULT_PRIMARY_ID;
    }
    loadCustomRelations(results) {
        const relationPromises = [];
        for (const customRelation of this.customRelations) {
            if (!Reflect.has(this, customRelation)) {
                throw new Error(`Method ${customRelation} not defined.`);
            }
            const relation = (Reflect.get(this, customRelation)());
            relationPromises.push(relation.fetch(results));
        }
        return relationPromises;
    }
}
//# sourceMappingURL=model.js.map