import { Relations } from "./relations.js";
import { Connector } from "../connection/connector.js";
import { ModelInterface, Relation } from "../models/model.interface.js";
export declare class HasMany extends Relations {
    db: IDBDatabase;
    connector: Connector;
    protected parentModel: ModelInterface;
    childRelation: Relation;
    constructor(db: IDBDatabase, connector: Connector, parentModel: ModelInterface, childRelation: Relation);
    /**
     * Fetch relation results
     * @param results
     */
    fetch(results: any[]): Promise<any>;
    /**
     * Bind relation results to parent results
     * @param parentResults
     * @param relationResults
     * @param relation
     */
    bindResults(parentResults: any[], relationResults: any, relation: Relation): Promise<any>;
}
