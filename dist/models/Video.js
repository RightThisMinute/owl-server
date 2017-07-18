"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Video {
    constructor({ id, title, thumbnailURL, channelID, description, publishDate }, active = false) {
        this.id = id;
        this.title = title;
        this.thumbnailURL = thumbnailURL;
        this.channelID = channelID;
        this.description = description;
        this.publishDate = publishDate;
        this.active = active;
    }
}
exports.default = Video;
//# sourceMappingURL=Video.js.map