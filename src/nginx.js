const path = require('path')
const fs = require('fs')

// 规范 Nginx 配置脚本
// 功能是根据域名把nginx文件拆成多个小文件
// TODO 处理注释和多域名
let nginxConfPath = 'D:\\desktop\\default.conf' // Nginx 配置文件路径
let outputPath = 'D:\\desktop\\vhost' // 输出文件夹（文件夹必须存在）
let nginxConfContent = fs.readFileSync(nginxConfPath, 'utf-8')
// console.log(nginxConfContent)

// nginxConfContent = `
// server {
//     listen 80;
//     server_name localhost   localhost2;
//     location / {
//         root /usr/local/nginx/;
//     }
// }
//
// server {
//     listen 80;
//     server_name a.api.yunser.com;
// }
//
// server {
//     listen 80;
//     server_name b.api.yunser.com;
// }
// `

let servers = []

// parser
let startIndex = 0
let endIndex
let isStart
let stack = []

for (let i = 0; i < nginxConfContent.length; i++) {
    let char = nginxConfContent[i]
    if (isStart) {
        if (char === '{') {
            stack.push('{')
        } if (char === '}') {
            if (stack.length === 1) {
                endIndex = i
                servers.push(nginxConfContent.substring(startIndex, endIndex + 1))
                isStart = false
                stack = []
            } else {
                stack.pop()
            }
        }
    } else {
        if (char === 's' && nginxConfContent.substr(i, 6) === 'server') {
            startIndex = i
            isStart = true
        }
    }
}

function parseServer(server) {
    let arr = server.split('\n')
    let ret = {}
    for (line of arr) {
        if (line.includes('server_name')) {
            line = line.replace(/^\s+/, '').replace(/\s+$/, '')
            let names = line.match(/server_name\s+?([\w\W]+?);/)[1]
            // console.log(names)
            ret.name = names.split(/\s+/)
        }
    }
    // console.log(arr)
    return ret
}

for (let server of servers) {
    // console.log('item')
    // console.log(server)

    let serverObj = parseServer(server)
    let fileName = serverObj.name[0]
    if (fileName.split('.').length > 3) {
        fileName = fileName.match(/[\w\W]+\.([\w\W]+?\.[\w\W]+?\.[\w\W]+)/)[1]
    }
    let filePath = path.resolve(outputPath, fileName + '.conf')
    if (fs.existsSync(filePath)) {
        let fileContent = fs.readFileSync(filePath, 'utf-8')
        fs.writeFileSync(filePath, fileContent + '\n\n' + server)
    } else {
        fs.writeFileSync(filePath, server)
    }
}
//

// const nginxParser = require('nginx-conf-parser').parser
// var result = nginxParser.parse(nginxConfContent);
// console.log(result); // yo. no async, sorry ;-(

// var NginxParser = require('nginxparser');
//
// var parser = new NginxParser('$remote_addr - $remote_user [$time_local] '
//     + '"$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"');
//
// parser.read(nginxConfPath, function (row) {
//     console.log(row);
// }, function (err) {
//     if (err) throw err;
//     console.log('Done!')
// });

// host
// let hostPath = 'C:\\Windows\\System32\\drivers\\etc\\hosts'
// let hostContent = fs.readFileSync(hostPath, 'utf-8')
// console.log(hostContent)
// fs.writeFileSync(hostPath, 'asd')

