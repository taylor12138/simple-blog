---
title: 'Vue(中)'
author: Hello
pubDate: 2021-03-01 
categories: 前端
description: 'Vue相关'
---

## 4.Vue CLI

在开发大型项目的时候，则必须使用到Vue CLI，CLI是Command-Line Interface ，翻译为命令行界面，俗称脚手架

使用 vue-cli 可以**快速搭建**Vue开发环境以及对应的webpack配置（终于不用自己配置webpack了！）

Vue CLI 的使用前提：Node & Webpack

安装脚手架（同时也自动装上vue）：

```shell
npm install -g @vue/cli
```

CLI 3+ 初始化

```shell
vue create my-project
```

但是我们这里也要使用`cli 2` 的功能所以还得 拉取 2.x模板

```shell
npm install -g @vue/cli-init
```

CLI 2 初始化项目

```shell
vue init webpack my-project
```



现有的vue项目添加eslint

```shell
vue add eslint
```



#### CLI 2 初始化

`vue init webpack 项目名称`，这个项目名称为创建最终项目文件夹名

然后会出现选项：

![](/simple-blog/Vue(中)/vue_cli2.png)

然后得到一个文件，可以查看 `package.json` 文件里的 script，得知相应的运行命令；下面对存放在里面的每个文件进行介绍

- build、config（配置基础变量）存放webpack的配置区域
- src 放置源代码区域
- static 放置静态资源的区域，原封不动复制到dist文件夹里
- .babelrc 关于转化为ES5的相关配置



#### 部分配置的介绍

关闭ESLint代码规范（可能不符合部分代码风格，比如不加分号，定义函数时函数名后空一格等）

config -> index.js -> useEslint: false



Runtime-only 和 Runtime + Compiler的不同之处在`main.js`里面

```js
//runtime  compiler
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
```

```js
//runtime-only
//直接render，跳过template部分
new Vue({
  el: '#app',
  render: h => h(App)
})
```

`Runtime-only`在实际公司开发中使用的比较多，性能更好，代码更少（不用处理template和ast， 它的 `.vue`文件由 webpack用到的loader：`vue-template-compiler` 解析成render， 也就是render(App)  ->  组件App的 template 替换掉绑定的元素 ）

实际上，`Vue`实例的`template` -> 会保存在`option`里 -> 进行parse解析成抽象语法树（`ast`）（描述了我们标签的详情数据情况） -> compile编译成 `render`函数  ->  

翻译成虚拟DOM（`virtual DOM`） -> 渲染成UI（真实DOM）

![](/simple-blog/Vue(中)/runtime.png)

所以实际上compiler是处理 `template`部分和 `ast`部分

动态创建标签：`createElement('标签', {标签属性}, [''])`,                                     `createElement(组件)`也可以

```js
//render函数的真身：(APP为组件对象)
render: funciton(createElement) {
	return createElement(APP);
}
```



#### CLI 3

与2版本有很大区别

- 基于webpack 4 打造
- 设计原则是“0配置”，移除根目录下的build、config
- 提供了vue ui 命令，提供了可视化配置，更加人性化
- 移除了static，新增了public，并且将index.html移动到public中，public类似于新的static

初始化后同样会出现初始化的配置选项

- preset 预设：default是默认；manually select features是手动
- feature特性：按空格选中/取消（Linter代码规范可以取消掉、Babel为支持es6以上语法 ）
- placing config配置的存放：config files 独立存放；package.json 放在package.json中
- save prest：是否保存刚才配置好的预设 （如果想删除，则要找到`.vuerc`文件，进入后进行修改删除）

![](/simple-blog/Vue(中)/vuecli3.png)

CLI 3 的配置去哪里了？ 

-> 启动配置服务器（可视化配置）：

```shell
vue ui 
```

导入当前项目脚手架的文件夹，然后可以在当前页面添加需要的插件，配置甚至运行等

如果真的要手动修改掉基础的配置，需要新建vue.config.js在当前项目目录下（原来build和Config文件的配置都放在node_modules里面了），在里面进行 `module.exports = {}`配置，到时会和原来的配置进行合并作为整体配置

想了解更多配置可以上 https://cli.vuejs.org/zh/config/ 查看

```js
module.exports = {
  devServer: {
    //运行后默认打开浏览器
    open: true
  }
}
```



#### CLI 4配置

讲述一下cli 4 中配置新添加的选项

- (*) Choose Vue version  是否要选择vue版本
- (*) Babel
- (*) TypeScript
- ( ) Progressive Web App (PWA) Support
- (*) Router
- (*) Vuex
- (*) CSS Pre-processors  是否要使用css预处理器，比如sass、less
- () Linter / Formatter        es代码linter检查
- ( ) Unit Testing                  单元测试
- ( ) E2E Testing                    端到端测试

Use class-style component syntax? (y/N) 

- 是否要使用class风格的component，我们一般是不怎么实用的，可以选择no

Use Babel alongside TypeScript (required for modern mode, auto-detected polyfills, transpiling JSX)? (Y/n) 

- 是否要用babel编译ts，一般tsc、babel咱们选babel，因为babel带polyfill，会打上一些补丁

Pick a linter / formatter config: (Use arrow keys)

- ESLint with error prevention only   普通eslint
- ESLint + Airbnb config                        eslint+爱彼迎规范
- ESLint + Standard config                    eslint+标准规范
- ESLint + Prettier                                   eslint+prettier格式化（cms项目中我用的是这个）
- TSLint (deprecated)

Where do you prefer placing config for Babel, ESLint, etc.? (Use arrow keys)

配置文件要存放哪种形式

- In dedicated config files      单独文件
- In package.json                     放package.json





#### 脚手架的模块化样式

当style标签具有该scoped属性时，其CSS将作用域化当前组件的元素（实质上脚手架会处理加上data-v-xxxx的属性）

我们通常在vue.config.js配置路径别名 

```js
module.exports = {
  devServer: {
    //运行后默认打开浏览器
    open: true
  },
  //publicPath为部署的配置
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  configureWebpack: {
    resolve: {
      // 配置别名,内部其实已经配置过一个，就是 '@':src
      // 在cli3以上版本，配置别名的值可以引用之前配置过的别名，如'@/assets',不过cli4好像这里用不了。。
      alias: {
        'assets': '@/assets',
        'components': '@/components',
        'view': '@/view'
      }
    }
  }
}
```

但是该别名 `@` 在css中无法直接使用，需要变成 `~@`的形式；还有 img 标签的 src中，也需要 `~@`的形式



#### 运行项目

根据配置的提示为

```shell
npm run serve
```

实质上会执行node_modules下面的bin目录的vue-cli-service文件夹下代码

里面的比如 `const Service = require(../lib/Serive) `也不要被欺骗了，并不是当前目录下的 `../`，而是内部有一个软连接，会去找到真是代码所在的位置，执行真实的代码



## 5.Vue router

#### 前后端路由概述

路由就是网络把信息从源地址传输到目的地址的活动，路由器主要维护一个映射表（ip地址和mac地址的映射关系）

后端渲染是将数据在后端处理生成html发给浏览器，前端渲染是通过ajax拿到数据，操作dom节点 渲染ui

（相当于Node.js里的服务器渲染和客户端渲染）

1.**后端路由**（后端渲染）：服务器处理一个url映射一个页面，通过正则匹配，交给controller进行处理，然后生成html等数据返回前端

2.**前后端分离**（前端渲染）：

- 输入url 去静态服务器（前端服务器）里获取 html + css + js
- 浏览器执行JS代码 -> JS代码中有API请求，去到API接口服务器（后端服务器）中获取数据

![](/simple-blog/Vue(中)/QdXr.png)

随着Ajax的出现，有了前后端分离的开发模式，前后端分离最大的优点就是责任清晰，分工明确，并且在移动端（IOS/Android）出现后，后端使用之前一套API即可

3. **前端路由**

在前后端分离中，静态资源服务器放了好几套的 HTML + CSS +JS，每个对应不同的页面

SPA页面（单页面富应用）：整个网站只有一个html页面（React、Vue）

而在前端路由中：

- 静态资源服务器只有一个html（甚至也只有一个CSS + 一个JS）
- 网页获取到静态资源后，由前端路由配置映射关系，一个路径对应一个组件（/home -> Home.vue）
- 点击url，通过JS代码判断，从那个获取的一个静态资源里再抽取资源，然后显示出来（这里抽取的资源，再vue里，相当于一个url映射一个组件，一个组件对应一个网页）

改变url，依然是页面不发生整体刷新



**url的hash**

为了改变url，而让也页面不发生刷新，可以使用 **url的hash** 或者**html5 的 history模式**

- Push：通过`window.location.hash = 'xxx'`更改href，网页不会刷新（默认），也就是重定向

  （带有hash的前端路由，优点是兼容性高，缺点是URL带#号不好看）
  
  哈希历史记录与浏览器历史记录之间的主要区别在于，哈希历史记录将当前位置存储在 URL 的 `hash` 部分中，这意味着它永远不会发送到服务器。如果您将网站托管在无法完全控制服务器路由的域上，或者例如在 Electron 应用程序中，您不想将“服务器”配置为在不同的 URL 上提供同一页面，这会很有用。
  
  - 继而此时我们可以通过 `window.addEventListener("hashchange", fn)` 监听hash改变时回调的事件
  
  - hash（#）是URL 的锚点，代表的是网页中的一个位置，单单改变#后的部分，浏览器只会滚动到相应位置，不会重新加载网页，也就是说 #是用来指导浏览器动作的，对服务器端完全无用，HTTP请求中也不会不包括#；同时每一次改变#后的部分，都会在浏览器的访问历史中增加一个记录，使用”后退”按钮，就可以回到上一个位置；
  
- Push：也可以通过`history.pushState({}, '', 'xxx')`更改href，进行重定向（history的前端路由，缺点是如果输入错误网址，真的会跑去和后端要数据，然后我们就会看到一个不好看的404页面，需要我们和后端调节说要他给我们提供一个我们提前给他的固定的html界面）

  可以使用`history.back()`或者`history.go(-1)` 后退功能进行回退

Push，入栈顶，可回退

- Replace：还可以通过  `window.replace`、 `history.replaceState({}, '', 'xxx')`来更改，不可回退（替换掉原先栈顶的路由）

在Vue实例中使用 `this.$router.back()` 也可以实现回退

（源码上除了hash、history、其实还有一个abstract模式）



**vue-router关于url改动的问题**

由于默认是使用hash改动url，如果想要改成Html5的history模式，则在router对象里利用mode属性进行修改

```js
const router = new Router({
    routes,
    mode: 'history',
    LinkActiveClass: 'active'   //可以把router-link当前被选中（点击）的标签的类名，改为active
})
```





#### 基本使用

目前三大框架都有自己的路由实现：Angular的ngRouter、React的ReactRouter、Vue的vue-router

安装：(或者脚手架选择的时候，可以自动帮你安装路由，并且以下步骤不用实施)

```shell
npm install vue-router --save
```

于src文件夹里创建 router文件夹 -> index.js

1.通过`Vue.use(插件)`，来安装插件 （在vue内部执行了`插件.install`方法）

2.创建路由对象，routes属性用于配置路由和组件的映射关系

3.将router对象传入Vue实例当中

```js
import Router from 'vue-router'
import Vue from 'vue'
Vue.use(Router);
const routes = [];
const router = new Router({
    routes
})
export default router;
```

router 为 Vue的 路由属性，直接赋值即可

```js
//main.js
import Vue from 'vue'
import App from './App'
import router from './router'  //自动找到该目录下的index文件
Vue.config.productionTip = false
new Vue({
    el: '#app',
    router,
    render: h => h(App)
})
```

使用

1.在components文件夹里新建组件 如： `home.vue` 和 `about.vue`，里面自己适配好template 和 script

2.在routes里编写映射关系，一个对象对应一个映射关系

3.可以通过 `"/:pathMatch(.*)"` 匹配找不到路径填补的组件（404 not found），而对于此时匹配不到时拿到的路径参数，通过 `$route.params.patchMath`拿到

url 中出现 path,则显示该对象里的组件component

```js
import Home from '../components/home'
import About from '../components/about'
const routes = [
    {
        path: '/home',
        component: Home
    },
    {
        path: '/about',
        component: About
    },
    {
        path: '/:pathMatch(.*)',
        component: NotFound
    }
];
```

3.通过`<router-link>`和`<router-view>`使用路由: 

vue-router模块源码中，注册了全局组件 `RouterView` 和 `RouterLink` 所以可以使用这两个标签

由于这里我们把Vue实例的渲染属性绑定了 App.vue 的组件对象，我们把`<router-link>`和`<router-view>`添加至 App.vue组件的template中使用

```html
<template>
  <div id="app">
    <!-- <router-link >是Vuerouter已经注册的的内置标签，最终会被渲染成a标签 -->
    <router-link to="/home">首页</router-link>
    <router-link to="/about">关于</router-link>
    <!-- <router-view>是Vuerouter已经注册的，决定路由的页面渲染 -->
    <router-view></router-view>
  </div>
</template>
```

配置首页

```js
const routes = [
    {
        path: '/',
        // redirect 重定向
        redirect: '/home'
    }
];
```



**router-link的其他属性的补充**

to属性：写上路径，点击后则会把网页的url进行路径的改动，然后`router-view`就会根据这个路径渲染网页

tag属性：默认最终渲染为为 a 标签，`tag="button"` 则渲染为button标签

replace属性：如果当前的router对象中mode属性为 'history'，增加该属性，则url的改变方法改为： `history.replaceState()`

router-link的原理：

```html
<template>
  <div id="app">
    <button @click="homeClick">首页</button>
    <button @click="aboutClick">关于</button>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "App",
  methods: {
    // 通过代码修改路径
    // vue-router源码往所有组件里都添加了$router属性
    // history的pushStatus， push => pushStatus
    // 但是连续点击会报错，可以试一试this.$router.push('home').catch(err => err)
    homeClick() {
      this.$router.push("/home");
    },
    aboutClick() {
      this.$router.push("/about");
    },
  },
};
</script>
```

```js
//选择hash的mode
$router.push() --> HashHistory.push() --> History.transitionTo() --> History.updateRoute() --> {app._route = route} --> vm.render()
```

```js
1 $router.push()          //调用方法
2 HashHistory.push()      //根据hash模式调用,设置hash并添加到浏览器历史记录（添加到栈顶）
                          //（其实也就是window.location.hash= XXX）
3 History.transitionTo()  //监测更新，更新则调用History.updateRoute()
4 History.updateRoute()   //更新路由
5 {app._route= route}     //替换当前app路由
6 vm.render()             //更新视图
```



**路由name属性**

路有记录独一无二的名称

它可以供给 `keep-alive` 的 **Props**使用，对名称进行匹配

```js
const routes = [
    {
        path: '/',
        name: 'home',
        redirect: '/home'
    },
];
```

此时可以通过`this.$route`获取

与此同时，当子路由进行路由嵌套 + 匹配是也需要对应这个name，一般建议name和路由路径名字保持一致比如

```js
{
    path: '/home',
    name: "home"
    component: Home,
        children: [
            {
                path: 'message',
                name: "message"
                component: HomeMessage
            }
        ]
},
```



**获取路由列表**

如果路由跳转出现问题，可以查看当前路由列表是否路由已经注册

此时可以使用API `getRoutes`

```ts
getRoutes(): RouteRecord[]
```

```js
console.log(router.getRoutes())
```



#### 其他知识点

**动态路由**

某些情况下，一个页面的path是不确定的，比如我希望我的路径是

 `/user/aaa`  或  `/user/bbb`

`/user/:id`

这种path和Component的匹配关系，我们称之为动态路由（也是路由传递数据的一种方式）

动态路由的绑定：新建一个user.vue文件，然后把vue文件映射到路由的js文件中（router的index.js）

```html
<template>
  <div>
    <h2>用户界面</h2>
    <h2>{{ userId }}</h2>
  </div>
</template>
<script>
export default {
  name: "User",
  computed: {
    // params是参数的意思
    userId() {
      //这里的userId对应的是映射时的/:userId
      return this.$route.params.userId;
    },
  },
};
</script>
```

```js
import User from '../components/user'
const routes = [
    {
        path: '/user/:userId',
        component: User
    }
];
```

接着在大组件app.vue中使用该模板

```html
<router-link :to="'/user/' + userId" tag="button">用户</router-link>
```

或者利用事件进行跳转+传递params

```js
this.$router.push("/detail/" + userId);
```

在app.vue导出的实例对象里添加相应的data属性：

```js
data() {
    return { userId: "zhangsan" };
},
```



**路由懒加载**

由于打包时，除了其他一些文件，主要的部分丢存放于一个js当中，然后在请求静态资源服务器时，可能因为文件太大，导致第一次请求资源时（即那一个主要的js文件），花费过长的时间，可能在请求过程，浏览器出现短暂的空白。

vue搭建脚手架时，对js、css文件等进行了分包

```shell
npm run build
```

/dist/static/js 文件中 app.xxx.js 是业务代码 、vendor.xxx.js是提供商/第三方包的源码、mainfest.xxx.js是为打包的代码做底层支撑（让浏览器识别ES6、commonJS语法等）

当打包构建应用时，JavaScript包会变得特别大，如果我们把不同路由由对应的组件分割成不同同代码块，然后当路由被访问时才加载对应组件，这样才会更加高效（采取一个路由打包一个js文件的方法，先向静态资源服务器请求当前最需要的js文件）

懒加载：用到时，再加载

于router文件夹的index.js中每个加载修改为函数的形式

```js
// 懒加载
const Home = () => import('../components/home');
const About = () => import('../components/about');
const User = () => import('../components/user');
const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        component: Home
    },
    {
        path: '/about',
        component: About
    },
    {
        path: '/user/:userId',
        component: User
    }
];
```



#### 路由嵌套

如果想要进行路由细分（比如进入 /home 之后，还想要在进入 /home/message ），则形成了路由嵌套

嵌套的实现：

- 创建相应的子组件，并且在路由映射中配置相应的子路由
- 在组件内部再次使用 `<router-view>`标签

以下操作作为例子进行路由嵌套

新建两个vue文件（用于嵌套在home路由上）

在路由的js文件中的routes数组里，每个对象都可以有一个children属性，里面可以保存嵌套的路由

```js
const HomeNews = () => import('../components/HomeNews')
const HomeMessage = () => import('../components/HomeMessage')
```

```js
{
    path: '/home',
    component: Home,
        children: [
            {
                path: '',
                redirect: 'news'
            },
            {// 子路由不需要加 '/' 
                path: 'news',
                component: HomeNews
            },
            {
                path: 'message',
                component: HomeMessage
            }
        ]
},
```

然后再home组件中添加 `router-view` 进行子路由页面渲染

```html
<template>
    <div>
        <h2>首页</h2>
        <!-- 这里需要给完整的路径， 不能直接to="/news" -->
        <router-link to="/home/news" tag="button">新闻</router-link>
        <router-link to="/home/message" tag="button">信息</router-link>
        <router-view></router-view>
    </div>
</template>
```





#### 参数传递

从一个路由页面跳转到另外一个路由页面时，我们可能希望传递一些消息

传递参数主要有两种类型：params和query

params类型：如动态路由的配置  `/router/:参数名`

- 传递方式：在配置路由映射时，path后面跟上响应的值进行接收声明 `路由路径名/:参数名`；
  - 接着在组件的router-link的to属性添加参数进行传递 /
  - 或者利用`this.$router.push("/detail/" + userId)`进行进行跳转
  - 当然传递多个参数还可以： `路由路径名/:参数名/路由路径名2/:参数名2` 进行重叠
- 传递后形成的路径 `/router/123`， `/router/abc`等
- 子组件通过 `this.$route.params.参数名`获取参数

**query类型： 正常路由配置方式**

- 传递方式：对象中使用query的key作为传递方式
- 传递后形成的路径： `/router?id=123`,  `/router?id=abc`

在总组件 app.vue 中进行配置

```html
<router-link
      :to="{ path: '/Profile', query: { name: 'Allen', age: 18, heigh: 1.88 } }"
      tag="button">
    档案</router-link>
```

或者利用事件进行跳转+传递query（router.push可以传入一个对象）

```js
事件名(){
    this.$router.push({
        path:'/detail',
        query:{
            name: 'Allen', 
            age: 18, 
            heigh: 1.88
        }
    })
}
```



若想在子组件的template模板中中获取该参数，则使用 `route.query`进行获取（得到一个对象，里面存储参数）

```html
 <p>{{ $route.query }}</p>
```

总结：大量数据使用query，因为query传过去是对象



**router和route**

大前提：所有的组件都继承vue类的原型

vue-router源码往所有组件里都添加了$router属性（往vue的原型上加的，用的是`vue.prototype`在原型对象上添加）

所以在任何一个组件里，都可以使用 `this.$router`进行获取

前端路由使用history刷新页面时，router-link的原理中使用到 `$router.push("路径")`、`$router.replace("路径")`、`$router.go(-1)`，router对象为路由文件夹router中index.js导出的router对象（有点当作BOM的 `history` 使用内味儿了 ）



而 route 是当前活跃的路由，vue-router源码往所有组件里也添加了$route属性（往vue的原型上加的，用的是`vue.prototype`在原型对象上添加）

所以在任何一个组件里，都可以使用 `this.$route`进行获取



#### 导航守卫

在发生路由跳转时，我们有时需要去监听这个跳转事件，然后对网页进行相应的变化（比如网页标题的改变）；亦或者是进行拦截，让他跳转到登陆页面 / 注册页面

方法一：使用生命周期函数 vue的生命周期函数 `created() {}` 来定制，缺点：一个功能的实现需要在多个（甚至是每个）子组件上定义。

方法二：导航守卫

比如先给每个路由添加 元数据 `meta`  （描述数据的数据）

```js
const routes = [
    {
        path: '/home',
        component: Home,
        meta: {
            title: '首页'
        },
        children: [
            {
                path: '',
                redirect: 'news'
            },
            {// 子路由不需要加 '/' 
                path: 'news',
                component: HomeNews
            }
        ]
    }
]
```

```js
// 导航守卫
router.beforeEach(function (to, from, next) {
    //从from跳转到to， from和to都是Route类型
    document.title = to.matched[0].meta.title;
    //有next才能实现路由跳转，一定要加上
    next();
})
```

我们可以通过`this.$route`获取meta的数据

也可以使用导航守卫，相当于axios的拦截器，这时可以使用`to.meta.title`获取，但是如果路由中使用了路由嵌套，还得格外注意使用 `to.matched[0].meta.title`获取，使用下标为0的进行获取，则当你未进行嵌套时，还能正常获取，因为确实是当前选定路由的第一个

- `next()` 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 **confirmed** (确认的)。（从vue router4.x以后不推荐使用了，通过返回值控制跳转，详情见我的`Vue3(上)`文章）
- `to`：一个route对象，即将跳转到的路由对象
- `fro`：一个route对象，跳转源头对象





#### 守卫分类

**全局守卫**：

- `router.beforeEach((to, from, next) => {})` 全局前置守卫，是路由跳转之前进行的回调。每一个导航被触发时，被调用的总是全局前置守卫
  - 用的最多，important！
- `router.beforeResolve((to, from, next) => {})`，全局解析守卫，和 `beforeEach`类似，区别是导航被确认之前，同时在**所有组件内守卫和异步路由组件被解析之后**，才被调用
- `router.afterEach((to, from) => {})`，后置钩子， 不需要主动调用next函数，等待路由跳转结束后也会调用函数



**路由独享守卫**（写到路由里面）

`beforeEnter`

```js
const router = new VueRouter({
  routes: [
    {
      path: '/play',
      component: Play,
      beforeEnter: (to, from, next) => {}
    }
  ]
})
```



**组件内路由守卫**

- `beforeRouteEnter(to, from, next)`
- `beforeRouteUpdate(to, from, next)`
- `beforeRouteLeave(to, from ,next)`

```js
const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  }
}
```

导航流程（官网）

1. 导航被触发。
2. 在失活的组件（from组件）里调用 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫 (2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件（to组件）里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫 (2.5+)。
9. 导航被确认。（进入导航）
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入（next传入一个参数，能拿到组件实例instance）。





#### keep-alive

router-view也是一个组件，如果直接被包在 keep-alive 里面，所有路径匹配到的视图组件都会被缓存（比如实现功能：进入 `/home` ， 默认进入 `/home/news`，如果跳转到 `/home/messgae` 之后，再跳转到其他页面，此时回到 /home 可以直接进入上一次查看的页面`/home/messgae`，而不是默认页面`/home/news`）

`keep-alive`  是Vue内置的一个组件，可以使被包含的组件保留状态，避免重新渲染，它的原理是避免组件被销毁（所以使用keep-alive之后，组件不会触发`destoryed` 钩子函数）

生命周期函数 `activated` 和 `deactivated` 只有在组件被保持了 `keep-alive` 时，才能被正常使用，这两个生命周期分别是重新进入 / 离开该缓存组件被触发

里面还有个 LRU （最近最久未用算法，同操作系统的LRU），缓存的太多超过max，就需要删除掉

SPA（单页面富应用）常用 `kepp-alive`，提高性能！

```html
<keep-alive>
    <router-view></router-view>
</keep-alive>
```

```js
//home.vue的script部分
export default {
  name: "home",
  data() {
    return { path: "/home/news" };
  },
  // 使用组件内守卫记录离开时的路径信息，并且再用生命周期函数activated实现跳转
  //activated为当前页面活跃状态的钩子函数
  activated() {
    this.$router.push(this.path).catch((err) => {});
  },
  beforeRouteLeave(to, from, next) {
    this.path = this.$route.path;
    next();
  },
};
```

`keep-alive`有两个非常重要的属性

- include：字符串或正则表达，只有匹配的组件才会被缓存
- exclude：字符串或正则表达，任何匹配的组件都不会被缓存

还有一个max属性

- max：最多可以缓存多少个组件实例，一旦达到这个数字，那么缓存的最近没被访问的组件就会被销毁

注意：这里的 ","不能加空格

```html
<!-- 使用keep-alive include="组件的name" -->
<keep-alive include="home,User">
    <router-view></router-view>
</keep-alive>
```



#### 动态组件Component

可以看成简易版路由组件

页面切换

```html
<!-- 方法一：v-if判断 -->
<template v-if="currentTab === 'home'">
    <home />
</template>
<template v-else-if="currentTab === 'about'">
    <about />
</template>
<template v-else-if="currentTab === 'category'">
    <category />
</template>

<!-- 方法二：动态组件 -->
<component :is="currentTab"></component>
```

component就是vue的一个内置组件
他有一个特殊的`attribute`：`is`

is属性要注入

- 通过component函数注册的组件（全局注册）
- 一个组件对象的component对象里注册的组件（局部注册）

同样的，想要让动态组件保持切换之后不被销毁，可以使用 `keep-alive`内置组件进行包裹

```html
<keep-alive>
    <component :is="currentTab"></component>
</keep-alive>
```





## 6.Vuex

#### 概念

Vuex是一个转为Vue.js应用程序开发的状态管理模式

其实可以简单看成把需要多个组件共享的变量全部存储在一个对象里面（状态：变量），然后把这个对象放在顶层的Vue实例中，让其他组件一起使用（而且交给Vuex大管家来管理，其数据还是**响应式**的）

我们其实可以自己通过prototype封装共享的变量对象，但是做不到响应式

多界面共享的例子：用户登陆状态、用户名称头像、地理位置、购物车信息

单页面状态管理： View(视图template部分) -> Actions(事件行为) -> State(变量) -> View

多页面状态管理：Vuex



#### 原理

- 利用vue的[插件机制](https://link.zhihu.com/?target=https%3A//cn.vuejs.org/v2/guide/plugins.html)，使用Vue.use(vuex)时，会调用vuex的install方法，装载vuex

- vuex是利用vue的mixin混入机制，在`beforeCreate`钩子前混入vuexInit方法，vuexInit方法实现了store注入vue组件实例，并注册了vuex store的引用属性$store
- 而其中的响应式，state是通过创建Vue实例的data来保存state，依旧是用到了发布监听的双向绑定，getters则是借助vue的计算属性computed实现数据实时监听



#### 使用

**安装**

```shell
npm install vuex --save
```

**初始化**

然后新建一个store文件夹，在里面创建 index.js 文件，以下步骤和创建router路由插件几乎相同

1.通过`Vue.use(插件)`，来安装插件 （在vue内部执行了`插件.install`方法）

2.创建store对象

3.将store对象传入Vue实例当中(在mian.js里面)，类似于添加了`Vue.prototype.$store = store`，但是却具有响应式能力

```js
import Vuex from 'vuex'
import Vue from 'vue'
// 1.安装插件
Vue.use(Vuex)
// 2.创建对象
const store = new Vuex.Store({
    
})
// 3.导出store对象
export default store
```

```js
//main.js
import Vue from 'vue'
import App from './App'
import store from './store'
Vue.config.productionTip = false
new Vue({
  el: '#app',
  store,
  render: h => h(App)
})
```

![](/simple-blog/Vue(中)/vuex.png)

​                                                                                                       **Vuex状态管理图**



**Devtools** 是Vue开发的一个浏览器插件，用来**记录每一次改变State**

- 需要在浏览器上安装：可以去谷歌应用商店安装Vue.js devtools 插件

Vue官方不建议Components直接修改State ，但是官方允许Components直接修改Mutations

Actions用于处理异步操作（Backend，也就是后端），Mutations一般都是存储同步操作

store对象内置属性：

- state：保存状态（变量），其他组件可以通过 `$store.state.变量名`进行获取（类似data）
- getters：类似于组件里的计算属性computed, 里面的函数默认可以传入state作为参数
- mutations：定义修改状态的方法，里面的函数默认可以传入state作为参数（类似methods）
- actions：在里面处理异步操作
- modules：用于划分模块

**具体操作**

```js
const store = new Vuex.Store({
    state: {
        counter: 10,
    },
    mutations: {
        increment(state) {
            state.counter++;
        },
        decrement(state) {
            state.counter--;
        },
        actions:{},
        getters: {},
        modules:{}
    }
})
```

使用共享变量的组件，这时调用共享的方法Mutations需要用commit来提交

```html
<template>
  <div id="app">
    <h2>{{ $store.state.counter }}</h2>
    <button @click="add">+</button>
    <button @click="sub">-</button>
  </div>
</template>
<script>
export default {
  name: "App",
  methods: {
    add() {
      this.$store.commit("increment");
    },
    sub() {
      this.$store.commit("decrement");
    },
  },
};
</script>
```



#### Vuex每个属性详解

##### **State单一状态树**

vuex推荐只创建一个Vuex.Store实例，若创建多个，日后不方便进行维护

单一状态树可以最直接地找到某个状态



##### 辅助函数

辅助函数 `mapState`的使用

除此之外，还有辅助函数 `mapGetters`、`mapActions`、`mapMutations` 等（大家的使用方式都一样的）

当一个组件需要获取多个状态的时候，将这些状态都声明为计算属性会有些重复和冗余。为了解决这个问题，我们可以使用 `mapState` 辅助函数帮助我们生成计算属性，让你少按几次键：

```js
// 在单独构建的版本中辅助函数为 Vuex.mapState
import { mapState } from 'vuex'

export default {
    // ...
    computed: {
        fullName(){
            return xxx;
        },
        ...mapState({
            // 箭头函数可使代码更简练
    		//count: state => state.count,
            // 传字符串参数 'count' 等同于 `state => state.count`
            countAlias: 'count',

            // 为了能够使用 `this` 获取局部状态，必须使用常规函数
            countPlusLocalState (state) {
                return state.count + this.localCount
            }
        })
    }
}
```

> 注意，得到的mapState是一个对象，而里面存储的是一个一个函数，因为计算属性的每一个属性都是一个函数（同样适用给mapGetters）

当映射的计算属性的名称与 state 的子节点名称相同时，我们也可以给 `mapState` 传一个字符串数组。

```js
computed: mapState([
  // 映射 this.count 为 store.state.count
  'count'
])
```

如果实在module中处理，可以通过传入 模块名 + state的属性名得到

```js
computed: {
	...mapState("home", ["homeCounter"]); // 对应模块名 + 属性名
}
```

​	

使用getters时，还可以使用：`mapGetters` 辅助函数，它仅仅是将 store 中的 getter 映射到局部计算属性：

此时，我们便可以在子组件直接使用该数据：`<div>{{doubleCounter}}</div>`

```js
import { mapGetters } from 'vuex'
export default {
  // ...
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'doubleCounter',
      'doubleCountermore',
      'add',
      // ...
    ])
  }
}
```



在子组件使用Actions时，也可以使用：`mapActions` 辅助函数，将组件的 methods 映射为 `store.dispatch` 调用（需要先在根节点注入 `store`）：（此时用 `this.方法名`即可调用）

```js
import { mapActions } from 'vuex'
export default {
  // ...
  methods: {
    ...mapActions([
      'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`
      // `mapActions` 也支持载荷：
      'incrementBy' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
    ]),
    ...mapActions({
      add: 'increment' // 将 `this.add()` 映射为 `this.$store.dispatch('increment')`
    })
  }
}
```





##### **Getters基本使用**

里面的函数默认可以传入state作为参数，但也可以默认传入 gatters 已有的数据（若传进来，第一个参数为state，第二个参数为getters）。如果要在组件中传入参数，则需要把返回的值改成返回一个函数

有点像computed

```js
const store = new Vuex.Store({
    state: {
        counter: 10,
    },
    getters: {
        doubleCounter(state) {
            return state.counter * state.counter;
        },
        doubleCountermore(state, getters) {
            return getters.doubleCounter + 1;
        },
        add(state, getters) {
            return num => { 
                return getters.doubleCountermore + num 
            }
        }
    },
})
```

```html
<h2>{{ $store.getters.doubleCounter }}</h2>
<h2>{{ $store.getters.add(10) }}</h2>
```



##### **Action基本使用**

Action类似于Mutation，但是是用来替代Mutation进行异步操作的（其实也可以来替代一些功能复杂的操作）

和Getter、Mutation不同，默认传入的参数不是state，而是 context：上下文，是一个和store实例均有相同方法的一个context对象

（包裹在Module里Actions的context则和最外层的store不一样，多了一个 `rootState`、`rootGetters` 属性 ）

- 但是也不支持在action里直接修改state，即不支持 context.state.info.name = 'Mikasa'
- 详情关系图可以看Vuex状态管理图，在action使用commit进行提交 -> mutation
- 第二个参数可选，为传入的对象payload，类似mutation的payload
- 在组件中调用action的异步方法，使用 `this.$store.dispatch("方法名"[, 传入参数]);`

```js
const store = new Vuex.Store({
    state: {
        counter: 10,
        info: {
            name: 'Allen',
            age: 18,
            feature: '始祖巨人'
        }
    },
    mutations: {
        update(state) {
            Vue.set(state.info, 'address', '帕拉迪亚岛')
        }
    },
    actions: {
        aupdate(context, payload) {
            setTimeout(() => {
                context.commit('update');// 原来是在vue组件中 this.$store.commit
                console.log(payload);
            }, 1000);
        }
    },
})
```

```js
//Vue对象的methods属性里
update() {
    this.$store.dispatch("aupdate", "我是payload");
},
```

使用Actions时可以返回一个Promise

当然，碰到了异步操作，且想要确认异步操作是否完成，少不了Promise的优雅加成：

```js
actions: {
    aupdate(context, payload) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                context.commit('update');
                console.log(payload);
                resolve();
            }, 1000);
        })
    }
},
```

```js
update() {
      this.$store
        .dispatch("aupdate", "我是payload")
        .then(() => {
          console.log("执行成功！");
        })
        .catch(() => {
          console.log("执行失败");
        });
    },
```



**Actions提交风格**

除了上述的commit提交方式，Vue还提供了另外一种风格，它是包含type属性的对象，而传入的参数即使并不需要传递多个，但也需要（自动）变成一个对象

```js
this.$store.dispatch({
    type: "aupdate",
    // 这时传过来的num变成一个对象
    num: num,
});
```

此时mutation传入的是对象，所以也要发生相应改变

```js
const store = new Vuex.Store({
    actions: {
        aupdate(constext, payload) {
            console.log(payload.num)
        }
    },
}
```



##### **Module基本使用**

store推荐state单一状态树、但是state里包含太多数据会显得十分臃肿

为此，Vuex允许我们讲store分割成模块（Module），每个模块拥有自己的state、mutation等

```js
const store = new Vuex.Store({
    modules: {
        a: {
            state: {},
            mutations: {},
            actions: {},
            getters:{}
        },
        b: {
            state: {},
            mutations: {},
            actions: {},
            getters:{}
        }
    }
})
```

或者在store的外部定义 module对象，然后直接在store的modules里面引用就可以了

```js
const moduleA = {
    state:{},
    mutations:{}
}
const store = new Vuex.Store({
    modules: {
        a:moduleA
    }
})
```

使用module注意事项：

1.  在组件中使用模块的state数据： `$store.state.模块名称.状态`

```html
<h2>{{$store.state.a.name}}</h2>
```

2. 组件中使用模块的mutation则使用方法和原来放在store里一样，在组件中直接`this.$store.commit(事件类型)`就可以了

3. getters也是也原来放在store里一样去使用；如果模块的getter想要使用到原来的store中的state，则此时模块的getter可以传入三个参数，分别是：

- 自身的state
- getters
- store的state
- store的getters

```js
const moduleA = {
    state: { name: 'Armin' },
    getters: {
        fullname(state, getters, rootState, rootGetters) {
            return state.name + rootState.counter
        }
    }
}
```

  4.它的actions中 `context.commit('函数');`的形式 ，函数只能commit模块中mutations里面的函数

5. actions中的context里，包含 `rootGetters`、 `rootState`，可以获取当前module以上的根的state、getters

6. actions中使用commit提交的时候（使用 `namespaced: true`的时候 ），可以附带第三个参数，`{ root: true }`，表示提交的是根root里面的mutations、actions。

   ```js
   actions: {
       aupdate(context, payload) {
           setTimeout(() => {
               context.commit('update', null, { root: true });
           }, 1000);
       }
   },
   ```

   

但是上述方法，比如使用getters、actions的时候，模块使用和原来的root使用没有区分，这样难以辨别事件源头，is not good

此时我们可以给模块增加属性：`namespaced: true`，此时模块就变得独立了(无法和原来的使用方法一样)

```js
const moduleA = {
    namespaced: true;
    //....
}
```

```html
<!-- <h2>{{ $store.getters["模块名/模块下getters的某属性名"] }}</h2> -->
<h2>{{ $store.getters["home/doubleHomeCounter"] }}</h2>
```

```js
methods:{
	homeIncrement(){
        this.$store.commit("home/increment");         //模块名/模块下的mutation方法
        this.$store.dispatch("home/actionIncrement"); //模块名/模块下action方法
    }
}
```



##### **Mutation基本使用**

mutations作为Vuex的一个属性，但是包含的东西比较多

官方认可：Vuex的store状态的更新唯一方式：提交Mutation

mutations里每个方法完成的事件尽量单一（也就是一个方法，不要有对于state的多种修改功能），方便跟踪Devtools的跟踪，可以选择放在Actions里，然后Action里的函数commit到不同的mutation函数对state修改

Mutation主要包括两部分：

- 字符串的事件类型
- 一个回调函数，该回调函数的第一个参数就是state

比如上述   **使用**   部分的例子中（代码放在了下方），increment为事件类型，`(state) {state.counter++;}`为回调函数

```js
increment(state) {
    state.counter++;
}
```

然后在组件中通过mutation更新进行使用 `this.$store.commit(事件类型)`

mutations传参问题：

- 里面的函数默认可以传入state作为参数，第一个参数为state
- 第二个参数为外部传进来的参数（如果要传递多个参数，则我们可以以对象的形式进行传递），它有个专业名词叫    payload：载荷

```js
const store = new Vuex.Store({
    mutations: {
        increment(state) {
            state.counter++;
        },
        incrementCount(state, payload) {
            state.counter += payload;
        }
    },
```

```js
//组件的methods
methods: {
    add() {
      this.$store.commit("increment");
    },
    addCount(num) {
      this.$store.commit("incrementCount", num);
    },
  },
```



**mutations提交风格**

除了上述的commit提交方式，Vue还提供了另外一种风格，它是包含type属性的对象，而传入的参数即使并不需要传递多个，但也需要（自动）变成一个对象

```js
this.$store.commit({
    type: "incrementCount",
    // 这时传过来的num变成一个对象
    num: num,
});
```

此时mutation传入的是对象，所以也要发生相应改变

```js
const store = new Vuex.Store({
    mutations: {
        incrementCount(state, payload) {
            state.counter += payload.num;
        }
    },
}
```



**Mutations常量类型**

定义常量是减少错误的基本方法

在store文件夹里定义一个js文件，比如 `mutation-type.js` 用于存储常量名，然后在其他文件里用 import导入，用常量名以 `[常量名]`的形式 替代mutations里的函数名，然后引用mutation函数的时候，继续先import导入存储常量名的js文件，直接引用 `this.$store.commit(常量名);` 就可以了

虽然过程十分繁琐，但有利于项目开发后的维护找错



**Mutation同步函数**

通常情况下，Vuex要求我们Mutation中方法必须是同步方法

- 主要原因是我们使用devtools时，devtools可以帮助我们捕捉mutation的快照
- 但如果是异步操作，那devtools将不能很好的追踪到这个操作什么时候会被完成





#### Vuex响应式原理

Vuex的store中的state是响应式的 state其中每个状态都有对应的 Dep -> [Watcher]，监听变化

包括状态里对象的每个属性的变化   

但这要求我们必须遵守Vuex对应的一些规则：

- 提前在store初始化所需的属性
- 当给state对象添加新属性时，使用下列方式：
  - 方式一：使用`Vue.set(obj, 'newProp', 123)`
  - 方式二：用新对象给旧对象重新赋值
  - 这里和数组的响应原理一样，有一些数组方法也不是响应的，需要借助其他方法来进行响应处理（如 `this.arr[0] = 'nothing';` ）
  - 删除属性的方式也相应改成使用 `Vue.delete(obj, 'newProp')`  

