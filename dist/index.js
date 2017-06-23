"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
const createDebug = require("debug");
const debug = createDebug('index');
const API_1 = require("./API");
const Config_1 = require("./Config");
const Store_1 = require("./Store");
const port = normalizePort(process.env.PORT || Config_1.config.api.port);
API_1.default.set('port', port);
const server = http.createServer(API_1.default);
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Store_1.store.initialize(Config_1.config.database.host, Config_1.config.database.port, Config_1.config.database.name);
        server.listen(port);
        server.on('error', onError);
        server.on('listening', onListening);
    });
}
function normalizePort(val) {
    let port = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port))
        return val;
    else if (port >= 0)
        return port;
    else
        return false;
}
function onError(error) {
    if (error.syscall !== 'listen')
        throw error;
    let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}
function onListening() {
    let addr = server.address();
    let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
    debug(`Listening on ${bind}`);
}
main()
    .then(() => debug('Up and running.'))
    .catch(reason => console.error('Failed to start.', reason));
