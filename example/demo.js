
const mm = require('micromatch');

let result = mm(
    ['src/get_limit_paths.js', 'example/dirs-limiter.config.js'],
    ['**/*'],
    { ignore: ['src/get_limit_paths.js'] }
);

console.log(result);