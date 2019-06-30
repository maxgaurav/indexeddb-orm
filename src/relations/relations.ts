import {ModelInterface, Relation, RelationInterface} from "../models/model.interface.js";
import {Model} from "../models/model.js";
import {QueryBuilder} from "../models/query-builder.js";
import {Connector} from "../connection/connector.js";

export abstract class Relations implements RelationInterface {

  public abstract db: IDBDatabase;

  public abstract connector: Connector;

  public abstract relation: Relation;

  public abstract bindResults(parentResults: any | any[], relationResults: any[], relation: Relation): Promise<any>;

  public abstract get(results: any[]): Promise<any[]>;

  public filteredModel(model: ModelInterface, relation: Relation): ModelInterface {
    const builder = new QueryBuilder();

    if (relation.func) {
      const query = relation.func(builder);

      model.builder = query.builder;
      model.relations = query.relations;
    }

    return model;
  }

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

  public getLocalKey(model: ModelInterface, relation: Relation): string {
    const primaryKey = model.table.primary || '_id';
    return relation.localKey ? relation.localKey : primaryKey;
  }
}
