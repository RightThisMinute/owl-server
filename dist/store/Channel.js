"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const Base_1 = require("./Base");
const ST = Sequelize;
const schema = {
    id: { type: ST.STRING, allowNull: false, primaryKey: true },
    name: { type: ST.STRING, allowNull: false },
};
class Channel extends Base_1.default {
}
exports.channelStore = new Channel('channel', schema);
