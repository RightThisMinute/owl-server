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
const createDebug = require("debug");
const debug = createDebug('store.snapshot');
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
        type: ST.BIGINT, allowNull: false, defaultValue: 0,
        field: 'view_count'
    },
    likeCount: {
        type: ST.BIGINT, allowNull: false, defaultValue: 0,
        field: 'like_count'
    },
    dislikeCount: {
        type: ST.BIGINT, allowNull: false, defaultValue: 0,
        field: 'dislike_count'
    },
    favoriteCount: {
        type: ST.BIGINT, allowNull: false, defaultValue: 0,
        field: 'favorite_count'
    },
    commentCount: {
        type: ST.BIGINT, allowNull: false, defaultValue: 0,
        field: 'comment_count'
    },
};
class SnapshotStore extends Base_1.default {
    post(snapshots) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.bulkCreate(snapshots);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshots = yield this.model.findAll();
            return snapshots.map(snapshot => snapshot.get());
        });
    }
    getByVideoAndAge(vidID, age) {
        return __awaiter(this, void 0, void 0, function* () {
            const datetime = new Date(Date.now() - (age * 1000));
            const snapshots = yield this.model.findAll({
                where: {
                    videoID: vidID,
                    recordedAt: { $gte: datetime }
                },
                order: [['created_at', 'DESC']],
            });
            return snapshots.map(snapshot => snapshot.get());
        });
    }
}
exports.snapshotStore = new SnapshotStore('snapshot', schema);
