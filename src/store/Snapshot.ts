
import * as Sequelize from 'sequelize'

import Base from './Base'
import { videoStore } from './Video'
import model from '../models/Snapshot'


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


class Snapshot extends Base<model> {}
export const snapshotStore = new Snapshot('snapshot', schema)
