import {Models, Settings} from "./interfaces";
import {DB} from "./db";
import {IndexBuilder, NormalBuilder, Relation} from "./builder";

/**
 * Interface pointing to the data being sent through the message channel
 */
export interface QueryBuilder {
    /**
     * List of tables to be included in the transaction
     */
    tables: string[],

    /**
     * Index query built in the main thread
     */
    indexBuilder: IndexBuilder,

    /**
     * List of non index column builder
     */
    normalBuilder: NormalBuilder[],

    /**
     * Various relations added to the main query builder
     */
    relations: Relation[]
}

class WorkerHandler {

    private db: DB;
    private models: Models;
    protected settings: Settings;

    constructor(private workerSpace) {

    }

    /**
     * Initialization of db instance with model setup and migrations
     * @param {Settings} settings
     * @param port
     * @return {Promise<void>}
     */
    private async init(settings: Settings, port) {
        try {
            this.settings = settings;
            this.db = new DB(this.workerSpace.indexedDB, this.workerSpace.IDBKeyRange, this.settings, false);
            this.models = await this.db.connect();
            port.postMessage({status: 'success'});
        } catch (e) {
            port.postMessage({status: 'error', error: e.message});
        }

    }

    /**
     * Function executes the main action functions available in the database
     *
     * @param port
     * @param {string} modelName
     * @param {string} action
     * @param {QueryBuilder} queryBuilder
     * @param content
     * @return {Promise<boolean>}
     */
    private async action(port, modelName: string, action: string, queryBuilder: QueryBuilder, content?) {
        if (!this.models.hasOwnProperty(modelName)) {
            port.postMessage({status: 'error', error: 'Invalid model called'});
            return false;
        }

        if (!this.models[modelName][action]) {
            port.postMessage({status: 'error', error: 'Invalid action called'});
            return false;
        }
        let model = this.models[modelName];
        model.indexBuilder = queryBuilder.indexBuilder;
        model.builder = queryBuilder.normalBuilder;
        model.relations = queryBuilder.relations;
        model.tables = model.tables.concat(queryBuilder.tables);

        try {
            let result = await model[action](...content);
            port.postMessage({status: 'success', content: result});
        } catch (e) {
            port.postMessage({status: 'error', error: e.message});
        }

    }

    /**
     * Function handles the transaction handling in database
     * @param port
     * @param models
     * @param content
     * @param modelName: string
     * @return {Promise<void>}
     */
    private async transaction(port, modelName:string, models, content) {

        if (!this.models.hasOwnProperty(modelName)) {
            port.postMessage({status: 'error', error: 'Invalid model called'});
            return false;
        }

        try{
            let m = models.map(model => {
                return this.models[model.name];
            });
            let result = await this.models[modelName].openTransaction(m, ...content);
            port.postMessage({status: 'success', content: result});

        }catch (e) {
            port.postMessage({status: 'error', error: e.message});
        }
    }

    public onMessage(e) {
        switch (e.data.command) {
            case 'init' :
                this.init(e.data.settings, e.ports[0]);
                break;
            case 'action':
                this.action(e.ports[0], e.data.modelName, e.data.action, this.parse(e.data.query), this.parse(e.data.content));
                break;
            case 'transaction':
                this.transaction(e.ports[0], e.data.modelName, e.data.models, this.parse(e.data.content));
                break;
            case 'test':
                console.info(e.data, e.ports);
                e.ports[0].close();
                break;
            default:
                e.ports[0].postMessage({status: 'fail', error: 'Incorrect command given'});
                e.ports[0].close();
        }
    }

    /**
     * Function parses the string content
     * @param {string} content
     * @return {any}
     */
    private parse(content: string): any {
        return JSON.parse(content, (key, value) => {
            if (typeof value != 'string') {
                return value;
            }
            return ( value.indexOf('function') >= 0 || value.indexOf('=>') >= 0) ? eval('(' + value + ')') : value;
        });
    }
}

let wh = new WorkerHandler(self);

self.onmessage = (e) => {wh.onMessage(e)};