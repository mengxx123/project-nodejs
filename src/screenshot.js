const path = require('path')
const fs = require('fs')

function screenshot(resPath) {
    let screenshotPath = path.resolve(resPath, 'screenshot')
    if (!fs.existsSync(screenshotPath)) {
        return []
    }
    let files = fs.readdirSync(screenshotPath)
    return files.map(item => {
        console.log(item)
        return {
            path: '_project/screenshot/' + item
        }
    })
}

module.exports = screenshot
