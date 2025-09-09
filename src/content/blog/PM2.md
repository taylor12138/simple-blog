---
author: Hello
categories: 网络
title: 'PM2'
description: 'PM2相关问题'
---
## PM2概述

#### 进程（Process）

**进程是操作系统中运行的独立程序实例**

特点：

- **独立的内存空间** - 每个进程有自己的内存区域
- **资源隔离** - 进程间不能直接访问彼此的数据
- **开销较大** - 创建和切换成本高
- **稳定性好** - 一个进程崩溃不影响其他进程



#### 线程（Thread）

**线程是进程内部的执行单元**

特点：

- **共享内存空间** - 同一进程内的线程共享内存
- **轻量级** - 创建和切换成本低
- **通信方便** - 可直接共享数据
- **相互影响** - 一个线程崩溃可能影响整个进程



#### Worker

**Worker** 是执行具体工作的**进程或线程**。

**Node.js 中的 Worker**

- **主进程**（Master）负责调度
- **工作进程**（Worker）负责处理任务
- 每个 Worker 独立运行，互不影响
什么是[cluster](https://www.eggjs.org/zh-CN/core/cluster-and-ipc/#cluster-%E6%98%AF%E4%BB%80%E4%B9%88)

```javascript
// 单个 Worker
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // 主进程：创建 Worker
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // Worker 进程：处理请求
  require('./app.js');
}
```



#### Worker 集群

**多个 Worker 协同工作**，提高处理能力和可靠性。

**集群架构**

```
Master 进程
├── Worker 1 (处理请求)
├── Worker 2 (处理请求)  
├── Worker 3 (处理请求)
└── Worker 4 (处理请求)
```

**优势**

- **充分利用多核 CPU**
- **单个 Worker 崩溃不影响整体**
- **负载均衡**



#### CPU 核心 vs Worker 数量

**理论上**

```javascript
const numCPUs = require('os').cpus().length;
console.log(`CPU 核心数: ${numCPUs}`); // 比如 8 核
```

**实际考虑**

- **CPU 密集型任务**: Worker 数 = CPU 核心数
- **I/O 密集型任务**: Worker 数 > CPU 核心数（可以 2-4 倍）
- **混合型任务**: 根据实际测试调优

```javascript
// 不同策略
const cpuWorkers = numCPUs;           // CPU 密集型
const ioWorkers = numCPUs * 2;        // I/O 密集型
const mixedWorkers = numCPUs * 1.5;   // 混合型
```



#### IPC 进程间通信

**什么是 IPC**

**Inter-Process Communication** - 不同进程之间交换数据的机制。

**Node.js 中的 IPC**

```javascript
// 主进程
const { fork } = require('child_process');
const worker = fork('worker.js');

// 发送消息给 Worker
worker.send({ type: 'task', data: 'hello' });

// 接收 Worker 的消息
worker.on('message', (msg) => {
  console.log('收到 Worker 消息:', msg);
});

// worker.js - Worker 进程
process.on('message', (msg) => {
  console.log('收到主进程消息:', msg);
  
  // 处理完成后回复
  process.send({ type: 'result', data: 'processed' });
});
```

**IPC 通信方式**

**1. 管道（Pipe）**

```javascript
// Node.js 默认使用管道
const worker = fork('worker.js'); // 自动创建 IPC 管道
```

**2. 消息队列**

```javascript
// 通过 Redis 等中间件
const redis = require('redis');
const client = redis.createClient();

// 进程 A 发送
client.lpush('queue', JSON.stringify(data));

// 进程 B 接收
client.brpop('queue', 0, (err, result) => {
  const data = JSON.parse(result[1]);
});
```



#### PM2

PM2 是一个**进程管理工具**，类似于：

Mac 系统中的类似工具：

- **Activity Monitor（活动监视器）** - 图形界面查看进程

**PM2** 是一个用于 **Node.js 应用程序** 的生产级进程管理器，主要用于在生产环境中管理和监控应用程序。

```bash
# 启动应用
pm2 start app.js

# 重启应用
pm2 restart app

# 停止应用
pm2 stop app

# 删除应用
pm2 delete app
```





## 守护进程（Daemon Process）

**守护进程**是在后台运行的系统服务程序，不与用户直接交互。

#### 守护进程特点

**后台运行**

- 没有控制终端
- 不受用户登录/退出影响
- 系统启动时自动运行

**持续服务**

- 24/7 不间断运行
- 提供系统或网络服务
- 响应其他程序的请求

