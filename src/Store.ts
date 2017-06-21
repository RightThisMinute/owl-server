
import * as createDebug from 'debug'
const debug = createDebug('Store')
import * as Sequelize from 'sequelize'

import { channelStore } from './store/Channel'


/**
 * Defined as abstract to allow exporting without allowing instantiation.
 */
export abstract class Store {
	connection: Sequelize.Sequelize

	constructor() {
		this.connection = new Sequelize('postgres://localhost:5432/owl', {
			define: {
				underscored: true
			}
		})

		this.syncModels()
			.catch(reason => {
				console.error('Failed syncing models.', reason)
			})

		debug('Initialized.')
	}

	async syncModels(): Promise<any> {
		let promises: PromiseLike<any>[] = []

		promises.push(channelStore.syncModel(this.connection))

		try {
			await promises.forEach(async promise => await promise)
		}
		catch (error) {

		}
	}
}

class _Store extends Store {}


// `export default` is not used because it would result in a new instance
// being created on each import.
export const store = new _Store()
