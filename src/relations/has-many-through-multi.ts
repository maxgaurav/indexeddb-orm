import {Relations} from "./relations.js";
import {ModelInterface, Relation} from "../models/model.interface.js";
import {Connector} from "../connection/connector.js";

export class HasManyThroughMulti extends Relations {
  constructor(
    public db: IDBDatabase,
    public connector: Connector,
    protected parentModel: ModelInterface,
    public childRelation: Relation
  ) {
    super();
  }

  public async fetch(results: any[]): Promise<any[]> {
    let model = this.getRelationModel(this.childRelation);
    model = this.filteredModel(model, this.childRelation);

    const values = results.reduce(
      (carry: any[], result) => carry.concat(result[this.getLocalKey(this.parentModel, this.childRelation)]), []
    );
    model.whereIndexIn(this.childRelation.foreignKey, values);

    const relationResults = await model.all();

    return this.bindResults(results, relationResults, this.childRelation);
  }

  public bindResults(parentResults: any[], relationResults: any[], relation: Relation): Promise<any> {
    const localKey = this.getLocalKey(this.parentModel, this.childRelation);

    parentResults.forEach(parentResult => {
      parentResult[this.getAttributeName(this.parentModel, relation)] = relationResults.filter(
        (relationResult: any) => !!parentResult[localKey].find(
          (multiValue: any) => multiValue === relationResult[relation.foreignKey]
        )
      );
    });

    return Promise.resolve(parentResults);
  }
}
