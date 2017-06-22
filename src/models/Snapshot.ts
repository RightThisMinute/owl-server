
export default class Snapshot {
	id: number
	videoID: string
	recordedAt: Date

	viewCount: number
	likeCount: number
	dislikeCount: number
	favoriteCount: number
	commentCount: number

	constructor(videoID: string, recordedAt: Date,
	            views: number, likes: number, dislikes: number, favs: number,
	            comments: number, id?: number)
	{
		this.id = id
		this.videoID = videoID
		this.recordedAt = recordedAt
		this.viewCount = views
		this.likeCount = likes
		this.dislikeCount = dislikes
		this.favoriteCount = favs
		this.commentCount = comments
	}
}
