import {Connector} from "../connection/connector.js";
import {ModelInterface, Relation} from "../models/model.interface.js";

export interface RelationInterface {
  db: IDBDatabase;

  connector: Connector;

  bindResults(parentResults: any | any[], relationResults: any[], relation: Relation): Promise<any>;

  fetch(results: any[]): Promise<any[]>;

  getLocalKey(model: ModelInterface, relation: Relation): string;

  getAttributeName(model: ModelInterface, relation: Relation): string;
}
