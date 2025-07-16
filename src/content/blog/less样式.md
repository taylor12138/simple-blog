---
author: Hello
categories: 前端
pubDate: 2020-10-02
title: less样式
description: 'CSS相关'
---

## less基础

CSS的冗余度比较高，需要书写大量看似没有逻辑的代码，不方便维护，且无计算能力

而Less是CSS的拓展语言，也成为CSS预处理器（常见的CSS预处理器：Less、Sass、Stylus），可以计算（**运算符的左右两侧必须加一个空格**，

两个数参与运算，如果只有一个数有单位，最后结果以这个单位为准

两个数参与运算，如果两个数都有单位，以前面那个数字单位为准）

Less的文件后缀名：.less

#### （1）less变量

```less
@color: pink;  /*@变量名:值;*/  
@font: 14px;
```

使用： background-color: @color ;

#### （2）less的编译

需要把less编译成CSS才能放入H5使用

在VScode中安装easy-less插件，less文件保存后一键生成CSS文件

#### （3）less镶套

在less不需要再 .header a {}  去选择后代选择器(再见)     可以直接：

```less
.header {
	width: 100px;
	a {
		color: red;
	}
}
```

伪类选择器：

```less
.nav {
	&:hover {
		color: blue;
	}
    &::before {
        content: "";
    }
}
```

在一个less中可以引入另外一个less（套娃）

```less
@import "common";  /*导入conmon.less*/
```



## Less函数

**each**

类似于循环函数

先定义一个数组变量

```less
@selectors: blue, green, red;
```

通过`each(数组名, {  .sel-@{value} {} });`的方式获取数组中每一个值（ `@{value}` ）

```less
each(@selectors, {
  .sel-@{value} {
    a: b;
  }
});
```

Outputs:

```less
.sel-blue {
  a: b;
}
.sel-green {
  a: b;
}
.sel-red {
  a: b;
}
```

当然也可以通过定义对象变量，通过each函数分别得到每个对象的key、index、value

```less
@set: {
  one: blue;
  two: green;
  three: red;
}
.set {
  each(@set, {
    @{key}-@{index}: @value;
  });
}
```

This will output:

```css
.set {
  one-1: blue;
  two-2: green;
  three-3: red;
}
```



**range**

传入一个数字，创建一个顺序数组列表

Examples:

```less
value: range(4);
```

Outputs:

```css
value: 1 2 3 4;
```

搭配each来使用：

```less
each(range(4), {
  .col-@{value} {
    height: (@value * 50px);
  }
});
```

Outputs:

```css
.col-1 {
  height: 50px;
}
.col-2 {
  height: 100px;
}
.col-3 {
  height: 150px;
}
.col-4 {
  height: 200px;
}
```



## less和sass

Sass与Scss是什么关系?

Sass的缩排语法，对于写惯css前端的web开发者来说很不直观，也不能将css代码加入到Sass里面，因此sass语法进行了改良，Sass 3就变成了Scss(sassy css)。与原来的语法兼容，只是用{}取代了原来的s缩进。

（SASS版本3.0之前的后缀名为.`sass`，而版本3.0之后的后缀名`.scss`。）

**less和sass的区别**

Less和Sass的主要不同就是他们的实现方式。

Less是基于JavaScript，是在客户端处理的。

Sass是基于Ruby的，是在服务器端处理的。

关于变量在Less和Sass中的唯一区别就是Less用@，Sass用$。