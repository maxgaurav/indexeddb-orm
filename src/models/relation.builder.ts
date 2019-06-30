import {
  ModelInterface,
  QueryBuilderInterface,
  Relation,
  RelationQueryBuilder,
  RelationTypes
} from "./model.interface.js";
import {Model} from "./model.js";
import {QueryBuilder} from "./query-builder.js";

export class RelationBuilder implements RelationQueryBuilder {

  public relations: Relation[] = [];

  public relationTables(relations: Relation[]): string[] {

    let tables: string[] = [];

    for (const relation of relations) {
      let tableName = '';
      if (relation.model instanceof Model) {
        tableName = relation.model.table.name;
      } else {
        tableName = <string>relation.model;
      }

      tables.push(tableName);
      if (relation.func) {
        const builder = relation.func(new QueryBuilder());
        tables = tables.concat(this.relationTables(builder.relations));
      }
    }

    return tables;
  }

  public relationTableName(model: ModelInterface | string): string {
    if (model instanceof Model) {
      return model.table.name;
    }

    return <string>model;
  }

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

}
