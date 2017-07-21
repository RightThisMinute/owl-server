
import * as bodyParser from 'body-parser'
import * as express from 'express'
import { some } from 'lodash'
import * as logger from 'morgan'

import { config } from './config'
import GraphQLRouter from './graphql'

// Creates and configures an ExpressJS web server.
class App {

	// ref to Express instance
	public express: express.Application

	// Run configuration methods on Express instance
	constructor() {
		this.express = express()
		this.middleware()
		this.routes()
	}

	// Configure Express middleware
	private middleware(): void {
		this.express.use(logger('dev'))
		this.express.use(bodyParser.json())
		this.express.use(bodyParser.urlencoded({extended: false}))
		this.express.use(corsMiddleware)
	}

	// Configure API endpoints.
	private routes(): void {
		// This is just to get up and running, and to make sure what we've got
		// is working so far. This function will change when we start to add
		// more API endpoints.
		let router = express.Router()
		// placeholder route handler
		router.get('/', (req, res, next) => {
			res.json({
				message: 'Hello, World!'
			})
		})

		router.options('/graphql', (req, res, next) => {
			res.end()
		})

		this.express.use('/', router)
		this.express.use('/graphql', GraphQLRouter)
	}

}

function corsMiddleware(req, res, next): void {
	const origin = req.header('origin')

	if (!origin || !config.cors || !config.cors.originPatterns) {
		next()
		return
	}

	const matched = some(config.cors.originPatterns, (pattern) => {
		return pattern.test(origin)
	})

	if (matched) {
		res.header('Access-Control-Allow-Origin', origin)
		res.header('Access-Control-Allow-Method',
		           req.header('Access-Control-Request-Method'))
		res.header('Access-Control-Allow-Headers',
		           req.header('Access-Control-Request-Headers'))
	}

	next()
}


export default new App().express


