var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Migration } from "./migration";
import { Model } from "./model";
import { WorkerModel } from "./worker-model";
var DB = (function () {
    function DB(db, idbKey, settings, useWorker, pathToWorker) {
        if (useWorker === void 0) { useWorker = false; }
        if (pathToWorker === void 0) { pathToWorker = ''; }
        this.db = db;
        this.idbKey = idbKey;
        this.settings = settings;
        this.useWorker = useWorker;
        this.pathToWorker = pathToWorker;
    }
    /**
     * Initializes database connection with indexedDB
     *
     * @returns {Promise}
     */
    DB.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.useWorker) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.createWorkerHandler()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [4 /*yield*/, this.createNormalHandler()];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * Destroys/Deletes the databaase
     * @param dbName
     */
    DB.prototype.destroy = function (dbName) {
        console.info('database ' + dbName + ' deleted');
        this.db.deleteDatabase(dbName);
    };
    /**
     * Creates connection in web worker space and if web worker fails
     * then creates normal database connection instance
     * @return {Promise<Models>}
     */
    DB.prototype.createWorkerHandler = function () {
        var _this = this;
        return new Promise(function (resolve) {
            var worker = new Worker(_this.pathToWorker);
            var ms = new MessageChannel();
            worker.postMessage({ command: 'init', settings: _this.settings }, [ms.port1]);
            ms.port2.onmessage = function (e) {
                if (e.data.status === 'error' || !e.data.status) {
                    ms.port2.close();
                    throw new Error(e.data.error || "Uncaught error <" + JSON.stringify(e.data) + ">");
                }
                var models = {};
                _this.settings.migrations.forEach(function (schema) {
                    var primary = schema.primary || 'id';
                    Object.defineProperty(models, schema.name, {
                        get: function () {
                            return new WorkerModel(worker, schema.name, primary);
                        }
                    });
                });
                resolve(models);
                ms.port2.close();
                ms.port1.close();
            };
        });
    };
    /**
     * Function creates/opens database connection in main javascript thread
     * @returns {Promise<Models>}
     */
    DB.prototype.createNormalHandler = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var request = _this.db.open(_this.settings.name, _this.settings.version);
            request.onupgradeneeded = function (e) {
                _this.idb = e.target.result;
                _this.migration = new Migration(_this.idb, e.target.transaction, _this.settings.migrations);
                _this.migration.run();
            };
            request.onerror = function (e) {
                reject(e.message);
            };
            request.onsuccess = function (e) {
                var models = {};
                _this.settings.migrations.forEach(function (schema) {
                    var primary = schema.primary || 'id';
                    Object.defineProperty(models, schema.name, {
                        get: function () {
                            return new Model(e.target.result, this.idbKey, schema.name, primary);
                        }
                    });
                });
                resolve(models);
            };
        });
    };
    return DB;
}());
export { DB };
