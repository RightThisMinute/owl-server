
import * as http from 'http'
import * as createDebug from 'debug'
const debug = createDebug('index')

import API from './API'
import { config } from './Config'
import { recorder } from './Recorder'
import { store } from './Store'

const port = normalizePort(process.env.PORT || config.api.port)
API.set('port', port)
const server = http.createServer(API)


async function main(): Promise<any> {
	await store.initialize(
		config.database.host, config.database.port, config.database.name,
		{ dropAndRecreateTables: false }
	)

	server.listen(port)
	server.on('error', onError)
	server.on('listening', onListening)

	recorder.start(3 * 60 * 1000)
}


function normalizePort(val: number|string): number|string|boolean {
	let port: number = (typeof val === 'string') ? parseInt(val, 10) : val
	if (isNaN(port))return val
	else if (port >= 0) return port
	else return false
}

function onError(error: NodeJS.ErrnoException): void {
	if (error.syscall !== 'listen') throw error
	let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port
	switch(error.code) {
		case 'EACCES':
			console.error(`${bind} requires elevated privileges`)
			process.exit(1)
			break
		case 'EADDRINUSE':
			console.error(`${bind} is already in use`)
			process.exit(1)
			break
		default:
			throw error
	}
}

function onListening(): void {
	let addr = server.address()
	let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`
	debug(`Listening on ${bind}`)
}

main()
	.then(() => debug('Up and running.'))
	.catch(reason => console.error('Failed to start.', reason))
