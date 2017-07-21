"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const express = require("express");
const lodash_1 = require("lodash");
const logger = require("morgan");
const config_1 = require("./config");
const graphql_1 = require("./graphql");
// Creates and configures an ExpressJS web server.
class App {
    // Run configuration methods on Express instance
    constructor() {
        this.express = express();
        this.middleware();
        this.routes();
    }
    // Configure Express middleware
    middleware() {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(corsMiddleware);
    }
    // Configure API endpoints.
    routes() {
        // This is just to get up and running, and to make sure what we've got
        // is working so far. This function will change when we start to add
        // more API endpoints.
        let router = express.Router();
        // placeholder route handler
        router.get('/', (req, res, next) => {
            res.json({
                message: 'Hello, World!'
            });
        });
        router.options('/graphql', (req, res, next) => {
            res.end();
        });
        this.express.use('/', router);
        this.express.use('/graphql', graphql_1.default);
    }
}
function corsMiddleware(req, res, next) {
    const origin = req.header('origin');
    if (!origin || !config_1.config.cors || !config_1.config.cors.originPatterns) {
        next();
        return;
    }
    const matched = lodash_1.some(config_1.config.cors.originPatterns, (pattern) => {
        return pattern.test(origin);
    });
    if (matched) {
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Method', req.header('Access-Control-Request-Method'));
        res.header('Access-Control-Allow-Headers', req.header('Access-Control-Request-Headers'));
    }
    next();
}
exports.default = new App().express;
//# sourceMappingURL=API.js.map