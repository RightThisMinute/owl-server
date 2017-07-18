"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Snapshot {
    constructor(videoID, recordedAt, views, likes, dislikes, favs, comments, id) {
        this.id = id;
        this.videoID = videoID;
        this.recordedAt = recordedAt;
        this.viewCount = views;
        this.likeCount = likes;
        this.dislikeCount = dislikes;
        this.favoriteCount = favs;
        this.commentCount = comments;
    }
}
exports.default = Snapshot;
//# sourceMappingURL=Snapshot.js.map