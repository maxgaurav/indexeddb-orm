import {TransactionHandling} from "./transaction-handling.js";
import {TableSchema} from "../migration/migration.interface.js";

export abstract class BaseModel extends TransactionHandling {

  public abstract table: TableSchema;

  public abstract get primaryId(): string;

  /**
   * Opens IDBRequest to perform action on object store
   * @param objectStore
   */
  protected request(objectStore: IDBObjectStore): IDBRequest {
    const direction = this.cursor || undefined;

    if (this.indexBuilder) {
      const keyRange = this.keyRange(this.indexBuilder);
      const cursor = this.indexBuilder.index !== this.primaryId ? objectStore.index(this.indexBuilder.index) : objectStore;
      return cursor.openCursor(keyRange, direction);
    } else {
      return objectStore.openCursor(undefined, direction);
    }
  }

}
