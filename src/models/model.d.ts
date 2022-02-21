import { ModelInterface, ModelKeysInterface, TransactionModes } from "./model.interface.js";
import { TableSchema } from "../migration/migration.interface.js";
import { Connector } from "../connection/connector.js";
import { FindOrCreateActions } from "./find-or-create-actions.js";
export declare class Model extends FindOrCreateActions implements ModelInterface {
    db: IDBDatabase;
    table: TableSchema;
    connector: Connector;
    protected transaction: IDBTransaction | null;
    constructor(db: IDBDatabase, table: TableSchema, connector: Connector);
    /**
     * Syncs data at primary index and returns newly updated record
     * @param id
     * @param data
     * @param mergeDeep [Defaults true]
     */
    sync<T>(id: any, data: any, mergeDeep?: boolean): Promise<T>;
    /**
     * Syncs data at index and returns newly updated record
     * @param indexName
     * @param id
     * @param data
     * @param mergeDeep [Defaults true]
     */
    syncIndex<T>(indexName: string, id: any, data: any, mergeDeep?: boolean): Promise<T>;
    /**
     * Syncs data at index and returns newly updated record
     * @param indexName
     * @param id
     * @param data
     * @param mergeDeep [Defaults true]
     */
    syncAllIndex<T>(indexName: string, id: any, data: any, mergeDeep?: boolean): Promise<T[]>;
    /**
     * Opens new transaction for all models and returns transaction instance
     * @param mode
     */
    openTransaction(mode: TransactionModes): {
        models: ModelKeysInterface;
        transaction: IDBTransaction;
    };
    /**
     * Loads relations against the model results
     *
     * @param results
     */
    protected loadRelations(results: any[]): Promise<any>[];
    /**
     * The primary key of the model
     */
    get primaryId(): string;
    /**
     * Loads custom relation created in the ORM classes extending the base model class
     * @param results
     */
    protected loadCustomRelations(results: any[]): Promise<any>[];
    /**
     * Adds sync column if table requires to have sync date
     * @param data
     */
    private syncObj;
}
