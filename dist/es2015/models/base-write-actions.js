import { FindFailActions } from "./find-fail-actions.js";
import { TransactionModes } from "./model.interface.js";
import { InvalidTransaction } from "../errors/invalid-transaction.js";
import { mergeDeep as _mergeDeep } from "../utils.js";
export class BaseWriteActions extends FindFailActions {
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
        if (transaction.mode !== TransactionModes.Write) {
            throw new InvalidTransaction('Transaction not in write mode');
        }
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
     * Updates all matching records at index
     * By default deep merges the input data with existing data record.
     *
     * @param indexName
     * @param id
     * @param data
     * @param mergeDeep
     * @throws NotFound
     */
    async saveIndex(indexName, id, data, mergeDeep = true) {
        const tables = [this.table.name];
        const transaction = this.getTransaction(tables, TransactionModes.Write);
        const record = await this.findIndexOrFail(indexName, id);
        if (transaction.mode !== TransactionModes.Write) {
            throw new InvalidTransaction('Transaction not in write mode');
        }
        return this.save(record[this.primaryId], data, mergeDeep);
    }
    /**
     * Updates all matching records at index
     * By default deep merges the input data with existing data record.
     *
     * @param indexName
     * @param id
     * @param data
     * @param mergeDeep
     * @throws NotFound
     */
    async saveAllIndex(indexName, id, data, mergeDeep = true) {
        const tables = [this.table.name];
        const transaction = this.getTransaction(tables, TransactionModes.Write);
        if (transaction.mode !== TransactionModes.Write) {
            throw new InvalidTransaction('Transaction not in write mode');
        }
        this.resetBuilder().whereIndex(indexName, id);
        await this.update(data, mergeDeep);
        return Promise.resolve(true);
    }
}
//# sourceMappingURL=base-write-actions.js.map