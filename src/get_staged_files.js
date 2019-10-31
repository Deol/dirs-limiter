'use strict';

const sgf = require('staged-git-files');
const path = require('path');

module.exports = async function(gitDir) {
    try {
        if (gitDir) {
            sgf.cwd = gitDir;
        }
        const stagedFiles = await sgf();
        return stagedFiles.map(file => (gitDir ? path.relative(process.cwd(), path.resolve(gitDir, file.filename)) : file.filename));
    } catch (err) {
        throw new Error(`Please set ${gitDir ? 'the right' : ''} config.gitDir!`);
    }
};