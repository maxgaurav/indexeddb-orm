class Builder {

    constructor () {
        this.builder = [];
        this.indexBuilder = {};
        this.relations = [];
        this.tables = [];
    }

    whereIndex(indexName, value) {

        this.indexBuilder = {
            index : indexName,
            value : value,
            type : 'and'
        };

        return this;
    }

    whereIndexIn(indexName, value) {

        this.indexBuilder = {
            index : indexName,
            value : value,
            type : 'in'
        };

        return this;
    }

    indexGte(indexName, value) {

        this.indexBuilder = {
            index : indexName,
            value : value,
            type : 'gte'
        };

        return this;
    }

    indexGt(indexName, value) {

        this.indexBuilder = {
            index : indexName,
            value : value,
            type : 'gt'
        };

        return this;
    }

    indexLte(indexName, value) {

        this.indexBuilder = {
            index : indexName,
            value : value,
            type : 'lte'
        };

        return this;
    }

    indexLt(indexName, value) {

        this.indexBuilder = {
            index : indexName,
            value : value,
            type : 'lt'
        };

        return this;
    }

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
                    if(value[attributes[i]] === undefined){
                        return undefined;
                    }

                    content = value[attributes[i]];
                }

                return content;
            }
        };

    }

    static get RELATIONS() {
        return {
            hasOne : 'hasOne',
            hasMany : 'hasMany'
        }
    }
}