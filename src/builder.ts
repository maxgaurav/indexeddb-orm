import {Model} from './model';
import {QueryBuilder} from "./worker";

/**
 * Main index query content
 */
export interface IndexBuilder {
    index: string,
    value: any,
    type: string
}

/**
 * Definition of relation for the main query builder
 */
export interface Relation {
    modelName: string,
    localKey: string,
    foreignKey: string,
    type: string,
    primary?: string | null

    func?(builder: Builder): Builder,
}

/**
 * Normal columns query content (columns without index)
 */
export interface NormalBuilder {
    attribute: string,
    value: any,
    type: string
}

export interface BuilderInterface {
    builder: NormalBuilder[],
    indexBuilder: IndexBuilder,
    relations: Relation[],
    tables: string[]
}

export class Builder implements BuilderInterface{

    constructor(public builder: NormalBuilder[] = [], public indexBuilder: IndexBuilder = <IndexBuilder>{}, public relations: Relation[] = [], public tables: string[] = []) {
    }

    /**
     * Sets the index builder value as an 'and' reference
     *
     * @param indexName string
     * @param value mixed
     * @returns {Builder}
     */
    whereIndex(indexName:string, value:any) {

        this.indexBuilder = {
            index: indexName,
            value: value,
            type: 'and'
        };

        return this;
    }

    /**
     * Sets the index builder value as an 'in' reference
     * @param indexName
     * @param value
     * @returns {Builder}
     */
    whereIndexIn(indexName: string, value: any) {

        this.indexBuilder = {
            index: indexName,
            value: value,
            type: 'in'
        };

        return this;
    }

    /**
     * Sets the index builder value with point inclusive and sets greater than check
     * @param indexName
     * @param value
     * @returns {Builder}
     */
    indexGte(indexName: string, value: any) {

        this.indexBuilder = {
            index: indexName,
            value: value,
            type: 'gte'
        };

        return this;
    }

    /**
     * Sets the index builder value with point not inclusive and sets greater than check
     * @param indexName
     * @param value
     * @returns {Builder}
     */
    indexGt(indexName: string, value: any) {

        this.indexBuilder = {
            index: indexName,
            value: value,
            type: 'gt'
        };

        return this;
    }

    /**
     * Sets the index builder value with point inclusive and sets less than check
     * @param indexName
     * @param value
     * @returns {Builder}
     */
    indexLte(indexName: string, value: any) {

        this.indexBuilder = {
            index: indexName,
            value: value,
            type: 'lte'
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
    indexLt(indexName: string, value: any) {

        this.indexBuilder = {
            index: indexName,
            value: value,
            type: 'lt'
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
    indexBetween(indexName: string, lower:string|number|null, upper:string|number|null) {

        this.indexBuilder = {
            index: indexName,
            value: [lower, upper],
            type: 'between'
        };

        return this;
    }

    /**
     * Filters non indexed value content as in and value of given attributes
     * @param attributeName
     * @param value
     * @returns {Builder}
     */
    whereIn(attributeName: string, value:any) {
        this.builder.push({
            attribute: attributeName,
            value: value,
            type: 'in'
        });

        return this;
    }

    /**
     * Filters values exactly  to the given value
     * @param attributeName
     * @param value
     * @returns {Builder}
     */
    where(attributeName:string, value: any) {
        this.builder.push({
            attribute: attributeName,
            value: value,
            type: 'and'
        });

        return this;
    }

    /**
     * Checks for value greater than or equal to the value given for the attribute
     * @param attributeName
     * @param {string | number} value
     * @returns {Builder}
     */
    gte(attributeName, value:string|number) {
        this.builder.push({
            attribute: attributeName,
            value: value,
            type: 'gte'
        });

        return this;
    }

    /**
     * Checks for value greater than the value given for the attribute
     * @param {string} attributeName
     * @param {string | number} value
     * @returns {Builder}
     */
    gt(attributeName:string, value: string|number) {
        this.builder.push({
            attribute: attributeName,
            value: value,
            type: 'gt'
        });

        return this;
    }

    /**
     * Checks for value less than or equal the value given for the attribute
     * @param {string} attributeName
     * @param {string | number} value
     * @returns {Builder}
     */
    lte(attributeName:string, value:string|number) {
        this.builder.push({
            attribute: attributeName,
            value: value,
            type: 'lte'
        });

        return this;
    }

    /**
     * Checks for value less than or equal the value given for the attribute
     * @param {string} attributeName
     * @param {string | number} value
     * @returns {Builder}
     */
    lt(attributeName:string, value:string|number) {
        this.builder.push({
            attribute: attributeName,
            value: value,
            type: 'lt'
        });

        return this;
    }

    /**
     * Filters content based on the between values given
     * @param {string} attributeName
     * @param {number} upper
     * @param {number} lower
     * @returns {Builder}
     */
    between(attributeName:string, upper:number, lower:number) {

        if (isNaN(upper) || isNaN(lower)) {
            throw "Between is only for numeric values";
        }

        this.builder.push({
            attribute: attributeName,
            value: [upper, lower],
            type: 'between'
        });

        return this;
    }

    /**
     * Adds relation to the main search content
     * @param {string} modelName
     * @param {string} type
     * @param {string} localKey
     * @param {string} foreignKey
     * @param func
     * @param {string} primary
     * @returns {Builder}
     */
    relation(modelName: string, type: string, localKey: string, foreignKey: string, func: any = null, primary: string | null = null) {
        this.tables.push(modelName);

        this.relations.push({
            modelName: modelName,
            func: func,
            localKey: localKey,
            foreignKey: foreignKey,
            type: type,
            primary: primary
        });

        return this;
    }

    static get helpers() {

        return {

            checkNestedAttribute(attributeString, value, condition) {
                return condition == Model.helpers.getNestedAttribute(attributeString, value)
            },

            getNestedAttribute(attributeString, value) {
                let attributes = attributeString.split('.');
                let i;
                let content = value;

                for (i = 0; i < attributes.length; i++) {
                    if (content[attributes[i]] === undefined) {
                        return undefined;
                    }

                    content = content[attributes[i]];
                }

                return content;
            },

            replaceNestedValues(attributes, value) {
                for (let attribute in attributes) {
                    value[attribute] = attributes[attribute];
                }

                return value;
            },
        };

    }

    public getBuilder(): QueryBuilder {
        return {
            tables: this.tables,
            indexBuilder: this.indexBuilder,
            normalBuilder: this.builder,
            relations: this.relations
        }
    }

    // noinspection JSMethodCanBeStatic
    get RELATIONS() {
        return Builder.RELATIONS;
    }

    static get RELATIONS() {
        return {
            hasOne: 'hasOne',
            hasMany: 'hasMany'
        }
    }
}