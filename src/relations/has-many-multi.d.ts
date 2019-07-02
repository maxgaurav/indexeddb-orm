import { Relations } from "./relations.js";
import { Connector } from "../connection/connector.js";
import { ModelInterface, Relation } from "../models/model.interface.js";
export declare class HasManyMulti extends Relations {
    db: IDBDatabase;
    connector: Connector;
    protected parentModel: ModelInterface;
    childRelation: Relation;
    constructor(db: IDBDatabase, connector: Connector, parentModel: ModelInterface, childRelation: Relation);
    fetch(results: any[]): Promise<any[]>;
    bindResults(parentResults: any[], relationResults: any[], relation: Relation): Promise<any>;
}
