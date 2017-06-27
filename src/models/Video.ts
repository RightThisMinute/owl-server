
import Channel from './Channel'

export default class Video {
	id?: string
	title?: string
	thumbnailURL?: string
	channelID?: string
	description?: string
	publishDate?: Date
	active?: boolean

	constructor(
		{ id, title, thumbnailURL, channelID, description, publishDate }: Video,
		active = false)
	{
		this.id = id
		this.title = title
		this.thumbnailURL = thumbnailURL
		this.channelID = channelID
		this.description = description
		this.publishDate = publishDate
		this.active = active
	}
}
