'use strict';

const fs = require('fs');
const util = require('util');
const path = require('path');

const exists = util.promisify(fs.exists);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

/**
 * 获取 message 文件所在位置
 */
function getMsgFilePath(gitDir) {
    const gitParams = process.env.HUSKY_GIT_PARAMS || process.env.GIT_PARAMS || '';
    const filePath = gitParams && gitParams.split && gitParams.split(' ')[0] || '';
    return gitDir ? path.resolve(gitDir, filePath) : filePath;
}

/**
 * 往 commit message 中追加信息
 */
module.exports = async function(appendMsg, gitDir) {
    const msgFilePath = getMsgFilePath(gitDir);
    const message = await exists(msgFilePath) && await readFile(msgFilePath, { encoding: 'utf-8' });
    if (message) {
        await writeFile(msgFilePath, `${message}${appendMsg}`, { encoding: 'utf-8' });
    } else {
        throw new Error('Can be used only in git prepare-commit-msg hook.');
    }
};