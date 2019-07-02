import { Relations } from "./relations.js";
export class HasManyThroughMulti extends Relations {
    constructor(db, connector, parentModel, childRelation) {
        super();
        this.db = db;
        this.connector = connector;
        this.parentModel = parentModel;
        this.childRelation = childRelation;
    }
    async fetch(results) {
        let model = this.getRelationModel(this.childRelation);
        model = this.filteredModel(model, this.childRelation);
        const values = results.reduce((carry, result) => carry.concat(result[this.getLocalKey(this.parentModel, this.childRelation)]), []);
        model.whereIndexIn(this.childRelation.foreignKey, values);
        const relationResults = await model.all();
        return this.bindResults(results, relationResults, this.childRelation);
    }
    bindResults(parentResults, relationResults, relation) {
        const localKey = this.getLocalKey(this.parentModel, this.childRelation);
        parentResults.forEach(parentResult => {
            parentResult[this.getAttributeName(this.parentModel, relation)] = relationResults.filter((relationResult) => !!parentResult[localKey].find((multiValue) => multiValue === relationResult[relation.foreignKey]));
        });
        return Promise.resolve(parentResults);
    }
}
//# sourceMappingURL=has-many-through-multi.js.map