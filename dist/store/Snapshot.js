"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Sequelize = require("sequelize");
const Base_1 = require("./Base");
const ST = Sequelize;
const schema = {
    videoID: {
        type: ST.STRING, allowNull: false, field: 'video_id',
    },
    recordedAt: {
        type: ST.DATE, allowNull: false, defaultValue: ST.NOW,
        field: 'created_at'
    },
    viewCount: {
        type: ST.INTEGER, allowNull: false, defaultValue: 0,
        field: 'view_count'
    },
    likeCount: {
        type: ST.INTEGER, allowNull: false, defaultValue: 0,
        field: 'like_count'
    },
    dislikeCount: {
        type: ST.INTEGER, allowNull: false, defaultValue: 0,
        field: 'dislike_count'
    },
    favoriteCount: {
        type: ST.INTEGER, allowNull: false, defaultValue: 0,
        field: 'favorite_count'
    },
    commentCount: {
        type: ST.INTEGER, allowNull: false, defaultValue: 0,
        field: 'comment_count'
    },
};
class Snapshot extends Base_1.default {
}
exports.snapshotStore = new Snapshot('snapshot', schema);
