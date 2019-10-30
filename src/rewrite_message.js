'use strict';

const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

/**
 * 获取 message 文件所在位置
 */
function getMsgFilePath() {
    const gitParams = process.env.HUSKY_GIT_PARAMS || process.env.GIT_PARAMS || '';
    return gitParams && gitParams.split && gitParams.split(' ')[0] || '';
}

/**
 * 往 commit message 中追加信息
 */
module.exports = async function(appendMsg) {
    const msgFilePath = getMsgFilePath();
    try {
        let message = await readFile(msgFilePath, { encoding: 'utf-8' });
        await writeFile(msgFilePath, `${message}${appendMsg}`, { encoding: 'utf-8' });
    } catch (error) {
        throw new Error('Can be used only in git prepare-commit-msg hook.');
    }
};