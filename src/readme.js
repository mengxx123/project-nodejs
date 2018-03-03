const screenshot = require('./screenshot')


function readme(manifest, project, resPath) {
    let readme = ''
    let grade = manifest.grade || 60
    grade = Math.ceil(grade / 20)
    console.log(grade)
    let gradeStr = ''
    for (let i = 0; i < 5; i++) {
        if (i < grade) {
            gradeStr += '★'
        } else {
//                        gradeStr += '☆'
        }
    }
    let gradeColor = manifest.grade >= 60 ? 'brightgreen' : 'orange'

    let progress = manifest.progress || 50
    let progressColor = progress === 100 ? 'brightgreen' : 'orange'

    let badges = []
    let badge = manifest.badge
    if (badge) {
        badges = badge.split(',')
    }
    let badgeStr = badges.join('%20+%20')

    // screenshot
    let screenshotFiles = screenshot(resPath)
    let screenshotText = ''
    console.log(screenshotFiles)
    if (screenshotFiles.length) {
        screenshotText = '\n# 截图\n\n'
        for (let file of screenshotFiles) {
            screenshotText += `![截图](${file.path})\n`
        }
    }

    // projectId
    let projectIdText = ''
    if (project.id) {
        projectIdText = `\n* 项目编号：${project.id}`
    }

    readme += `# ${project.name}

![质量](https://img.shields.io/badge/质量-${gradeStr}-${gradeColor}.svg) ![完成 50%](https://img.shields.io/badge/完成-${progress}%25-${progressColor}.svg)

> ${project.description || ''}

## 项目信息
${projectIdText}
* [项目主页](http://project.yunser.com/projects/${project.id})
* [在线 Demo](${project.demoUrl})
* ![技术栈](https://img.shields.io/badge/技术栈-${badgeStr}-brightgreen.svg)

如果觉得项目不错，可以给个星星。项目有 bug 可以到 [这里](https://github.com/yunser/${project.projectName}/issues) 提交问题。

## 开发构建

\`\`\`bash
git clone https://github.com/yunser/${project.projectName}.git # 下载
cd ${project.projectName} # 进入项目根目录
npm install # 安装依赖
npm run dev # 开发

# 构建
npm run build
\`\`\`
${screenshotText}
# 项目结构

\`\`\`text
root
├─ README.md
├─ build # 构建流程配置
├─ config # 项目配置文件
├─ index.html # 在这里配置 CDN
├─ package.json
├─ src
│  ├─ App.vue
│  ├─ components # 通用组件
│  ├─ config # 项目配置文件
│  ├─ main.js
│  ├─ router # 路由
│  ├─ scss
│  ├─ util # 工具类
│  └─ views # 视图
└─ static # 静态资源目录
   └─ img # 图片
\`\`\`

`
    if (project.license) {
        let license = `![${project.license} 协议](https://img.shields.io/badge/license-${project.license}%20©yunser-brightgreen.svg)`
        readme += `# 协议

${license}
`
    }

    return readme
}

module.exports = readme
