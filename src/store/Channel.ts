
import * as Sequelize from 'sequelize'

import Base from './Base'
import Channel from '../models/Channel'


const ST = Sequelize
const schema = {
	id: { type: ST.STRING, allowNull: false, primaryKey: true },
	name: { type: ST.STRING, allowNull: false },
}

class ChannelStore extends Base<Channel> {

	public async put(channels: Channel[]): Promise<void> {
		await Promise.all(channels.map(channel =>  this.model.upsert(channel)))
	}

	public async getAll(): Promise<Channel[]> {
		const channels = await this.model.findAll()
		return channels.map(channel => channel.get())
	}

}

export const channelStore = new ChannelStore('channel', schema)
