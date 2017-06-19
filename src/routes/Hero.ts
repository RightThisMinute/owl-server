
import {Router, Request, Response, NextFunction} from 'express'

/** @var object[] Heroes */
export const Heroes = require('../data')

export class HeroRouter {
	router: Router

	constructor() {
		this.router = Router()
		this.init()
	}

	/**
	 * Get All Heroes
	 *
	 * @param req
	 * @param res
	 * @param next
	 */
	public getAll(req: Request, res: Response, next: NextFunction) {
		res.send(Heroes)
	}

	public getOne(req: Request, res: Response, next: NextFunction) {
		let query = parseInt(req.params.id)
		let hero = Heroes.find(hero => hero.id === query)
		if (hero) {
			res.status(200)
				.send({
					message: 'Success',
					status: res.status,
					hero
				})
		}
		else {
			res.status(404)
				.send({
					message: 'No hero found with the given ID.',
					status: res.status
				})
		}
	}

	/**
	 * Take each handler, and attach to one of the Express.Router's endpoints.
	 */
	private init() {
		this.router.get('/', this.getAll)
		this.router.get('/:id', this.getOne)
	}
}


// Create the HeroRouter, and export its configured Express.Router
export default (new HeroRouter()).router
