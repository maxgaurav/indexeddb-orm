import {Models, Settings} from "./interfaces";
import {DB} from "./db";
import {IndexBuilder, NormalBuilder, Relation} from "./builder";

export interface QueryBuilder {
    tables: string[],
    indexBuilder: IndexBuilder,
    normalBuilder: NormalBuilder[],
    relations: Relation[]
}

class WorkerHandler {

    private db: DB;
    private models: Models;
    protected settings: Settings;

    constructor(private workerSpace) {

    }

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

    public onMessage(e) {
        switch (e.data.command) {
            case 'init' :
                this.init(e.data.settings, e.ports[0]);
                break;
            case 'action':
                this.action(e.ports[0], e.data.modelName, e.data.action, this.parse(e.data.query), this.parse(e.data.content));
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