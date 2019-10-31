'use strict';

const chalk = require('chalk');
const program = require('commander');
const inquirer = require('inquirer');
const { version } = require('../package.json');
const getConfig = require('./get_config');
const getEmailsStr = require('./get_emails_str');
const getGlobPaths = require('./get_glob_paths');
const getStagedFiles = require('./get_staged_files');
const rewriteMessage = require('./rewrite_message');

const PASS = 0, ERROR = 1;
const userStyle = chalk.underline;
const warnStyle = chalk.whiteBright.bgRed;
const noticeStyle = chalk.yellow.bold.underline;
const fileStyle = chalk.redBright.bold.underline;

module.exports = async function() {
    try {
        program
            .version(version)
            .option('-c, --config <path>', `path to a specific configuration file (CommonJS).
                     If no --config argument is provided, dirs-limiter will search for configuration files in the following places, in this order:
                     - a dirs-limiter property in package.json
                     - a dirs-limiter.config.js file exporting a JS object
                     The search will begin in the working directory and move up the directory tree until a configuration file is found.`)
            .option('-t, --tty-mode', 'execution in TTY mode')
            .option('-g, --gui-mode', 'execution in GUI mode')
            .parse(process.argv);

        // 获取配置信息
        const config = await getConfig(program.config);
        if (!config) {
            console.error(warnStyle('【dirs-limiter】Lack of configuration!'));
            process.exit(ERROR);
        }
        const {
            globs, emails,
            excludes, warnings,
            gitDir, emailColumn, limitMsg, contactMsg, guiWarningMsg
        } = config;

        // 获取 staged 中的 commit files，若无提交则直接绕过钩子
        const stagedFiles = await getStagedFiles(gitDir);
        !stagedFiles || !stagedFiles.length && process.exit(PASS);

        // 当前邮箱用户在管理员邮箱列表中时，直接绕过此钩子
        const authorEmail = process.env.GIT_AUTHOR_EMAIL;
        !emails || !emails.length || emails.includes(authorEmail) && process.exit(PASS);

        // 获取拦截文件列表和二次确认文件列表
        const { limitFiles, warningFiles } = getGlobPaths({ stagedFiles, globs, authorEmail, excludes, warnings });
        // 存在限制提交的文件，则直接拦截退出
        if (limitFiles && limitFiles.length) {
            console.error(`\n${authorEmail || 'You'} ${limitMsg || 'are not allowed to commit these files:'} \n${fileStyle(`${limitFiles.join('\n')}`)}`);
            console.error(`\n${warnStyle(contactMsg || 'Please contact these developers:')} \n${userStyle(getEmailsStr(emails, emailColumn))}\n`);
            process.exit(ERROR);
        }
        // 存在需要二次确认的文件，进行交互式确认
        if (warningFiles.length) {
            // GUI 环境下，直接拦截报错，提示去终端中执行命令
            if (program.guiMode) {
                console.error(`\n${authorEmail || 'You'} ${limitMsg || 'are not allowed to commit these files:'} \n${fileStyle(`${warningFiles.join('\n')}`)}`);
                console.error(`\n${warnStyle(guiWarningMsg || 'Please use the terminal to try again!')}\n`);
                process.exit(ERROR);
            }
            // 终端环境下，进行二次确认
            const warnings = config.warnings || [];
            for (let i = 0; i < warnings.length; i++) {
                let { globs, options, refuseMsg, commitMsg } = warnings[i] || {};
                let { limitFiles: paths } = getGlobPaths({ stagedFiles: warningFiles, globs });
                if(!options || !options.length || !commitMsg || !paths.length) {
                    continue;
                }
                // 进入交互式确认阶段
                console.info(`\n${noticeStyle(paths.join('\n'))}`);
                let answers = await inquirer.prompt(options);
                // 只要有一个回答不合规范则直接退出提交流程
                if(options.some(option => !answers[option.name])) {
                    console.error(`\n${warnStyle(refuseMsg || 'Not allowed to commit these files!')}\n`);
                    process.exit(ERROR);
                }
                // 存在输入信息情况，则写入 commit message 中
                await rewriteMessage(options.reduce((appendMsg, option) => {
                    let { type, name } = option || {};
                    return type === 'input' ? appendMsg.replace(`$\{${name}}`, answers[name]) : appendMsg;
                }, commitMsg), gitDir);
            }
        }
    } catch (err) {
        console.error(err);
        process.exit(ERROR);
    }
    process.exit(PASS);
};