# Welcome to my Blog 🚀 🚀 🚀

一个简单的记录博客
技术框架 AstroV5 && Solid && Reactjs.
(Solid + React混动)

template：
A astro blog template with [Koibumi Design system](https://github.com/koibumi-design)

# 图片压缩
- png 走 pngquant --quality=65-80
- jpg / jpeg 走 MozJPEG

在

```shell
npm run png
```

```shell
npm run jpeg
```

# 图片修复
部分文件虽然扩展名是 .png，但实际上都是 JPEG格式 的文件，有些虽然扩展名是 .jpg，但实际上都是 PNG格式 的文件，所以使用 pngquant等进行图片压缩的时候 无法处理它们，需要我们手动修复他们，可以运行

```shell
npm run fix-extensions
```

之前可以先安装对应工具(MacOS)

```shell
brew install mozjpeg pngquant
```

