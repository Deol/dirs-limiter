const fs = require('fs');
const path = require('path');
const util = require('util');

module.exports = async function(configPath) {
    const exists = util.promisify(fs.exists);

    const PkgPath = path.resolve('./package.json');
    const pkgConfig = await exists(PkgPath) && require(PkgPath)['dirs-limiter'];

    const jsPath = path.resolve(configPath || './dirs-limiter.config.js');
    const jsConfig = await exists(jsPath) && require(jsPath);

    return (configPath ? jsConfig : pkgConfig || jsConfig) || null;
};