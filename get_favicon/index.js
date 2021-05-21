// 输入url可以获取网址的小图标
// 目前测试的网址都可以成功，但是应该也有失败的，目前还没发现，如发现请告知一下
const request = require('request')
const cheerio = require('cheerio')
const jsdom = require("jsdom")
const axios = require('axios')

// 测试网址
// const url = 'https://www.bilibili.com'
const url = 'https://developers.weixin.qq.com/miniprogram/dev/framework/'
// const url = 'https://www.baidu.com'
// const url = 'https://www.w3cschool.cn/weixinapp/'
// const url = 'https://www.4399.com'
const path = url.split('/').splice(0, 3).join('/')

// 创建promise请求
new Promise((resolve, reject) => {
    // 设置请求超时时间
    let source = axios.CancelToken.source();
    setTimeout(() => {
        source.cancel()
    }, 1000);
    // 请求url地址如果包含中文将其转码后访问
    // 如果（网址+favicon.ico）存在就返回
    axios.get(encodeURI(path + '/favicon.ico'), { cancelToken: source.token }).then((result) => {
        resolve(result)
    }).catch(error => {
        reject(error)
    })
}).then(res => {
    return console.log(path + '/favicon.ico')
}).catch(err => {
    // 获取网页源代码
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            filter(body) // 请求成功的处理逻辑
        }
    })
})

// 第一种方法：jsdom
// const { JSDOM } = jsdom
// function filter (data) {
//     const dom = new JSDOM(data)
//     const link = dom.window.document.querySelectorAll("link")
//     for (let i = 0; i < link.length; i++) {
//         if (link[i].rel === "shortcut icon") {
//             return console.log(link[i].href)
//         }
//     }
// }

// 第二种方法：cheerio
// function filter (data) {
//     let $ = cheerio.load(data)
//     let t = $('link')
//     let patt = /^\/favicon\./i
//     for (let i = 0; i < t.length; i++) {
//         if (t[i].attribs.rel === 'shortcut icon') {
//             if (patt.test(t[i].attribs.href)) {
//                 return console.log(a + t[i].attribs.href)
//             }
//             return console.log(t[i].attribs.href)
//         }
//     }
// }
