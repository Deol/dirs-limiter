'use strict';

const path = require('path');
const util = require('util');
const sgf = require('staged-git-files');
const sgfiy = util.promisify(sgf);

module.exports = async function(files) {
    // lint-staged matched files
    if(files && files.length) {
        return files.map(file => path.relative(process.cwd(), file).replace(/^"|"$/g, ''));
    }
    // all staged files
    const stagedFiles = await sgfiy();
    return stagedFiles.map(file => file.filename);
};