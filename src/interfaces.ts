/**
 * Table Column
 * Structure for creating columns in an object store
 *
 */
export interface TableColumn {
    /**
     * The name of the column
     */
    name: string,

    /**
     * Optional attribute. If not given the index will become equal to column name. Pass value if the actual column in the database needs to be different.
     * You can also create a compound index using the index attribute
     * @eg Plain index
     * {name: 'email'}
     * For the above example the index and column name will be both email
     *
     * @eg Compound index
     * {name: 'hospital', index: ['hopitalId', 'userId']
     * Will create a compound index using hospital id and userId as index
     *
     * @eg Nested Index
     * {name: 'hospital', index: 'hospital.hospitalId'}
     * Suppose the data set contains an object hospital and nested attribute of hospital id. The above example will create the a nested index for hospitalId
     */
    index?: string[] | string,

    /**
     * Attributes allows us to mark type of index
     * Provide unique as true for unique index
     * Provide multiEntry as true if the index will contain array of strings|numbers and want to index each of them
     */
    attributes?: IDBIndexParameters
}

/**
 * Table creation/update schema
 * This structure of settings input will be used in migration to create tables/object stores in database.
 * The columns are actual indexes for the object store|table as indexed db is a nosql database so dynamic properties can
 * be stored in run time
 */
export interface TableSchema {
    /**
     * Name of table/object store
     */
    name: string,

    /**
     * By default the primary| key path value is _id. If a different column name is
     */
    primary?: string,

    /**
     * Array of columns settings
     */
    columns: TableColumn[],

    /**
     * Set this to true if to drop the table/object store
     */
    drop?: boolean,

    /**
     * If set to true then the system will look for existing column in object store and if found
     * then the system will delete that column
     */
    dropColumns?: string[]
}

/**
 * Main settings containing the various tables, the name of database and version of database.
 */
export interface Settings {
    /**
     * Migrations containing the object stores/tables with their names and columns(dedicated indexes) to be created in the table/object store.
     */
    migrations: TableSchema[],

    /**
     * Name of the database
     */
    name: string,

    /**
     * Version of the database
     */
    version: number
}

export interface Models {
    [modelName: string]: ModelInterface
}

export interface IDBStaticKeyRange extends IDBKeyRange {
    bound(x: any, y: any, notContainX?: boolean, notContainY?: boolean): IDBKeyRange,

    includes(key: any): boolean,

    lowerBound(x: any, notContainX?: boolean): IDBKeyRange,

    upperBound(x: any, notContainX?: boolean): IDBKeyRange,

    only(x: any): IDBKeyRange
}

/**
 * Interface for basic DB interaction
 */
export interface DBInterface{

    /**
     * Main database interaction object
     */
    idb: IDBDatabase,

    /**
     * Migration object which was passed during database connectivity to update/create object stores/tables in database
     */
    migration: MigrationInterface,

    /**
     * Main indexeddb interface available in the window scope of browser
     */
    db: IDBFactory,

    /**
     *
     */
    idbKey: IDBStaticKeyRange,

    /**
     * Main settings object containing the table name and schema settings
     */
    settings: Settings

    /**
     * Primary connection function which will open connection to database and run migrations
     * @returns {Promise<Model>}
     */
    connect(): Promise<ModelInterface>,

    /**
     * Deletes the database
     * @param {string} name
     */
    destroy(name: string): void
}

/**
 * Main model interface which will be used to take actions in tables of database to fetch/update/delete content.
 * The model interface will also provide ability to do query building
 */
export interface ModelInterface {
    /**
     * Finds the record based on primary key
     * @param {number} id
     * @returns {Promise<any>}
     */
    find(id: number): Promise<any>,

    /**
     * Returns the first result based on query builder by opening the cursor in the table of database
     * @returns {Promise<any>}
     */
    first(): Promise<any>

    /**
     * Returns array of results of fetched based on query building done by opening a cursor on table
     * @returns {Promise<any[]>}
     */
    get(): Promise<any[]>,

    /**
     * Creates the data with automatically appending createdAt and updatedAt as date object to the data and once
     * successful appends the auto incremented value to the data (with primary key specified else with default key) as result
     * @returns {Promise<any>}
     */
    create(data: any): Promise<any>,

    /**
     * Creates the multiple data with automatically appending createdAt and updatedAt as date object to all the data and once
     * successful appends the auto incremented value to the data (with primary key specified else with default key) as result
     * @returns {Promise<any>}
     * @param data
     */
    createMultiple(data: any[]): Promise<any[]>,

    /**
     * Updates the content of the record for the given primary key/keyPath with the given data.
     * @param {number} id
     * @param data
     * @returns {Promise<boolean>}
     */
    save(id: number, data: any): Promise<boolean>,

    /**
     * Updates multiple records with the given database found according to query buildt
     * @param data
     * @returns {Promise<number>}
     */
    update(data: any): Promise<number>,

    /**
     * Deletes the record at given primary key/keyPath
     * @param {number} id
     * @returns {Promise<any>}
     */
    destroyId(id: number): Promise<any>,

    /**
     * Deletes multiple recording passing the query builder criteria
     * @returns {Promise<any>}
     */
    destroy(): Promise<any>,

    /**
     * Returns count of total records found based on query built
     * @returns {Promise<number>}
     */
    count(): Promise<number>,

    /**
     * Returns the average of the column based on query built.
     * @param {string} attribute [Takes in string as value. In order to take in nested parameter pass with a '.'(dot) seperation)
     * @returns {Promise<number>}
     *
     * @example
     * [Without dot separation] : db.model.whereIndex('name','lorem').average('sum');
     * [With dot separation] : db.model.whereIndex('name', 'lorem').averaget('hospital.expenses')
     */
    average(attribute: string): Promise<number>,

    /**
     * Equivalent to map reduce action in the database. Pass the primary reduce function which would return the carry value.
     * @param {(value: any[the record for the iteration], result: any[the previous carry result]) => any[return of new carry result]} func
     * @param defaultCarry
     * @returns {Promise<any>}
     */
    reduce(func: (value: any, result: any) => any, defaultCarry: any): Promise<any>,

}

export interface MigrationInterface {
    objectStores: IDBObjectStore[],

    createStore(schema: TableSchema): void,

    run(): void,

    makeIndex(column: TableColumn, objectStore: IDBObjectStore): void,

    dropIndex(column: string, objectStore: IDBObjectStore): void
}