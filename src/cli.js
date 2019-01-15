'use strict';

const path = require('path');
const chalk = require('chalk');
const program = require('commander');
const pkg = require('../package.json');
const getConfig = require('./get_config');
const getLimitPaths = require('./get_limit_paths');

const PASS = 0, ERROR = 1;

module.exports = function() {
    try {
        program
            .version(pkg.version)
            .option('-c, --config <path>', `path to a specific configuration file (CommonJS).
                     If no --config argument is provided, dirs-limiter will search for configuration files in the following places, in this order:
                     - a dirs-limiter property in package.json
                     - a dirs-limiter.config.js file exporting a JS object
                     The search will begin in the working directory and move up the directory tree until a configuration file is found.
            `)
            .parse(process.argv);

        const {
            filePaths = [],
            emails = [],
            limitMsg = '',
            contactMsg = ''
        } = getConfig(program.config);

        if (!filePaths || !filePaths.length) {
            console.log(chalk.whiteBright.bgRed('【dirs-limiter】Lack of configuration!'));
            process.exit(ERROR);
        }

        const authorEmail = process.env.GIT_AUTHOR_EMAIL;
        if (!emails || !emails.length || emails.includes(authorEmail)) {
            process.exit(PASS);
        }

        const limitPaths = getLimitPaths({
            filePaths,
            commitPaths: program.args.map(arg => path.relative('', arg).replace(/^"|"$/g, ''))
        });

        if (limitPaths && limitPaths.length) {
            const fileStyle = chalk.redBright.bold.underline;
            const warnStyle = chalk.whiteBright.bgRed;
            const userStyle = chalk.underline;
            console.log(`
                \n${authorEmail || 'User'} ${limitMsg || 'is not allowed to commit these files:'} \n${fileStyle(`${limitPaths.join('\n')}`)}
                \n${warnStyle(contactMsg || 'Please contact these developers:')} \n${userStyle(emails.join(', '))}}
                \n\t\r
            `);
            process.exit(ERROR);
        }
    } catch (err) {
        console.error(err);
        process.exit(ERROR);
    }
    process.exit(PASS);
};