
import { Seconds } from '../types'
import Snapshot from '../models/Snapshot'
import Video from '../models/Video'
import { channelStore } from '../store/Channel'
import { videoStore } from '../store/Video'
import { snapshotStore } from '../store/Snapshot'

import * as createDebug from 'debug'
const debug = createDebug('graphql.Video')


export default class GQLVideo {

	public static async setActive(ids: string[]): Promise<void> {
		await videoStore.setActive(ids)
	}

	public static async getActive(): Promise<GQLVideo[]> {
		const vids = await videoStore.getActive()
		return vids.map(this.fromVideo)
	}

	private static fromVideo(vid: Video): GQLVideo
	{
		const gqlVid = new GQLVideo
		gqlVid.id = vid.id
		gqlVid.active = vid.active
		gqlVid.details = vid.title ? VideoDetails.fromVideo(vid) : null

		return gqlVid
	}

	public id: string
	public active: boolean
	public details: VideoDetails

	public async statsByAge({seconds}: {seconds: Seconds}): Promise<VideoStats[]>
	{
		const snapshots = await snapshotStore.getByVideoAndAge(this.id, seconds)
		return snapshots.map(VideoStats.fromSnapshot)
	}
}


class VideoDetails {
	public static fromVideo({title, description, thumbnailURL,
		                       publishDate, channelID}: Video): VideoDetails
	{
		const details = new VideoDetails

		details.title = title
		details.description = description
		details.thumbnailURL = thumbnailURL
		details.publishedAt = publishDate.getTime()

		const channel = new Channel
		channel.id = channelID
		details.channel = channel

		return details
	}

	public title: string
	public description: string
	public thumbnailURL: string
	public publishedAt: number
	public channel: Channel
}


class Channel {
	public id: string
	private _name: string

	public async name(): Promise<string> {
		if (this._name)
			return this._name

		const channel = await channelStore.getByID(this.id)
		this._name = channel.name

		return this._name
	}
}


class VideoStats {
	public static fromSnapshot(snapshot: Snapshot): VideoStats {
		const stats = new VideoStats

		stats.videoID = snapshot.videoID
		stats.recordedAt = snapshot.recordedAt.getTime()
		stats.views = snapshot.viewCount
		stats.likes = snapshot.likeCount
		stats.dislikes = snapshot.dislikeCount
		stats.favorites = snapshot.favoriteCount
		stats.comments = snapshot.commentCount

		return stats
	}

	public videoID: string
	public recordedAt: number
	public views: number
	public likes: number
	public dislikes: number
	public favorites: number
	public comments: number
}
