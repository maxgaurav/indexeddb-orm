importScripts('db.js', 'model.js', 'migration.js');

let db, models;
let errorNamespace = '-error';

self.addEventListener('message', (e) => {
    "use strict";

    self.emit(e.data.detail, e.data.timestamp, e.data.action, e.data.model);
});

self.addEventListener('idb:worker:initialize', (e) => {
    "use strict";

    let idb = self.indexedDB || self.mozIndexedDB || self.webkitIndexedDB || self.msIndexedDB

    db = new DB(idb, e.detail.detail, false);

    db.connect()
        .then((m) => {
            models = m;
            self.send(true, e.detail.timestamp, e.detail.action);
        })
        .catch((e) => self.send(false, e.detail.timestamp, e.detail.action));

});

self.emit = function (data, timestamp, action, model) {
    let e = new self.CustomEvent('idb:worker:' + action, {
        detail: {
            detail: data,
            timestamp: timestamp,
            action: action,
            model: model
        }
    });

    self.dispatchEvent(e);
};

self.send = function (data, timestamp, action) {
    "use strict";

    let e = {
        detail: data,
        action: action,
        timestamp: timestamp,
    };

    self.postMessage(e);
};


self.addEventListener('idb:worker:create', (e) => {
    "use strict";

    models[e.detail.model].create(e.detail.detail)
        .then((result) => {
            self.send(result, e.detail.timestamp, e.detail.action);
        })
        .catch(e => {
            self.send(e, e.detail.timestamp, e.detail.action + errorNamespace);
        });
});

self.addEventListener('idb:worker:find', (e) => {
    "use strict";

    models[e.detail.model].find(e.detail.detail)
        .then((result) => {
            self.send(result, e.detail.timestamp, e.detail.action);
        })
        .catch(e => {
            self.send(e, e.detail.timestamp, e.detail.action + errorNamespace);
        });
});

self.addEventListener('idb:worker:createMultiple', (e) => {
    "use strict";

    models[e.detail.model].createMultiple(e.detail.detail)
        .then((result) => {
            self.send(result, e.detail.timestamp, e.detail.action);
        })
        .catch(e => {
            self.send(e, e.detail.timestamp, e.detail.action + errorNamespace);
        });
});

self.addEventListener('idb:worker:get', (e) => {
    "use strict";

    models[e.detail.model].get(e.detail.detail)
        .then((result) => {
            self.send(result, e.detail.timestamp, e.detail.action);
        })
        .catch(e => {
            self.send(e, e.detail.timestamp, e.detail.action + errorNamespace);
        });
});