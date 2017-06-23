
import * as S from 'sequelize'
import * as createDebug from 'debug'
const debug = createDebug('Store')

abstract class Base<ModelType> {
	protected name: string
	protected schema: S.DefineAttributes
	protected options: S.DefineOptions<S.Instance<ModelType>>
	protected _model: S.Model<S.Instance<ModelType>, ModelType>

	public get model(): S.Model<S.Instance<ModelType>, ModelType> {
		return this._model
	}

	constructor(name: string, schema: S.DefineAttributes,
	            options?: S.DefineOptions<S.Instance<ModelType>>)
	{
		debug(`Constructing store instance for table ${name}.`)
		this.name = name
		this.schema = schema
		this.options = options
	}

	async syncModel(connection: S.Sequelize, force = false): Promise<any> {
		debug(`Defining ${this.name} model.`)
		this._model = connection.define<S.Instance<ModelType>, ModelType>(
			this.name, this.schema, this.options
		)

		await this.model.sync({ force })
		debug(`Synced ${this.name} model.`)
	}
}


export default Base
