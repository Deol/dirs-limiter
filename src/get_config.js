'use strict';

const fs = require('fs');
const path = require('path');
const util = require('util');
const exists = util.promisify(fs.exists);

const readConfig = async(configPath) => {
    const resolvePath = path.resolve(configPath);
    return await exists(resolvePath) && require(resolvePath);
};

module.exports = async(configPath) => {
    const jsConfig = await readConfig(configPath || './dirs-limiter.config.js');
    const pkgConfig = await readConfig('./package.json');
    return (configPath ? jsConfig : pkgConfig || jsConfig) || null;
};