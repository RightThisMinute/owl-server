"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
/** @var object[] Heroes */
exports.Heroes = require('../data');
class HeroRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    /**
     * Get All Heroes
     *
     * @param req
     * @param res
     * @param next
     */
    getAll(req, res, next) {
        res.send(exports.Heroes);
    }
    getOne(req, res, next) {
        let query = parseInt(req.params.id);
        let hero = exports.Heroes.find(hero => hero.id === query);
        if (hero) {
            res.status(200)
                .send({
                message: 'Success',
                status: res.status,
                hero
            });
        }
        else {
            res.status(404)
                .send({
                message: 'No hero found with the given ID.',
                status: res.status
            });
        }
    }
    /**
     * Take each handler, and attach to one of the Express.Router's endpoints.
     */
    init() {
        this.router.get('/', this.getAll);
        this.router.get('/:id', this.getOne);
    }
}
exports.HeroRouter = HeroRouter;
// Create the HeroRouter, and export its configured Express.Router
exports.default = (new HeroRouter()).router;
