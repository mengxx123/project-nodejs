const path = require('path')
const fs = require('fs')
const secret = requrie('./secret')

let secretConfig = {}
let secretConfigPath = path.resolve(__dirname, 'secret.js')
if (fs.existsSync(secretConfigPath)) {
    let content = fs.readFileSync(secretConfigPath, 'utf-8')
    secretConfig = JSON.parse(content)
}

const config = {
    indent: 4,
    defaultAuthor: 'yunser <1418503647@.qq.com>',
    defaultLicense: 'MIT',
    syncGithub: true,
    githubToken: secretConfig.githubToken || ''
}

module.exports = config
