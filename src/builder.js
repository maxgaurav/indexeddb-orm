class Builder {

    constructor () {
        this.builder = [];
        this.indexBuilder = {};
        this.relations = [];
        this.tables = [];
    }

    /**
     * Sets the index builder value as an 'and' reference
     *
     * @param indexName string
     * @param value mixed
     * @returns {Builder}
     */
    whereIndex(indexName, value) {

        this.indexBuilder = {
            index : indexName,
            value : value,
            type : 'and'
        };

        return this;
    }

    /**
     * Sets the index builder value as an 'in' reference
     * @param indexName
     * @param value
     * @returns {Builder}
     */
    whereIndexIn(indexName, value) {

        this.indexBuilder = {
            index : indexName,
            value : value,
            type : 'in'
        };

        return this;
    }

    /**
     * Sets the index builder value with point inclusive and sets greater than check
     * @param indexName
     * @param value
     * @returns {Builder}
     */
    indexGte(indexName, value) {

        this.indexBuilder = {
            index : indexName,
            value : value,
            type : 'gte'
        };

        return this;
    }

    /**
     * Sets the index builder value with point not inclusive and sets greater than check
     * @param indexName
     * @param value
     * @returns {Builder}
     */
    indexGt(indexName, value) {

        this.indexBuilder = {
            index : indexName,
            value : value,
            type : 'gt'
        };

        return this;
    }

    /**
     * Sets the index builder value with point inclusive and sets less than check
     * @param indexName
     * @param value
     * @returns {Builder}
     */
    indexLte(indexName, value) {

        this.indexBuilder = {
            index : indexName,
            value : value,
            type : 'lte'
        };

        return this;
    }

    /**
     * Sets the index builder value with point not inclusive and sets less than check
     *
     * @param indexName
     * @param value
     * @returns {Builder}
     */
    indexLt(indexName, value) {

        this.indexBuilder = {
            index : indexName,
            value : value,
            type : 'lt'
        };

        return this;
    }

    /**
     * Sets the index builder value with points inclusive and sets range between them
     * @param indexName
     * @param lower
     * @param upper
     * @returns {Builder}
     */
    indexBetween(indexName, lower, upper) {

        this.indexBuilder = {
            index : indexName,
            value : [lower, upper],
            type : 'between'
        };

        return this;
    }

    whereIn(attributeName, value) {
        this.builder.push({
            attribute : attributeName,
            value : value,
            type : 'in'
        });

        return this;
    }

    where(attributeName, value) {
        this.builder.push({
            attribute : attributeName,
            value : value,
            type : 'and'
        });

        return this;
    }


    gte(attributeName, value) {
        this.builder.push({
            attribute : attributeName,
            value : value,
            type : 'gte'
        });

        return this;
    }

    gt(attributeName, value) {
        this.builder.push({
            attribute : attributeName,
            value : value,
            type : 'gt'
        });

        return this;
    }

    lte(attributeName, value) {
        this.builder.push({
            attribute : attributeName,
            value : value,
            type : 'lte'
        });

        return this;
    }

    lt(attributeName, value) {
        this.builder.push({
            attribute : attributeName,
            value : value,
            type : 'lt'
        });

        return this;
    }

    between(attributeName, upper, lower) {
        uppper = parseFloat(upper);
        lower = parseFloat(lower);

        if(isNaN(upper) || isNaN(lower)){
            throw "Between is only for numeric values";
        }

        this.builder.push({
            attribute : attributeName,
            value : [upper, lower],
            type : 'between'
        });

        return this;
    }

    relation(modelName, type, localKey, foreignKey, func, primary) {
        this.tables.push(modelName);

        this.relations.push({
            modelName : modelName,
            func : func,
            localKey : localKey,
            foreignKey : foreignKey,
            type : type,
            primary : primary
        });

        return this;
    }

    static get helpers() {

        return {

            checkNestedAttribute (attributeString, value, condition) {
                return condition == Model.helpers.getNestedAttribute(attributeString, value)
            },

            getNestedAttribute(attributeString, value) {
                let attributes = attributeString.split('.');
                let i;
                let content = value;

                for(i = 0; i < attributes.length; i++) {
                    if(content[attributes[i]] === undefined){
                        return undefined;
                    }

                    content = content[attributes[i]];
                }

                return content;
            },

            replaceNestedValues(attributes, value) {
                for(let attribute in attributes) {
                    value[attribute] = attributes[attribute];
                }

                return value;
            },
        };

    }

    static get RELATIONS() {
        return {
            hasOne : 'hasOne',
            hasMany : 'hasMany'
        }
    }
}