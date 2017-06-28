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
const Sequelize = require("sequelize");
const Base_1 = require("./Base");
const ST = Sequelize;
const schema = {
    id: { type: ST.STRING, allowNull: false, primaryKey: true },
    name: { type: ST.STRING, allowNull: false },
};
class ChannelStore extends Base_1.default {
    put(channels) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(channels.map(channel => this.model.upsert(channel)));
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const channels = yield this.model.findAll();
            return channels.map(channel => channel.get());
        });
    }
    getByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.model.findById(id)).get();
        });
    }
}
exports.channelStore = new ChannelStore('channel', schema);
