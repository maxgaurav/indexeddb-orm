import { AggregateInterface, TransactionModes } from "./model.interface.js";
import { TableSchema } from "../migration/migration.interface.js";
import { OrmRelationBuilder } from "./orm-relation-builder.js";
export declare abstract class Aggregate extends OrmRelationBuilder implements AggregateInterface {
    db: IDBDatabase;
    table: TableSchema;
    constructor(db: IDBDatabase, table: TableSchema);
    /**
     * Creates request instance to fetch/update data in database
     * @param objectStore
     */
    protected abstract request(objectStore: IDBObjectStore): IDBRequest;
    /**
     * Returns new/existing transaction instance being used by the model
     * @param stores
     * @param mode
     * @param overwrite
     */
    protected abstract getTransaction(stores: string[], mode: TransactionModes, overwrite?: boolean): IDBTransaction;
    /**
     * Returns the count of matching records
     */
    count(): Promise<number>;
    /**
     * Returns average of attribute value on matching records.
     * If value is not numeric then its skipped
     * @param attribute
     */
    average(attribute: string): Promise<number>;
    /**
     * Provides reduce action on matching records to return a single value
     * @param func
     * @param defaultCarry
     */
    reduce(func: (value: any, result: any) => any, defaultCarry: any): Promise<any>;
    reduce<T>(func: (value: any, result: any) => any, defaultCarry: any): Promise<T>;
}
