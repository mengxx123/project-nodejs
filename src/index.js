const path = require('path')
const fs = require('fs')
var colors = require('colors');
const config = require('./config')
const readme = require('./readme')
const github = require('./github')

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'red',
    info: 'green',
    data: 'blue',
    help: 'cyan',
    warn: 'yellow',
    debug: 'magenta',
    error: 'red'
});

let projectRootPath =  'D:\\yunser' // root path of projects
let projectName = 'clipboard-front' // current project's name
let projectPath = path.resolve(projectRootPath, projectName)


let resPath = path.resolve(projectPath, '_project')
if (!fs.existsSync(resPath)) {
    console.info('create directory _project.')
    fs.mkdirSync(resPath)
}

let packageJsonPath = path.resolve(projectPath, 'package.json')
if (!fs.existsSync(packageJsonPath)) {
    console.info('项目的 package.json 文件不存在，请创建！')
    process.exit()
    fs.mkdirSync(jsPath)
}

let manifestPath = path.resolve(resPath, 'manifest.json')
let manifest = {}
if (fs.existsSync(manifestPath)) {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
} else {
    if (fs.existsSync(packageJsonPath)) {
        let package = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
        console.info('create manifest.json by package.json.')
        let exportAttr = ['name', 'description', 'version', 'author', 'private', 'homepage', 'keywords', 'repository', 'license', 'bugs',
            'contributors']
        for (let attr of exportAttr) {
            manifest[attr] = package[attr]
        }
    } else {
        console.info('create manifest.json.')

    }
}

let package = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))

let project

// console.log(package)

// if (package.private) {
//     console.log('This is a private project'.yellow)
// }

// description

// homepage
// if (!package.homepage) {
//     package.homepage = []
// }


// manifest version
if (!manifest.manifest_version) {
    manifest.manifest_version = 1
}

// name
package.name = manifest.name

// description
package.description = manifest.description

// version
package.version = manifest.version

// author
package.version = manifest.author

// author
package.author = manifest.author

// private
package.private = manifest.private

// homepage
if (manifest.homepage) {
    package.homepage = manifest.homepage
}

// keywords
// if (!package.keywords) {
//     package.keywords = []
// }

// grade: default 3

// progress: default 50

// license
if (!manifest.license) {
    manifest.license = config.defaultLicense
    package.license = manifest.license
}
let licenseFile = path.resolve(projectPath, 'LICENSE')
if (!fs.existsSync(licenseFile)) {
    let licenseContent = fs.readFileSync(`./src/template/license/${manifest.license}.tpl`, 'utf-8')
    licenseContent = licenseContent.replace(/{{\s*time\s*}}/, '2018')
    licenseContent = licenseContent.replace(/{{\s*owner\s*}}/, 'yunser.com')
    console.log('create file LICENSE')
    fs.writeFileSync(licenseFile, licenseContent)
}

// package.json
const attrs = ['name', 'description', 'version', 'author', 'keywords', 'repository', 'license', 'scripts', 'engines', 'bugs',
    'contributors', 'browserslist', 'dependencies', 'devDependencies']
let sortedObjKeys = Object.keys(package).sort((a, b) => {
    let aIndex = attrs.indexOf(a)
    let bIndex = attrs.indexOf(b)
    if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex
    }
    return 0
})
let sortedPackage = {}
for (let key of sortedObjKeys) {
    sortedPackage[key] = package[key]
}
let packageJsonContent = JSON.stringify(sortedPackage, null, config.indent)
fs.writeFileSync(path.resolve(projectPath, 'package.json'), packageJsonContent)

// README.md
let readmeContent = readme(manifest, package, resPath)
fs.writeFileSync(path.resolve(projectPath, 'README.md'), readmeContent)

// save manifest.json
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, config.indent))

// repository
github(manifest)

console.info('update project success.')
