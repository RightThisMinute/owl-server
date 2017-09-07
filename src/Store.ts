
import * as createDebug from 'debug'
const debug = createDebug('Store')
import * as Sequelize from 'sequelize'

import { DatabaseConfig } from './config'
import { channelStore } from './store/Channel'
import { videoStore } from './store/Video'
import { snapshotStore } from './store/Snapshot'
import Base from './store/Base'


type InitOptions = {
	dropAndRecreateTables?: boolean,
}


/**
 * Defined as abstract to allow exporting without allowing instantiation.
 */
class Store {

	public static get stores(): Base<any>[] {
		return [channelStore, videoStore, snapshotStore]
	}

	private _connection: Sequelize.Sequelize
	public get connection(): Sequelize.Sequelize { return this._connection }


	public async initialize(config: DatabaseConfig,
	                        options: InitOptions = {}): Promise<void>
	{
		const { host, port, name, user, password } = config
		const userString = user !== undefined ? `${user}:${password || ''}@` : ''

		const url = `postgres://${userString}${host}:${port}/${name}`
		this._connection = new Sequelize(url, {
			define: {
				underscored: true
			}
		})

		await this.connection.authenticate().catch(reason => {
			console.error(`Failed connecting to database with ${url}.`, reason)
		})

		debug('Syncing models...')
		const force = options.dropAndRecreateTables || false
		await this.syncModels(force).catch(reason => {
			console.error('Failed syncing models.', reason)
		})

		debug('Initialized.')
	}

	private async syncModels(force = false): Promise<void> {
		for (let sx = 0; sx < Store.stores.length; sx++)
			await Store.stores[sx].syncModel(this.connection, force)
	}
}


// `export default` is not used because it would result in a new instance
// being created on each import.
export const store = new Store()
