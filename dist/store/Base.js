"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const createDebug = require("debug");
const debug = createDebug('Store');
class Base {
    constructor(name, schema, options) {
        debug(`Constructing store instance for table ${name}.`);
        this.name = name;
        this.schema = schema;
        this.options = options;
    }
    get model() {
        return this._model;
    }
    syncModel(connection, force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            debug(`Defining ${this.name} model.`);
            this._model = connection.define(this.name, this.schema, this.options);
            yield this.model.sync({ force });
            debug(`Synced ${this.name} model.`);
        });
    }
    deleteAll() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.destroy();
        });
    }
}
exports.default = Base;
//# sourceMappingURL=Base.js.map