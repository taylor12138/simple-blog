---
title: 'WebAssembly'
author: Hello
pubDate: 2022-06-05
categories: 前端
description: 'WebAssembly相关'
---

## WebAssembly

webasembly是一种新型代码，它提供了一种以接近本机的速度在 Web 上运行以多种语言编写的代码的方法，客户端应用程序可以在 Web 上运行，比如可以在浏览器跑C/C++代码



## asm.js

2012年，Mozilla 的工程师 [Alon Zakai](https://github.com/kripken)做了一个编译器项目 [Emscripten](https://github.com/kripken/emscripten)。这个编译器可以将 C / C++ 代码编译成 JS 代码，但不是普通的 JS，而是一种叫做 [asm.js](http://asmjs.org/) 的 JavaScript 变体。



#### 问题

C / C++ 编译成 JS 有两个最大的困难。

> - C / C++ 是静态类型语言，而 JS 是动态类型语言。
> - C / C++ 是手动内存管理，而 JS 依靠垃圾回收机制。

**asm.js 就是为了解决这两个问题而设计的：它的变量一律都是静态类型，并且取消垃圾回收机制。**除了这两点，它与 JavaScript 并无差异，也就是说，asm.js 是 JavaScript 的一个严格的子集，只能使用后者的一部分语法。

所以可以看到 ts 是 js的超集，asm.js是js的子集



#### 速度快

并且一旦 JS 引擎发现运行的是 asm.js，就知道这是经过优化的代码，可以跳过语法分析这一步，直接转成汇编语言。另外，浏览器还会调用 WebGL 通过 GPU 执行 asm.js，即 asm.js 的执行引擎与普通的 JavaScript 脚本不同。这些都是 asm.js 运行较快的原因。据称，asm.js 在浏览器里的运行速度，大约是原生代码的50%左右。



#### Emscripten

虽然 asm.js 可以手写，但是它从来就是编译器的目标语言，要通过编译产生。目前，生成 asm.js 的主要工具是 [Emscripten](http://emscripten.org/)。

如果要获得asm.js的文件，可以通过学习Emscripten，并用Emscripten便衣你要转换的C/C++文件即可



**安装Emscripten**

看[这里](https://emscripten.org/docs/getting_started/downloads.html)



使用

创建一个c文件

```c
#include <stdio.h>
int main(){
	printf("hello world");
	return 0;
} 

```



```sh
emcc hello.c -s WASM=1 -o hello.html
```

此时可以看到hello.html、hello.css、hello.js文件



```sh
emcc hello.c -s WASM=1 -o hello.wasm
```

此时可以看到hello.wasm文件



##### 编译相关

以`asm.js`为编译目标时，C/C代码被编译为.js文件；以WebAssembly为编译目标时，C/C代码被编译为.wasm文件及对应的.js胶水代码文件。两种编译目标从应用角度来说差别不大——它们使用的内存模型、函数导出规则、JavaScript与C相互调用的方法等都是一致的。我们在实际使用中遇到的主要区别在于模块加载的同步和异步：当编译目标为`asm.js`时，由于C/C++代码被完全转换成了`asm.js`（JavaScript子集），因此可以认为模块是同步加载的；而以WebAssembly为编译目标时，由于WebAssembly的实例化方法本身是异步指令，因此模块加载为异步加载。以`asm.js`为目标的工程切换至WebAssembly时，容易发生Emscritpen运行时未就绪时调用了Module功能的问题，需要按照1.3.3的方法予以规避。

自1.38.1起，Emscripten默认的编译目标切换为WebAssembly。如果仍然需要以`asm.js`为编译目标，只需要在调用`emcc`时添加`-s WASM=0`参数，例如：

```
> emcc hello.cc -s WASM=0 -o hello_asm.js
```

WebAssembly是二进制格式，体积小、执行效率高是其先天优势。作为比较，上述命令生成的`hello_asm.js`约300KB，而WebAssembly版本的`hello.js`与`hello.wasm`加在一起还不到150KB。在兼容性允许的情况下，应尽量使用WebAssembly作为编译目标。

- -o：编译后的文件
- -O1、-O2、-O3、-Oz、-Os、-g 等：编译优化，具体可参考 Emscripten 官网相关章节；（压缩代码）



##### 编译参数

-s WASM=1 (0/1/2)

- WASM=0生成asm.js格式(适用于WebAssembly不支持的情况)

- WASM=1生成包含wasm格式

- WASM=2 asm.js与wasm格式均生成，添加支持判定，优先使用wasm格式。

更多参数看：

csdn文章：[Emscripten 编译器(emcc) 命令总结](https://blog.csdn.net/wngzhem/article/details/105192706)

知乎文章：[emscripten 编译参数](https://zhuanlan.zhihu.com/p/608244339)

野文章(参数在网页下方)：[从 0 开始快速上手 WebAssembly：Emscripten 使用入门](https://www.infoq.cn/article/f6ai8wulyij4b3co7lvf)

官网：[编译为WebAssembly](https://emcc.zcopy.site/docs/compiling/webassembly/#compiler-output)、[代码优化](https://emcc.zcopy.site/docs/optimizing/optimizing-code/)





#### 和wasm的对比

如果你对 JS 比较了解，可能知道还有一种叫做 WebAssembly 的技术，也能将 C / C++ 转成 JS 引擎可以运行的代码。那么它与 asm.js 有何区别呢？

回答是，两者的功能基本一致，就是转出来的代码不一样：asm.js 是文本，WebAssembly 是二进制字节码，因此运行速度更快、体积更小。从长远来看，WebAssembly 的前景更光明。

但是，这并不意味着 asm.js 肯定会被淘汰，因为它有两个优点：首先，它是文本，人类可读，比较直观；其次，所有浏览器都支持 asm.js，不会有兼容性问题。



## 参考

[阅读推荐：**很棒的 WebAssembly 应用程序的精选列表**](https://github.com/mcuking/Awesome-WebAssembly-Applications/blob/master/README.md)

[asm.js 和 Emscripten 入门教程](https://www.ruanyifeng.com/blog/2017/09/asmjs_emscripten.html)

[C/C++面向WebAssembly编程 ](https://www.cntofu.com/book/150/zh/ch1-quick-guide/ch1-04-compile.md)