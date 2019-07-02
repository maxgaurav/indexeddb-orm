import { Relations } from "./relations.js";
export class HasMany extends Relations {
    constructor(db, connector, parentModel, childRelation) {
        super();
        this.db = db;
        this.connector = connector;
        this.parentModel = parentModel;
        this.childRelation = childRelation;
    }
    /**
     * Fetch relation results
     * @param results
     */
    async fetch(results) {
        let model = this.getRelationModel(this.childRelation);
        model = this.filteredModel(model, this.childRelation);
        const values = results.map(result => result[this.getLocalKey(this.parentModel, this.childRelation)]);
        model.whereIndexIn(this.childRelation.foreignKey, values);
        const relationResults = await model.all();
        return this.bindResults(results, relationResults, this.childRelation);
    }
    /**
     * Bind relation results to parent results
     * @param parentResults
     * @param relationResults
     * @param relation
     */
    bindResults(parentResults, relationResults, relation) {
        const localKey = this.getLocalKey(this.parentModel, this.childRelation);
        parentResults.forEach(parentResult => {
            parentResult[this.getAttributeName(this.parentModel, relation)] = relationResults.filter((relationResult) => relationResult[relation.foreignKey] === parentResult[localKey]);
        });
        return Promise.resolve(parentResults);
    }
}
//# sourceMappingURL=has-many.js.map