---
title: 'Vue(上)'
author: Hello
pubDate: 2021-02-01 
categories: 前端
description: 'Vue相关'
---

## 1.邂逅VUE

vue是一个渐进式框架，这意味着可以作为你应用的一部分嵌入其中，对项目一点点进行重构，响应式：界面随着数据随时发生改变

以前JS原始编写的方法：命令式编程；                        Vue编写方法：声明式编程

vue全家桶：Core  +  Vue-router  +  Vuex

Vue特点：

- 解耦视图和数据
- 可复用组件
- 前端路由技术
- 状态管理
- 虚拟DOM

**引入vue**

```shell
$ npm install vue
```



体验：

```html
<div id="app">
    <ul>
        <li v-for='item in message'>{{item}}</li>
    </ul>
</div>
<script src="./js/vue.js"></script>
<script>
    const app = new Vue({
        el: '#app',
        data: {
            message: ['i', 'wanna', 'be', 'with', 'you']
        }
    })
</script>
```



#### Vue和MVVM

前提请记住：在官方文档中写道，虽然Vue并没有完全遵循MVVM模型，但是Vue的设计也受到了它的启发，因此在文档中经常会使用VM这个变量名表示Vue的实例。

Vue可以通过ref可以拿到dom对象，通过ref直接去操作视图。这一点上，违背了MVVM。



## 2.基础语法

Vue对象传入的option：

- el：决定Vue对象挂载在哪个元素上
- data：存储数据，类型为对象或者函数
- methods: 用于在Vue对象中定义方法
- 在官网中还有一些其他的option

在开发中在对象/类里面定义的叫方法（method），独立出来作用全局的称为函数（function）

双括号语法被称之为mustache语法，八字胡

```html
<!-- item和message分别为data中的字符串 -->
<li>{{item + '' + message}}，hello</li>
<!-- counter为data中的数字 -->
<li>{{counter * 2}}</li>
<!-- 得到getNumber函数返回值 -->
<li>{{getNumber()}}</li>
```



#### Vue的生命周期

在创建Vue对象的时候，内部会一步一步做出一系列复杂的事情/操作，而在做每一系列事情的过程当中，如果中间穿插 created、mounted、updated、destroyed等**生命周期钩子函数**它会指示你（它会内部自动执行，不需要手动调用），目前做到事情的哪一步。

**生命周期，更聪明的排序**

而当软件体积不断增大时，代码逻辑可能会像高速公路上的车辆一样，如果毫无秩序，每一辆车都想以最快的速度通过，反而会导致所有车辆停滞不前，造成拥堵。

拆分生命周期的一个重要目的就是将这些核心功能的优先级进行排序，黄金原则就是尽可能快的让用户最关心的界面先渲染出来



生命周期就是一个对象（如vue)从声明到使用到销毁的各个阶段，为了开发方便框架会在每个阶段的节点上定义一个特定函数，这个特定函数就是生命周期函数，也叫钩子函数

官网附有生命周期示意图

![](/Vue(上)/vue_life-1615514534331.jpg)

还有keep-alive独有的 `activated` 和 `deactivated`

created -> mounted -> activated

**父子组件生命周期**

父 `beforeCreate` - > 父 `created` ->父 `beforeMount` ->子 `beforeCreate`-> 子 `created`-> 子 `beforeMount`-> 子 `mounted`-> 父 `mounted`

父组件更新：父 `beforeUpdate`-> 父 `updated`

子组件更新：父 `beforeUpdate`->子`beforeUpdate` -> 子 `updated` ->父`updated` 

组件的调用 先父后子，渲染完成顺序先子后父

组件销毁  先父后子，销毁完成 先子后父

即便如此，官网提示你：注意 mounted 不会保证所有的子组件也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以在 mounted 内部使用 vm.$nextTick

关于 `destory`：在大多数场景中你不应该调用这个方法。最好使用 `v-if` 和 `v-for` 指令以数据驱动的方式控制子组件的生命周期。



#### V-指令

**v-once**

只会在第一次渲染数据，随后数据发生改变，元素内的数据不会再发生改变，阻止了响应式，可以添加在标签属性上

```html
<h2 v-once>{{message}}</h2>
```

**v-html**

类似于JS原生里的`innerHTML`，可以添加在标签属性上

```html
<h2 v-html="数据名称"></h2>
```

**v-pre**

进行原封不动的解析，可以添加在标签属性上

```html
<!-- 页面得到结果{{message}} -->
<h2 v-pre>{{message}}</h2>`
```

**v-cloak**

为了防止用户加载页面时，加载JavaScript卡住，导致页面显示源码 '{{message}}' ，添加

```html
<h2 v-cloak>{{message}}</h2>
```

等到Vue对该元素进行解析渲染，页面中才会显示该元素（原理使用了display: none）

**v-bind**

使用{{值}}可以将Vue的数据插入元素内容中，但是如果想让Vue的数据动态绑定元素标签属性中的值（比如img的src，a标签的href）,可以使用`v-bind`。`v-bind`还有一个对应的语法糖 `:`（简写方式），方式如下

```html
<a v-bind:href="bdurl">baidu</a>
<a :href="bdurl">baidu</a>
```

如果使用别人写好的组件，**传入批量**的props时（子组件中的props对象的每个属性都声明好了），直接写一个对象，然后 `v-bind="对象名"`即可



与此同时`v-bind`也可以动态绑定class属性值，但是它动态绑定class属性的重大意义在于可以写入对象，以键-值的形式，通过布尔值修改，来动态修改元素是否使用该类（在标签上还可以再自定义添加上自带的class，不参与动态绑定变化）

其实动态绑定class还可以采用数组语法，只不过目前用的比较少了

```html
<div id="app">
    <ul>
        <li v-for="(item, index) in movies" @click="colorch(index)" 
            :class="{active: index === iscolor}">{{item}}</li>
    </ul>
</div>
<script src="./js/vue.js"></script>
<script>
    const app = new Vue({
        el: '#app',
        data: {
            movies: ['batman', 'superman', 'spiderman'],
            iscolor: -1
        },
        methods: {
            colorch: function (index) {
                this.iscolor = index;
            }
        }
    })
```

`v-bind`还能动态绑定元素style样式的某个的单个属性，但是添加的时候注意，vue的语法中最好采用驼峰命名法，而且属性值外加单引号`''`

```html
<h2 :style="{fontSize: '100px'}">{{message}}</h2>
```

注意，绑定属性名的时候，不能用驼峰命名法，可能html不能正确识别，如果要用的话，则属性名要发生改动：`:topImages` ->改成->  `:top-images="xxx"`

在以对向形式绑定类名时，不能用 `-`，驼峰命名也不能奏效，可以使用 

```html
<div :class="
	{
        'tip': item.type === 3,
        'my-msg': item.type === 1,
        'other-msg': item.type === 2,
	}"
>
```



除此之外，连属性名也可以动态决定，只需要加一个中括号即可

```html
<div id="app"> </div>
<template id="my-app">
    <div :[name]="active">hello</div>
</template>
<script>
    const app = new Vue({
        template: '#my-app',
        data() {
            return {
                name: 'hello',
                active: 'act'
            }
        }
    }).$mount("#app")
</script>
```



若要传入多个动态属性，直接给 `v-bind`赋值即可

```html
<template id="my-app">
    <div v-bind="info">hello</div> 
    <!-- <div name="allen" age=12>hello</div> -->
</template>
<script>
    const app = new Vue({
        template: '#my-app',
        data() {
            return {
                info: {
                    name: 'allen',
                    age: 12
                }
            }
        }
    }).$mount("#app")
```



#### computed计算属性

Vue对象的option之一,当成属性去使用，不用加`()`进行函数调用，计算属性不像methods会被多次调用，它只会被调用一次（因此效率相对于methods更高），内部对计算属性做了缓存（有点React的useMemo内味了~）

```html
 <div id="app">
    <h2>{{fullname}}</h2>
  </div>
  <script src="./js/vue.js"></script>
  <script>
    const app = new Vue({
      el: '#app',
      data: {
        firstname: 'Lebron',
        lastname: 'James'
      },
      computed: {
        fullname: function () {  //fullname() {}  也可以
          return this.firstname + ' ' + this.lastname;
        }
      }
    })
  </script>
```

实际上计算属性一般只使用了它本身的get方法，而它的完整写法为：

```javascript
fullname: {
    set: function () {
        //一般情况下，我们不希望计算属性使用set方法,这样的话它就变成了一个只读属性
    },
    get:function() {
    	return this.firstname + '' + this.lastname;
    }
}
```

Computed 默认调用的是get方法 不能传参，想要传递参数得用set设置好，再用get取



#### **watch**属性

watch也是属于组件中的属性（和data，props，methods等并列），对应一个对象类型，里面存放函数方法，这些函数适用于监听某些data中属性的改变。当需要在数据变化时执行异步或开销较大的操作时，这个方式是最有用的。

 函数命名方式：`data中的属性名(改变后的值[, 改变前的值]){}`

```js
watch:{
    // 监听data中message的改变
    message(){
        console.log("hello");
    }
    //相当于message:function(){console.log("hello")}
    //亦或者是拿到新旧的值
    //message(newVal, oldVal) {}
}
```

除了传入函数外，其实watch里面传的是键值对，值除了函数还可以包含两个参数

- immediate：组件加载（首次渲染完成）立即触发回调函数执行，

- `deep`: 深度监听，为了发现**对象内部值**的变化，复杂类型的数据时使用（内部实际上是通过递归取值，然后进行逐个监听），而computed不需要deep，是因为它是从模板`双括号`取值，即使用`JSON.stringfy()`把对象的值一次性取出来

  因为是递归，比较耗性能，尽量不要采用
  
  但是deep有个bug，传入newVal、oldVal参数的时候，如果是内部的属性值发生改变，使得oldVal和newVal仍然是指向同一个地址，此时oldVal === newVal。
  
  当然，官方也做过说明
  
  > 注意：当变更（不是替换）对象或数组并使用 deep 选项时，旧值将与新值相同，因为它们的引用指向同一个对象/数组。Vue 不会保留变更之前值的副本。

```js
watch: {
    message: {
        //使用deep、immediate参数时，对应的函数名必须为handler
        handler(newVal, oldVal) {
            console.log(oldVal)
            console.log(newVal)
        },
        deep: true
    	immediate: true
    }
}
```



甚至`watch`还有`vm.$watch`的用法

```js
data(){
    return {
        info: { name: "allen" }
    }
}
//在create生命周期中
created(){
    const unwatch = this.$watch("info", function(newVal, oldVal) {
        console.log(newVal, oldVal);
    }, {
        deep: true,
        immediate: true
    })
}
```



**computed和watch**

computed：

- 支持缓存，只有依赖数据发生改变时才会重新计算
-  不支持异步，当computed内有异步操作时无效，无法监听数据的变化
- 如果一个属性是由其他属性计算而来的，且一对一或者多对一，则一般用computed

watch：

- 不支持缓存，数据变化则会直接触发相应操作
- 支持异步
- 监听的函数接收两个参数，第一个参数是最新的值（newValue）；第二个参数是输入之前的值（oldValue）
- 可以监听具体到数据的某个属性（对象）

**缓存实现原理**：new watcher -> 这里有个dirty属性，默认为true - > 

求值计算，然后dirty  = false  -> 当依赖数据再次发生改变时 dirty = true



#### 事件监听

`v-on` 绑定事件监听器，缩写（语法糖）为 `@` ，类似于jQuery的 `on` 事件处理，绑定多个事件可以使用对象的形式

```html
<button @click="increment">+</button>
<button v-on="{click: btnClick, mousemove: mouseMove}">-</button>
```



正常情况下，函数如果需要传递参数，然而你没有传递，则函数形参为undefined 

`v-on`参数问题：

- 如果该方法不需要传递参数，则方法后面的`()`可以不用添加
- 但是如果方法本身是需要一个参数的，但是传进来的时候没有加 `()`，（如@click="decrement"），则Vue会将浏览器中生成的事件对象Event作为参数，传入方法中
- 方法定义时，我们需要event对象，同时又需要其他参数时，在html标签内的方法括号中只添加参数 + `$event`

```html
<button @click="cclick(123, $event)">call</button>
```

```javascript
methods: {
    cclick(number, event) {
        console.log(number, event);
    }
}
```



`v-on`修饰符

`@事件名.stop`阻止事件冒泡：相当于原生的`e.stopPropagation()`

```html
<div @click="cclick">
    <button @click.stop="cclick">call</button>
</div>
```

`@事件名.prevent`阻止默认事件 => 相当于原生的 `e.preventDefault();`

`@事件名.{keyCode | ketAlias}`  从键盘特定键位触发回调（ `@keyup.enter="xxx"` ）

`@事件名.native` 监听根元素原生事件（在组件中使用）

- `<Compon_test @click="() => {}"><Compon_test>`  =>

  - `Compon_test.$on('click', () => {})` 

  - `Compon_test.$emit('click')`

- `<Compon_test @click.native="() => {}"><Compon_test>` => `Compon_test.addEventListener`

`@事件名.once` 只触发一次回调



#### 条件判断 + 循环遍历

`v-if="布尔值(或vue对象中存储的变量)"`来决定元素标签是否显示出来

`v-if` 可以搭配 `v-else` 来决定显示哪一些元素标签

```html
<h2 v-if="score>=90">优秀</h2>
<h2 v-else-if="socre>=80">良好</h2>
<h2 v-else-if="socre>=60">及格</h2>
<h2 v-else>不及格</h2>
```

`v-show`决定一个元素是否渲染出来（用法和 `v-if`相似），只是 `v-show`控制结点的display，而`v-if`是删除/创建节点

当我们需要经常切换某个元素的显示/隐藏时，使用`v-show`会更加节省性能上的开销；当只需要一次显示或隐藏时，使用`v-if`更加合理。

有时候我们并不想为了使用 `v-if`不得不在外层包裹一层div，但是我们可能并不像在结构上发生更改，我们可以使用 `template`来替代，有种类似于React中 `Fragment` 或者 `<>`空标签的效果

`v-for`也支持 `template`外层嵌套

但是 `v-show` 并不支持 `template`



`v-for`遍历数组/对象

遍历过程额外获取数组索引值使用 ` v-for="(item, index) in 数组名"`

遍历过程额外获取对象属性名使用 ` v-for="(value, key) in info"` （如果只有value,，则遍历对象每个属性的属性值）

遍历过程额外获取对象属性名，数组索引值使用 `"(value, key, index) in info"` （如果只有value,，则遍历对象每个属性的属性值）

```html
<ul>
      <li v-for="item in strs">{{item}}</li>
      <li v-for="(item, index) in strs">{{index}}.{{item}}</li>
      <li v-for="value in info">{{value}}</li>
      <li v-for="(value, key) in info">{{key}}:{{value}}</li>
      <li v-for="(value, key, index) in info">{{index}}.{{key}}:{{value}}</li>
</ul>
```

你也可以用 `of` 替代 `in` 作为分隔符，因为它更接近 JavaScript 迭代器的语法：

```html
<div v-for="item of items"></div>
```

官方推荐我们使用 `v-for`的时候，给元素或组件添加上 key属性（能更好的复用，提高增删时的性能，高效更新虚拟DOM），并且此时`key`属性绑定为`item`或者 `item.id`  比较好，能形成一一对应（也可以是`item`对象中的id）。这时候就可以唯一标识元素或组件，用diff算法正确识别节点，找到正确位置插入/删除节点。

- 如果key用index，是不可以的，因为index，即下标，会随着DOM元素的位置而改变，导致key = "index"，加了和没加一样！！
- 如果item不是字符串、数字之类的，也不推荐使用

原因：没有key会像操作顺序表（或者数组）一样操作改变位置及之后所有数据，有key就会像链表一样断链后链接，只进行一次操作

```html
<li v-for="item in strs" :key="item">{{item}}</li>
```



**v-for and v-if**

由于`v-for`的优先级是大于`v-if`的，当 `v-for`遍历出来后再每次都`v-if`进行判断比较消耗性能，  所以建议把`v-if`放在外层（比如直接放在template模板上）

**哪些数组的方法是响应式的**：

和对象不同的是，有些数组方法使用后Vue的页面不会及时响应

实际上这个响应式最好记的就是数组方法   看他是否真的改变原数组，而不是返回一个新数组（或者通过官方文档查看它是否为被包裹过的方法）

```js
// 1.push 
this.arr.push('David');
// 2.pop 删除数组中最后一个元素
this.arr.pop();
//3.shift 删除数组第一个元素
this.arr.shift();
//4.unshift 数组最前面添加元素
this.arr.unshift('David', 'Eason');
// 5.splice 用于删除多组元素且添加数据
// splice(开始位置, 删除个数, ...要添加的元素)
this.arr.splice(1, 0, 'David');
// 6.sort
this.arr.sort();
// 7.reverse
this.arr.reverse();
```

通过索引值修改数组元素并不会向页面及时响应结果：

```js
//修改对象用splice或者 Vue.set(修改对象, 索引值, 修改后的值)
this.arr[0] = 'nothing';
```



#### Methods注意事项

> 注意
>
> 不应该使用箭头函数来定义method函数（例如plus: () => this.a++）。理由是箭头函数
>
> 绑定了父级作用域的上下文，所以this将不会按照期望指向组件实例，this将会是父级的作用域（可能是window），this.a将会是undefined

这里和React是相反的，React就是要使用箭头函数来绑定组件实例；

而Vue用普通函数，而Vue并没有像React一样创建自己的内部作用域（类or函数），所以此时箭头函数却向上查找，绑定了父级作用域（在Vue3.x内部实质上是使用 `bind`绑定 `instance.proxy` ）！可以理解为以下的例子

```js
var a = 1;
var foo = {
    a: 2,
    bar: function () {
        return this.a;
    }
    bad: () => {
        return this.a             //箭头函数导致this永远绑定了父级作用域window
    }
};
```



#### 过滤器filters

Vue对象的option之一,当成属性去使用，调用需要在元素标签中添加 

```
{{传入的参数 | 过滤器函数名}}
```

可以把过滤器简单理解为一种格式化，比如时间，数字等等；它的实际效果和methods调用函数方法也差不多，只是编写样式更易懂、简洁

```html
<td>{{book.price | Price_str}}</td>
```

过滤器里面一般存函数，参数为过滤的数据

```js
//toFixed为保留两位小数
filters: {
    Price_str(price) {
        return '$' + price.toFixed(2);
    }
}
```



#### V-model

`v-model`也常常被用来实现表单（`input`、`checkbox`、`select`、`textarea`）和数据的双向绑定

`v-model`如果用在普通div上，只能用来作数据绑定功能（无事件功能、实际上div不支持 `v-model`，但是组件就可以 ）

```html
<input type="text" v-model="message">
{{message}}
```

```js
//在Vue对象中的data
data: {
    message: 'nothing'
}
```

利用 `v-model`实现单选框互绑

```html
<!-- 添加v-model之后，radio的input不需要加name属性来互斥radio（单选框） -->
<label for="male">
    <input type="radio" id="male" value="male" v-model="sex">男♂
</label>
<label for="female">
    <input type="radio" id="female" value="female" v-model="sex">女♀
</label>
<h2>你选择的性别是：{{sex}}</h2>
```

`v-model`其实是是一个语法糖，两个指令的结合

`v-bind`绑定data数据 + `v-on`绑定**input事件**改变data数据

```html
<input type="text" :value="message" @input="message = $event.target.value">
<h2> {{message}}</h2>
```

如果是要再多选框checkbox、选项select、单选radio的时候使用 `v-model`需要在input上赋予value值（hobbies是一个数组）

```html
<div>你的爱好：</div>
<label for="basketball">
    basketball
    <input type="checkbox" id="basketball" v-model="hobbies" value="basketball">
</label>
<label for="tennis">
    tennis
    <input type="checkbox" id="tennis" v-model="hobbies" value="tennis">
</label>
<label for="soccer">
    soccer
    <input type="checkbox" id="soccer" v-model="hobbies" value="soccer">
</label>
<h2>{{hobbies}}</h2>
```



v-model**还有修饰符** lazy、number、trim

```html
<!-- 修饰符lazy 使用之后使得input事件变得类似于change事件，等到用户输入完字符，敲回车/失去焦点才会修改数据 -->
<!-- <input type="text" @change="message = $event.target.value"> -->
<input type="text" v-model.lazy="message">

<!-- 修饰符number v-model默认给data赋值时，都是赋值为string类型，增加number修饰符可改变v-model赋值类型-->
<input type="text" v-model.number="age">

<!-- 修饰符trim，v-model默认给data赋值时剥除两边空格 -->
<input type="text" v-model.trim="name">
```

由于默认 `v-model`是 data数据 + input事件，我们可以在源码上自定义 `v-model`

自定义组件上使用 自定义 `v-model`  ：

```html
<el-checkbox v-model="check"></el-checkbox>
```

```js
//全局注册组件
Vue.component('el-checkbox', {
	template:`<input type="checkbox" :checked="check"
	@change="$emit('change', $event.target.checked)>"`
    //model属性,服务于v-model
	model:{
		prop:'check',  //更改默认value名字
		event:'change' //更改默认方法名,input事件改为change事件
	},
    props:{
    	check:Boolean          
   	}
})
```



原生标签上使用自定义 `v-model`

```js
const VueTemplateCompiler = require('vue-template-compiler');
const ele = VueTemplateCompiler.compiler('<input v-model="value"/>');
/**
with(this) {
	return	_c('input', {               //_c  createElement
		directives:[{                   //directives是对输入框的配置
			name:"model",
			rawName:"v-model"
			vale:(value),
			expression:"value"
		}],
		domProps:{
			"value":(value)             //这里value是默认，可以自定义为check
		},
		on:{
			"input":function($event) {  //这里的默认input可以自定义为change
				if($event.target.composing) return;
				value = $event.target.value
			}
		}
	})
}
**/
```



#### el和template

同时有`el`和`template`，则将`template`里的模板，直接把`el`绑定的元素替换掉



#### name属性

给每个组件最好加上一个name属性，很多功能的匹配都是依赖这个name，比如内置组件`keep-alive`的include属性匹配就是首先检查组件的name选项

`name: 组件名`

官方介绍

- **类型：**`string`

- **详情：**

  允许组件模板递归地调用自身。注意，组件在全局用 [`app.component`](https://v3.cn.vuejs.org/api/application-api.html#component) 注册时，全局 ID 自动作为组件的 name。

  指定 `name` 选项的另一个好处是便于调试。有名字的组件有更友好的警告信息。另外，当在有 [vue-devtools](https://github.com/vuejs/vue-devtools)，未命名组件将显示成 `<AnonymousComponent>`，这很没有语义。通过提供 `name` 选项，可以获得更有语义信息的组件树。



## 3.组件化开发

组件化开发思想即把页面拆分成一个个小的功能块，每个功能完成属于自己那部分的独立功能，分而治之

#### 组件使用三个步骤

- 创建组件构造器 `Vue.extend()`，通常我们在创建组件构造器时会传入template作为自定义模板
- 注册组件 `Vue.component(自定义组件标签名, 组件构造器对象)` 注意：定义的标签必须小写
- 使用组件 必须在`Vue`的实例范围内使用组件，即使用该组件时，必须把标签放在`Vue`绑定的标签内
- 最终内部调用 `$mount()`进行挂载

实际上可以把组件构造器对象看成一个类，使用的过程看成创建一个实例，在哪个组件中使用了即在哪个组件中创建了一个实例

```html
<div id="app">
     <!-- 3.使用组件 -->
    <!-- 比如这里绑定了id为app的块元素，则该自定义标签可以在该块内使用 -->
    <my-cpn> </my-cpn>
</div>
<script>
    // 1.创建组件构造器对象
    const cpnConstructor = Vue.extend({
        // 模板
        template: 
            `<div>
            	<h2>模板1内容</h2>
            </div>`
    });
    // 2.注册组件
    // 严重注意：定义的标签必须小写
    Vue.component('my-cpn', cpnConstructor);
    const app = new Vue({el: '#app'});
</script>
```

注意：在父组件中使用子组件不能使用 `v-on` 监听原生事件，必须添加 `native`修饰符，才能进行监听

```html
<div>
    <back-top @click.native="backClick"></back-top>
</div>
```

获取组件内的元素，需要用到 `$el`，所有组件都有一个元素 `$el` 用于获取组件中的元素，比如获取 组件 的 `offsetTop`

```js
console.log(this.$refs.tabControl.$el.offsetTop;)
```



#### **组件命名**

官方：

在字符串模板或单个文件组件中定义组件时，定义组件名的方式有两种：

使用 kebab-case

```js
app.component('my-component-name', {
  /* ... */
})
```

当使用 kebab-case (短横线分隔命名) 定义一个组件时，你也必须在引用这个自定义元素时使用 kebab-case，例如 `<my-component-name>`。

使用-pascalcase使用 PascalCase

```js
app.component('MyComponentName', {
  /* ... */
})
```

当使用 PascalCase (首字母大写命名) 定义一个组件时，你在引用这个自定义元素时两种命名法都可以使用。也就是说 `<my-component-name>` 和 `<MyComponentName>` 都是可接受的。**注意**，尽管如此，直接在 DOM (即非字符串的模板) 中使用时只有 kebab-case 是有效的。

但实际上大写命名再Vue中不推荐（符合W3C的规范），反而React中使用的就是这种大写命名



#### 组件分类

**全局注册&局部注册**：上面的例子为注册全局组件，意味着可以再多个Vue实例下使用

以下的例子为局部注册组件（局部注册组件自定义标签名不支持 `-`）

Vue对象中的components属性来注册局部组件,在开发过程用的最多的还是局部组件

```js
const app = new Vue({
      el: '#app',
      components: {
        //自定义组件标签名:组件构造器对象
        my_cpn: cpnConstructor
      }
    });
```



**父组件和子组件**

在组件构造器(组件二)中对另外一个组件(组件一)进行注册（`components{}`），这样的好处是可以在组件二模板里面,使用组件一,这样子就形成了父子组件的关系

父组件模板的所有东西都会在父级作用域进行编译，子组件模板的所有东西都会在子级作用域进行编译

**注意**:  在模板中，子组件的标签一定要写在父组件的DIV里面，因为定义模板时一般要有一个外层包裹的根元素（一般使用div）

```html
<div id="app">
    <cpn2></cpn2>
</div>
<script>
    //子组件,子组件要比父组件先创立
    const cpnConstructor = Vue.extend({
        template: `
        <div>
            <h2>模板1内容</h2>
        </div> `
    });
    //父组件
    const cpnConstructor2 = Vue.extend({
        template: `
		<div>
            <h2>模板2内容</h2>
			<cpn1></cpn1>
        </div> `,
        components: {
            cpn1: cpnConstructor
        }
    });
    // root组件
    const app = new Vue({
        el: '#app',
        components: {
            cpn2: cpnConstructor2
        }
    });
</script>
```



#### 组件语法糖

Vue为了简化组件使用的过程，提供了创建 + 注册合并的语法糖，直接适用对象替代`extend`步骤

```js
//创建+注册全局组件语法糖
Vue.component('mycpn', {
    template: `
        <div>
        	<h2>模板1内容</h2>
        </div> `
})
```

```js
//创建+注册局部组件语法糖
const app = new Vue({
    el: '#app',
    components: {
        mycpn2: {
            template: `
                <div>
                	<h2>模板2内容</h2>
                </div> `
        }
    }
});
```



**组件模板的分离写法**

为了使结构更加清晰，最好将html分离出来写，这里有两个组件模板分离的写法

- 1.script标签，注意类型必须是`text/x-template`（但是现在比较少使用了）
- 2.使用template标签

```html
<template id="cpn">
    <div>
        <h2>模板1内容</h2>
    </div>
</template>
<script>
    Vue.component('mycpn', {
        template: '#cpn'
    })
</script>
```



#### **组件的数据访问**

**组件的data**

组件内部不能直接访问Vue实例里的数据，包括data，methods等

组件是一个单独功能模块的封装，也有属于自己的data属性（其实可以把Vue实例也看成一个**特殊**的组件，组件在自己的标签里只能访问自己的data），当然也有自己的methods属性

**但是！！**：和Vue的data不同的是，组件自己的**data必须用函数写**（methods不用），然后再返回一个实例对象

组件中的data写成一个函数，数据以创立新一个对象的函数返回值形式定义，这样每复用一次组件，就会返回一份新的data，（因为函数会创建自己的作用域）类似于给每个组件实例创建一个私有的数据空间，让各个组件实例维护各自的数据。（同一个组件标签名用的是同一个组件构造器对象）

而单纯的写成对象形式，就使得所有组件实例在使用的时候直接引用同一个对象，导致共用了一份data，就会造成一个改变，全都会发生改变的局面。

```html
<template id="cpn">
    <div>
        <h2>{{str}}</h2>
    </div>
</template>
<script>
    Vue.component('mycpn', {
        template: '#cpn',
        data() {
            return {
                str: 'hello world'
            }
        }
    })
</script>
```



**父子组件的通信**

- 父组件传给子组件：子组件通过props方法接受数据; （外加 `v-bind`属性传值）Vue实例的data -> 子组件的props数组中某个变量名进行接收，当作数据来使用，然后在渲染到template模板中（mustache语法）
- 子组件传给父组件：$emit方法（自定义事件）传递参数

在真实开发中，Vue实例和子组件的通信也可以当作父组件和子组件的通信来看

##### 父组件传子组件

父组件传递给子组件实例：

```html
<div id="app">
    <mycpn :smovies="movies" :smessage="message"></mycpn>
</div>
<template id="cpn">
    <div>
        <ul>
            <li v-for="item in smovies">{{item}}</li>
        </ul>
        <h2>{{smessage}}</h2>
    </div>
</template>
<script>
    // 父组件传子组件 props 
    const app = new Vue({
        el: '#app',
        data: {
            movies: ['ironman', 'batman', 'spiderman'],
            message: 'hello world'
        },
        components: {
            mycpn: {
                template: '#cpn',
                props: ['smovies', 'smessage']
            }
        }
    });
</script>
```

**注意**：props定义的属性名同样不要使用驼峰标识，因为HTML属性不支持大写（自定义组件名也是不要大写）（非要用大写则在html里时，将对应的大写前加 `-`，这样的话大写转小写）

对于通过props从父组件传递过来的值最好不要直接修改，而是在子组件的data创建数据，以传递过来的值对其进行赋值，然后想修改的手再在data的数据中修改

**prop的赋值方式**

```js
// props: ['smovies', 'smessage']
// 这种对象写法还可以指定每个 prop 的值类型,甚至提供默认值,必传值,更常用
// 但是props里属性为对象或者数组时,默认值（default）属性必须是一个函数
// props:{
//   smovies:Array,
//   smessage:String
// }
props: {
    smovies: {
        type: Array,
        default() {
        	return []
        }
    },
        smessage: {
            type: String,
            default: 'nothing',
            require: false    //   使用该子组件的时候,是否必须要给这个smessage属性赋值
        }
}
```



非props的属性

当我们传递组建的某一个属性时，该属性没有定义对应的props或者emits时，就称之为非Props的Attribute

常见的包括style、class、id属性等

而当组件有根节点时，非Props的Attribute将自动添加到根节点的Attribute中

当然，也可以在组件里添加一个option：`inheritAttrs: false`，根节点将不会再继承这个非props属性

禁用的实际情况

- 禁用attribute继承常见情况是需要将attribute应用于根元素之外的其它元素
- 我们可以通过$attrs来访问所有非props的attribute

```html
<template>
  <div>
    <h2 :class="$attrs.class">hello world</h2>
    <h2>hello world</h2>
  </div>
</template>
```



##### **子组件传父组件**

 流程：

- 1.子组件通过$emit()触发事件，子组件发送出去一个事件 `this.$emit(事件名称, [传递参数])`,是自定义事件
-  2.父组件通过 v-on监听子组件事件 

```html
<!-- 父模板 -->
<div id="app">
    <!-- 父组件需要使用事件监听 v-on 进行监听，然后自己在methods定义相对应的处理函数就可以了 -->
    <!-- v-on不仅可以监听DOM事件，还可以监听组件之间的事件 -->
    <mycpn v-on:Bigclick="FatherListener"></mycpn>
</div>
<!-- 子模版 -->
<template id="cpn">
    <div>
        <ul>
            <li v-for="item in categories" @click="itemclick(item)">{{item.name}}</li>
        </ul>
    </div>
</template>

<script>
    const app = new Vue({
        el: '#app',
        components: {
            mycpn = {
                template: '#cpn',
                data() {
                    return {
                        categories: [
                            { id: 1, name: "热门推荐" },
                            { id: 1, name: "手机数码" },
                            { id: 1, name: "家用家电" },
                            { id: 1, name: "电脑办公" },
                        ]
                    }
        		},
                methods: {
                    itemclick(item) {
                        this.$emit('Bigclick', item);
                    }
                },
    		}
    	},
        methods: {
            //基本的事件默认传入event，但是子组件传来的事件，如果附带上参数，则如果父组件处理的函数自带传来的参数
            FatherListener(item) {
                console.log("hello", item);
            }
        }
    });
</script>
```



#### 父子组件对象操作

上面的组件数据访问我们已经提到了父子组件相互通信的方法（子组件传子组件信息给父组件，父组件传父组件的信息给子组件），但有时我们想直接访问组件（父组件获取子组件信息），而不是当子组件触发某个事件时，将子组件数据传给父组件再进行操作

父组件想要访问子组件：使用 `$children` 或者 `$refs`

子组件访问父组件：使用 `$parent`

**父组件想要访问子组件**：

但是真实开发中，我们不会通过`$children`去拿子组件对象进行操作，这是因为当使用`$children[索引号]`的方式拿取数据，当Vue绑定的标签内在中间新插入新子组件，会导致拿到的是新子组件的数据

所以用`$refs`比较多，无论Vue绑定的标签内是否有子组件，this.$ref 都默认为空

```html
<!-- 对应的html标签 -->
<div id="app">
    <cpn> </cpn>
    <cpn ref="cpn2"> </cpn>
    <button @click="btnClick">打印子组件信息</button>
</div>
```

```js
//子组件信息
cpn: {
    template: '#cpn',
    data() { return { name: 'Allen' } },
    methods: {
       showMessage() {
           console.log('nothing');
       }
    }
}
```

```js
//Vue的mothods中的方法：
btnClick() {
    // 1.$children
    // 调用Vue绑定的标签内第一个子组件的方法showMessage()
    this.$children[0].showMessage();
    console.log(this.$children[0].name);
    // 2.$ref,在标签上加属性：ref="cpn2",此时this.$ref不再为空
    console.log(this.$refs.cpn2);
}
```

使用前要注意：因为 ref 本身是作为渲染结果被创建的，在初始渲染的时候你不能访问它们 - 它们还不存在！`$refs` 也不是响应式的，因此你不应该试图用它在模板中做数据绑定。

ref如果绑定在组件中，那么通过 `this.refs.ref绑定的名称`获取到的是一个组件对象

ref如果绑定在元素中，那么通过 `this.refs.ref绑定的名称`获取到的是一个元素对象（此时ref的功能不是用于父组件获取子组件的数据，而是组件自己内部想要在某个地方获取到自己的某个标签（元素），这样有较高安全性，因为类名可能会重复，到时候项目开发时通过类名的获取，不一定能够准确获取目标）



**子组件想要访问父组件**：（开发中不建议用，因为引用了外部组件的数据，还是父组件的数据，这样会导致独立性、可复用性降低，有较大耦合性）`$parent`    如果想访问根组件数据用 `$root`

```js
//cpn的methods中：
methods: {
    btn_click() {
        console.log(this.$parent);
    }
}
```



#### 插槽slot

组件的插槽也是为了让封装的组件更具有扩展性（使用同一组件但能自定义特色风格）

- 抽取共性，预留不同

在组件（模板）中增加 `<slot></slot>`，然后在html上使用组件时，往中间添加的标签/文字，都会放在template模板中slot标签内

推荐使用 div标签先将 slot包起来再使用 `<div><slot></slot></div>`，可以避免很多bug

```html
<!-- 组件cpn的模板中添加： -->
<div>
    <h2>我是子组件</h2>
    <p>这是子组件的段落</p>
    <!-- 同时也可以定义一个默认值，这里没有传入则插槽内默认显示一个button -->
    <slot><button>按钮</button></slot>
</div>
```

```html
<!-- 使用插槽进行替换 -->
<cpn><button>其他</button> </cpn>
```



**具名插槽**

应用：如果有多个插槽且想要替换掉指定的插槽

一个不带 `name` 的 `<slot>` 出口会带有隐含的名字“default”。

注意 **`v-slot` 只能添加在 `<template>` 上**

```html
<!-- 组件cpn的模板中添加： -->
<div>
    <slot name="left"><span>左边</span></slot>
    <slot name="mid"><span>中间</span></slot>
    <slot name="right"><span>右边</span></slot>
</div>
```

```html
<!-- 如果是在<template>上的话，可以使用新版的 v-slot了 -->
<!-- 替换掉name为mid的插槽-->
<cpn>
    <template v-slot:mid>
        <!-- <template #mid>-->
        <span>nothing</span>
    </template>
</cpn>
```

旧版本的：`<div slot="插槽名">首页</div>`

vue2.6新增：

- 还有动态插槽名的用法，可以官网查看一下
- v-slot语法糖：#



**作用域插槽**

大前提：父组件模板的所有东西都会在父级作用域进行编译，子组件模板的所有东西都会在子级作用域进行编译

当前需求：想办法在父组件的作用域拿到子组件的数据，然后再在父组件做一个插槽填充（这里不能使用`$refs`因为，还没渲染完毕，在初始渲染的时候你不能用`$refs`进行访问）

- 也就是说，普通插槽的渲染位置在父组件里面，将父组件渲染的结果直接替换到 `slot`中； 
- 而作用域插槽的渲染位置是在子组件里面，所以这里就产生了作用域的不同

多个插槽写法：v-slot:插槽名="数据调用方法名"，

首先在子组件模板中的 `<slot></slot>`查找中添加自定义属性，自定义属性="想要绑定的数据名"

```html
<!-- 子组件-->
<!-- 注意：:data属性名这里可以随便改自己喜欢的名字，但是必须要小写，v-slot的也是一样要注意小写 -->
<slot :data="pLanguages">
    <ul>
        <li v-for="item in pLanguages">{{item}}</li>
    </ul>
</slot>
```

Vue里支持通过`template`，来拿到刚才的data属性，使用 `v-slot:"插槽具名"="自定义插槽 prop 的对象"`；获取子组件通过属性传递过来的数据，然后通过 `自定义插槽 prop 的对象.子组件自定义属性名`调用子组件的数据

```html
<!-- 在html中使用组件 -->
<cpn>
    <!-- <span v-for="item in pLanguages">{{item}}</span>  错误，不可以直接获取-->
    <!-- 如果插槽有具名，则写成<template v-slot:"具名"="slotProps"> -->
    <template v-slot="slotProps">
        <span v-for="item in slotProps.data">{{item}} - </span>
    </template>
</cpn>
```



#### 为什么要使用异步组件

大前提：

在webpack中，如果想要让webpack单独分包，也就是将导入的组件/文件在打包后不要合并，而是单独分一个chunk-哈希值.js出来，则只需要我们在导入的时候通过

```js
import('xxxxx.js').then(res => res.函数名);
```

的形式进行使用时，则webapck会帮我们额外生成chunk来打包该文件（利用的是import函数得到一个异步promise的原理）





如果组件功能多，打包的结果（app.js）会变大，我们可以采用异步的方式来加载组件，主要依赖于 `import`

异步组件 （`async component`）一定是一个函数，新版本提供了对象的写法

```js
components:{
	AddCustomerSchedule:(resolve) => import("../components/AddCustomer")
}
```

```js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // 向 `resolve` 回调传递组件定义
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```
