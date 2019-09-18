import { ConnectorInterface } from "./connector.interface.js";
import { Database, MigrationInterface } from "../migration/migration.interface.js";
import { DBSuccessEvent, DBVersionChangeEvent } from "./idb-event.interface.js";
import { Migration } from "../migration/migration.js";
import { ModelInterface, ModelKeysInterface, TransactionModes } from "../models/model.interface.js";
/**
 *
 */
export declare class Connector implements ConnectorInterface {
    migrationSchema: Database;
    /**
     * Database open request
     */
    private dbOpenConnection;
    /**
     * Migration builder instance
     */
    protected migration: Migration | null;
    /**
     * IndexedDB Database instance
     */
    protected database: IDBDatabase | null;
    constructor(migrationSchema: Database);
    /**
     * Create/Update and connects the database
     */
    connect(): Promise<ModelKeysInterface>;
    /**
     * Deletes the database
     */
    destroy(databaseName: string): Promise<boolean>;
    /**
     * Returns the IDBFactory.
     */
    indexedDB(): IDBFactory;
    /**
     * Called when database version is updated. Runs migrations to update schema structure
     * @param event
     */
    migrateHandler(event: DBVersionChangeEvent): Promise<boolean>;
    /**
     * Called when connection to database is successful. Creates various models for the tables.
     * @param event
     */
    protected completeHandler(event: DBSuccessEvent): {
        [key: string]: ModelInterface;
    };
    /**
     * Returns migration instance
     */
    getMigration(): MigrationInterface | null;
    /**
     * Returns database instance
     */
    getDatabase(): IDBDatabase | null;
    /**
     * Opens a transaction to allow fine control on commits.
     * @param mode
     */
    openTransaction(mode: TransactionModes): {
        models: ModelKeysInterface;
        transaction: IDBTransaction;
    };
    /**
     * Closes currently open connection to database
     */
    close(): Promise<boolean>;
}
