"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Video {
    constructor(id, title, thumbURL, channelID, desc, pubDate) {
        this.id = id;
        this.title = title;
        this.thumbnailURL = thumbURL;
        this.channelID = channelID;
        this.description = desc;
        this.publishDate = pubDate;
    }
}
exports.default = Video;
