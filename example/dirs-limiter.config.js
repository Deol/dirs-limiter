module.exports = {
    // 需要匹配限制提交的文件列表
    globs: [
        '**/*.js'
    ],
    // 允许提交的用户邮箱列表
    emails: [
        'A_doz@126.com'
    ],
    // 白名单
    excludes: [
        {
            // 上方 globs 中的子集，允许下方邮箱用户提交
            globs: [
                'src/get_limit_paths.js'
            ],
            emails: [
                'you@niubility.com'
            ]
        }
    ],
    // 提示信息中的每行显示邮箱数量
    emailColumn: 1,
    // 限制提交的文案提醒
    limitMsg: '不允许提交下列文件：',
    // 限制提交的成员提醒
    contactMsg: '若需要修改，请联系下列成员：'
};