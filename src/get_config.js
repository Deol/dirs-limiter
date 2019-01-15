const fs = require('fs');
const path = require('path');

module.exports = function(configPath) {

    const PkgPath = path.resolve('./package.json');
    const pkgConfig = fs.existsSync(PkgPath) && require(PkgPath)['dirs-limiter'];

    const jsPath = path.resolve(configPath || './dirs-limiter.config.js');
    const jsConfig = fs.existsSync(jsPath) && require(jsPath);

    return (configPath ? jsConfig : pkgConfig || jsConfig) || {};
};