
import * as createDebug from 'debug'
const debug = createDebug('Store')
import * as Sequelize from 'sequelize'

import { channelStore } from './store/Channel'
import { videoStore } from './store/Video'
import { snapshotStore } from './store/Snapshot'



/**
 * Defined as abstract to allow exporting without allowing instantiation.
 */
export abstract class Store {
	private _connection: Sequelize.Sequelize

	public get connection(): Sequelize.Sequelize { return this._connection }

	async initialize(host: string, port: number, database: string): Promise<any> {
		const url = `postgres://${host}:${port}/${database}`
		this._connection = new Sequelize(url, {
			define: {
				underscored: true
			}
		})

		await this.connection.authenticate().catch(reason => {
			console.error(`Failed connecting to database with ${url}.`, reason)
		})

		debug('Syncing models...')
		await this.syncModels().catch(reason => {
			console.error('Failed syncing models.', reason)
		})

		debug('Initialized.')
	}

	async syncModels(force = false): Promise<any> {
		const stores = [channelStore, videoStore, snapshotStore]

		for (let sx = 0; sx < stores.length; sx++)
			await stores[sx].syncModel(this.connection, force)
	}
}

class _Store extends Store {}


// `export default` is not used because it would result in a new instance
// being created on each import.
export const store = new _Store()
