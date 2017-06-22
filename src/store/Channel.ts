
import * as Sequelize from 'sequelize'

import Base from './Base'
import model from '../models/Channel'


const ST = Sequelize
const schema = {
	id: { type: ST.STRING, allowNull: false, primaryKey: true },
	name: { type: ST.STRING, allowNull: false },
}

class Channel extends Base<model> {}
export const channelStore = new Channel('channel', schema)
