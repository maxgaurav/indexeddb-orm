import {
  ModelInterface,
  QueryBuilderInterface,
  Relation,
  RelationQueryBuilder,
  RelationTypes,
} from './model.interface.js';
import { TableSchema } from '../migration/migration.interface.js';

export abstract class RelationBuilder implements RelationQueryBuilder {
  /**
   * Array of relations to be loaded
   */
  public relations: Relation[] = [];

  /**
   * Custom relations list
   */
  public customRelations: string[] = [];

  /**
   * Returns list of childRelation tables required by the model action
   * @param tables
   */
  public tableNames(tables: TableSchema[]): string[] {
    return tables.map((table) => table.name);
  }

  /**
   * Adds childRelation to be fetched
   * @param relations
   */
  public with(
    relations: (Relation | string)[],
  ): RelationQueryBuilder | ModelInterface {
    // first filtering existing relations for same table

    for (const relation of relations) {
      if (typeof relation === 'string') {
        this.withCustom(relation);
      }

      if (typeof relation === 'object') {
        this.withRelation(relation);
      }
    }

    return this;
  }

  /**
   * Maps the relation in main relation list
   * @param relation
   * @protected
   */
  protected withRelation(
    relation: Relation,
  ): RelationQueryBuilder | ModelInterface {
    const filteredRelations = this.relations.filter(
      (existingRelation) => (existingRelation.model = relation.model),
    );
    this.relations = filteredRelations.concat([relation]);

    return this;
  }

  /**
   * Adds childRelation to be fetched
   *
   * @deprecated
   * @param modelName
   * @param type
   * @param localKey
   * @param foreignKey
   * @param func
   */
  public relation(
    modelName: string,
    type: RelationTypes,
    localKey: string,
    foreignKey: string,
    func?: (builder: QueryBuilderInterface) => QueryBuilderInterface,
  ): RelationQueryBuilder | ModelInterface {
    const index = this.relations.findIndex(
      (relation) => relation.model === modelName,
    );

    if (index !== -1) {
      this.relations.splice(index, 1);
    }

    this.relations.push({
      model: modelName,
      type,
      localKey,
      foreignKey,
      func,
    });

    return this;
  }

  /**
   * Adds custom relation
   * @param relation
   */
  protected withCustom(
    relation: string,
  ): RelationQueryBuilder | ModelInterface {
    const filteredRelations = this.customRelations.filter(
      (existingRelation) => existingRelation === relation,
    );
    this.customRelations = filteredRelations.concat([relation]);

    return this;
  }
}
