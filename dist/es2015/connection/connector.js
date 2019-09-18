import { Migration } from "../migration/migration.js";
import { Model } from "../models/model.js";
/**
 *
 */
export class Connector {
    constructor(migrationSchema) {
        this.migrationSchema = migrationSchema;
        /**
         * Database open request
         */
        this.dbOpenConnection = null;
        /**
         * Migration builder instance
         */
        this.migration = null;
        /**
         * IndexedDB Database instance
         */
        this.database = null;
    }
    /**
     * Create/Update and connects the database
     */
    connect() {
        this.dbOpenConnection = this.indexedDB().open(this.migrationSchema.name, this.migrationSchema.version);
        return new Promise((resolve, reject) => {
            if (this.dbOpenConnection === null) {
                throw new Error('Database connection did not open');
            }
            this.dbOpenConnection.addEventListener('success', (event) => {
                const models = this.completeHandler(event);
                resolve(models);
            });
            this.dbOpenConnection.addEventListener('error', (event) => {
                reject(event);
            });
            this.dbOpenConnection.addEventListener('upgradeneeded', async (event) => {
                await this.migrateHandler(event);
            });
        });
    }
    /**
     * Deletes the database
     */
    destroy(databaseName) {
        const request = this.indexedDB().deleteDatabase(databaseName);
        return new Promise((resolve, reject) => {
            request.addEventListener('success', () => resolve(true));
            request.addEventListener('error', (e) => reject(e));
        });
    }
    /**
     * Returns the IDBFactory.
     */
    indexedDB() {
        const idb = indexedDB || self.indexedDB || self.mozIndexedDB || self.webkitIndexedDB || self.msIndexedDB;
        if (!idb) {
            throw new Error("IndexedDB constructor not found in environment");
        }
        return idb;
    }
    /**
     * Called when database version is updated. Runs migrations to update schema structure
     * @param event
     */
    async migrateHandler(event) {
        const migration = new Migration(this.migrationSchema.tables, event.target.result, event.target.transaction);
        this.migrationSchema.tables = await migration.run();
        return true;
    }
    /**
     * Called when connection to database is successful. Creates various models for the tables.
     * @param event
     */
    completeHandler(event) {
        const storeNames = this.migrationSchema.tables.map(table => table.name);
        const transaction = event.target.transaction || event.target.result.transaction(storeNames);
        this.database = event.target.result;
        const migration = new Migration(this.migrationSchema.tables, event.target.result, transaction);
        this.migration = migration;
        const stores = migration.listObjectStores();
        const models = {};
        for (const store of stores) {
            const table = this.migrationSchema.tables.find(schema => schema.name === store.name);
            Object.defineProperty(models, store.name, {
                get: () => {
                    if (table.ormClass) {
                        return new table.ormClass(event.target.result, table, this);
                    }
                    else {
                        return new Model(event.target.result, table, this);
                    }
                }
            });
        }
        return models;
    }
    /**
     * Returns migration instance
     */
    getMigration() {
        return this.migration;
    }
    /**
     * Returns database instance
     */
    getDatabase() {
        return this.database;
    }
    /**
     * Opens a transaction to allow fine control on commits.
     * @param mode
     */
    openTransaction(mode) {
        if (this.database === null) {
            throw new Error('First initialize the connection using connect.');
        }
        const transaction = this.database.transaction(this.migrationSchema.tables.map(table => table.name));
        const models = {};
        for (const table of this.migrationSchema.tables) {
            Object.defineProperty(models, table.name, {
                get: () => {
                    const model = new Model(this.database, table, this);
                    model.setTransaction(transaction);
                    return model;
                }
            });
        }
        return { models, transaction };
    }
    /**
     * Closes currently open connection to database
     */
    close() {
        if (this.database) {
            this.database.close();
            return Promise.resolve(true);
        }
        return Promise.reject('No Connection open');
    }
}
//# sourceMappingURL=connector.js.map