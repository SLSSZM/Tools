// 输入url可以获取网址的小图标
// 目前测试的网址都可以成功，但是应该也有失败的，目前还没发现，如发现请告知一下
const request = require('request')
const cheerio = require('cheerio')

// 测试网址
const url = 'https://www.bilibili.com'
// const url = 'https://developers.weixin.qq.com/miniprogram/dev/framework'
// const url = 'https://developers.weixin.qq.com/ebook?action=get_post_info&docid=000ee2c29d4f805b0086a37a254c0a'
// const url = 'https://www.baidu.com'
// const url = 'https://www.w3cschool.cn/weixinapp'
// const url = 'https://www.4399.com'

// 获取网址域名
const path = url.split('/').splice(0, 3).join('/')

// 1.先对网址域名 + /favicon.ico进行验证
request({ url: path + '/favicon.ico', timeout: 500 }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        return console.log(path + '/favicon.ico') // 请求成功的处理逻辑
    } else {
        // 如果第一步获取失败就对采取暴力获取
        // 2.获取网页源代码
        request({ url, timeout: 500 }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                filter(body) // 请求成功的处理逻辑
            } else {
                return console.log('url错误')
            }
        })
    }
})

function filter (data) {
    // 用cheerio解析网址源码
    let $ = cheerio.load(data)
    // 获取link标签
    let t = $('link')
    // 用正则对/favicon.ico和shortcut icon进行判断
    let patt = /^\/favicon\./i
    let icon = /(shortcut|icon)/i
    for (let i = 0; i < t.length; i++) {
        // 查到与icon正则相同的就获取它的href
        if (icon.test(t[i].attribs.rel)) {
            // 再次判断href路径是否为/favicon.ico
            if (patt.test(t[i].attribs.href)) {
                return console.log(path + t[i].attribs.href)
            }
            return console.log(t[i].attribs.href)
        }
    }
}
