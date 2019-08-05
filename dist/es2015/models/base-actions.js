import { Aggregate } from "./aggregate.js";
import { TransactionModes } from "./model.interface.js";
export class SearchActions extends Aggregate {
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
    findAllIndex(indexName, id) {
        this.resetBuilder();
        this.whereIndex(indexName, id);
        return this.all();
    }
}
//# sourceMappingURL=base-actions.js.map