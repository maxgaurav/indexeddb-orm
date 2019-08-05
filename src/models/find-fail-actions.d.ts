import { SearchActions } from "./search-actions.js";
export declare abstract class FindFailActions extends SearchActions {
    /**
     * Returns fist matching record or throws NotFound exception
     * @throws NotFound
     */
    firstOrFail<T>(): Promise<T>;
    /**
     * Finds the record on primary key or throws error
     * @param id
     * @throws NotFound
     */
    findOrFail<T>(id: any): Promise<T | null>;
    /**
     * Finds value at index or throws NotFound exception.
     * @param indexName
     * @param id
     * @throws NotFound
     */
    findIndexOrFail<T>(indexName: string, id: any): Promise<T>;
}
