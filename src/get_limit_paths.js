const limit = require('ignore');

module.exports = function({ filePaths = [], commitPaths = [] } = {}) {
    const limiter = limit().add(filePaths);
    return commitPaths.filter(commitPath => limit.isPathValid(commitPath) && limiter.ignores(commitPath));
};