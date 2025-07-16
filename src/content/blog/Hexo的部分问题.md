---
author: Hello
categories: 前端
title: Hexo的部分问题
description: '博客相关'
---

## Quick Start

### 打开

win+R进入cmd，然后在正确目录下进入：cd source\_post\(指定blog下)

### 基本操作

用typora修改完毕后，
1.使用“hexo clean”进行清理
（1.5.若是发生主题等修改后，要接上hexo g 来建立）
2.接上“hexo s”即可进入网站查看（退出键位：control+C，y）（本地浏览）
3.再次部署到远端：hexo d

### 关于主题

1.可以使用git clone 网址.git themes\新建目录名
（或者使用码云gitee进行下载，然后复制到themes目录下）
2.cd..    (回到blog目录下)
notepad _config.yml
把记事本里面的theme：xx修改成theme：主题目录名
3.重新执行"基本操作"

### 



## 关于图片

再_post目录下安装 (必须得是这个)

```shell
npm i https://github.com/CodeFalling/hexo-asset-image
```

然后再_post下新建和md文件同名的文件夹，放入图片，再md中引入即可

如果还是出现上传后没有图片，可能是因为图片命为 ' httpxxx '、甚至是文件名为http也是不能被允许的，这种格式也是不能被允许的！！（因此我不得不把文章名改为超文本传输协议。。。）



参考文献

https://hexo.io/docs/one-command-deployment.html)



## 前端解析markdown文件

**实现 getStaticProps**

首先，安装[gray-matter](https://github.com/jonschlinkert/gray-matter)，它可以让我们解析每个 markdown 文件中的元数据。

```shell
npm install gray-matter
```

为了呈现 markdown 内容，我们将使用该[`remark`](https://github.com/remarkjs/remark)库。首先，让我们安装它：

```
npm install remark remark-html
```

可以效仿next官网制作的，写一个SSG的博客网站：https://www.nextjs.cn/learn/basics/data-fetching/implement-getstaticprops