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
const Sequelize = require("sequelize");
const Channel_1 = require("./store/Channel");
const Video_1 = require("./store/Video");
const Snapshot_1 = require("./store/Snapshot");
/**
 * Defined as abstract to allow exporting without allowing instantiation.
 */
class Store {
    static get stores() {
        return [Channel_1.channelStore, Video_1.videoStore, Snapshot_1.snapshotStore];
    }
    get connection() { return this._connection; }
    initialize(host, port, database, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `postgres://${host}:${port}/${database}`;
            this._connection = new Sequelize(url, {
                define: {
                    underscored: true
                }
            });
            yield this.connection.authenticate().catch(reason => {
                console.error(`Failed connecting to database with ${url}.`, reason);
            });
            debug('Syncing models...');
            const force = options.dropAndRecreateTables || false;
            yield this.syncModels(force).catch(reason => {
                console.error('Failed syncing models.', reason);
            });
            debug('Initialized.');
        });
    }
    syncModels(force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let sx = 0; sx < Store.stores.length; sx++)
                yield Store.stores[sx].syncModel(this.connection, force);
        });
    }
}
// `export default` is not used because it would result in a new instance
// being created on each import.
exports.store = new Store();
