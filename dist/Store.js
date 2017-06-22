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
    constructor() {
        this.connection = new Sequelize('postgres://localhost:5432/owl', {
            define: {
                underscored: true
            }
        });
        this.syncModels()
            .catch(reason => {
            console.error('Failed syncing models.', reason);
        });
        debug('Initialized.');
    }
    syncModels(force = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const stores = [Channel_1.channelStore, Video_1.videoStore, Snapshot_1.snapshotStore];
            for (let sx = 0; sx < stores.length; sx++)
                yield stores[sx].syncModel(this.connection, force);
        });
    }
}
exports.Store = Store;
class _Store extends Store {
}
// `export default` is not used because it would result in a new instance
// being created on each import.
exports.store = new _Store();
