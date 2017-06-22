
import * as Sequelize from 'sequelize'

import Base from './Base'
import { channelStore } from './Channel'
import model from '../models/Video'


const ST = Sequelize
const schema = {
	id: { type: ST.STRING, allowNull: false, primaryKey: true },
	title: { type: ST.STRING, allowNull: false },
	thumbnailURL: { type: ST.STRING, allowNull: false, field: 'thumbnail_url' },
	channelID: {
		type: ST.STRING, allowNull: false, field: 'channel_id',
		// Leaving out the reference metadata for now as it's causing an error that
		// I haven't been able to figure out yet.
		// references: { model: channelStore.model, key: 'id' }
	},
	description: ST.TEXT,
	publishDate: { type: ST.DATE, field: 'published_at' }
}

class Video extends Base<model> {}
export const videoStore = new Video('video', schema)
