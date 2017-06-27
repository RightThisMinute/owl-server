
import Timer = NodeJS.Timer
import * as request from 'request-promise-native'

import { config } from './Config'

import Channel from './models/Channel'
import { channelStore } from './store/Channel'
import Snapshot from './models/Snapshot'
import { snapshotStore } from './store/Snapshot'
import Video from './models/Video'
import { videoStore } from './store/Video'
import * as YouTube from './YouTube'

import * as createDebug from 'debug'
const debug = createDebug('Recorder')


class Recorder {

	private recording = false
	private intervalReference: Timer

	public start(interval: number): void {
		this.intervalReference = setInterval(() => {
			if (this.recording) {
				debug('Already recording. SKIP.')
				return;
			}

			this.recording = true

			debug('TICK')
			this.record()
				.then(() => this.recording = false)
				.catch(error => {
					console.error('Failed recording snapshots.', error)
					this.recording = false
				})
		}, interval)
	}

	public stop(): void {
		clearInterval(this.intervalReference)
	}

	public async record(): Promise<void> {
		const ids = await videoStore.getActiveIDs()

		const uri = 'https://www.googleapis.com/youtube/v3/videos'
		          + '?part=snippet,statistics'
		          + `&id=${ids.join(',')}`
		          + `&key=${config.youtube.key}`

		const response: YouTube.VideoListResponse =
			await request({ uri, json: true }).catch(reason => {
				console.error('Failed requesting video details from YouTube.',
				              uri, reason)
			})

		if (response.hasOwnProperty('error')) {
			console.error('Error response from YouTube.', uri, response.error)
			throw Error('Error response from YouTube.')
		}

		const channels = response.items
			.map(video => {
				return new Channel(video.snippet.channelId, video.snippet.channelTitle)
			})
			.sort((a, b) => {
				// Group duplicates together
				if (a.id  <  b.id) return -1
				if (a.id === b.id) return  0
				if (a.id  >  b.id) return  1
			})
			.reduce((acc, channel) => {
				// Remove duplicates
				if (acc.length > 0 &&  channel.id === acc[acc.length-1].id)
					return acc
				acc.push(channel)
				return acc
			}, [])

		const videos = response.items.map(video => {
			const snippet = video.snippet

			const thumbs = video.snippet.thumbnails
			const thumbnail = Object.getOwnPropertyNames(thumbs)
				.reduce((largest: YouTube.Thumbnail, name) => {
					return !largest || largest.width < thumbs[name].width
						? thumbs[name] : largest
				}, null)

			return new Video({
				id: video.id,
				title: snippet.title,
				thumbnailURL: thumbnail.url,
				channelID: snippet.channelId,
				description: snippet.description,
				publishDate: new Date(snippet.publishedAt),
			}, true)
		})

		const snapshots = response.items.map(video => {
			const stats = video.statistics
			return new Snapshot(video.id, new Date(),
				stats.viewCount, stats.likeCount, stats.dislikeCount,
				stats.favoriteCount, stats.commentCount
			)
		})

		await Promise.all([
			channelStore.put(channels),
			videoStore.patch(videos),
			snapshotStore.post(snapshots)
		])
	}
}

export const recorder = new Recorder()
