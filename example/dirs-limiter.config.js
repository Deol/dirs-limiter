module.exports = {
    globs: [
        '**/*.js'
    ],
    emails: [
        'A_doz@126.com'
    ],
    excludes: [
        {
            globs: [
                'src/get_limit_paths.js'
            ],
            emails: [
                'you@niubility.com'
            ]
        }
    ],
    emailColumn: 1,
    limitMsg: '不允许提交下列文件：',
    contactMsg: '若需要修改，请联系下列成员：'
};