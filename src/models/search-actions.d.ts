import { Aggregate } from "./aggregate.js";
import { BaseSearchActionsInterface } from "./model.interface.js";
export declare abstract class SearchActions extends Aggregate implements BaseSearchActionsInterface {
    protected abstract loadRelations(results: any[]): Promise<any>[];
    protected abstract loadCustomRelations(results: any[]): Promise<any>[];
    /**
     * Returns list of all matching records.
     */
    all<T>(): Promise<T[]>;
    /**
     * Returns fist matching record
     */
    first<T>(): Promise<T>;
    /**
     * Finds the record on primary key or returns null
     * @param id
     */
    find<T>(id: any): Promise<T | null>;
    /**
     * Finds value at index.
     * @param indexName
     * @param id
     */
    findIndex<T>(indexName: string, id: any): Promise<T>;
    /**
     * Finds all values for the index
     *
     * @param indexName
     * @param id
     */
    findAllIndex<T>(indexName: string, id: any): Promise<T[]>;
}
