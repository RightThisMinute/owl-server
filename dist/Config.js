"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yamlConfig = require("config-yaml");
let conf = yamlConfig(`${__dirname}/../config.yaml`);
if (conf.cors && conf.cors.originPatterns instanceof Array)
    conf.cors.originPatterns = conf.cors.originPatterns.map(pattern => {
        return new RegExp(pattern, 'i');
    });
exports.config = conf;
//# sourceMappingURL=Config.js.map