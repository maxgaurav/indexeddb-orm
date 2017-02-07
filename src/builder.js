class Builder {

    constructor () {
        this.builder = [];
        this.indexBuilder = {};
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
        this.builder.push({
            attribute : attributeName,
            value : [upper, lower],
            type : 'between'
        });

        return this;
    }
}