"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const Base_1 = require("./Base");
const ST = Sequelize;
const schema = {
    id: { type: ST.STRING, allowNull: false, primaryKey: true },
    title: { type: ST.STRING, allowNull: false },
    thumbnailURL: { type: ST.STRING, allowNull: false, field: 'thumbnail_url' },
    channelID: {
        type: ST.STRING, allowNull: false, field: 'channel_id',
    },
    description: ST.TEXT,
    publishDate: { type: ST.DATE, field: 'published_at' }
};
class Video extends Base_1.default {
}
exports.videoStore = new Video('video', schema);
