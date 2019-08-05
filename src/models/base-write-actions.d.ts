import { FindFailActions } from "./find-fail-actions.js";
import { BaseWriteActionsInterface } from "./model.interface.js";
export declare abstract class BaseWriteActions extends FindFailActions implements BaseWriteActionsInterface {
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
    save(id: any, data: any, mergeDeep?: boolean): Promise<boolean>;
    /**
     * Updates all matching records at index
     * By default deep merges the input data with existing data record.
     *
     * @param indexName
     * @param id
     * @param data
     * @param mergeDeep
     * @throws NotFound
     */
    saveIndex(indexName: string, id: any, data: any, mergeDeep?: boolean): Promise<boolean>;
    /**
     * Updates all matching records at index
     * By default deep merges the input data with existing data record.
     *
     * @param indexName
     * @param id
     * @param data
     * @param mergeDeep
     * @throws NotFound
     */
    saveAllIndex(indexName: string, id: any, data: any, mergeDeep?: boolean): Promise<boolean>;
}
