---
author: Hello
pubDate: 2021-10-24
categories: 前端
title: Serverless
description: '架构相关'
---

## Serverless

Serverless（无服务计算）是指构建和运行不需要服务器管理的应用程序和概念

无服务器计算是一种**按需提供后端服务**的方法。无服务器提供程序允许用户编写和部署代码，而不必担心底层基础结构。从无服务器供应商处获得后端服务的公司将根据其计算费用，而不必保留和支付固定数量的带宽或服务器数量，因为该服务是**自动扩展**的。请注意，尽管称为无服务器，但仍使用物理服务器，但开发人员无需了解它们。

目前行业可能更多处于容器Docker + Kubernetes，利用Iaas、Paas和Saas来快速搭建部署应用

Docker是一个平台，它主要是提供一些服务，任何一台装有docker的机器你都可以建立、发布、运行你的应用程序，使用docker很省钱省时。

简单的介绍Kubernetes。它就是一套成熟的商用服务编排解决方案。Kubernetes定位在Paas层，重点解决了微服务大规模部署时的服务编排问题。



#### 精确定义化

实际上，业界对Serverless尚无一致认可的定义，但是我相信大部分开发者在听到 Serverless时，会联想到Lambda，并且冒出“函数”、“按需（调用次数）收费”、“事件驱动”等关键词。确实当年刚刚诞生的Serverless就像下面可爱的“紫薯人”，紫色充满神秘感（当年刚推出的时候绝对是黑科技），让人印象深刻。



**在《serverless-架构应用开发指南》的定义是：**

- Serverless 架构是指大量依赖第三方服务（也叫做后端即服务，即“`BaaS`”）或暂存容器中运行的自定义代码（函数即服务，即“`FaaS`”）的应用程序，函数是无服务器架构中抽象语言运行时的最小单位。



**按 AWS 官方对于 Serverless 的定义：**

> 服务器架构是基于互联网的系统，其中应用开发不使用常规的服务进程。相反，它们仅依赖于第三方服务（例如AWS Lambda服务），客户端逻辑和服务托管远程过程调用的组合。”[2](https://serverless.ink/#fn2)

在一个基于 AWS 的 Serverless 应用里，应用的组成是：

- 网关 API Gateway 来接受和处理成千上万个并发 API 调用，包括流量管理、授权和访问控制、监控等
- 计算服务 Lambda 来进行代码相关的一切计算工作，诸如授权验证、请求、输出等等
- 基础设施管理 CloudFormation 来创建和配置 AWS 基础设施部署，诸如所使用的 S3 存储桶的名称等
- 静态存储 S3 作为前端代码和静态资源存放的地方
- 数据库 DynamoDB 来存储应用的数据
- 等等



Serverless 与 FaaS（函数即服务）通常被视为可以互换的术语，但这并不准确。Serverless 是一种抽象层次更高的架构模式，而**“FaaS + BaaS”只是 Serverless 这种架构模式的一种实现**。



**而我自己更多的理解**：

- 为Serverless并不是一定要使用云服务，而是一种依赖于按需依赖第三方服务的架构思想



#### 特点

- Serverless 是**真正的按需使用**，请求到来时才开始运行
- 开发者只需要专注于业务，按内存和时间算钱即可
- 降低启动成本（对于大公司而言，这些都是现成的基础设施。可对于新创企业来说，这都是一些启动成本。）、减少运营成本，实现快速上线

存在的问题：

- 不适合长时间运行应用（可以理解为长期租车的成本肯定比买车贵，但是你就少掉了一部分的维护成本。因此，这个问题实际上是一个值得深入计算的问题。）
- 完全依赖于第三方，可控性不强（云提供商可能对其组件的交互方式有着严格的限制，从而影响您系统的灵活性和定制能力。采用 BaaS 环境时，开发人员可能要为代码不受其控制的服务负责；并且如果决定要更换提供商，也可能需要升级系统以符合新供应商的规范，而这无疑会增加成本。）
- 缺乏调试和开发工具



#### 历史

2006 年 AWS 推出 EC2（Elastic Compute Cloud），作为第一代 IaaS（Infrastructure as a Service）

PaaS（Platform as a Service）是构建在 IaaS 之上的一种平台服务，提供操作系统安装、监控和服务发现等功能，用户只需要部署自己的应用即可，最早的一代是 Heroku。

历史上第一个 Serverless 平台可以追溯到 2006 年，名为 Zimki（该公司已倒闭），这个平台提供服务端 JavaScript 应用，虽然他们没有使用Serverless 这个名词，但是他们是第一个“按照实际调用付费”的平台。第一个使用 Serverless 名词的是 [iron.io](https://iron.io/)。



2006年AWS推出了IaaS的云计算，Google认为云计算不应该是IaaS这样的底层形态，所以在2008年推出了自己的云计算代表产品GAE（PaaS的具体产品）

到后来的PaaS产品比如Cloud Foundry，这类PaaS产品相对更实际一些，底层IaaS还是云厂商提供，上层提供一套应用管理生态，背后的思想还是不希望开发者通过IaaS这么底层的方式去使用云计算，而是从PaaS开始，不过它也不是Serverless化的，你还是要考虑服务器的维护、更新、扩展和容量规划等等。

随着容器技术的成熟，以及Serverless理念的进一步发展，PaaS和Serverless理念也开始融合，典型的产品代表就是阿里云在2019年推出的产品：SAE：

- 首先，它是一个PaaS，再具体一点说，是一个应用PaaS。这意味着大部分开发者使用起来都会非常自然，因为里面的概念你会非常熟悉，比如应用发布、重启、灰度、环境变量、配置管理等等。
- 同时，它也是Serverless化的。这意味着你不必再关心服务器，不用再申请机器，维护服务器，装一堆工具，而是按需使用，按分钟计费，结合强大的弹性能力（定时弹性、指标弹性）实现极致成本。
- 最后，得益于Docker为代表的容器技术的发展，SAE解决了经典PaaS的突出问题（各种限制和强绑定），依托于容器镜像，在上面可以跑任意的语言的应用



#### Faas and Baas

- FaaS（Function as a Service， 函数即服务） 意在无须自行管理服务器系统或自己的服务器应用程序，即可直接运行后端代码；它可以取代一些服务处理服务器（可能是物理计算机，但绝对需要运行某种应用程序），这样不仅不需要自行供应服务器，也不需要全时运行应用程序。
  - 实质上就是一些运行函数的平台，比如AWS 的 Lambda、阿里云函数计算和腾讯云云函数等。


按照通俗的角度来说，就是花钱让别人的服务器，提供一个函数，帮你调用，并且将结果返回给你



- BaaS（Backend as a Service，后端即服务）是指我们不再编写或管理所有服务端组件，可以使用领域通用的远程组件（而不是进程内的库）来提供服务
  - 实质上是一些后端云服务，比如云数据库、对象存储、消息队列， 使用庞大的云可访问数据库生态系统（例如，Parse，Firebase），身份验证服务（例如，Auth0，AWS Cognito）等。利用 BaaS，可以极大简化我们的应用开发难度。

Serverless 则可以理解为运行在 FaaS 中，使用了 BaaS 的函数。

![](/simple-blog/Serverless/bff.png)

![](/simple-blog/Serverless/bff2.png)



## IaaS，PaaS，SaaS 

- **IaaS**：基础设施服务，Infrastructure-as-a-service
- **PaaS**：平台服务，Platform-as-a-service
- **SaaS**：软件服务，Software-as-a-service

这三者的区别被IBM 的软件架构师 Albert Barron 曾经使用披萨作为比喻

设想你是一个餐饮业者，自己生产披萨，但是这样比较麻烦，因此你决定外包一部分工作，采用他人的服务。你有三个方案。

**（1）方案一：IaaS**

- IaaS 表示将由提供商通过云为您管理基础架构，包括实际的服务器、网络、[虚拟化](https://www.redhat.com/zh/topics/virtualization)和[存储](https://www.redhat.com/zh/topics/data-storage)。用户可通过[应用编程接口（API）](https://www.redhat.com/zh/topics/api) 或控制面板进行访问，并且基本上是租用基础架构。操作系统、应用和[中间件](https://www.redhat.com/zh/topics/middleware)等内容由用户管理，而提供商则提供硬件、网络、硬盘驱动器、存储和服务器，并负责处理中断、维修及硬件问题。
- 采用IaaS服务，那么意味着你就不用自己买服务器了，随便在哪家购买虚拟机，但是还是需要自己装服务器软件
- 比喻：他人提供厨房、炉子、煤气，你使用这些基础设施，来烤你的披萨。
- 比如阿里云服务器之类的



**（2）方案二：PaaS**

- 使用 PaaS 环境的优势包括转移部分职责，如维护服务器、更新基础架构软件以及设置用于构建应用的自定义平台。PaaS 提供商可托管平台，并为正在运行的应用提供环境。
- 采用PaaS的服务，那么意味着你既不需要买服务器，也不需要自己装服务器软件，只需要自己开发网站程序
- 比喻：除了基础设施，他人还提供披萨饼皮；你只要把自己的配料洒在饼皮上，让他帮你烤出来就行了。也就是说，你要做的就是设计披萨的味道（海鲜披萨或者鸡肉披萨），他人提供平台服务，让你把自己的设计实现。
- 比如：网页应用管理，应用设计，应用虚拟主机，存储，安全以及应用开发协作工具等。目前网上常说的中间件就是一种典型的PaaS服务



**（3）方案三：SaaS**

- SaaS 是指由提供商为您管理应用。提供商将负责处理软件更新、漏洞修复及其他常规软件维护工作，而您只用通过 Web 浏览器或 API 连接至软件。这样一来，您就无需在每台计算机上安装应用。
- 如果你再进一步，购买某些在线论坛或者在线网店的服务,这意味着你也不用自己开发网站程序，只需要使用它们开发好的程序，而且他们会负责程序的升级、维护、增加服务器等，而你只需要专心运营即可
- 比喻：他人直接做好了披萨，不用你的介入，到手的就是一个成品。你要做的就是把它卖出去，最多再包装一下，印上你自己的 Logo。
- 比如：平时使用的苹果手机云服务，网页中的一些云服务等。



![](/simple-blog/Serverless/paas.png)



从左到右，自己承担的工作量（上图蓝色部分）越来越少，IaaS > PaaS > SaaS。



- SaaS：面向普通用户
- PaaS：面向开发者
- IaaS：面向底层开发者（**云服务的最底层**）



## 使用

对于新手，可以优先选择了 Serverless 框架，GitHub: https://github.com/serverless/serverless。

```shell
npm install -g serverless
```

然后就是关于AWS用户账号的添加和权限的添加

然后生成**访问密钥 ID** 和 **私有访问密钥**。请妥善保存好。

然后导出证书，并使用 `serverless depoy` 保存到本地。

更多请看：(都是同一个作者)

[Serverless 应用开发指南：serverless 的 hello, world](https://www.phodal.com/blog/serverless-development-guid-serverless-framework-hello-world/)

[Serverless 应用开发指南： Node.js 编程返回动态 HTML](https://www.phodal.com/blog/serverless-development-guide-nodejs-create-dymamic-html/)

[Serverless 应用开发指南：API Gateway + S3 + AWS Lambda 打造 CRUD](https://www.phodal.com/blog/serverless-development-guide-use-s3-api-gateway-create-crud/)

[Serverless 应用开发指南：Serverless + Express 的 React 服务端渲染](https://www.phodal.com/blog/serverless-development-guide-express-react-build-server-side-rendering/)

....



## Serverless 和前端

前端经过了Ajax、Nodejs、React等技术迭代后，已经形成了相对成熟的技术体系，特别是Nodejs，使前端和服务端产生了联系。

前端和后端的分工发挥了各个的优点，但是在协作的过程中也一直存在一个问题，后端同学通常是面向领域和服务提供接口，但是前端是面向用户具体的数据接口，有时候一个简单的需求会因为两边的定义和联调搞半天。所以也诞生了BFF（Backends For Frontends）这样一层，谁使用谁开发，专门解决领域模型 - UI 模型的转换。

理想很美好，现实也很骨干，如果前端同学去做BFF这一层，发现要学习后端的DevOps、高可用、容量规划等等，这些其实是前端同学不想关心的，这种诉求在Serverless时代得到了很好的解决，由BFF变为了SFF（Serverless For Frontend）,让前端同学只要写几个 Function，其他都交给Serverless平台

类似的还有服务端渲染 SSR（Server Side Rendering），本来前后端分工后，后端只需要写接口，前端负责渲染，但是在SEO友好以及快速首屏渲染等需求背景下，有时候会用到服务端渲染的方案，同样，使用Serverless 前端同学又可以愉快的玩耍了。





参考文章：

[《serverless-架构应用开发指南》](https://serverless.ink/#serverless-%E6%9E%B6%E6%9E%84%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91%E6%8C%87%E5%8D%97)

[Serverless 应用开发指南：serverless 的 hello, world](https://www.phodal.com/blog/serverless-development-guid-serverless-framework-hello-world/)

 [IaaS，PaaS，SaaS的区别（阮一峰）](https://www.ruanyifeng.com/blog/2017/07/iaas-paas-saas.html)

[6岁！是时候重新认识下Serverless了](https://developer.aliyun.com/article/778541?utm_content=g_1000207513)

[你学BFF和Serverless了吗](https://zhuanlan.zhihu.com/p/368780365)