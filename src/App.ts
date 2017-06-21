
import * as path from 'path'
import * as express from 'express'
import * as logger from 'morgan'
import * as bodyParser from 'body-parser'

import HeroRouter from './routes/Hero'
import GraphQLRouter from './graphql'
import { Store, store } from './Store'

// Creates and configures an ExpressJS web server.
class App {

	// ref to Express instance
	public express: express.Application
	private store: Store

	// Run configuration methods on Express instance
	constructor() {
		this.store = store
		this.express = express()
		this.middleware()
		this.routes()
	}

	// Configure Express middleware
	private middleware(): void {
		this.express.use(logger('dev'))
		this.express.use(bodyParser.json())
		this.express.use(bodyParser.urlencoded({extended: false}))
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

		this.express.use('/', router)
		this.express.use('/api/v1/heroes', HeroRouter)
		this.express.use('/graphql', GraphQLRouter)
	}

}

export default new App().express


