import { Relations } from "./relations.js";
import { ModelInterface, Relation } from "../models/model.interface.js";
import { Connector } from "../connection/connector.js";
export declare class HasManyThroughMulti extends Relations {
    db: IDBDatabase;
    connector: Connector;
    protected parentModel: ModelInterface;
    childRelation: Relation;
    constructor(db: IDBDatabase, connector: Connector, parentModel: ModelInterface, childRelation: Relation);
    fetch(results: any[]): Promise<any[]>;
    bindResults(parentResults: any[], relationResults: any[], relation: Relation): Promise<any>;
}
