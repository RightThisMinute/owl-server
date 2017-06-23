
import * as Sequelize from 'sequelize'

import Base from './Base'
import { channelStore } from './Channel'
import Video from '../models/Video'
import { store } from '../Store'

import * as createDebug from 'debug'
const debug = createDebug('videoStore')


const ST = Sequelize
const schema = {
	id: { type: ST.STRING, allowNull: false, primaryKey: true },
	title: ST.STRING,
	thumbnailURL: { type: ST.STRING, field: 'thumbnail_url' },
	channelID: {
		type: ST.STRING, field: 'channel_id',
		// Leaving out the reference metadata for now as it's causing an error that
		// I haven't been able to figure out yet.
		// references: { model: channelStore.model, key: 'id' }
	},
	description: ST.TEXT,
	publishDate: { type: ST.DATE, field: 'published_at' },
	active: { type: ST.BOOLEAN, allowNull: false },
}

class VideoStore extends Base<Video> {

	async setActive(ids: string[]): Promise<any> {
		const videos = ids.map(id => new Video({id}, true))

		return store.connection.transaction(async transaction => {
			await this.model.update({ active: false }, {
				transaction,
				where: { active: true },
			})

			await Promise.all(videos.map(video => {
				return this.model.upsert(video, { transaction })
			}))
		})
	}

	async getActiveIDs(): Promise<string[]> {
		const videos = await this.model.findAll({
			attributes: ['id'],
			where: { active: true }
		})

		return videos.map(video => video.get('id'))
	}

}

export const videoStore = new VideoStore('video', schema)
