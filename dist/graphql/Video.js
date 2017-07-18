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
const Channel_1 = require("../store/Channel");
const Video_1 = require("../store/Video");
const Snapshot_1 = require("../store/Snapshot");
const createDebug = require("debug");
const debug = createDebug('graphql.Video');
class GQLVideo {
    static setActive(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Video_1.videoStore.setActive(ids);
            return yield this.getActive();
        });
    }
    static getActive() {
        return __awaiter(this, void 0, void 0, function* () {
            const vids = yield Video_1.videoStore.getActive();
            return vids.map(this.fromVideo);
        });
    }
    static fromVideo(vid) {
        const gqlVid = new GQLVideo;
        gqlVid.id = vid.id;
        gqlVid.active = vid.active;
        gqlVid.details = vid.title ? VideoDetails.fromVideo(vid) : null;
        return gqlVid;
    }
    statsByAge({ seconds }) {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshots = yield Snapshot_1.snapshotStore.getByVideoAndAge(this.id, seconds);
            return snapshots.map(VideoStats.fromSnapshot);
        });
    }
}
exports.default = GQLVideo;
class VideoDetails {
    static fromVideo({ title, description, thumbnailURL, publishDate, channelID }) {
        const details = new VideoDetails;
        details.title = title;
        details.description = description;
        details.thumbnailURL = thumbnailURL;
        details.publishedAt = publishDate.getTime();
        const channel = new Channel;
        channel.id = channelID;
        details.channel = channel;
        return details;
    }
}
class Channel {
    name() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._name)
                return this._name;
            const channel = yield Channel_1.channelStore.getByID(this.id);
            this._name = channel.name;
            return this._name;
        });
    }
}
class VideoStats {
    static fromSnapshot(snapshot) {
        const stats = new VideoStats;
        stats.videoID = snapshot.videoID;
        stats.recordedAt = snapshot.recordedAt.getTime();
        stats.views = snapshot.viewCount;
        stats.likes = snapshot.likeCount;
        stats.dislikes = snapshot.dislikeCount;
        stats.favorites = snapshot.favoriteCount;
        stats.comments = snapshot.commentCount;
        return stats;
    }
}
//# sourceMappingURL=Video.js.map