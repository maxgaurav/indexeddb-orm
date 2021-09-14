import { QueryBuilder } from './query-builder.js';
import { HasOne } from '../relations/has-one.js';
import {
  BaseModelInterface,
  ModelConstructorInterface,
  ModelInterface,
  OrmRelationBuilderInterface,
  Relation,
  RelationTypes,
} from './model.interface.js';
import { Connector } from '../connection/connector.js';
import { HasMany } from '../relations/has-many.js';
import { HasManyMulti } from '../relations/has-many-multi.js';
import { HasManyThroughMulti } from '../relations/has-many-through-multi.js';
import { TableSchema } from '../migration/migration.interface.js';

export abstract class OrmRelationBuilder
  extends QueryBuilder
  implements OrmRelationBuilderInterface, BaseModelInterface
{
  public abstract table: TableSchema;

  public abstract db: IDBDatabase;

  public abstract connector: Connector;

  /**
   * Returns has one relation
   * @param model
   * @param foreignKey
   * @param localKey
   * @param parentKeyName
   */
  hasOne(
    model: ModelConstructorInterface,
    foreignKey: string,
    localKey?: string | undefined,
    parentKeyName?: string,
  ): HasOne {
    const relation = this.convertToRelation(
      model,
      RelationTypes.HasOne,
      foreignKey,
    );

    if (localKey) {
      relation.localKey = localKey;
    }

    if (parentKeyName) {
      relation.attributeName = parentKeyName;
    }

    return new HasOne(this.db, this.connector, this, relation);
  }

  /**
   * Returns has many relation
   * @param model
   * @param foreignKey
   * @param localKey
   * @param parentKeyName
   */
  hasMany(
    model: ModelConstructorInterface,
    foreignKey: string,
    localKey?: string | undefined,
    parentKeyName?: string,
  ): HasMany {
    const relation = this.convertToRelation(
      model,
      RelationTypes.HasMany,
      foreignKey,
    );

    if (localKey) {
      relation.localKey = localKey;
    }

    if (parentKeyName) {
      relation.attributeName = parentKeyName;
    }

    return new HasMany(this.db, this.connector, this, relation);
  }

  /**
   * Returns has many multi entry relation
   * @param model
   * @param foreignKey
   * @param localKey
   * @param parentKeyName
   */
  hasManyMultiEntry(
    model: ModelConstructorInterface,
    foreignKey: string,
    localKey?: string,
    parentKeyName?: string,
  ): HasManyMulti {
    const relation = this.convertToRelation(
      model,
      RelationTypes.HasManyMultiEntry,
      foreignKey,
    );

    if (localKey) {
      relation.localKey = localKey;
    }

    if (parentKeyName) {
      relation.attributeName = parentKeyName;
    }

    return new HasManyMulti(this.db, this.connector, this, relation);
  }

  /**
   * Returns relation has many through multi entry relation
   * @param model
   * @param foreignKey
   * @param localKey
   * @param parentKeyName
   */
  hasManyThroughMultiEntry(
    model: ModelConstructorInterface,
    foreignKey: string,
    localKey?: string,
    parentKeyName?: string,
  ): HasManyThroughMulti {
    const relation = this.convertToRelation(
      model,
      RelationTypes.HasManyThroughMultiEntry,
      foreignKey,
    );

    if (localKey) {
      relation.localKey = localKey;
    }

    if (parentKeyName) {
      relation.attributeName = parentKeyName;
    }

    return new HasManyThroughMulti(this.db, this.connector, this, relation);
  }

  public convertToRelation(
    modelConstructor: ModelConstructorInterface,
    type: RelationTypes,
    foreignKey: string,
  ): Relation {
    const model = this.newModel(modelConstructor);
    return { model, type, foreignKey };
  }

  private newModel(
    modelConstructor: ModelConstructorInterface,
  ): ModelInterface {
    const table = this.connector.migrationSchema.tables.find(
      (tableSchema) => tableSchema.name === modelConstructor.TableName,
    );

    if (!table) {
      throw new Error('Table schema not found');
    }

    return new modelConstructor(this.db, table, this.connector);
  }
}
