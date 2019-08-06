import { AggregateInterface } from "./model.interface.js";
import { TableSchema } from "../migration/migration.interface.js";
import { BaseModel } from "./base-model.js";
export declare abstract class Aggregate extends BaseModel implements AggregateInterface {
    db: IDBDatabase;
    table: TableSchema;
    constructor(db: IDBDatabase, table: TableSchema);
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
    reduce<T extends any, U extends any>(func: (value: U, result: any) => any, defaultCarry: any): Promise<T>;
    reduce<T>(func: (value: any, result: any) => any, defaultCarry: any): Promise<T>;
}
