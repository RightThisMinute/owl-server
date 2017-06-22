
import Channel from './Channel'

export default class Video {
	id: string
	title: string
	thumbnailURL: URL
	channelID: number
	description: string
	publishDate: Date

	constructor(id: string, title: string, thumbURL: URL, channelID: number,
	            desc: string, pubDate: Date)
	{
		this.id = id
		this.title = title
		this.thumbnailURL = thumbURL
		this.channelID = channelID
		this.description = desc
		this.publishDate = pubDate
	}
}
