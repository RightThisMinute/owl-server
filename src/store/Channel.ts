
import * as Sequelize from 'sequelize'
import model from '../models/Channel'


type ModelInstance = Sequelize.Instance<model>
type ModelType = Sequelize.Model<ModelInstance, model>


const ST = Sequelize
const schema = {
	id: { type: ST.STRING, allowNull: false, primaryKey: true },
	name: { type: ST.STRING, allowNull: false },
}


class Channel {
	private model: ModelType

	syncModel(connection: Sequelize.Sequelize): PromiseLike<ModelType>
	{
		this.model = connection.define<ModelInstance, model>(
			'channel', schema
		)
		return this.model.sync()
	}
}


export const channelStore = new Channel()
