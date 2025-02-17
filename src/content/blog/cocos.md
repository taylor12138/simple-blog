---
title: 'cocos'
author: Hello
pubDate: 2024-12-01 
categories: 前端
description: 'cocos相关'
---

## Cocos.js概述

Cocos.js概述，主要源自chatgpt：

Cocos.js 是一款基于 Cocos2d-x 引擎的 JavaScript 游戏开发框架，主要用于创建跨平台的移动端游戏。它结合了 Cocos2d-x 引擎的高性能和跨平台特性以及 JavaScript 语言的便捷性和灵活性。



Cocos2d-x 是一个成熟的开源游戏引擎，用 C++ 编写，支持多平台开发，包括 iOS、Android、Windows 等。Cocos.js 则是针对 JavaScript 开发者提供的一个封装层，使他们能够使用 JavaScript 语言进行游戏开发。



Cocos.js 提供了一系列的游戏开发工具和组件，包括场景管理、动画系统、精灵管理、物理引擎、UI 系统等，使开发者能够方便地构建游戏场景、处理用户输入、管理游戏对象等。此外，Cocos.js 还支持 JavaScript 的模块化开发，使开发者能够更好地组织和管理代码。



Cocos.js 的特点

1. 跨平台支持：可以使用一套代码开发游戏，并在多个平台上运行，包括 iOS、Android、Windows 等。
2. 高性能：Cocos2d-x 引擎具有优秀的性能表现，能够实现流畅的游戏体验。
3. JavaScript 开发：使用 JavaScript 语言进行开发，无需学习额外的编程语言。
4. 丰富的功能：提供了丰富的游戏开发工具和组件，方便开发者构建各种类型的游戏。
5. 社区支持：Cocos.js 拥有活跃的开发者社区，提供技术支持和资源分享。



#### 分类

#### Cocos Creator

Cocos Creator：是一个位于Cocos2d-x之上的**GUI编辑器**。Cocos Creator 内部已经包含完整的 JavaScript 引擎和 cocos2d-x 原生引擎，不需要额外安装任何 cocos2d-x 引擎或 Cocos Framework，

Creator 3.0 统一了 2D 与 3D 的开发工作流，进一步优化了性能，完善了品质

特性：![](/js游戏框架合集/cococreator.png)



#### Cocos2d-x

Cocos2d-x：是cocos的游戏引擎。它支持c ++，JavaScript和Lua。2D 和 3D。它玩起来和前端的pixijs比较类似

**希望将旧的 Cocos2d-JS 游戏直接运行到 Cocos Creator 上**：由于两者的 API 并不是100%兼容，所以这点是做不到的。

特性：![](/js游戏框架合集/cocos3.jpg)



## Cocos Creator

注意： Creator 在 2.4.4 和 3.0.0 版本升级才对M1 芯片的 mac 电脑适配。

[官网：安装和启动](https://docs.cocos.com/creator/manual/zh/getting-started/install/) + 注册个人账户

然后再editor选项栏下载一个编辑器

然后我们可以在社区下载一些看起来很酷的项目(需要注意他对应的creator编辑器 版本)

![](/js游戏框架合集/cocos1.png)

然后打开项目后进行 [预览和调试](https://docs.cocos.com/creator/manual/zh/editor/preview/) 进行查看

官方还提供了几个新手操作时间实例，可以看这里：

- [Hello world!](https://docs.cocos.com/creator/manual/zh/getting-started/helloworld/)
- [快速上手：制作第一个游戏](https://docs.cocos.com/creator/manual/zh/getting-started/first-game/)

整体上看和我们正常开发web 3d很像，比如创建场景，创建cube啊，只是这些从写代码转移到了gui界面

![](/js游戏框架合集/cocos2.png)

左上角负责gui部分，快速添加 / 删除 mesh

左下角负责编写代码，和我们正常的项目目录一样（添加脚本用typescript，且需要注意，Cocos Creator 中脚本名称就是组件的名称，这个命名是大小写敏感的！如果组件名称的大小写不正确，将无法正确通过名称使用组件！）

这对于一些简单的动画来说，无疑是福音



#### 编写动画效果

通过一般代码，我们可以制作一些比较呆板的动画效果，比如x、y、z轴位移，如何添加一些比较灵性的动画呢？

Cocos Creator 内置了通用的动画系统用以实现基于关键帧的动画。除了支持标准的位移、旋转、缩放动画和帧动画之外，还支持任意组件属性和用户自定义属性的驱动，再加上可任意编辑的时间曲线和创新的移动轨迹编辑功能，能够让内容生产人员不写一行代码就制作出细腻的各种动态效果。

[动画系统](https://docs.cocos.com/creator/manual/zh/animation/)

![](/js游戏框架合集/cocos4.png)

然后在对应的节点脚本上，导入 + 使用对应的动画

```ts
import {  Animation } from 'cc';
```

```ts
//动画
@property({type: Animation})
public BodyAnim: Animation | null = null;
```

对应的动画函数执行

```ts
if (this.BodyAnim) {
  if (step === 1) {
    this.BodyAnim.play('onStep');
  } else if (step === 2) {
    this.BodyAnim.play('twoStep');
  }
}
```





#### 游戏管理器（GameManager）

一般来说，场景内会有不同功能，不同类型的节点，这些节点存放在场景里面我们可以将其视为我们游戏最要的数据部分。而很多情况下我们需要动态的生成、访问、删除这些节点。虽然在 Cocos Creator 里面我们可以通过 `find` 方法来查找这些节点，但实际上由于 `find` 方法需要访问场景内的所有节点，查找的命中率很低，这会造成大量的性能浪费。因此在开发中，我们一般会做一些单独的脚本，使用他们来管理场景内的 **某一类** 节点，或 **某一些** 数据，我们可以称他们为 **管理器**。

举个例子，我们有很多角色，我们游戏可能需要不断的创建新的角色，删除某些已经死亡的角色，查询某些角色的状态，那么我们可以创建一个名为 ActorManager 的类来作为角色管理器，使其支持这些功能。



#### 预制件（Prefab）

预制件用于存储一些可以复用的场景对象，它可以包含节点、组件以及组件上的数据。由预制件生成的实例既可以继承模板的数据，又可以有自己定制化的数据修改。

[详情](https://docs.cocos.com/creator/manual/zh/asset/prefab.html)

像这样创建一个prefab文件，将将预制件资源从 **资源管理器** 拖拽到 **层级管理器** ，然后再从prefab文件夹中拖动到场景即可

![](/js游戏框架合集/cocos5.jpg)



#### meta文件

Cocos Creator 会为 assets 目录下的每一个文件和目录生成一个同名的 meta 文件，相信大家一定不会太陌生。理解 Creator 生成 meta 文件的作用和机理，能帮助您和您的团队解决在多人开发时常会遇到的资源冲突、文件丢失、组件属性丢失等问题。那 meta 文件是做什么用的呢，详情可以看 [此处](https://docs.cocos.com/creator/3.8/manual/zh/asset/meta.html)

## cocos开始

#### 基础设置

先将设计宽高改为竖屏

![image-20240909001703052](/js游戏框架合集/setting.png)



#### 给当前组件添加帧动画

![image-20240916231451467](/js游戏框架合集/frame.png)

新建动画剪辑资源，然后在assets文件夹下我们可以新建一个animations文件夹，专门用来放置动画组件

然后在属性栏中添加你想要的动画（帧动画，位移等）

![image-20240916233930161](/js游戏框架合集/frame2.png)

![image-20240916233930161](/js游戏框架合集/frame3.png)

与此同时，如果想播放循环动画，可以在左下角“循环模式”上设置为“循环播放“



#### 创建ui组件

在这还能随时随地创建ui组件

![image-20240917000613149](/js游戏框架合集/button.png)



#### 创建脚本

我们需要给我们的组件赋值上点击事件

![image-20240917003932599](/js游戏框架合集/start-script.png)

然后把新建的脚本，拖拽到canvas 或 对应的事件组件上

此时为button ui 组件添加事件即可

![image-20240917005016996](/js游戏框架合集/button2.png)

双击创建好的脚本，可以直接打开vscode进行编辑

注意对于暴露的事件，需要设置为public

```ts
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('start_ui')
export class start_ui extends Component {
    start() {

    }

    update(deltaTime: number) {
        
    }

    public onStartGame(){
			//点击后触发onStartGame事件，并且在button ui 组件上进行事件绑定
    }
}
```



#### 设置节点

 通过设置节点，可对应脚本中的内置属性，然后通过代码来操控脚本

先引入脚本

```ts
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('background_ui')
export class background_ui extends Component {
    // 引入该装饰器后，可通过属性面板进行赋值
    @property(Node)
    public bg01: Node
    @property(Node)
    public bg02: Node

    // 向cocos creator暴露这个速度
    @property
    public speed = 100

    start() {

    }

    //背景不停滚动
    update(deltaTime: number) {
        const height = 852;

        const bg01Position = this.bg01.position;
        const newbg01Y = bg01Position.y - this.speed * deltaTime;
        this.bg01.setPosition(bg01Position.x, newbg01Y, bg01Position.z);

        const bg02Position = this.bg02.position;
        const newbg02Y = bg02Position.y - this.speed * deltaTime;
        this.bg02.setPosition(bg02Position.x, newbg02Y, bg02Position.z);

        if(bg01Position.y < -height) {
            this.bg01.setPosition(bg01Position.x, newbg02Y+height, bg01Position.z);
        }
        if(bg02Position.y < -height) {
            this.bg02.setPosition(bg02Position.x, newbg01Y+height, bg02Position.z);
        }

    }
}
```

此时将左上角层级管理器的ui 拖拽到 右边属性检查器定义好的的bg01 、 bg02中去

![image-20240917012322586](/js游戏框架合集/node.png)



#### 创建按键监听脚本

如果你想对某个组件设置按键的监听（比如通过wasd、上下左右、鼠标拖动来操控ui组件），可以通过上方《创建脚本》先创建一个 component

然后通过拖动挂载到对应的组件当中

![image-20250205221806419](/js游戏框架合集/cocoslisten.png)

然后设置对应方法

```typescript
import { _decorator, Component, EventTouch, input, Node, Vec3, Input } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('play_ui')
export class play_ui extends Component {
    protected onLoad(): void {
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    protected onDestroy(): void {
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
    }

    public onTouchMove(e: EventTouch): void {
        const p = this.node.position;
        const targetPostion = new Vec3(p.x + e.getDeltaX(), p.y + e.getDeltaY(), p.z);
        if(targetPostion.x < -230 || targetPostion.x > 230 || targetPostion.y < -380 || targetPostion.y > 380) {
            return;
        }
        this.node.setPosition(targetPostion);
    }
}
```



## cocos脚本api

场景加载，使用 `director.loadScene("场景名称")`，加载下一场景

```ts
public onStartGame(){
  director.loadScene('GameScene')
}
```



## 游戏库对比合集

[3D探索——Web 3D哪家强？](https://juejin.cn/post/6844903701736325133)（主要是threejs和Layabox）



## 案例合集

cocos官网案例：https://docs.cocos.com/creator/manual/zh/cases-and-tutorials/





## ECS模式

在 Cocos 引擎中，**ECS** 指的是 **实体-组件-系统**（Entity-Component-System）架构。ECS 是一种用于游戏开发的编程模式，它旨在将游戏对象的行为、数据和逻辑分离，以实现更高效、更灵活的代码结构。



#### chatgpt讲解

ECS 结构概述：

1. **实体（Entity）**：实体是游戏中的对象，它可以是一个玩家、敌人、道具、背景元素等。实体本身通常只是一个唯一的标识符，并不包含任何行为或数据。它是所有组件的容器。
2. **组件（Component）**：组件是附加到实体上的数据包，包含实体的状态信息，但不包含行为。比如，`PositionComponent`（位置组件）可能包含 x 和 y 坐标，`HealthComponent`（生命值组件）可能包含一个整数值表示生命值，`VelocityComponent`（速度组件）可能包含一个速度向量等。
3. **系统（System）**：系统负责处理和更新附加到实体的组件。系统根据组件的数据来执行实际的逻辑操作，比如渲染、物理碰撞、AI 行为等。一个系统通常会操作某类特定的组件（比如处理所有拥有位置和速度组件的实体进行移动）。



ECS 的优点：

- **高效性**：ECS 可以让游戏的不同部分独立执行并且并行化，提升性能，尤其是在处理大量实体时。
- **可扩展性**：因为组件和系统是独立的，添加新功能时只需添加新的组件和系统，而不必修改已有代码。
- **清晰的职责分离**：组件只关注数据，系统只处理逻辑，避免了代码的耦合。



Cocos 的 ECS 实现：

Cocos 引擎在其 3.x 版本开始支持 ECS 架构，特别是在 Cocos Creator 3.x 及以后版本中，ECS 被进一步集成。开发者可以通过定义实体、组件和系统，来构建游戏逻辑和行为。



示例：

假设我们要实现一个简单的物理引擎，可能会有以下几个组件和系统：

- **PositionComponent**：表示实体的位置。
- **VelocityComponent**：表示实体的速度。
- **PhysicsSystem**：负责根据实体的速度更新实体的位置。

当游戏运行时，`PhysicsSystem` 会查找所有同时包含 `PositionComponent` 和 `VelocityComponent` 的实体，然后更新它们的位置，使其根据速度值进行移动。