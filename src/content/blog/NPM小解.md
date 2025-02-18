---
author: Hello
pubDate: 2021-01-31 
categories: 前端
title: NPM小解
description: 'NPM相关'
---

## 1.Nodejs的包

通俗来说，单个`js`文件算一个模块，放在一个文件夹里就是一个包了

`CommonJS`	的包规范由包结构和包描述两个部分组成  

**包结构**：用于组织包中的各种文件  

​	-package.json 描述文件    （important）

​	-bin 可执行二进制文件

​	-lib js代码

​	-doc 文档

​	-test 单元测试

包描述文件（上面的那个-package.json 描述文件）：描述包的相关信息，以供外部读取分析。它用于表达非代码相关信息，是一个json格式的文件，实际上加载包时使用的原则是：node_modules/express/package.json  main, 而且它其中保存着十分重要的第三方包依赖项信息（dependencies）

并且建议每个项目里带一个（有且只有一个）package.json文件`npm init` 

`npm init -y`  里面的-y就是yes的意思，在init的时候省去了敲回车的步骤，生成的默认的package.json



## 2.package.jon解析（杂碎）

npm包命名：

- 若包名称中存在一些符号，将符号去除后不得与现有包名重复

例如：由于`react-native`已经存在，`react.native`、`reactnative`都不可以再创建。

- 如果你的包名与现有的包名太相近导致你不能发布这个包，那么推荐将这个包发布到你的作用域下。

例如：用户名 `conard`，那么作用域为 `@conard`，发布的包可以是`@conard/react`。

main属性：

`main` 属性可以指定程序的主入口文件

```json
{
  "main": "lib/index.js",
}
```

script属性

`scripts` 用于配置一些脚本命令的缩写





#### package.json和package-lock.json

npm 5以前是不会有`package-lock.json`这个文件的

npm 5 以后才加入

从安装上看，npm都会生成或更新`package-lock.json`这个文件

- npm 5 版本以后的安装包，不用加--save添加依赖，它会自动保存依赖
- 它会自动创建或者更新`package-lock.json`
- `package-lock.json`里面保存的是node_modules所有包的依赖，包括依赖的包里`package.json`所依赖的包名（套娃）
- 因此重新`npm install`时速度会有所提升

从文件上看

- lock是用来锁定版本的，如果当前项目依赖了1.1版本，但是重新`npm install ` 其实会给你下载最新版本，而不是1.1
- 而`package-lock.json`的另一个作用就是锁定版本号，防止自动升级最新版



#### lock的 `lockfileVersion` 

 `lockfileVersion` 字段来指定的 lock 格式的版本

npm5之后设置为1，

以前的 lock 格式仍然支持并被识别为版本 `0` 。

而后来从 NPM 7 发布以来，一个新的 `package-lock.json` 文件被重新生成为不同的结构。从 `lockfileVersion` 1 到 2，从而兼容npm 6用户，并且不再忽略 `yarn.lock`



#### 符号

```json
"@music/mobile-toast": "～2.1.13",
"@music/mobile-url": "^4.0.6",
```

1.^插入符号
        他将会把当前库的版本更新到当前主版本（也就是第一位数字）中最新的版本。放到我们的例子中就是："axios": "^0.18.0", 这个库会去匹配0.x.x中最新的版本，但是他不会自动更新到1.0.0。

2.~波浪符号
        他会更新到当前次版本号（也就是中间的那位数字）中最新的版本。放到我们的例子中就是："cross-env": "~5.2.0"，这个库会去匹配更新到5.2.x的最新版本，如果出了一个新的版本为5.3.0，则不会自动升级。波浪符号是曾经npm安装时候的默认符号，现在已经变为了插入符号。



### NPM命令

#### 基础

（Node Package Manager）

CommonJS包规范时理论，NPM是其中一种实践，是Node包管理器

对于Node而言，NPM帮助其完成第三方模块的发布，安装和依赖（A->B->C，下载C直接A, B也下），借助NPM，Node与第三方模块之间形成良好的一个生态系统（安装了node以后，自带安装npm）

在cmd命令行窗口：

`npm -v` 查看版本  （或者`包名 --version`）

`npm` 帮助说明

`npm search 包名` 搜索包

`npm why xxx --long` 查看当前项目对xxx包的依赖关系



**安装**

`npm install ` 下载当前项目所依赖的包（根据package.json配置里的依赖下载）

`npm install 包名` / `npm i 包名` 当前目录安装包（可以先创建一个文件夹）（尾部加`--save`，则为生产环境时依赖，则添加到当前`package.json`的依赖里）

如果尾部加 `--save-dev`则为开发时依赖

`npm install 包名 -g` 全局模式安装包（一般都是计算机里的工具）

如果本身电脑上有该包，则直接 `npm install 包名 `则会直接下载最新版本 



**删除**

`npm remove 包名` / `npm r 包名` 删除包 （这个好像是旧版的）

`npm uninstall 模块`：删除模块，但不删除模块留在package.json中的对应信息

`npm uninstall 模块 --save` 删除模块，同时删除模块留在package.json中dependencies下的对应信息

`npm uninstall 模块 --save-dev` 删除模块，同时删除模块留在package.json中devDependencies下的对应信息



**查看包版本**
`npm view <pkg> version` 查看包版本
`npm view <pkg> versions` 查看包更多历史版本



```
npm i module_name  -S  = >  npm install module_name --save    写入到 dependencies 对象

npm i module_name  -D  => npm install module_name --save-dev   写入到 devDependencies 对象

npm i module_name  -g  全局安装

npm i module_name@latest  安装最新版本
```



#### 镜像源

通过 `npm config set` 进行npm的配置

比如配置镜像源

```
npm config set 包名:registry 配置的网址    # 指定 包名 走 配置的网址写的镜像源
```

查看当前源

```shell
npm config list 
```



#### npm5以后的--save

在版本 5 之前，NPM 只是`node_modules`默认安装了一个包。当您尝试为您的应用程序/模块安装依赖项时，您需要先安装它们，然后将它们（连同适当的版本号）添加到`dependencies`您的`package.json`.

该`--save`选项指示 NPM 自动将包包含在`dependencies`您的部分中`package.json`，从而为您节省了额外的步骤。

此外，还有一些补充选项`--save-dev`，`--save-optional`它们分别将包保存在`devDependencies`和下`optionalDependencies`。这在安装仅开发包（如`grunt`测试库）时很有用。



但是

**5级以上更新：**

从[npm 5.0.0](http://blog.npmjs.org/post/161081169345/v500)开始，已安装的模块默认添加为依赖项，因此`--save`不再需要该选项。其他保存选项仍然存在，并列[在](https://docs.npmjs.com/cli/install).`npm install`



#### npm 5以后的install

**早期**：`npm` 处理依赖的方式简单粗暴，以递归的形式，严格按照 `package.json` 结构以及子依赖包的 `package.json` 结构将依赖安装到他们各自的 `node_modules` 中。直到有子依赖包不在依赖其他模块。

这样子层级结构会比较明显，

- 但是！如果不同模块引用的是同一个模块，则会产生大量冗杂
- 在 `Windows` 系统中，文件路径最大长度为260个字符，嵌套层级过深可能导致不可预知的问题。



**中期**（npm3）：选择扁平化的结构，无论是直接依赖还是子孙依赖，都放在`node_modules`当中，而此时模块的搜索模式为：

- 在当前模块路径下搜索
- 在当前模块 `node_modules` 路径下搜素
- 在上级模块的 `node_modules` 路径下搜索

但是：当安装到相同模块时，判断已安装的模块版本是否符合新模块的版本范围，如果符合则跳过，不符合则在**当前模块**的 `node_modules` 下安装该模块。

这使得放置顺序则决定了 总`node_modules` 的依赖结构

然后就会出现（buffer2依赖 `base64-js1.0.3`，buffer依赖  `base64-js@1.0.2` ）

![](/NPM小解/npm1.jpg)

假如没有依赖了 `base64-js@1.0.1`，出现两种情况

![](/NPM小解/npm2.jpg)

 ![](/NPM小解/npm3.jpg)

也就是说，如果依赖不同版本，有可能导致依赖结构的不确定性，而这种不确定性可能会给程序带来不可预知的问题。



**后期**：为了解决 `npm install` 的不确定性问题，在 `npm 5.x` 版本新增了 `package-lock.json` 文件，而安装方式还沿用了 `npm 3.x` 的扁平化的方式。

`package-lock.json` 的作用是锁定依赖结构，即只要你目录下有 `package-lock.json` 文件，那么你每次执行 `npm install` 后生成的 `node_modules` 目录结构一定是完全相同、一一对应的。

并且， `package-lock.json` 中已经缓存了每个包的具体版本和下载链接，不需要再去远程仓库进行查询，然后直接进入文件完整性校验环节，减少了大量网络请求。



但是仍然存在部分缺陷

平铺式的算法的复杂性，以及Phantom（所以项目中可以非法访问没有声明过依赖的包，因为该包可能是作为依赖的依赖）、性能和安全问题



#### npm i 的流程

所以总结起来 npm i 的流程是：

1. 检查`.npmrc` 文件（`npm running cnfiguration`, 即npm运行时配置文件），从项目级的 `.npmrc`  -> 用户级的`.npmrc`  ->  全局的 `.npmrc` （有点DNS查询的感觉

2. 检查有没有lock文件，

   - 有lock文件，检查 `package.json` 中的依赖版本是否和 `package-lock.json` 中的依赖有冲突

     - 有冲突的话在merge conflicts的阶段，只需要从主分支中checkout去package-lock.json，再以此为基础，重新安装新分支中需要的依赖。

       ```shell
       git checkout dev -- package-lock.json;
       ```

       这样让npm自动的去维护`package-lock.json`。

       或者团队合作中，做merge操作的人可以通过查看package.json的变更知道新安装了哪些依赖包，来重新安装，

     - 没冲突直接走缓存流程

   - 没有lock文件，则：

从 `npm` 远程仓库获取包信息

根据 `package.json`构建依赖树，构建过程：

- 构建依赖树时，不管其是直接依赖还是子依赖的依赖，优先将其放置在 `node_modules` 根目录。
- 当遇到相同模块时，判断已放置在依赖树的模块版本是否符合新模块的版本范围，如果符合则跳过，不符合则在当前模块的 `node_modules` 下放置该模块。
- 注意这一步只是确定逻辑上的依赖树，并非真正的安装，后面会根据这个依赖结构去下载或拿到缓存中的依赖包

- 进入缓存流程
- 将包解压到 `node_modules`
- 生成 `lock` 文件



#### **缓存**

在执行 `npm install` 或 `npm update`命令下载依赖后，除了将依赖包安装在`node_modules` 目录下外，还会在本地的缓存目录缓存一份。

**缓存流程**：

在缓存中依次查找依赖树中的每个包

- 不存在缓存：
  - 从 `npm` 远程仓库下载包
  - 校验包的完整性
  - 校验不通过：
    - 重新下载
  - 校验通过：
    - 将下载的包复制到 `npm` 缓存目录
    - 将下载的包按照依赖结构解压到 `node_modules`
- 存在缓存：将缓存按照依赖结构解压到 `node_modules`



#### 被讨厌了的npm

[NPM Clients That Are Better Than The Original](https://blog.bitsrc.io/npm-clients-that-are-better-than-the-original-cd54ed0f5fe7)



#### npm7

2020年10月13日是npm CLI团队的快乐星期二，经过几个月的努力，npm CLI团队正式发布了 `npm@7.0.0`。

- 工作区（重复安装问题）：它支持在一个顶级的根包中管理多个包（Yarn和Pnpm以相同的名称实现类似的功能）。它是什么？你可以将它视为在预定义和通用上下文内的项目之间共享软件包的一种方式。，但是并不是说软件包是完全通用的，或者所有内容都要放进同一个下载位置。这个方案确实可以解决一遍又一遍地复制模块的麻烦，还能让你控制我们的模块要共享给哪些项目。

  有了工作区以后，你就可以明确地告诉 NPM，你的程序包将存放在何处。并且由于新版客户端可以感知工作区，因此它会正确安装依赖项，而不会复制那些通用的依赖。

- 同级项依赖：在之前的版本(`npm v6`)中，npm默认不安装同级项依赖，这使得开发人员不得不自己安装和管理同级项依赖关系（比如React15和React16）。而现在，NPM 现在将完成开发人员的工作并帮助后者决定是否应该安装该对等依赖项

  - 同级依赖：

    这里就简单介绍一下：对等依赖项和普通的依赖项几乎没什么区别，它们并没有定义一个严格的要求，而是声明：

    - 你的软件包与另一个模块的特定版本兼容。
    - 如果该模块已经安装并且是正确的版本，则不要执行任何操作。
    - 如果找不到该模块或版本存在冲突，则向开发人员显示一条消息，警告他们这一事实，此外什么也不做。

- Package-lock v2和对yarn.lock的支持

- 其他：

  - npm现在使用了 `package.export`，而不再使用 `require()`
  - `npx` 的重写，下载已经可以使用 `npm exec` 了
  - `npm audit` 的输出在人可读和 `--json` 输出方式上都有所改变。它不再使用表格来显示漏洞，vuln count也不再是将树上的每一个节点相乘。
  - 现在默认情况下，`npm ls` 仅显示顶级软件包

参考链接：https://blog.bitsrc.io/npm-7-this-is-what-i-call-an-update-de17a34ab787



#### 其他的选择

[NPM Clients That Are Better Than The Original](https://blog.bitsrc.io/npm-clients-that-are-better-than-the-original-cd54ed0f5fe7)





## 3.管理Node版本

可以使用nvm进行包管理，随时切换node版本

```js
// 设置 node 安装源
nvm node_mirror https://npm.taobao.org/mirrors/node/
nvm npm_mirror https://npm.taobao.org/mirrors/npm/

// 安装版本
nvm install latest
// 使用指定版本
nvm use v17.0.0
// 查看系统存在的 node 版本
nvm list
// 卸载指定 node 版本
nvm uninstall 17.0.0
```

可以参考以下文章

https://blog.csdn.net/weixin_44582077/article/details/110237056



## 4.NPX

npx是一个工具，npm v5.2.0引入的一条命令（npx），一个npm包执行器，指在提高从npm注册表使用软件包时的体验 ，npm使得它非常容易地安装和管理托管在注册表上的依赖项，npx使得使用CLI工具和其他托管在注册表。它大大简化了一些事情。

实质上 npx 执行的是 `node_module/.bin/` 下面包的命令

主要特点：

- 临时安装可执行依赖包，不用全局安装，不用担心长期的污染。

- 可以执行依赖包中的命令，安装完成自动运行。

  - （比如使用React时，我们使用npm）

    ```shell
    npm i -g create-react-app 
    create-react-app 项目名称
    ```

  - 使用npx

    ```shell
    npx create-react-app 项目名称
    ```

- 自动加载node_modules中依赖包，不用指定$PATH。

- 可以指定node版本、命令的版本，解决了不同项目使用不同版本的命令的问题。（`-p`参数用于指定 npx 所要安装的模块）

  - ```shell
    npx -p node@8 npm run build
    ```

  
  甚至可以
  
  利用 npx 可以下载模块这个特点，可以指定某个版本的 Node 运行脚本。它的窍门就是使用 npm 的 [node 模块](https://www.npmjs.com/package/node)。
  
  > ```bash
  > $ npx node@0.12.8 -v
  > v0.12.8
  > ```
  
  上面命令会使用 0.12.8 版本的 Node 执行脚本。原理是从 npm 下载这个版本的 node，使用后再删掉。
  
  某些场景下，这个方法用来切换 Node 版本，要比 nvm 那样的版本管理器方便一些。



## 5.PNMP

截至2021/11/5, GitHub的Star数量为13.4k，目前Vue、微软、字节都有在使用

下载同yarn：

```shell
npm install -g pnpm
```

从结果上来看，它具有以下优势：

1. 安装速度块

   1. 依赖解析。 仓库中没有的依赖都被识别并获取到仓库。
   2. 目录结构计算。 `node_modules` 目录结构是根据依赖计算出来的。
   3. 链接依赖项。 所有以前安装过的依赖项都会直接从仓库中获取并链接到 `node_modules`。

2. 极其简洁的node_modules目录（非扁平的 node_modules）

   ![](/NPM小解/pnpm.png)

3. 能极大的降低磁盘空间的占用：使用 npm 时，依赖每次被不同的项目使用，都会重复安装一次。  而在使用 pnpm 时，依赖会被存储在内容可寻址的存储中，所以：

   1. 如果你用到了某依赖项的不同版本，只会将不同版本间有差异的文件添加到仓库。 例如，如果某个包有100个文件，而它的新版本只改变了其中1个文件。那么 `pnpm update` 时只会向存储中心额外添加1个新文件，而不会因为仅仅一个文件的改变复制整新版本包的内容。
   2. 所有文件都会存储在硬盘上的某一位置。 当软件包被被安装时，包里的文件会**硬链接**到这一位置，而不会占用额外的磁盘空间。 这允许你跨项目地共享同一版本的依赖。

4. 对**monorepo**支持

   - Monorepo 可以一定程度解决重复安装和修改困难的问题，但需要走本地编译

5. 安全性高，项目无法非法访问未声明的依赖（比如项目A依赖B包，B包依赖C包，此时是项目A无法使用C包）

   - ![](/NPM小解/pnpm2.png)



#### 符号链接和硬链接

 pnpm 使用**符号链接和硬链接**（Hard Link），它会在全局的 store 目录里存储项目 `node_modules` 文件的 `hard links` 

- 一个**硬链接**是一个[目录条目](https://en.wikipedia.org/wiki/Directory_entry)，一个名字与关联[文件](https://en.wikipedia.org/wiki/Computer_file)的[文件系统](https://en.wikipedia.org/wiki/File_system)（文件别名）。所有[基于目录的](https://en.wikipedia.org/wiki/Directory_(computing))文件系统必须至少有一个硬链接，为每个文件提供原始名称

  硬链接指通过索引节点来进行连接。在Linux的文件系统中，保存在磁盘分区中的文件不管是什么类型都给它分配一个编号，称为索引节点号(Inode Index)。在Linux中，多个文件名指向同一索引节点是存在的

  只有删除了源文件和所有对应的硬链接文件，文件实体才会被删除
  
  一个优势例子来源于知乎
  
  [Pnpm: 最先进的包管理工具](https://zhuanlan.zhihu.com/p/404784010)
  
  例如项目里面有个 1MB 的依赖 a，在 pnpm 中，看上去这个 a 依赖同时占用了 1MB 的 node_modules 目录以及全局 store 目录 1MB 的空间(加起来是 2MB)，但因为 `hard link` 的机制使得两个目录下相同的 1MB 空间能从两个不同位置进行寻址，因此实际上这个 a 依赖只用占用 1MB 的空间，而不是 2MB。



- 软链接

  符号连接（Symbolic Link），也叫软连接。软链接文件有类似于Windows的快捷方式（文件路径指向）。它实际上是一个特殊的文件。在符号连接中，文件实际上是一个文本文件，其中包含的有另一文件的位置信息。

  不论是硬链接或软链接都不会将原本的档案复制一份，只会占用非常少量的磁碟空间。



#### 软、硬链接最根本的区别

原理上，硬链接和源文件的inode节点号相同，两者互为硬链接。软连接和源文件的**inode节点号**不同，进而指向的block也不同，软连接block中存放了源文件的路径名。 实际上，硬链接和源文件是同一份文件，而软连接是独立的文件，类似于快捷方式，存储着源文件的位置信息便于指向。 

```
源文件 -> 物理硬盘一个区块
硬链接 -> 物理硬盘一个区块
软链接 -> 源文件路径
```

也就是说，删除源文件，不影响硬链接的访问，但是软连接实际上保存了一个源文件的访问路径，所以会影响软链接的访问

使用限制：

使用限制上，不能对目录创建硬链接，不能对不同文件系统创建硬链接，不能对不存在的文件创建硬链接；可以对目录创建软连接，可以跨文件系统创建软连接，可以对不存在的文件创建软连接。



## 6.npm发包

首先在github上新建项目，clone下来后 `npm init -y`，push完后我们就可以发包啦

在官网注册账号

需要切换npm源

如果是淘宝源、或者公司的源，需要在本地项目命令行输入（后面我们记得切回公司的镜像源，以免影响我们的日常使用）

```shell
npm set registry https://registry.npmjs.org/
```

```shell
npm login
```

在本地和npm官网的账户连接

在`package.json`确保包名全球唯一，也就是name唯一，且main的值为我们打包的文件，因为读取的时候会根据main读取对应的文件

```json
{
  "name": "名称",
  "version": "1.0.0",
  "description": "",
  //main文件路径
  "main": "./dist/main.js",
  //ts声明文件路径
  "typings": "dist/main.d.ts",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  //要发布到npm的文件
  "files": [
    "lib"
  ],
  //关键词
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^5.68.0",
    "webpack-cli": "^4.9.2"
  }
}
```

发布

```shell
npm publish
```



发包后无法获取最新版本时，请检查是否修改了src下文件，不然可能无法获取到最新latest包

并且确保package.json不能为 `type:module` (则以.js结尾或没有任何扩展名的文件将作为ES模块进行加载。默认是走`type: commonjs`)

![](/NPM小解/module.png)





## 7.npm link

`npm install`可以把发布在npmjs平台上的模块包下载到本地

但是对于未发布的包，我们无法测试使用（你可以在本地改源码，但是别人测试的时候下载你的仓库文件，然后 `npm i`，就不知道要不要改源码了 ），此时我们可以使用`npm link`

`npm link`可以帮助我们模拟包安装后的状态，它会在系统中做一个快捷方式映射，让本地的包就好像install过一样，可以直接使用。在MAC中，我们在终端可以直接敲命令，其实是在执行`/xxx`目录下的脚本



当前：我们的`test-project`项目依赖 `xx-module` npm 包

首先，进入我们要开发的npm模块 `xx-module`，执行npm link

```shell
cd xx-module
npm link
```

执行命令后，`xx-module`项目会根据`package.json`上的配置，被链接到全局，路径是`{prefix}/lib/node_modules/<package>`，这是官方文档上的描述，我们可以使用`npm config get prefix`命令获取到prefix的值

然后，进入`test-project`项目，执行命令

```ruby
cd test-project
npm link xx-module
```

> 请注意，`package-name`取自`package.json`，*而不是*取自目录名称。



解除链接
1）解除项目和模块的链接

```shell
cd xxx/xxx/test-project
npm unlink xx-module
```

2）解除模块的全局链接

```shell
cd xxx/xxx/xx-module
npm unlink xx-module
```



参考：

[npm link的使用](https://www.jianshu.com/p/aaa7db89a5b2)

[用一个实例简单介绍什么是pnpm](https://zhuanlan.zhihu.com/p/553199008)

[NPM 7: This Is What I Call An Update](https://blog.bitsrc.io/npm-7-this-is-what-i-call-an-update-de17a34ab787)



## 8.更好的link： yalc

对于一些公司内部包的link ，走npm link 可能有些问题，但是yalc就没问题，因为yalc直接走本地全局的link，并且可以快速切换为第三方npm 包 和本地包

一些[阅读链接：yalc: 可能是最好的前端link调试方案（已经非常谦虚了）](https://juejin.cn/post/7033400734746066957)

[github](https://github.com/wclr/yalc)

安装

```shell
npm i yalc -g
# or
yarn global add yalc
```



本地工具库

```shell
yalc publish
```

修改代码后更新 + 推送（试了下，有时只使用 yalc push 是不行的，无法更新，直接两个命令都加上就必更新）

```shell
yalc publish --push
yalc push
```



本地要引入的项目

```shell
yalc add 包名
```

使用后移出项目

```shell
yalc remove 包名
```



### 更多的其他用法

```csharp
yalc update good-ui # 更新依赖
yalc remove --all # 移除当前包里的全部yalc依赖
```



## 9.peerDependencies

**peerDependencies** 也是 package.json 中的一个属性，翻译过来**是**对等依赖的意思，其中的包在 npm install 时并不会被安装；打包项目时，其中的包也不会被打包进去。

一般用于一些组件库，对齐一些react、vue版本

```json
{
  "devDependencies": {
    "react": "^16.12.0",
  },
  "peerDependencies": {
    "react": ">=16.0.0",
    "react-dom": ">=16.0.0",
    "prop-types": ">=15.6.0"
  },
  "dependencies": {
    "@babel/runtime": "^7.15.3"
  }
}
```

例如：

```json
"peerDependencies": {
  "echarts": "^5.3.1",
  "vue": "^3.2.25"
},
```

在 `npm` 库的开发过程中，使用到了 `vue和echarts` 这两个依赖库，将其放在了 `peerDependencies` 中，此时当前库进行打包的时候

`vue和echarts` 这两个库就不会被打包进去。但是使用这个 `npm` 库的用户，需要在自己的项目中额外安装 `vue和echarts` 这两个依

库。



## 10.resolution

resolutions 是一个用于解决依赖项冲突的 npm 特殊字段。在某些情况下，您的项目依赖项可能需要不同的版本，而这些版本之间可能存在冲突。这时候，您可以使用 resolutions 字段来指定应该使用哪个版本，以解决这些冲突。

例如，如果您的项目依赖于 package-a 和 package-b，而这两个包都依赖于 package-c，但它们依赖于 package-c 的不同版本，这会导致冲突。在这种情况下，您可以在 package.json 文件中使用 resolutions 字段来指定应该使用哪个版本。例如：

```json
{
  "dependencies": {
    "package-a": "^1.0.0",
    "package-b": "^2.0.0"
  },
  "resolutions": {
    "package-c": "^1.2.0"
  }
}
```

在这个示例中，我们指定了 package-c 的版本应该是 ^1.2.0。这意味着当 npm 安装依赖项时，它将使用 1.2.x 系列中的最新版本来解决 package-a 和 package-b 之间的冲突。



在package.json文件里添加跟scripts、dependencies、evDependencies平级的resolutions，把想要强制升级的子依赖期望版本写入，scripts里添加配置"preinstall": "npx force-resolutions"，最后像启动项目一样使用npm run preinstall运行下载，最后达成目的。

```json
{
  "name": "xxx",
  "version": "1.0.0",
  "description": "xxx",
  "author": "xxx",
  "private": true,
  "scripts": {
    "dev": "webpack-dev-server --inline --hot --progress --config build/webpack.dev.conf.js",
    "start": "npm run dev",
    "unit": "jest --config test/unit/jest.conf.js --coverage",
    "e2e": "node test/e2e/runner.js",
    "test": "npm run unit && npm run e2e",
    "build": "node build/build.js",
    "preinstall": "npx force-resolutions"
  }
}
```

