import {
  BaseModelInterface,
  DEFAULT_PRIMARY_ID,
  ModelInterface,
  QueryBuilderInterface,
  Relation,
} from '../models/model.interface.js';
import { Model } from '../models/model.js';
import { QueryBuilder } from '../models/query-builder.js';
import { Connector } from '../connection/connector.js';
import { RelationInterface } from './relation.interface.js';

export abstract class Relations
  extends QueryBuilder
  implements RelationInterface, QueryBuilderInterface
{
  /**
   * IDBDatabase
   */
  public abstract db: IDBDatabase;

  /**
   * Connection instance
   */
  public abstract connector: Connector;

  /**
   * Binds childRelation result to parent result.
   * @param parentResults
   * @param relationResults
   * @param relation
   */
  public abstract bindResults(
    parentResults: any | any[],
    relationResults: any[],
    relation: Relation,
  ): Promise<any>;

  /**
   * Fetches childRelation results
   * @param results
   */
  public abstract fetch(results: any[]): Promise<any[]>;

  /**
   * Sets builder values created through callback function
   * @param model
   * @param relation
   */
  public filteredModel(
    model: ModelInterface,
    relation: Relation,
  ): ModelInterface {
    model = this.bindBuilder(model);
    const builder = new QueryBuilder();

    if (relation.func) {
      const query = relation.func(builder);
      model.builder = model.builder.concat(query.builder);
      model.with(builder.relations);
    }

    return model;
  }

  public bindBuilder(model: ModelInterface): ModelInterface {
    model.builder = model.builder.concat(this.builder);
    model.with(this.relations);
    return model;
  }

  /**
   * Retrieves th childRelation model instance
   * @param relation
   */
  public getRelationModel(relation: Relation): ModelInterface {
    let model: ModelInterface;

    if (typeof relation.model === 'string') {
      const tableSchema = this.connector.migrationSchema.tables.find(
        (table) => table.name === relation.model,
      );
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
  public getLocalKey(model: BaseModelInterface, relation: Relation): string {
    const primaryKey = model.table.primary || DEFAULT_PRIMARY_ID;
    return relation.localKey ? relation.localKey : primaryKey;
  }

  /**
   * Returns the attribute name by which childRelation is to be attached with parent model
   * @param model
   * @param relation
   */
  public getAttributeName(
    model: BaseModelInterface,
    relation: Relation,
  ): string {
    return relation.attributeName || model.table.name;
  }
}
