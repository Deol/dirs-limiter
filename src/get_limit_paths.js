const mm = require('micromatch');

module.exports = function({ commitFiles, globs, excludes, authorEmail } = {}) {
    if(!commitFiles || !commitFiles.length || !globs || !globs.length) {
        return [];
    }
    let ignorePatterns = [];
    excludes && excludes.forEach((item = {}) => {
        item.globs && item.emails &&
        item.emails.includes(authorEmail) &&
        ignorePatterns.push(...item.globs);
    });
    return mm(commitFiles, globs, { ignore: ignorePatterns });
};