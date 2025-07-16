---
author: Hello
categories: 前端
pubDate: 2021-8-31 
title: CSS炫酷动画
description: 'CSS相关'
---
## CSS瀑布流

瀑布流优点：艺术性强，观赏性高

缺点：目的性差

#### 方法一`multi-column`布局

先了解以下几个属性

- `column-count`: 设置共有几列
  - （把当前Block、containers、except、table、wrapper、boxes分成列拜访）
- `column-width`: 设置每列宽度，列数由`总宽度`与`每列宽度`计算得出
- `column-gap`: 设置列与列之间的间距

demo样式：

```css
.container {
  column-count: 2;
  column-gap: 10px;
  padding: 10px;
  .item {
   //...
    img {
      //...
    }
  }
}
```

缺点：

`multi-column`布局（也就是上方的布局方法）会将其内的元素自动进行流动和平衡，尽可能保证每列的高度趋于相同，所以会将其内的文本阶段分布在两列内。

因此可能导致文本内容被切断

但是可以使用 `break-inside`中断这种平衡，保持每个元素的独立性

```css
.container {
  column-count: 2;
  column-gap: 10px;
  padding: 10px;
  .item {
   break-inside: avoid;
    img {
      //...
    }
  }
}
```

但还有缺点：

这种方式仅适用于数据固定不变的情况，对于滚动加载更多等可动态添加数据的情况就并不适用了。



#### 方法二Grid布局

首先要明确的grid布局中的一些属性

主要设置在父元素

- `display`:设置为`grid`指明当前容器为`Grid布局`
- `grid-template-columns`: 定义每一列的列宽
- `grid-template-rows`: 定义每一行的行高
- `column-gap`：用于设置列间距
- `grid-auto-rows`：用来设置多余网格的行高



主要设置在子元素

- `grid-row-start`：上边框所在的水平`网格线`
- `grid-row-end`：下边框所在的水平`网格线`
- `grid-column-start`：左边框所在的垂直`网格线`
- `grid-column-end`：右边框所在的垂直`网格线`

以上四个属性的属性值为 auto | 网格线的自定义名称 | 网格线的索引值（从1开始） | span + 数字，表示边框跨域多少网格



由此，我们只需要不设置行高(`grid-template-rows`)，此时设置`grid-auto-rows`后，所有单元格的高度均为`grid-auto-rows`指定的值。将`grid-auto-rows`设置一个很小的值，比如`10px`，然后对其进行拉伸将其高度指定为真实高度，每一个单元格都做如下操作，那么瀑布流就实现了~

```css
.container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr; // 分为3列
    column-gap:5px; // 列间距5px
    grid-auto-rows: 10px; 
    .item{
        grid-row-start: auto;
    }
}
```



#### 方法三Flex布局

使用flex，将容器分成固定数量等列，每列在添加flex布局，修改其 `flex-direction`即可实现





参考链接https://juejin.cn/post/6844904004720263176





## CSS炫酷按钮

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>帅气的流光灯，想学吗？</title>
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        body{background-color:#000;}
        .w{
            width: 400px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-100%);
            
        }
        p{
            color: #fff;
            text-align: center;
            font-size: 40px;
            font-weight: bolder;
        }
        span{
            color: #fff;
            text-align: center;
            display: block;
        }
        a{
            text-decoration: none;
            position: absolute;
            /* left:50%;
            top:50%;
            transform: translate(-50%,-50%); */
            font-size:24px;
            width: 400px;
            height: 100px;
            line-height: 100px;
            text-align: center;
            color: #fff;
            background: linear-gradient(90deg,#9370DB,#AFEEEE,#FFA500,#9370DB);
            /* background:linear-gradient(90deg,#03a9f4,#f441a5,#ffeb3b,#03a9f4); */
            border-radius:50px;
            text-transform: uppercase;
            background-size: 400%;
            z-index: 1;
        }
        a::before{
            content: "";
            position: absolute;
            left:-5px;
            top: -5px;
            right: -5px;
            bottom: -5px;
            background: linear-gradient(90deg,#9370DB,#AFEEEE,#FFA500,#9370DB);
            /* background:linear-gradient(90deg,#03a9f4,#f441a5,#ffeb3b,#03a9f4); */
            background-size:400%;
            border-radius:50px;
            filter: blur(20px);
            z-index: -1;
        }
        a:hover{
            animation: sun 7s infinite;
        }
        a:hover::before{
            animation: sun 7s infinite;
        }
        @keyframes sun {
            100%{
                background-position: -400% 0;
            }
        }
    </style>
</head>
<body>
    <div class="w">
        <p>流光灯</p>
        <span>鼠标停在上面会动~想学吗</span>
        <a href="javascript:;">sunbutton</a>
    </div>
</body>
</html>
```

原文链接：https://blog.csdn.net/rainbow0518/article/details/106017086





## CSS赛博朋克

```html
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>CSS实现赛博朋克风格按钮</title>
</head>
	<style>
		button, button::after {
		  width: 300px;
		  height: 86px;
		  font-size: 40px;
		  background: linear-gradient(45deg, transparent 5%, #FF013C 5%);
		  border: 0;
		  color: #fff;
		  letter-spacing: 3px;
		  line-height: 88px;
		  box-shadow: 6px 0px 0px #00E6F6;
		  outline: transparent;
		  position: relative;
		}
		button::after {
		  --slice-0: inset(50% 50% 50% 50%);//设置六个分片
		  --slice-1: inset(80% -6px 0 0);
		  --slice-2: inset(50% -6px 30% 0);
		  --slice-3: inset(10% -6px 85% 0);
		  --slice-4: inset(40% -6px 43% 0);
		  --slice-5: inset(80% -6px 5% 0);
		  content: '立即加入';
		  display: block;
		  position: absolute;
		  top: 0;
		  left: 0;
		  right: 0;
		  bottom: 0;
		  background: linear-gradient(45deg, transparent 3%, #00E6F6 3%, #00E6F6 5%, #FF013C 5%);
		  text-shadow: -3px -3px 0px #F8F005, 3px 3px 0px #00E6F6;
		  clip-path: var(--slice-0);
		}
		button:hover::after {
		  animation: 1s glitch;//设置延时1秒，定义glitch变量在在里面设置动画
		  animation-timing-function: steps(2, end);
		}
		@keyframes glitch {
		  0% { clip-path: var(--slice-1); transform: translate(-20px, -10px); }
		  10% { clip-path: var(--slice-3); transform: translate(10px, 10px); }
		  20% { clip-path: var(--slice-1); transform: translate(-10px, 10px); }
		  30% { clip-path: var(--slice-3); transform: translate(0px, 5px); }
		  40% { clip-path: var(--slice-2); transform: translate(-5px, 0px); }
		  50% { clip-path: var(--slice-3); transform: translate(5px, 0px); }
		  60% { clip-path: var(--slice-4); transform: translate(5px, 10px); }
		  70% { clip-path: var(--slice-2); transform: translate(-10px, 10px); }
		  80% { clip-path: var(--slice-5); transform: translate(20px, -10px); }
		  90% { clip-path: var(--slice-1); transform: translate(-10px, 0px); }
		  100% { clip-path: var(--slice-1); transform: translate(0); }
		}
	</style>
<body>
	<button>立即加入</button>
</body>
</html>
```



原文：https://blog.csdn.net/TBDBTUO/article/details/118070710

亦或者参考这个https://github.com/zxuqian/html-css-examples/tree/master/27-glitch-effect



## CSS数字滚动组件

实质上更多的是js逻辑，css只是使用了`transform: translateY`

https://juejin.cn/post/6995086139484799006