// 用puppeteer获取favicon

const puppeteer = require('puppeteer');

let url = 'https://developers.weixin.qq.com/ebook?action=get_post_info&docid=000ee2c29d4f805b0086a37a254c0a'
// let url = 'https://www.bilibili.com'
// let url = 'https://www.iconfont.cn/'
// let url = 'https://www.baidu.com'
// let url = 'https://www.taobao.com'
// let url = 'https://element.eleme.cn/#/zh-CN/component/installation'

let scrape = async (url) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '–disable-gpu', // GPU硬件加速
      '–disable-dev-shm-usage', // 创建临时文件共享内存
      '–disable-setuid-sandbox', // uid沙盒
      '–no-first-run', // 没有设置首页。在启动的时候，就会打开一个空白页面。
      '–no-sandbox', // 沙盒模式
      '–no-zygote',
      '–single-process' // 单进程运行
    ]
  });
  const page = await browser.newPage();
  // 开启拦截器
  await page.setRequestInterception(true);
  page.on('request', req => {
    // 根据请求类型过滤
    const resourceType = req.resourceType();
    if (resourceType !== 'document') {
      req.abort();
    } else {
      req.continue();
    }
  });
  await page.goto(url);
  const path = url.split('/').splice(0, 3).join('/')

  const result = await page.evaluate(async (path) => {
    let elements = document.getElementsByTagName('link'); // 选择所有产品
    const icon = /(shortcut icon|shortcut)/i
    for (var element of elements) { // 遍历每个产品
      if (icon.test(element.getAttribute('rel'))) {
        if (element.getAttribute('href')[0] === '/') {
          if (element.getAttribute('href')[1] === '/') {
            return path.split('/').splice(0, 1) + element.getAttribute('href')
          }
          return path + element.getAttribute('href')
        }
        if (element.getAttribute('href')[0] === 'f') {
          return path + '/' + element.getAttribute('href')
        }
        return element.getAttribute('href')
      } else {
        return path + '/favicon.ico'
      }
    }
  }, path);
  browser.close();
  return result; //  返回数据
};

scrape(url).then((value) => {
  console.log(value); // 成功!
});