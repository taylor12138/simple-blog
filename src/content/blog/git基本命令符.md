---
author: Hello
categories: 前端
pubDate: 2021-03-01 
title: git基本命令符
description: 'git相关知识'
---

## 版本控制

它是一种软件开发过程中，管理我们对文件、目录、或工程等内容的修改历史、方便我们查看更改历史记录，备份以便恢复以前的版本软件工程技术。简单来说就是用于管理多人协同开发项目的技术

SVN：集中式版本控制、所有版本存在服务器上，需要连网才能看到历史版本，服务器坏了可能导致数据丢失。工作时我们首先需要从中央服务器的到最新版本

Git：分布式版本控制，每个人都拥有全部的代码（可能有安全隐患），这样就可以在本地查看历史版本，可以离线在本地提交，只需练网时push到相应服务器即可。协同方式：A修改了代码、B也修改了代码，这时只需要你们两人之间把各自修改的代码推送给对方，即可看到对方修改

Git是目前（2021年）世界上最先进的分布式版本控制系统

#### Git启动

`Git Bash`：Unix与Linux风格的命令行，使用最多，推荐最多

`Git CMD`：Windows风格命令行

`Git GUI`：图形界面，不建议初学者使用

## Git基本命令符

config 配置有system级别 global（用户级别） 和local（当前仓库）三个 设置先从system -> global -> local  底层配置会覆盖顶层配置 分别使用--system/global/local 可以定位到配置文件

查看系统config

```shell
git config --system --list
```

查看当前用户（global）配置

```shell
git config --global --list
```

安装Git后必须执行的(不然提交不了项目)：设置用户名和邮箱

```shell
git config --global user.name "taylor12138"
git config --global user.email "277421392@qq.com"
```

查看当前仓库配置信息

```shell
git config --local--list
```

#### 基本理论

Git本地有三个工作区域：

- 工作目录（Working Directory）：平时存放项目代码的地方（主要跟我们挂钩的两个区域之一）

- 暂存区（Stage/Index）：临时存放改动，事实上只是一个文件

- 资源库（Respository/Git Directory）：安全存放数据的位置，这里有提交到所有版本的数据

- 再加上远程仓库（Remote Directory）：托管代码的服务器（主要跟我们挂钩的两个区域之一）

![](/simple-blog/git基本命令符/git.png)

#### 忽略文件

有时我们不想把某些文件也一并上传，比如前端项目中的 `npm_modules`

可以在 `.gitignore`文件下添加忽略的文件

```shell
*.txt         #忽略所有.txt结尾的文件
!lib.txt      #将lib.txt除外（不被忽略）
/temp         #仅忽略根目录下的TODO文件，不包括其他目录的temp文件
build/        #忽略build/目录下的所有文件
doc/*.txt     #忽略doc/notes.txt但不包括doc/server/arch.txt
```

## github建立连接的方法

#### 方法1：

在GitHub网站上新建仓库

然后拷贝仓库的地址，进行克隆下载到本地

把自己原来项目除了git文件的所有文件拷贝进下载的文件夹里（克隆下载的文件本身自带`.git`文件）

利用工具 进入新的文件夹  可以查看状态：（可以查看文件是否被跟踪）

```shell
git status
```

一般git上传只需要

1 放入暂存区

```shell
git add .
```

2 提交到git本地仓库， `-m`是提交信息

```shell
git commit -m '描述'
```

比如：`git commit -m 'feat(buyvip): 补充埋点路径参数'`

提交规范：

![](/simple-blog/git基本命令符/git2.jpg)

3 推送到远程

```shell
git push
```

#### 方法2：

将本地项目直接push，不用拷贝

创建一个全空的仓库

然后该项目有提示：`git remote add orgin https://github.com/xxxxxxxx.git`的指令 和 `git push -u origin master`指令

在项目的终端执行 

#### git撤回操作(reset)

如果只是add（暂存）或者commit（提交到本地仓库），可以使用

```shell
git reset HEAD <filename>
```

**HEAD 说明：**

- HEAD 表示当前版本
- HEAD^ 上一个版本
- HEAD^^ 上上一个版本
- HEAD^^^ 上上上一个版本
- 以此类推...

如果是已经推送到远程仓库了，需要进行回滚（reset或者revert）

```shell
$ git revert HEAD
$ git push origin master
```

reset和revert都可以用来回滚代码。但他们是有区别的。

1、reset是彻底回退到指定的commit版本，该commit后的所有commit都将被清除；而revert仅是撤销指定commit的修改，并不影响后续的commit。

2、reset执行后不会产生记录，revert执行后会产生记录。

当然也可以不用revert，而是当前代码切到新的分支，比如feat/xxx，然后回到原来的分支，

使用 `git reset`我们需要找到回滚的commit，输入git reset --hard {commitId}，将本地文件回滚： 

```shell
git reset --hard d580ea7dab097d8ea6d658adbc7e9d57ef22669a
```

然后可以强行push上去

```shell
git push -f
```

此时我们拿到的时候会滚的旧代码，然后我们可以使用vscode自带的工具，拿到我们修改的部分，进行对比修改

![vscode](/simple-blog/git基本命令符/git3.png)

回退到上个版本 + 提交：

```shell
git reset --hard HEAD^  
git push origin HEAD --force
```

常见命令如下：

- --mixed（默认）：默认的时候，只有暂存区变化
- --hard参数：如果使用 --hard 参数，那么工作区也会变化
- --soft：如果使用 --soft 参数，那么暂存区和工作区都不会变化

#### git删除某次提交（revert）

```shell
 git revert <hash>
```

如果是merge动作，则需要用-m选项

```shell
git revert -m 1 <merge commit hash> # -m 后面的是数字1, 表示要回滚的是一个merge动作且以主分支的提交为准
```

#### **git stash**暂存内容

当git pull时，出现以下提示：

```bash
更新 07153c9..820f46d
error: 您对下列文件的本地修改将被合并操作覆盖：
```

别人修改了文件并且提交PUSH,你也修改了此文件并且没有add和[commit](https://so.csdn.net/so/search?q=commit&spm=1001.2101.3001.7020).然后你在pull时就会出现此提示。

如果不想舍弃对本地的修改：

就按照提示的操作一样：请在合并前提交或贮藏您的修改。

贮藏修改，就要用到**git stash**

先git stash，本地工作区备分，放入git栈中。然后，工作区内容恢复到仓库head最后一次提交的内容。

然后git pull.

最后，git stash pop,这个过程自动合并。如果成功，则自动此备分从git stash中删除。如果有冲突，则你需要手动解决冲突。然后git stash drop

## Git分支

```shell
git branch          #查看所有分支
git branch -r       #查看远程分支
git branch dev      #新建dev分支，但是现在仍停留在原分支
git branch -d dev   #删除dev分支
git merge [branch]  #合并指定分支到当前分支
```

如果多个分支并行执行，会导致代码并不冲突，也就是同时存在多个版本

一般来说master主分支非常稳定，用来发布新版本，工作一般在新建的dev分支上工作，等待dev分支稳定后才可合并到master主分支上

切换分支

```shell
git checkout “对应分支”
git checkout -                      #切换到上一个分支
git checkout -b 命名(feat/v1.21)    #新建分支feat/v1.21
```

此时我们可以push到新建的分支

```shell
git push --set-upstream origin feat/v1.21
```

## Git提交错误

Connection was reset in connection to github.com:443

解决方法：

1.

```shell
git config --global http.sslVerify false
```

结果：失败

2.

```sehll
git config --global --unset http.proxy
```

结果：失败

3.cmd命令执行（可能是因为使用过vpn或者代理，关机时忘记关了。）

```shell
ipconfig/flushdns
```

结果：失败

4.更改本地hosts文件，添加github的ip地址

结果：失败

5.：输入命令

```shell
git config --global http.proxy 127.0.0.1:7890 为全局的 git 项目都设置代理
git config --local http.proxy 127.0.0.1:7890 为某个 git 项目单独设置代理
```

结果：成功

## Package.json版本号

一般package.json依赖配置如下

```js
"dependencies": {
    "xxx": "~1.3.7",
    "yyy": "^1.19.0",
    "zzz": "<1.0.2"
  }
```

其中依赖名前会加上，例如 `~ ^ >= < + *` 这些符号

> 主版本号.次版本号.修补版本号 **major.minor.patch**

- patch：修复bug，兼容老版本

- minor：新增功能，兼容老版本

- major：新的架构调整，不兼容老版本
1. `~version` 
    大概匹配某个版本
   
   如果minor版本号指定了，那么minor版本号不变，而patch版本号任意
   
   如果minor和patch版本号未指定，那么minor和patch版本号任意
   
   如：~1.1.2，表示>=1.1.2 <1.2.0，可以是1.1.2，1.1.3，1.1.4，…，1.1.n
   
   如：~1.1，表示>=1.1.0 <1.2.0，可以是同上
   
   如：~1，表示>=1.0.0 <2.0.0，可以是1.0.0，1.0.1，1.0.2，…，1.0.n，1.1.n，1.2.n，…，1.n.n

2. `^version`
   
   > 兼容某个版本
   > 
   > 版本号中最左边的非0数字的右侧可以任意
   > 
   > 如果缺少某个版本号，则这个版本号的位置可以任意 如：^1.1.2 ，表示>=1.1.2 <2.0.0，可以是1.1.2，1.1.3，…，1.1.n，1.2.n，…，1.n.n
   
   如：^0.2.3 ，表示>=0.2.3 <0.3.0，可以是0.2.3，0.2.4，…，0.2.n
   
   如：^0.0，表示 >=0.0.0 <0.1.0，可以是0.0.0，0.0.1，…，0.0.n

## git代码提交规范工具husky

如果想要在提交之前（git commit），让eslint做一次 eslint fix，我们可以使用husky工具

你一可以他把看成一个关于git 的 eslint

husky是一个git hook工具，可以帮助我们触发git 提交的各个阶段，pre-commit、commit-msg、pre-push

我们自己也可以在 `./git/hooks` 新建文件，给予可执行权限，然后在pre-commit阶段执行某种操作

使用husky：使用自动配置命令

```shell
npx husky-init && npm install
```

windows用户（powershell）可以换成

```shell
npx husky-init -and npm install
```

#### pre-commit

此时可以在`.husky`文件夹下的pre-commit文件下，写入`eslint`的fix命令（`package.json`中代码检查命令 `npm run lint` 之类的 ）

上面那个命令会执行以下三步操作

1. 安装husky相关依赖（ `npm i husky -D` ）
2. 项目目录下创建 `.husky` 文件夹（ `npx husky install` ）
3. 在`package.json`中添加一个脚本

#### 自动规范化提交格式

`commitizen`，可以帮助我们自动生成规范的提交信息（上面所说到的commit规范）

使用：

```shell
npm i commitizen -D
```

安装 `cz-conventional-changelog`并且进行初始化（自动帮我们在`package.json`中配置相关config）

```shell
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

首先我们还是 `git add .` 

然后我们提交代码的时候，不输入 `git commit -m 'xxx'` ，而是输入以下命令即可 

```shell
npx cz
```

#### 限制提交（commit-msg）

既然我们按照cz的规格来提交，但是并没有说不能使用原来的方法直接提交

此时我们可以是用 `commitlint` 来限制提交

安装

```shell
npm i @commitlint/config-conventional @commitlint/cli -D
```

在根目录创建 `commitlint.config.js` 文件，配置`commitlint`

```js
module.exports = {
  extends: ['@commitlint/config-conventional']
}
```

使用husky生成 `commit-msg` 文件，验证提交信息

```shell
npx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"
```

## git配置ssh

关于git管理时，配置多个账号（比如公司用一个，个人用一个）

指导一：[Git 配置多账号（Mac）](https://blog.csdn.net/anndy_/article/details/123636132)

指导二： [github/gitlab同时管理多个ssh key](https://xuyuan923.github.io/2014/11/04/github-gitlab-ssh/)

因为

If you're using macOS Sierra 10.12.2 or later, you will need to modify your `~/.ssh/config` file to automatically load keys into the ssh-agent and store passphrases in your keychain.

所以现在一般ssh中的config也需要配置，最好用第二个。
