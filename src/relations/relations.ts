import {DEFAULT_PRIMARY_ID, ModelInterface, Relation, RelationInterface} from "../models/model.interface.js";
import {Model} from "../models/model.js";
import {QueryBuilder} from "../models/query-builder.js";
import {Connector} from "../connection/connector.js";

export abstract class Relations implements RelationInterface {

  /**
   * IDBDatabase
   */
  public abstract db: IDBDatabase;

  /**
   * Connection instance
   */
  public abstract connector: Connector;

  /**
   * Relation object defining the relation to parent model
   */
  public abstract relation: Relation;

  /**
   * Binds relation result to parent result.
   * @param parentResults
   * @param relationResults
   * @param relation
   */
  public abstract bindResults(parentResults: any | any[], relationResults: any[], relation: Relation): Promise<any>;

  /**
   * Fetches relation results
   * @param results
   */
  public abstract fetch(results: any[]): Promise<any[]>;

  /**
   * Sets builder values created through callback function
   * @param model
   * @param relation
   */
  public filteredModel(model: ModelInterface, relation: Relation): ModelInterface {
    const builder = new QueryBuilder();

    if (relation.func) {
      const query = relation.func(builder);

      model.builder = query.builder;
      model.relations = query.relations;
    }

    return model;
  }

  /**
   * Retrieves th relation model instance
   * @param relation
   */
  public getRelationModel(relation: Relation): ModelInterface {
    let model: ModelInterface;

    if (relation.model instanceof String) {
      const tableSchema = this.connector.migrationSchema.tables.find(table => table.name === relation.model);
      if (!tableSchema) {
        throw new Error('Table schema not found');
      }

      model = new Model(this.db, tableSchema, this.connector);
    } else {
      model = <ModelInterface>relation.model;
    }

    return model;
  }

  /**
   * Retrieves the local key of parent model
   * @param model
   * @param relation
   */
  public getLocalKey(model: ModelInterface, relation: Relation): string {
    const primaryKey = model.table.primary || DEFAULT_PRIMARY_ID;
    return relation.localKey ? relation.localKey : primaryKey;
  }
}
