export class RelationBuilder {
    constructor() {
        /**
         * Array of relations to be loaded
         */
        this.relations = [];
        /**
         * Custom relations list
         */
        this.customRelations = [];
    }
    /**
     * Returns list of childRelation tables required by the model action
     * @param tables
     */
    tableNames(tables) {
        return tables.map(table => table.name);
    }
    /**
     * Adds childRelation to be fetched
     * @param relations
     */
    with(relations) {
        // first filtering existing relations for same table
        const filteredRelations = this.relations.filter(relation => !relations.find(newRelation => newRelation.model === relation.model));
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
    relation(modelName, type, localKey, foreignKey, func) {
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
    withCustom(relations) {
        const filteredRelations = this.customRelations.filter(relation => !relations.find(newRelation => newRelation === relation));
        this.customRelations = filteredRelations.concat(relations);
        return this;
    }
}
//# sourceMappingURL=relation.builder.js.map