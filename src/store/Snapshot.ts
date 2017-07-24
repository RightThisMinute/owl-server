
import * as Sequelize from 'sequelize'

import Base from './Base'
// import { videoStore } from './Video'
import Snapshot from '../models/Snapshot'
import { Seconds } from '../types'

import * as createDebug from 'debug'
const debug = createDebug('store.snapshot')


const ST = Sequelize

const schema = {
	videoID: {
		type: ST.STRING, allowNull: false, field: 'video_id',
		// Leaving out the reference metadata for now as it's causing an error that
		// I haven't been able to figure out yet.
		// references: { model: videoStore.model, key: 'id' }
	},
	recordedAt: {
		type: ST.DATE, allowNull: false, defaultValue: ST.NOW,
		field: 'created_at'
	},
	viewCount: {
		type: ST.BIGINT, allowNull: false, defaultValue: 0,
		field: 'view_count'
	},
	likeCount: {
		type: ST.BIGINT, allowNull: false, defaultValue: 0,
		field: 'like_count'
	},
	dislikeCount: {
		type: ST.BIGINT, allowNull: false, defaultValue: 0,
		field: 'dislike_count'
	},
	favoriteCount: {
		type: ST.BIGINT, allowNull: false, defaultValue: 0,
		field: 'favorite_count'
	},
	commentCount: {
		type: ST.BIGINT, allowNull: false, defaultValue: 0,
		field: 'comment_count'
	},
}


class SnapshotStore extends Base<Snapshot> {

	public async post(snapshots: Snapshot[]): Promise<void> {
		await this.model.bulkCreate(snapshots)
	}

	public async getAll(): Promise<Snapshot[]> {
		const snapshots = await this.model.findAll()
		return snapshots.map(snapshot => snapshot.get())
	}

	public async getByVideoAndAge(vidID: string, age: Seconds):
		Promise<Snapshot[]>
	{
		const datetime = new Date(Date.now() - (age * 1000))

		const snapshots = await this.model.findAll({
			where: {
				videoID: vidID,
				recordedAt: { $gte: datetime }
			},
			order: [['created_at', 'ASC']],
		})

		return snapshots.map(snapshot => snapshot.get())
	}

}

export const snapshotStore = new SnapshotStore('snapshot', schema)
