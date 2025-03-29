---
author: Hello
categories: 网络
title: nginx
description: 'nginx相关'
---

## nginx概述

Nginx是一款轻量级的Web服务器、反向代理服务器，由于它的内存占用少，启动极快，高并发能力强，在互联网项目中广泛应用。



## nginx安装

使用brew安装nginx

```shell
brew install nginx
```

```
brew info nginx
```

![](/nginx/n1.png)

可查看配置信息



然后我们打开server所在目录，进行查看

```
open /opt/homebrew/etc/nginx
```

而此时配置项也在这个目录下：/opt/homebrew/etc/nginx/nginx.conf

打开文件编辑器

```
vi nginx.conf
```

编辑后保存配置：

```
nginx -t; nginx -s reload
nginx -t; kill -HUP
```

nginx -t 检查nginx配置的语法,操作前都要检查一下,很重要,发现错误可及时修正.



启动

```
brew services start nginx // 重启的命令是: brew services restart nginx
```

或者在server目录下

```
nginx #启动nginx
nginx -s reload #重新加载配置文件 ，热加载配置文件
nginx -s quit #:推荐 待nginx进程处理任务完毕进行停止
nginx -s stop #:先查出nginx进程id再使用kill命令强制杀掉进程。
```



此刻我们可以看到

![](/nginx/n2.png)



终止

终端输入ps -ef|grep nginx获取到nginx的进程号, 注意是找到“nginx:master”的那个进程号

![](/nginx/n3.png)

这里的进程号为34653



```
kill -QUIT nginx进程号   //(从容的停止，即不会立刻停止)
Kill -TERM nginx进程号   //（立刻停止）
Kill -INT nginx进程号    //（和上面一样，也是立刻停止）
```







## 相关报错

```
nginx: [error] invalid PID number "" in "/opt/homebrew/var/run/nginx.pid"
```

可能是nginx没启动，启动即可



## nginx配置

```nginx
server {
    listen       8080;
    server_name  localhost;
    root   /usr/share/nginx/html;
    index  index.html index.htm;

    location / {
        # For SPA， 所有路由都重定向到 index.html，支持前端路由
        try_files $uri /index.html;
    }

    # 接口动态代理到分开部署的后端服务上
    location /api {
        # 将/api后缀的请求代理到 API_URL 
        proxy_pass ${API_URL};
        # 设置代理请求头
        proxy_set_header Host ${API_HOST}; # 设置后端服务的 Host
        proxy_set_header X-Real-IP $remote_addr; # 传递真实 IP
        proxy_set_header X-Forwarded-For $remote_addr; # 传递客户端 IP
        proxy_set_header X-Forwarded-Host 前端域名xxx;
        proxy_set_header X-Proxy-Forwarded-Host 前端域名xxx;
    }
}
```

`proxy_set_header` 指令 用于设置请求头的值，设置的值的含义和http请求体中的含义完全相同

- Host，Host的含义是表明请求的主机名，因为nginx作为反向代理使用，而如果后端真实服务器设置有类似防盗链或者根据http请求头中的host字段来进行路由或判断功能的话，如果反向代理层的nginx不重写请求头中的host字段，将会导致请求失败

  【默认反向代理服务器会向后端真实服务器发送请求，并且请求头中的host字段应为proxy_pass指令设置的服务器】

- X_Forward_For，X_Forward_For字段表示该条http请求是由谁发起的？如果反向代理服务器不重写该请求头的话，那么后端真实服务器在处理时会认为所有的请求都来在反向代理服务器，如果后端有防攻击策略的话，那么机器就被封掉了。因此，在配置用作反向代理的nginx中一般会增加两条配置，修改http的请求头。



#### nginx配置中自带的导出变量

比如上面的$http_host和$remote_addr都是nginx的导出变量，可以在配置文件中直接使用



## 参考

[用Nginx做端口转发（反向代理）](https://zhuanlan.zhihu.com/p/108740468)