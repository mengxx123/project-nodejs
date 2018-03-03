const request = require('request-promise-native')
const config = require('./config')

async function github(manifest) {
    console.log(33)
    if (!manifest.repository) {
        return
    }
    if (!config.syncGithub) {
        return
    }
    console.log(333)
    if (manifest.repository instanceof String) {

    }
    console.log(3333)
    let str = manifest.repository.split(':')[1]
    let user = str.split('/')[0]
    let repos = str.split('/')[1]

    let options = {
        url: `https://api.github.com/repos/${user}/${repos}`,
        method: 'PATCH',
        json: true,
        body: {
            name: repos,
            description: manifest.description,
            homepage: manifest.homepage
        },
        headers: {
            'Authorization': 'token ' + config.githubToken,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
        }
    }
    // function callback(error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //         // console.log(body)
    //     } else {
    //         // console.log(body)
    //     }
    // }

    // await request(options)
    console.log('update github description and homepage success.')

    if (manifest.keywords && manifest.keywords.length) {
        options = {
            url: `https://api.github.com/repos/${user}/${repos}/topics`,
            method: 'PUT',
            json: true,
            body: {
                names: manifest.keywords
            },
            headers: {
                'Accept': 'application/vnd.github.mercy-preview+json',
                'Authorization': 'token ' + config.githubToken,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36',
            }
        }
        await request(options)
    }


}

module.exports = github
