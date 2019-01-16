module.exports = function(emails = [], column) {
    let len = emails && emails.length || 0;
    if(!len) {
        return '';
    }
    if(!column || column === 1) {
        return emails.join(column ? '\n' : ',');
    }
    let result = [];
    for (let i = 0; i < Math.ceil(len / column); i++) {
        result.push(emails.slice(i * column, i * column + column));
    }
    return result.map(item => item.join(',')).join('\n');
};