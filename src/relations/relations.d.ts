import { ModelInterface, Relation, RelationInterface } from "../models/model.interface.js";
import { Connector } from "../connection/connector.js";
export declare abstract class Relations implements RelationInterface {
    /**
     * IDBDatabase
     */
    abstract db: IDBDatabase;
    /**
     * Connection instance
     */
    abstract connector: Connector;
    /**
     * Relation object defining the relation to parent model
     */
    abstract relation: Relation;
    /**
     * Binds relation result to parent result.
     * @param parentResults
     * @param relationResults
     * @param relation
     */
    abstract bindResults(parentResults: any | any[], relationResults: any[], relation: Relation): Promise<any>;
    /**
     * Fetches relation results
     * @param results
     */
    abstract fetch(results: any[]): Promise<any[]>;
    /**
     * Sets builder values created through callback function
     * @param model
     * @param relation
     */
    filteredModel(model: ModelInterface, relation: Relation): ModelInterface;
    /**
     * Retrieves th relation model instance
     * @param relation
     */
    getRelationModel(relation: Relation): ModelInterface;
    /**
     * Retrieves the local key of parent model
     * @param model
     * @param relation
     */
    getLocalKey(model: ModelInterface, relation: Relation): string;
}
