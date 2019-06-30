import {Database} from "./migration/migration.interface.js";
import {Connector} from "./connection/connector.js";
import {CursorDirection, RelationTypes} from "./models/model.interface.js";

export interface WindowInterface extends Window {
  msIndexedDB: IDBFactory;
  webkitIndexedDB: IDBFactory;
  mozIndexedDB: IDBFactory;
  idb: (schema: Database) => Connector;
  idbTypes: {
    RelationTypes: {[key: string]: RelationTypes},
    CursorTypes: {[key: string]: CursorDirection}
  };
}
