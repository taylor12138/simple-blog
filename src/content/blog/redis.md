---
author: Hello
categories: 网络
title: 'redis'
description: 'redis相关问题'
pubDate: 2022-08-23 
---
## Redis概述

Redis 是什么

**Redis** 是一个高性能的**内存数据库**，支持多种数据结构。

#### **特点**

- **内存存储** - 极快的读写速度
- **持久化** - 数据可保存到磁盘
- **丰富数据类型** - 字符串、列表、集合、哈希等
- **原子操作** - 保证数据一致性

#### **使用方法**

```bash
# 安装启动
brew install redis
redis-server

# 基本操作
redis-cli
> SET key "value"
> GET key
> LPUSH queue "task1"
> RPOP queue
```



## node中使用

```javascript
// 安装
npm install redis

// 使用
const redis = require('redis');
const client = redis.createClient({
  host: 'localhost',
  port: 6379
});

await client.connect();
await client.set('key', 'value');
const value = await client.get('key');
```



## egg.js 的redis

#### **核心特性**

- **连接池管理**
- **多 Redis 实例支持**
- **配置化管理**
- **与 Egg.js 生命周期集成**
- **TypeScript 支持**

在 Egg.js 中安装使用

#### **1. 安装插件**

```bash
npm install egg-redis --save
```

#### **2. 启用插件**

```javascript
// config/plugin.js
exports.redis = {
  enable: true,
  package: 'egg-redis',
};
```

#### **3. 配置 Redis**

```javascript
// config/config.default.js
exports.redis = {
  client: {
    port: 6379,
    host: '127.0.0.1',
    password: '',
    db: 0,
  },
};

// 多实例配置
exports.redis = {
  clients: {
    cache: {
      port: 6379,
      host: '127.0.0.1',
      db: 0,
    },
    session: {
      port: 6379,
      host: '127.0.0.1', 
      db: 1,
    },
  },
};
```

#### **4. 在代码中使用**

```javascript
// app/controller/user.js
class UserController extends Controller {
  async getUser() {
    const { ctx, app } = this;
    const userId = ctx.params.id;
    
    // 单实例使用
    const cached = await app.redis.get(`user:${userId}`);
    if (cached) {
      ctx.body = JSON.parse(cached);
      return;
    }
    
    // 从数据库获取
    const user = await ctx.service.user.find(userId);
    
    // 缓存到 Redis
    await app.redis.setex(`user:${userId}`, 3600, JSON.stringify(user));
    ctx.body = user;
  }
  
  async cacheWithMultiInstance() {
    const { app } = this;
    
    // 多实例使用
    await app.redis.get('cache').set('key1', 'value1');
    await app.redis.get('session').set('key2', 'value2');
  }
}
```

#### **5. 在 Service 中使用**

```javascript
// app/service/cache.js
class CacheService extends Service {
  async setCache(key, value, ttl = 3600) {
    const { app } = this;
    return await app.redis.setex(key, ttl, JSON.stringify(value));
  }
  
  async getCache(key) {
    const { app } = this;
    const result = await app.redis.get(key);
    return result ? JSON.parse(result) : null;
  }
  
  async delCache(key) {
    const { app } = this;
    return await app.redis.del(key);
  }
}
```

#### **常用场景**

- **缓存热点数据**
- **Session 存储**
- **分布式锁**
- **消息队列**
- **计数器**

egg-redis 让在 Egg.js 中使用 Redis 变得非常简单和规范化。





#### **多 Redis 实例支持**

**不是内存共享，而是多个独立的 Redis 服务**

```javascript
// 场景：不同业务使用不同 Redis 实例
exports.redis = {
  clients: {
    cache: {
      host: 'redis-cache.example.com',  // 服务器1 缓存专用
      port: 6379,
      db: 0,
    },
    session: {
      host: 'redis-session.example.com', // 服务器2 会话专用
      port: 6379,
      db: 0,
    },
    queue: {
      host: 'redis-queue.example.com',   // 服务器3 队列专用
      port: 6379,
      db: 0,
    }
  }
};
```

**为什么需要多实例？**

- **业务隔离** - 缓存、会话、队列分离
- **性能优化** - 避免单点瓶颈
- **故障隔离** - 一个实例故障不影响其他
- **数据分片** - 大数据量分布存储



## 分布式锁

**什么是分布式锁？**

在**分布式系统**中，确保同一时间只有**一个进程**能执行特定任务的机制。

**经典场景：库存扣减**

```javascript
// 没有锁的问题
async function buyProduct(productId, quantity) {
  const stock = await getStock(productId);  // 读取库存: 10
  if (stock >= quantity) {                  // 检查: 10 >= 1 ✓
    await updateStock(productId, stock - quantity); // 更新: 10-1=9
  }
}

// 并发问题：
// Worker1: 读取库存10 → 检查通过 → 准备更新为9
// Worker2: 读取库存10 → 检查通过 → 准备更新为9  
// 结果：两个请求都成功，但库存应该是8，实际是9
```

### **Redis 分布式锁实现**

**基础版本**

```javascript
class RedisLock {
  constructor(redis, key, ttl = 30000) {
    this.redis = redis;
    this.key = `lock:${key}`;
    this.ttl = ttl;
    this.value = `${Date.now()}-${Math.random()}`;
  }
  
  async acquire() {
    // SET key value NX PX ttl
    // NX: 只在不存在时设置
    // PX: 设置过期时间（毫秒）
    const result = await this.redis.set(
      this.key, 
      this.value, 
      'PX', 
      this.ttl, 
      'NX'
    );
    return result === 'OK';
  }
  
  async release() {
    // Lua 脚本确保原子性
    const script = `
      if redis.call("GET", KEYS[1]) == ARGV[1] then
        return redis.call("DEL", KEYS[1])
      else
        return 0
      end
    `;
    return await this.redis.eval(script, 1, this.key, this.value);
  }
}
```

#### **使用分布式锁**

```javascript
async function buyProductSafely(productId, quantity) {
  const lock = new RedisLock(app.redis, `product:${productId}`);
  
  try {
    // 获取锁
    const acquired = await lock.acquire();
    if (!acquired) {
      throw new Error('获取锁失败，请稍后重试');
    }
    
    // 执行业务逻辑
    const stock = await getStock(productId);
    if (stock >= quantity) {
      await updateStock(productId, stock - quantity);
      return { success: true };
    } else {
      throw new Error('库存不足');
    }
  } finally {
    // 释放锁
    await lock.release();
  }
}
```

对于同一台机器上的 worker，加锁避免并发写入同一文件
防止多个 worker 进程同时下载/解压同一个资源文件

#### **Egg.js 中的实现**

```javascript
// app/service/lock.js
class LockService extends Service {
  async withLock(key, fn, ttl = 30000) {
    const { app } = this;
    const lockKey = `lock:${key}`;
    const lockValue = `${Date.now()}-${Math.random()}`;
    
    try {
      // 获取锁
      const acquired = await app.redis.set(
        lockKey, 
        lockValue, 
        'PX', 
        ttl, 
        'NX'
      );
      
      if (acquired !== 'OK') {
        throw new Error('获取锁失败');
      }
      
      // 执行业务逻辑
      return await fn();
      
    } finally {
      // 释放锁
      const script = `
        if redis.call("GET", KEYS[1]) == ARGV[1] then
          return redis.call("DEL", KEYS[1])
        else
          return 0
        end
      `;
      await app.redis.eval(script, 1, lockKey, lockValue);
    }
  }
}

// 使用
await ctx.service.lock.withLock(`order:${orderId}`, async () => {
  // 处理订单逻辑
  return await processOrder(orderId);
});
```

可以看到 确保任务唯一性是在 释放锁时，带上对应的id标识：`KEYS[1]) == ARGV[1] then return redis.call("DEL", KEYS[1])`

不然则不删除该锁（redis）



### 确保任务唯一性

#### **消息队列 + 分布式锁**

```javascript
// BullMQ 中的实现
const worker = new Worker('order-queue', async (job) => {
  const { orderId } = job.data;
  
  return await ctx.service.lock.withLock(`process:${orderId}`, async () => {
    // 确保同一订单同时只有一个 Worker 处理
    return await processOrder(orderId);
  });
});
```

分布式锁解决了**分布式环境**中的**并发控制**问题，确保数据一致性和业务正确性。