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
命令分解：
    find public - 在 public 目录中查找
    -type f - 只查找文件（不包括目录）
    -name "*.png" - 文件名匹配 .png 扩展名
    -exec pngquant - 对每个找到的文件执行 pngquant 工具
    --quality=65-80 - 设置压缩质量为65%-80%
    --ext .png - 保持 .png 扩展名
    --force - 强制覆盖原文件
    {} \\; - {} 代表找到的文件，\\; 结束exec命令
作用： 压缩所有PNG图片，减小文件大小

```shell
npm run jpeg
```
命令分解：
find public -type f - 在public目录查找文件
\\( -name "*.jpg" -o -name "*.jpeg" \\) - 查找 .jpg 或 .jpeg 文件
-exec sh -c '...' sh {} \\; - 执行shell脚本
jpegtran -copy none -optimize -progressive - JPEG优化工具
-copy none - 不复制EXIF等元数据
-optimize - 优化文件
-progressive - 创建渐进式JPEG
"$1" > "$1.tmp" - 输出到临时文件
&& mv "$1.tmp" "$1" - 成功则替换原文件
|| rm -f "$1.tmp" - 失败则删除临时文件
作用： 优化所有JPEG图片，减小文件大小

使用之前可以先安装对应工具(MacOS)

```shell
brew install mozjpeg pngquant
```

# 图片修复
部分文件虽然扩展名是 .png，但实际上都是 JPEG格式 的文件，有些虽然扩展名是 .jpg，但实际上都是 PNG格式 的文件，所以使用 pngquant等进行图片压缩的时候 无法处理它们，需要我们手动修复他们，可以运行

```shell
npm run fix-extensions
```


