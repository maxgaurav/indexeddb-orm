"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("./db");
var WorkerHandler = /** @class */ (function () {
    function WorkerHandler(workerSpace) {
        this.workerSpace = workerSpace;
    }
    /**
     * Initialization of db instance with model setup and migrations
     * @param {Settings} settings
     * @param port
     * @return {Promise<void>}
     */
    WorkerHandler.prototype.init = function (settings, port) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        this.settings = settings;
                        this.db = new db_1.DB(this.workerSpace.indexedDB, this.workerSpace.IDBKeyRange, this.settings, false);
                        _a = this;
                        return [4 /*yield*/, this.db.connect()];
                    case 1:
                        _a.models = _b.sent();
                        port.postMessage({ status: 'success' });
                        return [3 /*break*/, 3];
                    case 2:
                        e_1 = _b.sent();
                        port.postMessage({ status: 'error', error: e_1.message });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
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
    WorkerHandler.prototype.action = function (port, modelName, action, queryBuilder, content) {
        return __awaiter(this, void 0, void 0, function () {
            var model, result, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.models.hasOwnProperty(modelName)) {
                            port.postMessage({ status: 'error', error: 'Invalid model called' });
                            return [2 /*return*/, false];
                        }
                        if (!this.models[modelName][action]) {
                            port.postMessage({ status: 'error', error: 'Invalid action called' });
                            return [2 /*return*/, false];
                        }
                        model = this.models[modelName];
                        model.indexBuilder = queryBuilder.indexBuilder;
                        model.builder = queryBuilder.normalBuilder;
                        model.relations = queryBuilder.relations;
                        model.tables = model.tables.concat(queryBuilder.tables);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, model[action].apply(model, content)];
                    case 2:
                        result = _a.sent();
                        port.postMessage({ status: 'success', content: result });
                        return [3 /*break*/, 4];
                    case 3:
                        e_2 = _a.sent();
                        port.postMessage({ status: 'error', error: e_2.message });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Function handles the transaction handling in database
     * @param port
     * @param models
     * @param content
     * @param modelName: string
     * @return {Promise<void>}
     */
    WorkerHandler.prototype.transaction = function (port, modelName, models, content) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var m, result, e_3, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.models.hasOwnProperty(modelName)) {
                            port.postMessage({ status: 'error', error: 'Invalid model called' });
                            return [2 /*return*/, false];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        m = models.map(function (model) {
                            return _this.models[model.name];
                        });
                        return [4 /*yield*/, (_a = this.models[modelName]).openTransaction.apply(_a, [m].concat(content))];
                    case 2:
                        result = _b.sent();
                        port.postMessage({ status: 'success', content: result });
                        return [3 /*break*/, 4];
                    case 3:
                        e_3 = _b.sent();
                        port.postMessage({ status: 'error', error: e_3.message });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    WorkerHandler.prototype.onMessage = function (e) {
        switch (e.data.command) {
            case 'init':
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
                e.ports[0].postMessage({ status: 'fail', error: 'Incorrect command given' });
                e.ports[0].close();
        }
    };
    /**
     * Function parses the string content
     * @param {string} content
     * @return {any}
     */
    WorkerHandler.prototype.parse = function (content) {
        return JSON.parse(content, function (key, value) {
            if (typeof value != 'string') {
                return value;
            }
            return (value.indexOf('function') >= 0 || value.indexOf('=>') >= 0) ? eval('(' + value + ')') : value;
        });
    };
    return WorkerHandler;
}());
var wh = new WorkerHandler(self);
self.onmessage = function (e) { wh.onMessage(e); };
