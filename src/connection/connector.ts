import {ConnectorInterface} from "./connector.interface.js";
import {Database} from "../migration/migration.interface.js";
import {DBSuccessEvent, DBVersionChangeEvent} from "./idb-event.interface.js";
import {WindowInterface} from "../window.interface.js";
import {Migration} from "../migration/migration.js";

declare let window: WindowInterface;

export class Connector implements ConnectorInterface {

  public dbOpenConnection: IDBOpenDBRequest | null = null;

  public constructor(private migrationSchema: Database) {
  }

  /**
   * Create/Update and connect the database
   */
  public connect(): Promise<any> {
    this.dbOpenConnection = this.indexedDB().open(this.migrationSchema.name, this.migrationSchema.version);
    this.dbOpenConnection.addEventListener('success', (event) => this.completeHandler(event as DBSuccessEvent));
    this.dbOpenConnection.addEventListener('error', (event) => this.errorHandler(event as ErrorEvent));
    this.dbOpenConnection.addEventListener('upgradeneeded', async (event) => {
      await this.migrateHandler(event as DBVersionChangeEvent);
    });

    return Promise.resolve('');
  }

  public destroy(): Promise<boolean> {
    const request = this.indexedDB().deleteDatabase(this.migrationSchema.name);
    return new Promise((resolve, reject) => {
      request.addEventListener('success', () => resolve(true));
      request.addEventListener('error', (e) => reject(e));
    });

  }

  public indexedDB(): IDBFactory {
    return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  }

  public async migrateHandler(event: DBVersionChangeEvent): Promise<boolean> {
    const migration = new Migration(this.migrationSchema.tables, event.target.result, event.target.transaction);
    this.migrationSchema.tables = await migration.run();
    return true;
  }

  protected errorHandler(event: ErrorEvent) {
    // @todo handle error
  }

  protected completeHandler(event: DBSuccessEvent) {

  }
}
