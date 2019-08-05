import { TransactionHandling } from "./transaction-handling.js";
export class BaseModel extends TransactionHandling {
    /**
     * Opens IDBRequest to perform action on object store
     * @param objectStore
     */
    request(objectStore) {
        const direction = this.cursor || undefined;
        if (this.indexBuilder) {
            const keyRange = this.keyRange(this.indexBuilder);
            const cursor = this.indexBuilder.index !== this.primaryId ? objectStore.index(this.indexBuilder.index) : objectStore;
            return cursor.openCursor(keyRange, direction);
        }
        else {
            return objectStore.openCursor(undefined, direction);
        }
    }
}
//# sourceMappingURL=base-model.js.map