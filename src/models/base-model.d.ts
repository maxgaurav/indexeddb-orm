import { TransactionHandling } from "./transaction-handling.js";
import { TableSchema } from "../migration/migration.interface.js";
export declare abstract class BaseModel extends TransactionHandling {
    abstract table: TableSchema;
    abstract get primaryId(): string;
    /**
     * Opens IDBRequest to perform action on object store
     * @param objectStore
     */
    protected request(objectStore: IDBObjectStore): IDBRequest;
}
