import {Relations} from "./relations.js";
import {ModelInterface, Relation} from "../models/model.interface.js";
import {Connector} from "../connection/connector.js";

export class HasManyThroughMulti extends Relations {
  constructor(
    public db: IDBDatabase,
    public connector: Connector,
    protected parentModel: ModelInterface,
    public relation: Relation
  ) {
    super();
  }

  public async fetch(results: any[]): Promise<any[]> {
    let model = this.getRelationModel(this.relation);
    model = this.filteredModel(model, this.relation);

    const values = results.reduce(
      (carry: any[], result) => carry.concat(result[this.getLocalKey(this.parentModel, this.relation)]), []
    );
    model.whereIndexIn(this.relation.foreignKey, values);

    const relationResults = await model.all();

    return this.bindResults(results, relationResults, this.relation);
  }

  public bindResults(parentResults: any[], relationResults: any[], relation: Relation): Promise<any> {
    const localKey = this.getLocalKey(this.parentModel, this.relation);

    parentResults.forEach(parentResult => {
      parentResult[this.getRelationModel(relation).table.name] = relationResults.filter(
        (relationResult: any) => !!parentResult[localKey].find(
          (multiValue: any) => multiValue === relationResult[relation.foreignKey]
        )
      );
    });

    return Promise.resolve(parentResults);
  }
}
