import { BaseWriteActions } from "./base-write-actions.js";
import { FindOrCreateActionInterface } from "./model.interface.js";
export declare abstract class FindOrCreateActions extends BaseWriteActions implements FindOrCreateActionInterface {
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
}
