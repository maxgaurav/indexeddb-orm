import {
  ModelInterface,
  QueryBuilderInterface,
  Relation,
  RelationQueryBuilder,
  RelationTypes
} from "./model.interface.js";
import {Model} from "./model.js";
import {QueryBuilder} from "./query-builder.js";
import {Connector} from "../connection/connector.js";
import {TableSchema} from "../migration/migration.interface.js";

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
    return tables.map(table => table.name);
  }

  /**
   * Adds childRelation to be fetched
   * @param relations
   */
  public with(relations: Relation[]): RelationQueryBuilder | ModelInterface {
    // first filtering existing relations for same table

    const filteredRelations = this.relations.filter(
      relation => !relations.find(
        newRelation => newRelation.model === relation.model)
    );
    this.relations = filteredRelations.concat(relations);

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
    modelName: string, type: RelationTypes, localKey: string, foreignKey: string, func?: (builder: QueryBuilderInterface) => QueryBuilderInterface
  ): RelationQueryBuilder | ModelInterface {

    const index = this.relations.findIndex(relation => relation.model === modelName);

    if (index !== -1) {
      this.relations.splice(index, 1);
    }

    this.relations.push({
      model: modelName,
      type,
      localKey,
      foreignKey,
      func
    });

    return this;
  }

  /**
   * Adds custom relations
   * @param relations
   */
  public withCustom(relations: string[]): RelationQueryBuilder | ModelInterface {
    const filteredRelations = this.customRelations.filter(
      relation => !relations.find(
        newRelation => newRelation === relation)
    );
    this.customRelations = filteredRelations.concat(relations);

    return this;
  }
}
