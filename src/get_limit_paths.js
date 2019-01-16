const mm = require('micromatch');

module.exports = function({ commitFiles, globs } = {}) {
    if(!commitFiles || !commitFiles.length || !globs || !globs.length) {
        return [];
    }
    return mm(commitFiles, globs);
};