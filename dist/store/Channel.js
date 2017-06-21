"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const ST = Sequelize;
const schema = {
    id: { type: ST.STRING, allowNull: false, primaryKey: true },
    name: { type: ST.STRING, allowNull: false },
};
class Channel {
    syncModel(connection) {
        this.model = connection.define('channel', schema);
        return this.model.sync();
    }
}
exports.channelStore = new Channel();
