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
                'example/dirs-limiter.config.js',
                'src/*.js'
            ],
            emails: [
                'test@test.com'
            ]
        }
    ],
    warnings: [
        {
            globs: [
                'example/demo.js'
            ],
            refuseMsg: '未通过 review，不允许提交上述文件，请找同事 review 后再提交！',
            commitMsg: '（reviewer: ${reviewer}）',
            options: [
                {
                    type: 'confirm',
                    name: 'confirm',
                    message: '上述文件改动风险较高，是否已请同事 review 确认？'
                },
                {
                    type: 'input',
                    name: 'reviewer',
                    message: '请输入为您 review 的同事名号：',
                    when: answers => answers.confirm
                }
            ]
        }
    ],
    emailColumn: 2,
    limitMsg: '不允许提交下列文件：',
    contactMsg: '若需要修改，请联系下列成员：',
    guiWarningMsg: '此类情况下，需要使用终端进行确认提交！'
};