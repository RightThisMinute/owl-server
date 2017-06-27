
export interface VideoListResponse {
	items?: [Video]
	error?: {
		code: number
		message: string
		errors: object[]
	}
}

export interface Video {
	id: string
	snippet?: VideoSnippet
	statistics?: VideoStatistics
}

export interface VideoSnippet {
	title: string
	publishedAt: string
	description: string
	thumbnails: { [key: string]: Thumbnail }
	channelId: string
	channelTitle: string
	tags: string[]
	categoryId: string
}

export interface Thumbnail {
	url: string
	width: number
	height: number
}

export interface VideoStatistics {
	viewCount: number
	likeCount: number
	dislikeCount: number
	favoriteCount: number
	commentCount: number
}
