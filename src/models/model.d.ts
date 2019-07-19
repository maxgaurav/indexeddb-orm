import { ModelInterface, ModelKeysInterface, TransactionModes } from "./model.interface.js";
import { Aggregate } from "./aggregate.js";
import { TableSchema } from "../migration/migration.interface.js";
import { Connector } from "../connection/connector.js";
export declare class Model extends Aggregate implements ModelInterface {
    db: IDBDatabase;
    table: TableSchema;
    connector: Connector;
    private transaction;
    constructor(db: IDBDatabase, table: TableSchema, connector: Connector);
    /**
     * Returns list of all matching records.
     */
    all<T>(): Promise<T[]>;
    /**
     * Returns fist matching record
     */
    first<T>(): Promise<T>;
    /**
     * Returns fist matching record or throws NotFound exception
     * @throws NotFound
     */
    firstOrFail<T>(): Promise<T>;
    /**
     * Finds the record on primary key or returns null
     * @param id
     */
    find<T>(id: any): Promise<T | null>;
    /**
     * Finds the record on primary key or throws error
     * @param id
     * @throws NotFound
     */
    findOrFail<T>(id: any): Promise<T | null>;
    /**
     * Finds value at index.
     * @param indexName
     * @param id
     */
    findIndex<T>(indexName: string, id: any): Promise<T>;
    /**
     * Finds value at index or throws NotFound exception.
     * @param indexName
     * @param id
     * @throws NotFound
     */
    findIndexOrFail<T>(indexName: string, id: any): Promise<T>;
    /**
     * Finds all values for the index
     *
     * @param indexName
     * @param id
     */
    findAllIndex<T>(indexName: string, id: any): Promise<T[]>;
    /**
     * Creates new record entry
     * @param data
     */
    create<T>(data: any): Promise<T>;
    /**
     * Creates multiple record entry by passing array of entries to be created
     * @param entries
     */
    createMultiple<T>(entries: any[]): Promise<T[]>;
    /**
     * Finds the first record else creates the record with accordance to builder provided for filtering
     * @param data
     * @throws InvalidTransaction
     */
    firstOrCreate<T>(data: any): Promise<T>;
    /**
     * Finds the record at primary key else creates the record
     * @param id
     * @param data
     * @throws InvalidTransaction
     */
    findOrCreate<T>(id: any, data: any): Promise<T>;
    /**
     * Finds the record at index else creates the record
     * @param indexName
     * @param id
     * @param data
     * @throws InvalidTransaction
     */
    findIndexOrCreate<T>(indexName: string, id: any, data: any): Promise<T>;
    /**
     * Deletes matching entry.
     * If no builder/index for filtering is provided then throws error.
     */
    destroy(): Promise<boolean>;
    /**
     * Delete record at id of primary key
     * @param id
     */
    delete(id: any): Promise<boolean>;
    /**
     * Delete records matching index.
     * @param indexName
     * @param value
     * @param isMulti
     */
    deleteIndex(indexName: string, value: any, isMulti?: boolean): Promise<boolean>;
    /**
     * Clears entire object store
     */
    truncate(): Promise<boolean>;
    /**
     * Delete record at id
     *
     * @deprecated
     * @param id
     */
    destroyId(id: any): Promise<boolean>;
    /**
     * Updates all matching records.
     * By default deep merges the input data with existing data records.
     * @param data
     * @param mergeDeep
     */
    update(data: any, mergeDeep?: boolean): Promise<number>;
    /**
     * Updates the records at id
     * By default deep merges the input data with existing data record.
     *
     * @param id
     * @param data
     * @param mergeDeep
     * @throws NotFound
     */
    save(id: any, data: any, mergeDeep?: boolean): Promise<any>;
    /**
     * Retrieves current transaction and if ne transaction exists then creates new one.
     *
     * @param stores
     * @param mode
     * @param overwrite
     */
    getTransaction(stores: string[], mode: TransactionModes, overwrite?: boolean): IDBTransaction;
    /**
     * Sets transaction for the model
     * @param transaction
     */
    setTransaction(transaction: IDBTransaction): void;
    /**
     * Creates new transaction
     * @param stores
     * @param mode
     */
    createTransaction(stores: string[], mode: TransactionModes): IDBTransaction;
    /**
     * Opens new transaction for all models and returns transaction instance
     * @param mode
     */
    openTransaction(mode: TransactionModes): {
        models: ModelKeysInterface;
        transaction: IDBTransaction;
    };
    /**
     * Opens IDBRequest to perform action on object store
     * @param objectStore
     */
    protected request(objectStore: IDBObjectStore): IDBRequest;
    /**
     * Loads relations against the model results
     *
     * @param results
     */
    protected loadRelations(results: any[]): Promise<any>[];
    /**
     * The primary key of the model
     */
    readonly primaryId: string;
    protected loadCustomRelations(results: any[]): Promise<any>[];
}
