'use strict';

const mm = require('micromatch');

/**
 * 根据可能存在的 func 条件获取 globs list
 * @param {Array} list globs 列表，单项结构为对象且必有 globs 数组：[{ globs: [] }]
 * @param {Function} func 过滤函数
 */
const filterGlobs = (list, func) => list && list.reduce && list.reduce((globs, item) => {
    if(func && typeof func === 'function' ? func(item) : true) {
        globs.push(...item.globs || []);
    }
    return globs;
}, []) || [];

module.exports = function({ globs, stagedFiles, authorEmail, excludes, warnings } = {}) {
    if (!globs || !stagedFiles || !globs.length || !stagedFiles.length) {
        return {
            limitPaths: [],
            // excludePaths: [],
            warningPaths: []
        };
    }
    // 过滤白名单 globs
    const excludeFilterFunc = item => item.emails && item.emails.includes && item.emails.includes(authorEmail);
    const excludeGlobs = filterGlobs(excludes, excludeFilterFunc);
    // 过滤二次确认列表 globs
    const warningGlobs = filterGlobs(warnings);
    return {
        // 限制提交的文件列表
        limitPaths: mm(stagedFiles, globs, { ignore: excludeGlobs.concat(warningGlobs) }) || [],
        // limitPaths 需要过滤的匹配子集，即不限制提交的白名单列表
        // excludePaths: excludeGlobs.length && mm(stagedFiles, excludeGlobs) || [],
        // 需要用户进行二次确认的警告文件列表
        warningPaths: warningGlobs.length && mm(stagedFiles, warningGlobs, { ignore: excludeGlobs }) || []
    };
};