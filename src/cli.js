'use strict';

const path = require('path');
const chalk = require('chalk');
const isGlob = require('is-glob');
const program = require('commander');
const pkg = require('../package.json');
const getConfig = require('./get_config');
const getEmailsStr = require('./get_emails_str');
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

        const config = getConfig(program.config);
        if (!config) {
            console.log(chalk.whiteBright.bgRed('【dirs-limiter】Lack of configuration!'));
            process.exit(ERROR);
        }

        const {
            globs = [],
            emails = [],
            limitMsg = '',
            contactMsg = '',
            emailColumn = ''
        } = config || {};

        const invalidGlobs = globs.filter(glob => !isGlob(glob)) || [];
        if (invalidGlobs.length) {
            console.log('Invalid ?(ext)globs:');
            console.log(chalk.whiteBright.bgRed(invalidGlobs.join('\n')));
        }

        const authorEmail = process.env.GIT_AUTHOR_EMAIL;
        if (!emails || !emails.length || emails.includes(authorEmail)) {
            process.exit(PASS);
        }

        const limitPaths = getLimitPaths({
            commitFiles: program.args.map(arg => path.relative('', arg).replace(/^"|"$/g, '')),
            globs: globs.filter(path => isGlob(path))
        });

        if (limitPaths && limitPaths.length) {
            const fileStyle = chalk.redBright.bold.underline;
            const warnStyle = chalk.whiteBright.bgRed;
            const userStyle = chalk.underline;
            console.log(`
                \n${authorEmail || 'User'} ${limitMsg || 'is not allowed to commit these files:'} \n${fileStyle(`${limitPaths.join('\n')}`)}
                \n${warnStyle(contactMsg || 'Please contact these developers:')} \n${userStyle(getEmailsStr(emails, emailColumn))}}
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