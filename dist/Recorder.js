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
const request = require("request-promise-native");
const Config_1 = require("./Config");
const Channel_1 = require("./models/Channel");
const Channel_2 = require("./store/Channel");
const Snapshot_1 = require("./models/Snapshot");
const Snapshot_2 = require("./store/Snapshot");
const Video_1 = require("./models/Video");
const Video_2 = require("./store/Video");
const createDebug = require("debug");
const debug = createDebug('Recorder');
class Recorder {
    constructor() {
        this.recording = false;
    }
    start(interval) {
        this.intervalReference = setInterval(() => {
            if (this.recording) {
                debug('Already recording. SKIP.');
                return;
            }
            this.recording = true;
            debug('TICK');
            this.record()
                .then(() => this.recording = false)
                .catch(error => {
                console.error('Failed recording snapshots.', error);
                this.recording = false;
            });
        }, interval);
    }
    stop() {
        clearInterval(this.intervalReference);
    }
    record() {
        return __awaiter(this, void 0, void 0, function* () {
            const ids = yield Video_2.videoStore.getActiveIDs();
            const uri = 'https://www.googleapis.com/youtube/v3/videos'
                + '?part=snippet,statistics'
                + `&id=${ids.join(',')}`
                + `&key=${Config_1.config.youtube.key}`;
            const response = yield request({ uri, json: true }).catch(reason => {
                console.error('Failed requesting video details from YouTube.', uri, reason);
            });
            if (response.hasOwnProperty('error')) {
                console.error('Error response from YouTube.', uri, response.error);
                throw Error('Error response from YouTube.');
            }
            const channels = response.items
                .map(video => {
                return new Channel_1.default(video.snippet.channelId, video.snippet.channelTitle);
            })
                .sort((a, b) => {
                // Group duplicates together
                if (a.id < b.id)
                    return -1;
                if (a.id === b.id)
                    return 0;
                if (a.id > b.id)
                    return 1;
            })
                .reduce((acc, channel) => {
                // Remove duplicates
                if (acc.length > 0 && channel.id === acc[acc.length - 1].id)
                    return acc;
                acc.push(channel);
                return acc;
            }, []);
            const videos = response.items.map(video => {
                const snippet = video.snippet;
                const thumbs = video.snippet.thumbnails;
                const thumbnail = Object.getOwnPropertyNames(thumbs)
                    .reduce((largest, name) => {
                    return !largest || largest.width < thumbs[name].width
                        ? thumbs[name] : largest;
                }, null);
                return new Video_1.default({
                    id: video.id,
                    title: snippet.title,
                    thumbnailURL: thumbnail.url,
                    channelID: snippet.channelId,
                    description: snippet.description,
                    publishDate: new Date(snippet.publishedAt),
                }, true);
            });
            const snapshots = response.items.map(video => {
                const stats = video.statistics;
                return new Snapshot_1.default(video.id, new Date(), stats.viewCount, stats.likeCount, stats.dislikeCount, stats.favoriteCount, stats.commentCount);
            });
            yield Promise.all([
                Channel_2.channelStore.put(channels),
                Video_2.videoStore.patch(videos),
                Snapshot_2.snapshotStore.post(snapshots)
            ]);
        });
    }
}
exports.recorder = new Recorder();
//# sourceMappingURL=Recorder.js.map