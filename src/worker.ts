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
            this.db = new DB(this.workerSpace.indexedDB, this.workerSpace.IDBKeyRange, this.settings);
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
            console.log(action, queryBuilder, content);
            port.postMessage({status: 'error', error: 'Invalid action called'});
            return false;
        }

        this.models[modelName].indexBuilder = queryBuilder.indexBuilder;
        this.models[modelName].builder = queryBuilder.normalBuilder;
        this.models[modelName].relations = queryBuilder.relations;
        this.models[modelName].tables = queryBuilder.tables;

        try {
            let result = await this.models[modelName][action](...content);
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
                debugger;
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

// let db, models;
// let errorNamespace = '-error';
//
// self.addEventListener('message', (e) => {
//     "use strict";
//     JSON.parse(e.data.detail);
//     let data = JSON.parse(e.data.detail, (key, value) => {
//         if(typeof value != 'string'){
//             return value;
//         }
//         return ( value.indexOf('function') >= 0 || value.indexOf('=>') >= 0) ? eval('('+value+')') : value;
//     });
//     self.emit(data, e.data.timestamp, e.data.action, e.data.model);
// });
//
// self.addEventListener('idb:worker:initialize', (e) => {
//     "use strict";
//
//     let idb = self.indexedDB || self.mozIndexedDB || self.webkitIndexedDB || self.msIndexedDB;
//     let idbKey = self.IDBKeyRange || self.webkitIDBKeyRange || self.msIDBKeyRange;
//
//     db = new DB(idb, idbKey, e.detail.detail, false, '', self.Promise);
//
//     db.connect()
//         .then((m) => {
//             models = m;
//             self.send(true, e.detail.timestamp, e.detail.action);
//         })
//         .catch((e) => self.send(false, e.detail.timestamp, e.detail.action));
//
// });
//
// self.emit = function (data, timestamp, action, model) {
//     let ev = new self.CustomEvent('idb:worker:' + action, {
//         detail: {
//             detail: data,
//             timestamp: timestamp,
//             action: action,
//             model: model
//         }
//     });
//
//     self.dispatchEvent(ev);
// };
//
// self.send = function (data, timestamp, action) {
//     "use strict";
//
//     let ev = {
//         detail: data,
//         action: action,
//         timestamp: timestamp,
//     };
//
//     self.postMessage(ev);
// };
//
//
// self.addEventListener('idb:worker:create', (e) => {
//     "use strict";
//
//     let m = models[e.detail.model];
//
//     m.create(e.detail.detail)
//         .then((result) => {
//             self.send(result, e.detail.timestamp, e.detail.action);
//         })
//         .catch(er => {
//             self.send(er, e.detail.timestamp, e.detail.action + errorNamespace);
//         });
// });
//
// self.addEventListener('idb:worker:find', (e) => {
//     "use strict";
//
//     let m = models[e.detail.model];
//     m.builder = e.detail.detail.builder;
//     m.indexBuilder = e.detail.detail.indexBuilder;
//     m.tables = e.detail.detail.tables;
//     m.relations = e.detail.detail.relations;
//
//     m.find(e.detail.detail)
//         .then((result) => {
//             self.send(result, e.detail.timestamp, e.detail.action);
//         })
//         .catch(er => {
//             self.send(er, e.detail.timestamp, e.detail.action + errorNamespace);
//         });
// });
//
// self.addEventListener('idb:worker:createMultiple', (e) => {
//     "use strict";
//
//     let m = models[e.detail.model];
//     m.createMultiple(e.detail.detail)
//         .then((result) => {
//             self.send(result, e.detail.timestamp, e.detail.action);
//         })
//         .catch(er => {
//             self.send(er, e.detail.timestamp, e.detail.action + errorNamespace);
//         });
// });
//
// self.addEventListener('idb:worker:get', (e) => {
//     "use strict";
//
//     let m = models[e.detail.model];
//     m.builder = e.detail.detail.builder;
//     m.indexBuilder = e.detail.detail.indexBuilder;
//     m.tables = e.detail.detail.tables;
//     m.relations = e.detail.detail.relations;
//
//     m.get(e.detail.detail)
//         .then((result) => {
//             self.send(result, e.detail.timestamp, e.detail.action);
//         })
//         .catch(er => {
//             self.send(er, e.detail.timestamp, e.detail.action + errorNamespace);
//         });
// });
//
// self.addEventListener('idb:worker:first', (e) => {
//     "use strict";
//
//     let m = models[e.detail.model];
//     m.builder = e.detail.detail.builder;
//     m.indexBuilder = e.detail.detail.indexBuilder;
//     m.tables = e.detail.detail.tables;
//     m.relations = e.detail.detail.relations;
//
//     m.first(e.detail.detail)
//         .then((result) => {
//             self.send(result, e.detail.timestamp, e.detail.action);
//         })
//         .catch(err => {
//             self.send(err, e.detail.timestamp, e.detail.action + errorNamespace);
//         });
// });
//
// self.addEventListener('idb:worker:update', (e) => {
//     "use strict";
//
//     let m = models[e.detail.model];
//
//     m.update(e.detail.detail)
//         .then((result) => {
//             self.send(result, e.detail.timestamp, e.detail.action);
//         })
//         .catch(er => {
//             self.send(er, e.detail.timestamp, e.detail.action + errorNamespace);
//         });
// });
//
// self.addEventListener('idb:worker:save', (e) => {
//     "use strict";
//
//     let m = models[e.detail.model];
//
//     m.save(e.detail.detail.id, e.detail.detail.data)
//         .then((result) => {
//             self.send(result, e.detail.timestamp, e.detail.action);
//         })
//         .catch(er => {
//             self.send(er, e.detail.timestamp, e.detail.action + errorNamespace);
//         });
// });
//
// self.addEventListener('idb:worker:count', (e) => {
//     "use strict";
//
//     let m = models[e.detail.model];
//
//     m.count()
//         .then((result) => {
//             self.send(result, e.detail.timestamp, e.detail.action);
//         })
//         .catch(er => {
//             self.send(er, e.detail.timestamp, e.detail.action + errorNamespace);
//         });
// });
//
// self.addEventListener('idb:worker:average', (e) => {
//     "use strict";
//
//     let m = models[e.detail.model];
//
//     m.average(e.detail.detail)
//         .then((result) => {
//             self.send(result, e.detail.timestamp, e.detail.action);
//         })
//         .catch(er => {
//             self.send(er, e.detail.timestamp, e.detail.action + errorNamespace);
//         });
// });
//
//
// self.addEventListener('idb:worker:reduce', (e) => {
//     "use strict";
//
//     let m = models[e.detail.model];
//
//     m.reduce(e.detail.detail.func, e.detail.detail.defaultCarry)
//         .then((result) => {
//             self.send(result, e.detail.timestamp, e.detail.action);
//         })
//         .catch(er => {
//             self.send(er, e.detail.timestamp, e.detail.action + errorNamespace);
//         });
// });
//
// self.addEventListener('idb:worker:destroyId', (e) => {
//     "use strict";
//
//     let m = models[e.detail.model];
//
//     m.destroyId(e.detail.detail)
//         .then((result) => {
//             self.send(result, e.detail.timestamp, e.detail.action);
//         })
//         .catch(er => {
//             self.send(er, e.detail.timestamp, e.detail.action + errorNamespace);
//         });
// });
//
// self.addEventListener('idb:worker:destroy', (e) => {
//     "use strict";
//
//     let m = models[e.detail.model];
//
//     m.destroy()
//         .then((result) => {
//             self.send(result, e.detail.timestamp, e.detail.action);
//         })
//         .catch(er => {
//             self.send(er, e.detail.timestamp, e.detail.action + errorNamespace);
//         });
// });