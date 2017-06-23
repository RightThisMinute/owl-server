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
const Video_1 = require("../models/Video");
const Store_1 = require("../Store");
const createDebug = require("debug");
const debug = createDebug('videoStore');
const ST = Sequelize;
const schema = {
    id: { type: ST.STRING, allowNull: false, primaryKey: true },
    title: ST.STRING,
    thumbnailURL: { type: ST.STRING, field: 'thumbnail_url' },
    channelID: {
        type: ST.STRING, field: 'channel_id',
    },
    description: ST.TEXT,
    publishDate: { type: ST.DATE, field: 'published_at' },
    active: { type: ST.BOOLEAN, allowNull: false },
};
class VideoStore extends Base_1.default {
    setActive(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const videos = ids.map(id => new Video_1.default({ id }, true));
            return Store_1.store.connection.transaction((transaction) => __awaiter(this, void 0, void 0, function* () {
                yield this.model.update({ active: false }, {
                    transaction,
                    where: { active: true },
                });
                yield Promise.all(videos.map(video => {
                    return this.model.upsert(video, { transaction });
                }));
            }));
        });
    }
    getActiveIDs() {
        return __awaiter(this, void 0, void 0, function* () {
            const videos = yield this.model.findAll({
                attributes: ['id'],
                where: { active: true }
            });
            return videos.map(video => video.get('id'));
        });
    }
}
exports.videoStore = new VideoStore('video', schema);
