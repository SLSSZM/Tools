// 用puppeteer获取favicon

const puppeteer = require('puppeteer')

let url = 'https://developers.weixin.qq.com/ebook?action=get_post_info&docid=000ee2c29d4f805b0086a37a254c0a'
// let url = 'https://www.bilibili.com'
// let url = 'https://www.iconfont.cn/'
// let url = 'https://www.baidu.com'
// let url = 'https://www.taobao.com'
// let url = 'https://element.eleme.cn/#/zh-CN/component/installation'

let scrape = async (url) => {
  // 打开浏览器
  const browser = await puppeteer.launch({ headless: true })
  // 创建一个新页面
  const page = await browser.newPage()
  // 开启拦截器
  await page.setRequestInterception(true)
  page.on('request', req => {
    // 根据请求类型过滤，除了html全部过滤掉
    const resourceType = req.resourceType()
    if (resourceType !== 'document') {
      req.abort()
    } else {
      req.continue()
    }
  })
  // 打开url页面
  await page.goto(url)
  // 切割出域名
  const path = url.split('/').splice(0, 3).join('/')
  // 在打开的浏览器运行代码
  const result = await page.evaluate(async (path) => {
    // 获取所以的link标签
    let elements = document.getElementsByTagName('link')
    // 创建正则
    const icon = /(shortcut icon|shortcut)/i
    // 遍历link标签
    for (var element of elements) {
      // 用正则来判断link标签的rel
      if (icon.test(element.getAttribute('rel'))) {
        // 判断是否以 / 开头
        if (element.getAttribute('href')[0] === '/') {
          // 判断是否以 // 开头
          if (element.getAttribute('href')[1] === '/') {
            return path.split('/').splice(0, 1) + element.getAttribute('href')
          }
          return path + element.getAttribute('href')
        }
        // 判断是否以favicon开头
        if (element.getAttribute('href')[0] === 'f') {
          return path + '/' + element.getAttribute('href')
        }
        return element.getAttribute('href')
      } else {
        return path + '/favicon.ico'
      }
    }
  }, path)
  // 关闭浏览器
  browser.close()
  // 返回数据
  return result
};

scrape(url).then((value) => {
  console.log(value) // 成功!
});