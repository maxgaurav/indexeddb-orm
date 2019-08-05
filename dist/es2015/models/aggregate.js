import { TransactionModes } from "./model.interface.js";
import { nestedAttributeValue } from "../utils.js";
import { BaseModel } from "./base-model.js";
export class Aggregate extends BaseModel {
    constructor(db, table) {
        super();
        this.db = db;
        this.table = table;
    }
    /**
     * Returns the count of matching records
     */
    count() {
        const tables = [this.table.name];
        const transaction = this.getTransaction(tables, TransactionModes.ReadOnly);
        const objectStore = transaction.objectStore(this.table.name);
        let request;
        if (this.builder.length === 0 && this.indexBuilder === null) {
            request = objectStore.count();
        }
        else if (this.builder.length === 0 && this.indexBuilder !== null) {
            request = objectStore.count(this.keyRange(this.indexBuilder));
        }
        else {
            request = this.request(objectStore);
        }
        return new Promise((resolve, reject) => {
            let count = 0;
            request.addEventListener("success", async (event) => {
                if (this.builder.length === 0) {
                    return resolve(event.target.result);
                }
                const cursor = event.target.result;
                if (cursor) {
                    if (!this.allowedToProcess(cursor.value)) {
                        return cursor.continue();
                    }
                    count++;
                    return cursor.continue();
                }
                resolve(count);
            });
            request.addEventListener("error", (error) => reject(error));
        });
    }
    /**
     * Returns average of attribute value on matching records.
     * If value is not numeric then its skipped
     * @param attribute
     */
    average(attribute) {
        const tables = [this.table.name];
        const transaction = this.getTransaction(tables, TransactionModes.ReadOnly);
        const objectStore = transaction.objectStore(this.table.name);
        const request = this.request(objectStore);
        return new Promise((resolve, reject) => {
            let count = 0;
            let total = 0;
            request.addEventListener("success", async (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    if (!this.allowedToProcess(cursor.value)) {
                        return cursor.continue();
                    }
                    const value = nestedAttributeValue(attribute, cursor.value);
                    if (!isNaN(parseFloat(value))) {
                        total += parseFloat(cursor.value[attribute]);
                    }
                    count++;
                    return cursor.continue();
                }
                resolve(total / count);
            });
            request.addEventListener("error", (error) => reject(error));
        });
    }
    reduce(func, defaultCarry) {
        const tables = [this.table.name];
        const transaction = this.getTransaction(tables, TransactionModes.ReadOnly);
        const objectStore = transaction.objectStore(this.table.name);
        const request = this.request(objectStore);
        return new Promise((resolve, reject) => {
            let result = defaultCarry;
            request.addEventListener("success", async (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    if (!this.allowedToProcess(cursor.value)) {
                        return cursor.continue();
                    }
                    result = func(cursor.value, result);
                    return cursor.continue();
                }
                resolve(result);
            });
            request.addEventListener("error", (error) => reject(error));
        });
    }
}
//# sourceMappingURL=aggregate.js.map