---
author: Hello
categories: 网络
title: 'whistle'
description: 'whistle相关问题'
pubDate: 2022-08-23 
---
## Whislte概述

Whistle 是一个基于 Node 实现的跨平台 Web 调试代理工具。

和其他抓包软件，如 Charles、Fiddler 一样，它可以查看、修改 HTTP、HTTPS、Websocket 的请求、响应，也可以作为 HTTP 代理服务器使用。得益于其强大的规则配置功能，理论上可以实现对请求、响应的任意修改。Whistle 是开源软件，使用完全免费。

[官方文档](https://wproxy.org/whistle/) & [GitHub](https://github.com/avwo/whistle)

**快速安装：**

```sh
brew install whistle  # 通过 Homebrew 安装
npm i -g whistle      # 或者通过 npm 全局安装
```

**启动 Whistle 服务：**

```sh
w2 start
```

然后就可以看见

![](/simple-blog/whistle/w1.png)



#### 配置代理

配置代理方式我们可以查看官网：https://wproxy.org/whistle/install.html

其中有mac、windows 全局代理，chrome局部代理、手机全局代理

这里我选择chrome局部代理，使用 [Proxy SwitchyOmega](https://chrome.google.com/webstore/detail/proxy-switchyomega/padekgcemlokbadohgkifijomclgjgif) 扩展程序，单独为浏览器单独设置代理，进行本地环境调试

安装完成后，我们对其进行代理配置：

![](/simple-blog/whistle/w2.png)

![](/simple-blog/whistle/w3.png)

![](/simple-blog/whistle/w4.png)

以上就配置完了，在开启whistle后，，对于浏览器先打开auto switch，

![](/simple-blog/whistle/w5.png)

然后再打开http://127.0.0.1:8899/#network就可以看到包信息了

![](/simple-blog/whistle/w6.png)



## 使用

我们点击其中一个请求，在右侧边栏中即可看到该请求与响应的详细信息。其中：

- Overview 请求的基本信息
- Inspectors 请求与响应的详情
  - Request: Headers, WebForms, Body, JSONView, HexView, Cookies, Raw
  - Response: Headers, Preview, Body, JSONView, HexView, Cookies, Trailers, Raw
- Timeline 请求的时间线
- Composer 构造请求，或者修改请求再次发送
- Tools 其他工具

然后点击响应详情的 `Inspectors` -> `response` -> `+key` ->  取个名字，将响应信息保存到本地

![](/simple-blog/whistle/w7.png)

然后，在左侧边栏的「Values」菜单中，就可以看到我们保存的响应结果

这是一个编辑页面，编辑完后我们可以用control + s 保存

![](/simple-blog/whistle/w8.png)

当然，我们最好把他换成json格式

![](/simple-blog/whistle/w9.png)



### 设置替换规则

现在我们有了mock的json文件，可以通过whistle的Rules选项设置规则，让接口匹配对应的mock数据

```sh
# 把前面的请求地址复制过来
https://域名/api/moyi/activity/creative/painting file://`{mockname.json}`

# 如果你是跨域访问的，可能需要在最后加一个 resCors，就像这样：
https://域名/api/moyi/activity/creative/painting file://`{mockname.json}` resCors://enable
```

![](/simple-blog/whistle/w10.png)



而对于一般情况，我们也不可能针对一个地址一次规则替换信息，官方它的匹配模式规则，和正则匹配类似，当然还有其他好用的匹配规则，详情：https://wproxy.org/whistle/pattern.html

```sh
# 路径匹配
http://www.test.com/xxx operatorURI

# 通配符匹配
^/api/moyi/activity/creative/painting file://`{mockname.json}`

# 正则匹配 所有这个域名下的接口都强制开启 CORS
/(igame|moyis|music)\.163\.com\/.*api\/.*/i resCors://enable
```





### host替换

同样的，在Rules规则页，可以像设置本地`/etc/hosts`一样设置本地host

```sh
127.0.0.1 www.example.com
```

除此之外还有其他特点：

- 灵活匹配

![](/simple-blog/whistle/w11.png)

除了保留hosts文件单一的语法规则来支持域名匹配外，whistle还提供给开发者更加灵活强大的端口映射(即支持ip带端口)、CNAME、路径匹配、精确匹配、正则表达式、组合等host匹配模式。语法规则的一般描述如下：

```
host pattern1 pattern2 patternN
```

> host为计划转发到`ip:port`，pattern1-N为匹配请求url的表达式。当pattern只有一个时，host和pattern的顺序往往可以互换，具体可参考[匹配模式](https://wproxy.org/whistle/pattern.html)。



- **端口映射**

  ```
  127.0.0.1:8080 www.example.com
  # 位置可以调换，等价于： 
  # www.example.com  127.0.0.1:8080
  ```

  > 对于本地开发调试，往往无法只在80端口提供Web服务。如果使用传统的hosts文件方式，我们只能通过`www.example.com:8080`访问到本地的8080端口，使用whistle提供的端口映射功能即可很好解决这一问题。

  

- **路径匹配**

  ```
  127.0.0.1:8080 example.com/test 
  # 位置可以调换，等价于： 
  # example.com/test 127.0.0.1:8080
  ```

  > 通过配置上述规则，可将`example.com/test`路径下的请求转发到本地的8080端口，比如请求`example.com/test/a.html`、`example.com/test?a=1`，但对于请求`example.com/testa`则不会进行转发处理。注意，使用传统的hosts语法，是将该域名下的所有请求都进行host替换处理。

  

其他匹配规则和特性可以查看[官网](https://wproxy.org/whistle/rules/host.html)





## 线上环境打开本地页面

经过whistle代理后，我们可以随意通过修改请求内容，将请求内容代理为本地页面，在传给app，就可以实现app线上环境查看本地环境页面

而这里更推荐重定向（redirect）来替换线上页面而不是强行暴力替换html，是因为页面的url地址还是没变的，此时css、js资源如果是依赖url + 路径名获取的话，会导致资源加载失败，甚至出现一些跨域问题

1.首先我们将手机弄个代理

2.给手机装好根证书，好抓https的包

![](/simple-blog/whistle/w12.png)

3.在Rules规则页下进行替换

```sh
https://m.moyi.163.com/newyear20230117/half/index.html redirect://`http://本地ip地址:8080/half/index.html`

# 通配符简化，也可以打开本地开发页面哦，注意要用局域网地址
^/newyear20230117/half/index.html redirect://`http://本地ip地址:8080`
```

此时我们就可以在线上环境看到我们本地测试环境的页面了～



### 替换js资源

除此之外，我们甚至可以替换线上的js资源，帮我们免除掉反复线上部署，测试的问题（本地测试环境没问题，线上环境有问题的时候）

比如，我感觉这个包的js代码有问题，现在想要替换掉

![](/simple-blog/whistle/w13.png)

我们直接把原始脚本下载下来，修改它。然后添加以下规则：

```sh
# 这里在文件里加了个 alert(12345)，当然也可以加 debugger
^/static_public/5fb72673e2a9649c728fbf99/SocialLiveTask/1.0.2/index.min.js file:///Users/localcode/Downloads/index.min.js

# 可选：禁用 JS 文件的浏览器缓存
*.js cache://no
```

刷新页面，可以看到修改的代码已经生效了（如果没生效，你可能需要清空浏览器缓存）。虽然代码是 minified 过的，但格式化一下，大部分情况下也可以调试了。但如果代码很复杂，minified 之后根本看不懂呢？

没有关系，如果你本地有源码，那么可以**修改源码，通过 `npm run build` 生成编译结果，然后再做资源替换**。理论上来说，只要参数正确，本地生产的构建结果应该和线上的是一致的，所以替换也不会有问题。

通过这种方法，可以省去反复部署再验证的麻烦



## 设置 Cookie

在手机上设置 cookie 一直是个比较麻烦的问题，一般可能会做个开发登录页来写入 cookie。通过 Whistle 的 cookie 替换功能，我们可以直接把 cookie 写入手机，无需其他繁琐操作。

以云音乐的 `MIDDLE_U` cookie 为例，在 whistle -> http://127.0.0.1:8899/#values 中新建一个 JSON：

```json
{
  "MIDDLE_U": {
    "value": "4547604608",
    "maxAge": 315360000,
    "httpOnly": false,
    "path": "/",
    "secure": false,
    "domain": ".moyi.163.com"
  }
}
```

在 Rules 中添加如下规则：

```sh
# 注意：域名需要和上面 cookie 中的 domain 是同源
# 这里匹配的是接口的域名
api.moyi.163.com resCookies://{moyidevcookie.json}
```

在手机上访问一下这个页面，cookie 就被设置上啦。设置完成后可以把这行规则注释掉，只要手机上不清空会一直生效。