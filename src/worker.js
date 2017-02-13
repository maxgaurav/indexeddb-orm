importScripts('db.js', 'builder.js', 'model.js', 'migration.js');

let db, models;
let errorNamespace = '-error';

self.addEventListener('message', (e) => {
    "use strict";
    JSON.parse(e.data.detail);
    let data = JSON.parse(e.data.detail, (key, value) => {
        if(typeof value != 'string') return value;
        return ( value.substring(0,8) == 'function') ? eval('('+value+')') : value;
    });
    self.emit(data, e.data.timestamp, e.data.action, e.data.model);
});

self.addEventListener('idb:worker:initialize', (e) => {
    "use strict";

    let idb = self.indexedDB || self.mozIndexedDB || self.webkitIndexedDB || self.msIndexedDB;
    let idbKey = self.IDBKeyRange || self.webkitIDBKeyRange || self.msIDBKeyRange;

    db = new DB(idb, idbKey, e.detail.detail, false);

    db.connect()
        .then((m) => {
            models = m;
            self.send(true, e.detail.timestamp, e.detail.action);
        })
        .catch((e) => self.send(false, e.detail.timestamp, e.detail.action));

});

self.emit = function (data, timestamp, action, model) {
    let ev = new self.CustomEvent('idb:worker:' + action, {
        detail: {
            detail: data,
            timestamp: timestamp,
            action: action,
            model: model
        }
    });

    self.dispatchEvent(ev);
};

self.send = function (data, timestamp, action) {
    "use strict";

    let ev = {
        detail: data,
        action: action,
        timestamp: timestamp,
    };

    self.postMessage(ev);
};


self.addEventListener('idb:worker:create', (e) => {
    "use strict";

    let m = models[e.detail.model];

    m.create(e.detail.detail)
        .then((result) => {
            self.send(result, e.detail.timestamp, e.detail.action);
        })
        .catch(er => {
            self.send(er, e.detail.timestamp, e.detail.action + errorNamespace);
        });
});

self.addEventListener('idb:worker:find', (e) => {
    "use strict";

    let m = models[e.detail.model];
    m.builder = e.detail.detail.builder;
    m.indexBuilder = e.detail.detail.indexBuilder;
    m.tables = e.detail.detail.tables;
    m.relations = e.detail.detail.relations;

    m.find(e.detail.detail)
        .then((result) => {
            self.send(result, e.detail.timestamp, e.detail.action);
        })
        .catch(er => {
            self.send(er, e.detail.timestamp, e.detail.action + errorNamespace);
        });
});

self.addEventListener('idb:worker:createMultiple', (e) => {
    "use strict";

    let m = models[e.detail.model];
    m.createMultiple(e.detail.detail)
        .then((result) => {
            self.send(result, e.detail.timestamp, e.detail.action);
        })
        .catch(er => {
            self.send(er, e.detail.timestamp, e.detail.action + errorNamespace);
        });
});

self.addEventListener('idb:worker:get', (e) => {
    "use strict";

    let m = models[e.detail.model];
    m.builder = e.detail.detail.builder;
    m.indexBuilder = e.detail.detail.indexBuilder;
    m.tables = e.detail.detail.tables;
    m.relations = e.detail.detail.relations;

    m.get(e.detail.detail)
        .then((result) => {
            self.send(result, e.detail.timestamp, e.detail.action);
        })
        .catch(er => {
            self.send(er, e.detail.timestamp, e.detail.action + errorNamespace);
        });
});

self.addEventListener('idb:worker:first', (e) => {
    "use strict";

    let m = models[e.detail.model];
    m.builder = e.detail.detail.builder;
    m.indexBuilder = e.detail.detail.indexBuilder;
    m.tables = e.detail.detail.tables;
    m.relations = e.detail.detail.relations;

    m.first(e.detail.detail)
        .then((result) => {
            self.send(result, e.detail.timestamp, e.detail.action);
        })
        .catch(err => {
            self.send(err, e.detail.timestamp, e.detail.action + errorNamespace);
        });
});

self.addEventListener('idb:worker:update', (e) => {
    "use strict";

    let m = models[e.detail.model];

    m.update(e.detail.detail)
        .then((result) => {
            self.send(result, e.detail.timestamp, e.detail.action);
        })
        .catch(er => {
            self.send(er, e.detail.timestamp, e.detail.action + errorNamespace);
        });
});

self.addEventListener('idb:worker:save', (e) => {
    "use strict";

    let m = models[e.detail.model];

    m.save(e.detail.detail.id, e.detail.detail.data)
        .then((result) => {
            self.send(result, e.detail.timestamp, e.detail.action);
        })
        .catch(er => {
            self.send(er, e.detail.timestamp, e.detail.action + errorNamespace);
        });
});