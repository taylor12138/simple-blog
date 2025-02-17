---
title: 'Docker'
author: Hello
pubDate: 2022-06-05
categories: 前端
description: 'Docker相关'
---

## Docker概述

#### 1. 简要概述

IT 软件中所说的 "Docker" ，是指容器化技术，用于支持创建和使用 [Linux® 容器](https://www.redhat.com/zh/topics/containers)。

[开源 Docker 社区](https://forums.docker.com/)致力于改进这类技术，并免费提供给所有用户，使之获益。



##### 虚拟机

一般来说，比如我们写了一个web应用，如果朋友们要看/部署到远程服务器，那么首先都需要配置相同的依赖（数据库之类的，甚至要保证操作系统的一致性），不然会出现“我的机器可以跑，你的机器跑不了”的情况

为了模拟完全相同的本地开发环境，我们可以使用虚拟机，但是虚拟机的缺点：

- 虚拟机需要模拟硬件，运行整个操作系统，不但体积臃肿内存占高，程序性能也会受到影响（其实就是占体积..）



##### Linux 容器

**Linux 容器不是模拟一个完整的操作系统，而是对进程进行隔离。**或者说，在正常进程的外面套了一个[保护层](https://link.juejin.cn?target=https%3A%2F%2Fopensource.com%2Farticle%2F18%2F1%2Fhistory-low-level-container-runtimes)。对于容器里面的进程来说，它接触到的各种资源都是虚拟的，从而实现与底层系统的隔离。

由于容器是进程级别的，相比虚拟机有很多优势。

**（1）启动快**

容器里面的应用，直接就是底层系统的一个进程，而不是虚拟机内部的进程。所以，启动容器相当于启动本机的一个进程，而不是启动一个操作系统，速度就快很多。

**（2）资源占用少**

容器只占用需要的资源，不占用那些没有用到的资源；虚拟机由于是完整的操作系统，不可避免要占用所有资源。另外，多个容器可以共享资源，虚拟机都是独享资源。

**（3）体积小**

容器只要包含用到的组件即可，而虚拟机是整个操作系统的打包，所以容器文件比虚拟机文件要小很多。

总之，容器有点像轻量级的虚拟机，能够提供虚拟化的环境，但是成本开销小得多。



##### Docker

**Docker 属于 Linux 容器的一种封装，提供简单易用的容器使用接口。**

Docker在概念上和虚拟机十分相似，但是轻量很多，它不会去模拟底层硬件，只是为每个应用提供一个完全隔离的运行环境（类似于sandbox），我们可以在每个不同的环境配置不同的工具

Docker 将应用程序与该程序的依赖，打包在一个文件里面。运行这个文件，就会生成一个虚拟容器。程序在这个虚拟容器里运行，就好像在真实的物理机上运行一样

使用docker安装，

- 一个命令即可安装当前所需所有依赖
- 大量镜像可直接使用(在dockerhub上找)
- 无系统兼容问题，可多版本共存
- 用完就丢



##### Image/镜像

（理解成一个npm i + package.json / 一个安装包。即可）

- 类似于一个虚拟机快照，里面包含了你要部署的应用程序以及他关联的所有库
- 通过镜像，我们可以创建许多不同的container容器，这里的容器就像一台台虚拟机，每个container独立运行

**Docker 把应用程序及其依赖，打包在 image 文件里面。**只有通过这个文件，才能生成 Docker 容器。image 文件可以看作是容器的模板。Docker 根据 image 文件生成容器的实例。同一个 image 文件，可以生成多个同时运行的容器实例。

Dockerfile

- 类似于一个自动化脚本，主要用来创建镜像（类比在虚拟机中安装操作系统和软件）





#### 2. 其他概述

##### 特点

- 模块化
- 层和镜像版本控制
- 回滚
-  快速部署



##### 应用

借助 Docker，您可将容器当做轻巧、模块化的虚拟机使用。同时，您还将获得高度的灵活性，从而实现对容器的高效创建、部署及复制，并能将其从一个环境顺利迁移至另一个环境，[从而有助于您针对云来优化您的应用](https://www.redhat.com/zh/topics/cloud-native-apps)。



##### 原理

**Docker** 使用 `Google` 公司推出的 [Go 语言](https://golang.google.cn/) 进行开发实现

Docker 技术使用[ Linux 内核](https://www.redhat.com/zh/topics/linux/what-is-the-linux-kernel)和内核功能（例如 [Cgroups](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Resource_Management_Guide/ch01.html) 和 [namespaces](https://lwn.net/Articles/528078/)）来分隔进程，以便各进程相互独立运行。这种独立性正是采用容器的目的所在；它可以独立运行多种进程、多个应用，更加充分地发挥基础设施的作用，同时保持各个独立系统的[安全性](https://www.redhat.com/zh/topics/security)。



##### 一些docker的镜像加速源

| 镜像加速器          | 镜像加速器地址                       |
| ------------------- | ------------------------------------ |
| Docker 中国官方镜像 | https://registry.docker-cn.com       |
| DaoCloud 镜像站     | http://f1361db2.m.daocloud.io        |
| Azure 中国镜像      | https://dockerhub.azk8s.cn           |
| 科大镜像站          | https://docker.mirrors.ustc.edu.cn   |
| 阿里云              | https://ud6340vz.mirror.aliyuncs.com |
| 七牛云              | https://reg-mirror.qiniu.com         |
| 网易云              | https://hub-mirror.c.163.com         |
| 腾讯云              | https://mirror.ccs.tencentyun.com    |

配置

![](/docker/d1.png)



#### 3.使用

直接跑命令

```
docker run --name some-redis -d redis
```

- -d 在后台运行
- --name ，给redis命名为some-redis
- **-p:** 指定端口映射，格式为：**主机(宿主)端口:容器端口**
- 更多运行命令含义可以在[此处查看](https://docs.docker.com/reference/cli/docker/container/run/)

打开桌面版docker，到对应的redis cli，执行命令

![](/docker/d2.png)



#### 4. Docker-compose

##### 概念

Docker Compose **是一个工具，你可以用来定义和分享多容器应用程序**。 这意味着你可以使用一个单一的资源来运行一个有多个容器的项目。



###### 场景

Docker 帮助你在你的机器上快速建立一个开发环境。完成整个过程只需要几分钟时间。

但是，让我们假设你被分配到一个项目上，该项目需要至少 10 个不同的服务处于运行状态来运行你的项目。例如，假设你的项目需要 Java 8、Node 14、MySQL、MongoDB、Ruby on rails、RabbitMQ 和其他。

在这种情况下，你必须从 Docker 中单独提取所有这些镜像，并在其容器中启动所有这些镜像。在某些时候，一个进程可能依赖于另一个进程来运行。所以，你必须给它们排序。

如果这是一个一次性的过程就好了。但是，不仅仅是一次——每天、每次你开始在你的项目上工作时——你都必须启动所有这些服务。

这是一个乏味的过程，对吗？

为了克服这个问题，Docker 引入了一个叫做多容器（Docker Compose）的概念。在学习 Docker Compose 之前，让我们快速了解一下如何在 Docker 中启动数据库主机。



Compose 是用于定义和运行多容器 Docker 应用程序的工具。通过 Compose，您可以使用 YML 文件来配置应用程序需要的所有服务

像这样（Docker-Compose的工程配置文件默认为`docker-compose.yml`）：

```yaml
# yaml 配置实例
version: '3'
services:
  web:
    build: .
    ports:
    - "5000:5000"
    volumes:
    - .:/code
    - logvolume01:/var/log
    links:
    - redis
  redis:
    image: redis
volumes:
  logvolume01: {}
```



###### 安装docker-compose

- 如果你是安装的桌面版 Docker，不需要额外安装，已经包含了。
- 如果是没图形界面的服务器版 Docker，你需要单独安装 [安装文档](https://docs.docker.com/compose/install/#install-compose-on-linux-systems)
- 运行`docker-compose`检查是否安装成功



###### docker-compose.yml 配置文件

```yaml
# yaml 配置
version: '3'
services:
 web:
  build: .
  ports:
   - "5000:5000"
 redis:
  image: "redis:alpine"
  volumes:
  - redis:/data
  
volumes:
  db:
  redis:
```

该 Compose 文件定义了两个服务：web 和 redis。

- **web**：该 web 服务使用从 Dockerfile 当前目录中构建的镜像。然后，它将容器和主机绑定到暴露的端口 5000。此示例服务使用 Flask Web 服务器的默认端口 5000 。
- docker-compose v3版本，version版本1 就不要考虑了已经废弃了
- **redis**：该 redis 服务使用 Docker Hub 的公共 Redis 映像。
- volumes：创建 + 设置卷，用于镜像挂载



服务配置命令

- **build**

  指定为构建镜像上下文路径：

  例如 webapp 服务，指定为从上下文路径 ./dir/Dockerfile 所构建的镜像：

  ```yaml
  version: "3.7"
  services:
    webapp:
      build: ./dir
  ```

- image

  指定容器运行的镜像。以下格式都可以：

  ```yaml
  image: redis
  image: ubuntu:14.04
  image: tutum/influxdb
  image: example-registry.com:4000/postgresql
  image: a4bc65fd # 镜像id
  ```

- volumes

  将主机的数据卷或着文件挂载到容器里。

  ```yaml
  version: "3.7"
  services:
    db:
      image: postgres:latest
      volumes:
        - "/localhost/postgres.sock:/var/run/postgres/postgres.sock"
        - "/localhost/data:/var/lib/postgresql/data"
  ```

- environment

  添加环境变量。您可以使用数组或字典、任何布尔值，布尔值需要用引号引起来，以确保 YML 解析器不会将其转换为 True 或 False。

  ```yaml
  environment:
    - RACK_ENV=development
    # 时区调整为上海
    - TZ=Asia/Shanghai
  ```

- ports

  ```yaml
  ports:
    - "80:80"         # 绑定容器的80端口到主机的80端口
    - "9000:80"       # 绑定容器的80端口到主机的9000端口
    - "443"           # 绑定容器的443端口到主机的任意端口，容器启动时随机分配绑定的主机端口号
  ```

- expose

  ```yaml
  expose:
    - "3000"
    - "8000"
  ```
  
  以上指令将当前容器的端口3000和8000暴露给**其他容器**。
  
  **和ports的区别是，expose不会将端口暴露给主机，主机无法访问expose的端口**。
  
- restart

  ```yaml
  restart: always
  ```

  always：表示无论容器如何退出，都会自动重启。这意味着如果容器崩溃或被手动停止，Compose 会尝试自动重新启动它。



###### 运行Compose

在测试目录中（目录中包含docker-compose.yml 配置文件），执行以下命令来启动应用程序：

```
docker-compose up
```

如果你想在后台执行该服务可以加上 **-d** 参数，此时就可以继续在终端中进行其他操作了。

```
docker-compose up -d
```



##### Docker-compose常用命令

启动容器

```
docker-compose up [options] [--scale SERVICE=NUM...] [SERVICE...]              
```

在后台运行服务容器

```
docker-compose up -d
```



列出项目中所有的容器

```
docker-compose ps
```



停止容器

```
docker-compose stop
```



停止和删除容器、网络、卷、镜像

```
docker-compose down
```



构建（重新构建）项目中的服务容器

```
docker-compose bulid
```



进入xx容器内的命令行，比如redis

```
docker-compose exec redis sh
```



#### 5.定制自己的dockerfile

##### 基础

在自己的项目下

新建一个dockerfile文件

```dockerfile
# 项目基础
FROM node:11

# 项目维护者
LABEL org.opencontainers.image.authors="https://github.com/taylor12138"

# 把当前目录（.）下代码复制到容器里(/app)目录
ADD . /app

# 设置运行目录
WORKDIR /app

# 运行命令，安装依赖
# RUN 命令可以有多个，但是可以用 && 连接多个命令来减少层级。
# 例如 RUN npm install && cd /app && mkdir logs
RUN npm install --registry=https//registry.npm.taobao.org

# 指定默认命令。
# CMD 指令只能一个，是容器启动后执行的命令，算是程序的入口。
# 如果还需要运行其他命令可以用 && 连接，也可以写成一个shell脚本去执行。
# 例如 CMD cd /app && ./start.sh
CMD node app.js
```



##### 一些其他的示例A

[案例地址](https://www.runoob.com/docker/docker-compose.html)



##### 一些其他的示例B

```dockerfile
FROM xxx.com/alpaca/node:v3

RUN apk add --update --no-cache ffmpeg make g++ automake autoconf libtool nasm libjpeg-turbo-dev pngquant

WORKDIR /appops

COPY *.json /appops/

RUN npm install

COPY . /appops

RUN npm run tsc

CMD npm start
```

**Dockerfile 内容解释：**

1. `FROM xxx.com/alpaca/node:v3`
   - 使用xxxx内部的Docker镜像仓库（harbor）中的Node.js基础镜像
   - 基于alpine Linux的轻量级Node.js镜像
2. `RUN apk add --update --no-cache ffmpeg make g++ automake autoconf libtool nasm libjpeg-turbo-dev pngquant`
   - 使用alpine的包管理器`apk`安装必要的系统依赖
   - `--update`: 更新包索引
   - `--no-cache`: 不缓存包索引，减小镜像大小
   - 安装的包包括：
     - `ffmpeg`: 视频处理工具
     - `make`, `g++`, `automake`, `autoconf`: 编译工具链
     - `libtool`: 通用库支持脚本
     - `nasm`: 汇编器
     - `libjpeg-turbo-dev`: JPEG图片处理库
     - `pngquant`: PNG图片压缩工具（之前代码中用到的）
3. `WORKDIR /appops`
   - 设置容器内的工作目录为`/appops`
   - 后续的命令都将在这个目录下执行
4. `COPY *.json /appops/`
   - 复制所有JSON文件（如package.json, tsconfig.json等）到容器的`/appops/`目录
   - 这样做是为了利用Docker的缓存机制，如果依赖没有变化，就不需要重新安装
5. `RUN npm install`
   - 安装项目依赖
   - 在复制package.json之后执行，这样只有当依赖发生变化时才会重新安装
6. `COPY . /appops`
   - 复制项目的所有文件到容器的`/appops/`目录
   - 在安装依赖之后复制源代码，这样修改源代码不会触发依赖重新安装
7. `RUN npm run tsc`
   - 执行TypeScript编译
   - 将TypeScript代码编译为JavaScript
8. `CMD npm start`
   - 容器启动时执行的命令
   - 启动Node.js应用程序



##### Dockerfile示例

```dockerfile
FROM python:3.7-alpine
WORKDIR /code
ENV FLASK_APP app.py
ENV FLASK_RUN_HOST 0.0.0.0
RUN apk add --no-cache gcc musl-dev linux-headers
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
COPY . .
CMD ["flask", "run"]
```

**Dockerfile 内容解释：**

- **FROM python:3.7-alpine**: 从 Python 3.7 映像开始构建镜像。

- **WORKDIR /code**: 将工作目录设置为 /code。

- ```
  ENV FLASK_APP app.py
  ENV FLASK_RUN_HOST 0.0.0.0
  ```

  设置 flask 命令使用的环境变量。

- **RUN apk add --no-cache gcc musl-dev linux-headers**: 安装 gcc，以便诸如 MarkupSafe 和 SQLAlchemy 之类的 Python 包可以编译加速。

- ```
  COPY requirements.txt requirements.txt
  RUN pip install -r requirements.txt
  ```

  复制 requirements.txt 并安装 Python 依赖项。

- **COPY . .**: 将 . 项目中的当前目录复制到 . 镜像中的工作目录。

- **CMD ["flask", "run"]**: 容器提供默认的执行命令为：flask run。



##### 编译镜像

[docker build ](https://www.runoob.com/docker/docker-build-command.html)命令，用于编译dockerfile的镜像

语法

```
docker build [OPTIONS] PATH | URL | -
```

- `-t` 设置镜像名字和版本号



```
docker build -t my-test:v1 .
```

此时在docker ui界面，即可看到刚才的`my-test`dockerfile镜像

![image-20240313005414499](/docker/d3.png)



##### 运行镜像

然后我们可以运行镜像了

```
docker run -p 8080:8080 --name test-hello my-test:v0.0.1
```



##### 镜像挂载

一些其他小问题

- 使用 Docker 运行后，我们改了项目代码不会立刻生效，需要重新`build`和`run`，很是麻烦。
- 容器里面产生的数据，例如 log 文件，数据库备份文件，容器删除后就丢失了。



通过目录挂载可以解决以上问题

几种挂载方式（[官网详情](https://docs.docker.com/storage/)）

- `bind mount` 直接把宿主机目录映射到容器内，适合挂代码目录和配置文件。可挂到多个容器上
- `volume` 由容器创建和管理，创建在宿主机，所以删除容器不会丢失，官方推荐，更高效，Linux 文件系统，适合存储数据库数据。可挂到多个容器上
- `tmpfs mount` 适合存储临时文件，存宿主机内存中。不可多容器共享。

![image-20240313095416820](/docker/d4.png)

我们可以通过图片看到，`bind mount`是直接绑定宿主机的文件目录，`volume`是容器来创建宿主机的文件目录，`tmpfs mount` 直接走内存



使用

`bind mount` 方式用绝对路径 `-v 服务端项目的绝对路径名`

```shell
docker run -p 8080:8080 --name test-hello1 -v /Users/xxxx/Desktop/other/docker/test-app -d my-test:v0.0.1
```



`volume` 方式，只需要一个名字 `-v db-data:/app`

```shell
# create volume
docker volume create mysql-data

# run mysql container in the background
$ docker run --name mysql-db -v mysql-data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:latest

# stop mysql container
docker rm -f mysql-db

# remove volume
docker volume remove mysql-data
```



#### 6.docker多容器通信

项目往往都不是独立运行的，需要数据库、缓存这些东西配合运作。

要想多容器之间互通，从 Web 容器访问 Redis 容器，我们只需要把他们放到同个网络中就可以了。

docker [网络命令](https://docs.docker.com/reference/cli/docker/network/)

如果使用docker-compose 则所有容器将使用同一个网络，可以直接相互通信



创建一个名为`test-net`的网络：

```
docker network create test-net
```

针对需要被访问的容器：

运行 Redis 在 `test-net` 网络中，指定redis容器在网络中的名字为`redis`，这样项目就能通过别名访问了(--network-alias)

```
docker run -d --name redis --network test-net --network-alias redis redis:latest
```

修改代码中访问`redis`的地址为网络别名

![image-20240527180002522](/docker/redis.png)

运行 Web 项目，使用同个网络

```
docker run -p 8080:8080 --name test -v D:/test:/app --network test-net -d test:v1
```

查看数据

`http://localhost:8080/redis`

容器终端查看数据是否一致



## Podman

Podman 是一个**无守护进程（daemonless）**的开源 Linux 原生工具

旨在使用开放容器计划 （OCI） 容器和容器映像轻松查找、运行、构建、共享和部署应用程序。Podman 提供了一个命令行界面 （CLI），任何使用过 Docker 容器引擎的人都熟悉。大多数用户可以简单地将 Docker 别名化为 Podman（别名 docker=podman），而不会出现任何问题。与其他常见的容器引擎（Docker、CRI-O、containerd）类似，Podman 依赖于符合 OCI 标准的容器运行时（runc、crun、runv 等）与操作系统交互并创建正在运行的容器。这使得 Podman 创建的正在运行的容器与任何其他常见容器引擎创建的容器几乎没有区别。



Podman中的容器可以以root或非root用户身份运行，所以其实更安全

由于Podman没有守护程序来管理容器，Podman使用另一个服务管理器来管理所有的服务，并支持在后台运行容器，称为Systemd。



#### 守护进程（ Daemon）

1、定义

守护进程是运行在后台的一种特殊进程，它独立于控制终端并且周期性地执行某种任务或循环等待处理某些事件的发生；它不需要用户输入就能运行而且提供某种服务，不是对整个系统就是对某个用户程序提供服务。Linux系统的大多数服务器就是通过守护进程实现的。

守护进程一般在系统启动时开始运行，除非强行终止，否则直到系统关机才随之一起停止运行；

守护进程一般都以root用户权限运行，因为要使用某些特殊的端口（1-1024）或者资源；

守护进程的父进程一般都是init进程，因为它真正的父进程在fork出守护进程后就直接退出了，所以守护进程都是孤儿进程，由init接管

守护进程是非交互式程序，没有控制终端，所以任何输出，无论是向标准输出设备stdout还是标准出错设备stderr的输出都需要特殊处理。

守护进程的名称通常以d结尾，比如sshd、xinetd、crond等



2、作用

1.守护进程是一个生存周期较长的进程，通常独立于控制终端并且周期性的执行某种任务或者等待处理某些待发生的事件

2.大多数服务都是通过守护进程实现的

3.关闭终端，相应的进程都会被关闭，而守护进程却能够突破这种限制





Linux系统的大多数服务器就是通过守护进程实现的。常见的守护进程包括：

- 系统日志进程syslogd、
- web服务器httpd、
- 邮件服务器sendmail
- 数据库服务器mysqld等。



#### 一些命令

**podman 机器初始化**

```
podman machine init [options] [name]
```



**podman 启动虚拟机**

```
podman machine start [name]
```



**podman 停止虚拟机**

```
podman machine stop [name]
```



**通过外部 compose 提供程序运行 Compose 工作负载**

podman compose 是围绕外部 compose 提供程序（如 docker-compose 或 podman-compose）的精简包装器。这意味着正在 `podman compose` 执行另一个工具，该工具实现 compose 功能，但以某种方式设置环境，让 compose 提供程序与本地 Podman 套接字透明地通信。指定的选项以及命令和参数将直接传递到撰写提供程序。

默认的撰写提供程序是 `docker-compose` 和 `podman-compose` 。如果已安装， `docker-compose` 则优先

```
podman compose [options] [command [arg …]]
```



**列出运行的容器**

```
$ podman ps -a
```



参考：

[Docker 1小时快速上手教程，无废话纯干货](https://www.bilibili.com/video/BV1s54y1n7Ev?from=search&seid=15719185628407439607&spm_id_from=333.337.0.0)

[Docker 入门教程-阮一峰](https://www.ruanyifeng.com/blog/2018/02/docker-tutorial.html)

[Docker Compose 是什么？通过示例学习如何使用它](https://www.freecodecamp.org/chinese/news/what-is-docker-compose-how-to-use-it/)