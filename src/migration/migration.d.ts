import { MigrationInterface, TableColumn, TableSchema } from "./migration.interface.js";
export declare class Migration implements MigrationInterface {
    tables: TableSchema[];
    db: IDBDatabase;
    transaction: IDBTransaction | null;
    constructor(tables: TableSchema[], db: IDBDatabase, transaction: IDBTransaction | null);
    /**
     * Runs the migration action to update the database with new stores or deletes unwanted stored and then creates or
     * drops indexes for the stores.
     */
    run(): Promise<TableSchema[]>;
    /**
     * Creates an index in object store
     * @param column
     * @param objectStore
     */
    createIndex(column: TableColumn, objectStore: IDBObjectStore): IDBIndex;
    /**
     * Drops an index in object store
     * @param column
     * @param objectStore
     */
    dropIndex(column: string, objectStore: IDBObjectStore): boolean;
    /**
     * Creates new object store
     * @param schema
     */
    createObjectStore(schema: TableSchema): IDBObjectStore;
    /**
     * Drops existing object store
     * @param schema
     */
    dropObjectStore(schema: TableSchema): boolean;
    /**
     * Creates various indexes on object store
     * @param table
     * @param objectStore
     */
    protected createColumns(table: TableSchema, objectStore: IDBObjectStore): void;
    /**
     * Drops indexes in object store
     * @param table
     * @param objectStore
     */
    protected dropOldColumns(table: TableSchema, objectStore: IDBObjectStore): void;
    /**
     * Returns a list of all object store names which are in current database
     */
    private allStoreNames;
    /**
     * Returns all object store instances in database
     */
    listObjectStores(): IDBObjectStore[];
}
