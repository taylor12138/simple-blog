---
author: Hello
pubDate: 2022-03-20
categories: 前端
title: Threejs(上)
description: '动画相关'
---

## 1.threejs简介

#### WebGL

WebGL（全写Web Graphics Library）字面意义理解就是web图像库.是一种3D绘图协议，种绘图技术标准允许把JavaScript和OpenGL ES 2.0结合在一起，通过增加OpenGL ES 2.0的一个JavaScript绑定

当然也可以说是一个负责图形处理的JavaScript API，可在任何兼容的Web浏览器中渲染高性能的交互式3D和2D图形，而无需使用插件.总结一句话,“webgl是一个专门计算或渲染3D图像的javascriptAPI也可以称之为专门处理3D图像的一种javaScript技术”．



WEBGL VS canvas VS SVG

- SVG:本身會變成瀏覽器 DOM。優點是方便交互，缺點是因為每一個 SVG 元素都是一個 DOM 元素，繪製或移動一個 SVG 元素，瀏覽器都需要重新繪製、渲染頁面
- canvas: 不涉及 DOM 元素，和 SVG 繪製的元素相比，交互性差，但也正因如此，在元素自身的動畫特效上不受 DOM 位置限制，在瀏覽器性能（載入速度）上比 SVG 更佳。
- WebGL:WebGL 通過 WebGL JS API 連接 Javascript 和 GPU 編譯程序。GPU 繪圖的渲染大部分在 GPU 上進行，對瀏覽器壓力減小，性能幾個量級地提高，使 WebGL 成為瀏覽器內的3D渲染、大數據可視化唯一的選擇。



#### threejs概述

随着WebGL在2011年推出之后，3d技术正式向高级编程语言js敞开大门

threejs是基于原生webGL封装运行的三维引擎，在所有webGL引擎中，threejs是国内资料最多，使用最广泛的三维引擎

并且Threejs会选择性渲染，只渲染屏幕当前出现的Object3D

官网：https://threejs.org/

GitHub：https://github.com/mrdoob/three.js

一个炫酷的threejs网站推荐https://lusion.co/；当然官网也有很多threejs的案例网站



threejs教学：

- [Three.js Fundamentals](https://threejs.org/manual/#en/fundamentals)

- [Three.js Journey](https://threejs-journey.xyz/)

- [Learn Three.js](https://www.packtpub.com/web-development/learn-threejs-third-edition)

- [初めてのThree.js](https://www.amazon.co.jp/初めてのThree-js-第2版-_WebGLのためのJavaScript-3Dライブラリ-Dirksen/dp/4873117704/)

- ###### 法国threejs高级开发工程师Bruno Simon的教学视频



threejs程序结构

- 场景
  - 网络模型
  - 光照
- 相机
  - 位置
  - 视线方向
  - 投影方式
- 渲染器
  - 渲染器创建
  - 渲染器渲染
  - domElement属性



#### 笔者感受

感觉threejs很灵活，像js一样，又很细致，你可以灵活把一个物品拆分成许多个单独的节点，你甚至可以把一根手指拆成三个节点，对其进行不同曲率对应的rotation计算，换算下来一只手都可以有几十甚至几百个节点来操控。这里有一个坦克的例子：https://threejs.org/manual/#zh/scenegraph

细的缺点就是麻烦，没有封装好的东西，灵活和便捷总是相对的，并且还需要一些图形学的知识





#### 图片要求

threejs用到的一些图，出了一些普通图片，还有时候需要可以本身要调节光亮的图片（使用HDR的图片）

HDR图：高动态范围图像(High-Dynamic Range，简称HDR)，相比普通的图像，可以提供更多的动态范围和图像细节，根据不同的曝光时间的LDR(Low-Dynamic Range)图像，利用每个曝光时间相对应最佳细节的LDR图像来合成最终HDR图像，能够更好的反映出真实环境中的视觉效果。

这里有个HDR图推荐网址：https://polyhaven.com/



#### 安装

项目中安装

```shell
npm i three
```



#### 推荐工具

threejs参数众多吗，但与图形学能力不好的同学建议配合上 `Dat.gui` 工具 拼命调整参数，达到自己想要的效果



#### WebGL兼容性检查

**（WebGL compatibility check）**

虽然这个问题现在已经变得越来不明显，但不可否定的是，某些设备以及浏览器直到现在仍然不支持WebGL。
以下的方法可以帮助你检测当前用户所使用的环境是否支持WebGL，如果不支持，将会向用户提示一条信息。

请将https://github.com/mrdoob/three.js/blob/master/examples/jsm/capabilities/WebGL.js引入到你的文件，并在尝试开始渲染之前先运行该文件。

```
if (WebGL.isWebGLAvailable()) {    // Initiate function or other initializations here    animate(); } else {    const warning = WebGL.getWebGLErrorMessage();    document.getElementById('container').appendChild(warning); }
```



## 2.初始start

为了真正能够让你的场景借助three.js来进行显示，我们需要以下几个对象：场景、相机和渲染器，这样我们就能透过摄像机渲染出场景。

```js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//一般可以设置为75°、45°的角度等
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
```

```js
//最后再添加到文档中
document.body.appendChild( renderer.domElement );
```



```js
//当然还可以在创建渲染器的时候 添加进ducoment
const canvas = document.querySelector('.mycanvas');
const renderer = new THREE.WebGLRenderer({ canvas });
```

让我们搭建第一个小[案例](https://codesandbox.io/s/suspicious-butterfly-d1j2rf?file=/index.js)吧



#### 辅助工具

用于辅助找到空间感觉的辅助工具

```js
//显示三维坐标系
// 红色为x轴、绿色为y轴、蓝色为z轴
const axes = new THREE.AxisHelper(20)
//新版本是 const axesHelper = new THREE.AxesHelper(20);，传入的参数为坐标轴长度
//添加到场景中
scene.add(axes)
```

当然还有不同的helper，比如`CameraHelper`、`DirectionalLightHelper` 等，都是官方的辅助工具，可以在官网中找到对应的helper进行调试

![](/simple-blog/three/axeshelper.png)



用于查看帧数等性能相关的工具

```js
import Stats from 'three/examples/jsm/libs/stats.module'

const stats = Stats();
document.body.appendChild(stats.dom);
renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
  stats.update();
});
```

![](/simple-blog/three/fps.png)



debug工具

可以去我的《动画辅助工具》blog查看



#### 三大要素

##### (1)相机

three.js里有几种不同的相机，在这里，我们使用的是**PerspectiveCamera**（透视摄像机）。

这个相机的特点是能将场景中的物体进行进大远小的渲染

```js
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
```

第一个参数是**视野角度（FOV）**。视野角度就是无论在什么时候，你所能在显示器上看到的场景的范围，它的单位是角度(与弧度区分开)，一般45、75比较多，75最多，因为比较接近人眼能看到的角度范围。

第二个参数是**长宽比（aspect ratio）**。 也就是你用一个物体的宽除以它的高的值。比如说，当你在一个宽屏电视上播放老电影时，可以看到图像仿佛是被压扁的。

接下来的两个参数是**近截面**（near）和**远截面**（far）。通俗来讲就是相机能看到的最近的距离和最远的距离。 

![](/simple-blog/three/camera.png)

设置完还得设置相机的位置，参数分别是x、y、z坐标

```js
camera.position.set(-1.8, 0.6, 2.7);
```

- `.aspect : Float`

  摄像机视锥体的长宽比，通常是使用画布的宽/画布的高。默认值是**1**（正方形画布）。
  
- `camera.lookAt(scene.position)`

  让当前相机指向场景中心，这里的参数必须传入一个position



###### 其他相机

正交相机（`OrthographicCamera`）

`OrthographicCamera( left : Number, right : Number, top : Number, bottom : Number, near : Number, far : Number )`

left — 摄像机视左边界。
right — 摄像机视右边界。
top — 摄像机视上边界。
bottom — 摄像机视下边界。
near — 摄像机近端距离。
far — 摄像机远端距离。

这一摄像机使用[orthographic projection](https://en.wikipedia.org/wiki/Orthographic_projection)（正交投影）来进行投影。

他没有视野角度（fov）的概念，在这种投影模式下，无论物体距离相机距离远或者近，在最终渲染的**图片中**物体的大小都保持不变。

这对于渲染2D场景或者UI元素是非常有用的。



###### updateProjectionMatrix

**.[updateProjectionMatrix](https://threejs.org/docs/index.html#api/zh/cameras/PerspectiveCamera.updateProjectionMatrix) () : undefined**

更新摄像机投影矩阵，在任何参数被改变以后必须被调用。

比如下面就是相机的 aspect 发生改变，所以需要我们手动update一下

```js
this.camera.aspect = window.innerWidth / window.innerHeight; //其实也就是调整camera第二个参数
// 更新一下摄像机转换3d投影的矩阵
this.camera.updateProjectionMatrix();
```



一般最多用到以上2种相机，如果

想了解更多相机 [看这里](https://threejs.org/docs/index.html?q=Camera#api/zh/cameras/OrthographicCamera)



##### (2)WebGLRenderer（渲染器）

```js
//可以设置抗锯齿 antialias
const renderer = new THREE.WebGLRenderer({ antialias: true });
//设置像素比,window.devicePixelRatio为当前浏览器的像素比
renderer.setPixelRatio(window.devicePixelRatio)
//设置画布 尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
```

使用渲染器后，还得让其在浏览器中进行渲染

```js
renderer.render(scene, camera)
```



使用css的背景

```css
.my-canvas {
    width: 100%;
    height: 100%;
    display: block;
    background: url(resources/images/daikanyama.jpg) no-repeat center center;
    background-size: cover;
}
```

```js
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas,
  alpha: true,
});
```



###### 应对HD-DPI显示器

如果你确实想用设备的分辨率来渲染，three.js中有两种方法来实现。

一种是使用renderer.setPixelRatio来告诉three.js分辨率的倍数。 访问浏览器从CSS像素到设备像素的倍数然后传给three.js。

```
 renderer.setPixelRatio(window.devicePixelRatio);
```

之后任何对`renderer.setSize`的调用都会神奇地使用您请求的大小乘以您传入的像素比例. **强烈不建议这样**。 看下面。

另一种方法是在调整canvas的大小时自己处理。

```js
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width = canvas.clientWidth * pixelRatio | 0;
  const height = canvas.clientHeight * pixelRatio | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}
```

第二种方法从客观上来说更好。为什么？因为我拿到了我想要的。 在使用three.js时有很多种情况下我们需要知道canvas的绘图缓冲区的确切尺寸。 比如制作后期处理滤镜或者我们在操作着色器需要访问gl_FragCoord变量，如果我们截屏或者给GPU 读取像素，绘制到二维的canvas等等。 通过我们自己处理我们会一直知道使用的尺寸是不是我们需要的。 幕后并没有什么特殊的魔法发生。



###### 动画loop

- `.setAnimationLoop ( callback : Function ) : undefined`

  callback — 每个可用帧都会调用的函数。 如果传入‘null’,所有正在进行的动画都会停止。

  可用来代替[requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)的内置函数. 对于WebXR项目，必须使用此函数。(可以理解为就是一个 `requestAnimationFrame` )

  ```js
  renderFn() {
    mesh.rotation.y += 0.01;
    this.renderer.render(this.scene, camera)
    this.renderer.setAnimationLoop(this.renderFn)
  }
  // 动画函数
  animate() {
      this.renderFn();
  }
  ```

但是有一个缺陷：当你帧数越高（不同手机表现不同），此时动画越快，为此我们需要做一些策略：通过时间调节我们的frame rate

方法一：本地时间

```js
let time = Date.now();
renderFn() {
  const currentTime = Date.now();
  const deltaTime = currentTime - time;
  time = currentTime;
  mesh.rotation.y += 0.01 * deltaTime;
  this.renderer.render(this.scene, camera)
  this.renderer.setAnimationLoop(this.renderFn)
}
```

方法二：threejs的clock

```js
const clock = new THREE.Clock()
renderFn() {
  const elapsedTime = clock.getElapsedTime(); //得到的是秒不是毫秒
  mesh.rotation.y += elapsedTime;
  this.renderer.render(this.scene, camera)
  this.renderer.setAnimationLoop(this.renderFn)
}
```



###### **色调映射**

在设置hdr图之后，可以设置色调映射属性，这些常量定义了WebGLRenderer中toneMapping的属性。 这个属性用于在普通计算机显示器或者移动设备屏幕等低动态范围介质上，模拟、逼近高动态范围（HDR）效果。

```js
//色调映射（常量），设置为电影级别
renderer.toneMapping = THREE.ACESFilmicToneMapping;
//调节曝光程度
renderer.toneMappingExposure = 2;
```



###### 其他

针对不需要动画的场景，一般我们在材质加载完成后才调用`render`方法. 我们这么做是因为使用了[按需渲染](https://threejs.org/manual/zh/rendering-on-demand.html)中的方法, 而不是连续渲染. 这样我们仅仅需要在材质加载后渲染一遍就好.



##### (3)scene（场景）

```js
const scene = new THREE.Scene()
scene.add(xx) //将xx添加入场景, 可传入多个Object3D
scene.remove(xx) //将xx移除场景
```

它继承于[Object3D](https://threejs.org/docs/index.html#api/zh/core/Object3D)，它代表一个局部空间，以下是官网文档对场景解释的一个例子：

![](/simple-blog/three/scene.png)

太阳系、太阳、地球、月亮。

地球绕着太阳转，月球绕着地球转，月球绕着地球转了一圈。从月球的角度看，它是在地球的 "局部空间 "中旋转。尽管它相对于太阳的运动是一些疯狂的像螺线图一样的曲线，但从月球的角度来看，它只需要关注自身围绕地球这个局部空间的旋转即可。

这个是我按照官网写的旋转的[例子](https://codesandbox.io/s/keen-jepsen-gfrle4?file=/src/script.js)

如果在场景中添加太阳，太阳旋转是个根据场景旋转，把地球添加进太阳中，除了地球自转，地球还会因为太阳的旋转，产生以太阳为相对点进行旋转，此时如果`sunMesh.scale.set(5, 5, 5)` 比例设置为 5x。这意味着 `sunMeshs` 的局部空间是 5 倍大。这表示地球现在大了 5 倍，它与太阳的距离 ( `earthMesh.position.x = 10` ) 也是 5 倍。这个以太阳为局部空间的一切，都会影响到地球

```js
//创建太阳
const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
sunMesh.scale.set(5, 5, 5); // 扩大太阳的大小
scene.add(sunMesh);
objects.push(sunMesh);

//创建地球
const earthMaterial = new THREE.MeshPhongMaterial({
  color: 0x2233ff,
  emissive: 0x112244
});
const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
earthMesh.position.x = 10;
sunMesh.add(earthMesh);
objects.push(earthMesh);
```

![](/simple-blog/three/scene2.png)

所以我们最好做一个太阳系，再往太阳系里添加地球和太阳

```js
//创建太阳系
const solarSystem = new THREE.Object3D();
scene.add(solarSystem);
objects.push(solarSystem);

//创建太阳
const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xffff00 });
const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
sunMesh.scale.set(5, 5, 5); // 扩大太阳的大小
solarSystem.add(sunMesh);
objects.push(sunMesh);

//创建地球
const earthMaterial = new THREE.MeshPhongMaterial({
  color: 0x2233ff,
  emissive: 0x112244
});
const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
earthMesh.position.x = 10;
solarSystem.add(earthMesh);
objects.push(earthMesh);
```

![](/simple-blog/three/scene3.png)

最后再试一试加上地月系

```js
//创建地月系
const earthOrbit = new THREE.Object3D();
earthOrbit.position.x = 10;
solarSystem.add(earthOrbit);
objects.push(earthOrbit);

// 创建地球
const earthMaterial = new THREE.MeshPhongMaterial({
  color: 0x2233ff,
  emissive: 0x112244
});
const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
earthOrbit.add(earthMesh);
objects.push(earthMesh);

// 创建月亮
const moonMaterial = new THREE.MeshPhongMaterial({
  color: 0x888888,
  emissive: 0x222222
});
const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
moonMesh.position.x = 2;
moonMesh.scale.set(0.5, 0.5, 0.5);
earthOrbit.add(moonMesh);
objects.push(moonMesh);
```

![](/simple-blog/three/scene4.png)

###### 区块（Object3D）管理的优点

通过这种区块（Object3D）的方式，管理每个Mesh，在某个场景下有大量Mesh需要进行移动时有巨大的性能优化空间，此时成百上千的Mesh放在一个Object3D里进行位置变化，可以被当成一次的位置变化

所以可以看到很多案例，在导入`.gltf`文件之后，不急着通过`traverse` 遍历 每一个节点进行控制，而是可以吧 节点（mesh）丢到object 3D里，进行统一管理





###### 场景内部方法

- `.background(Object)`

  若不为空，在渲染场景的时候将设置背景，且背景总是首先被渲染的。 可以设置一个用于的“clear”的Color（颜色）、一个覆盖canvas的Texture（纹理）， 或是 a cubemap as a CubeTexture or an equirectangular as a Texture。默认值为null。

  当然也可以使用threejs的`Color`

  ```js
  scene.background = new THREE.Color(BACKGROUND_COLOR);
  ```

如果背景图被拉伸了，说明他被自动适应屏幕宽高，此时需要我们调整图片比例

```js
function render(time) {
 
  ...
 
  // 设置背景贴图的repeat和offset属性
  // 来保证图片的比例是正确的
  // 注意图片有可能还没加载完成
  const canvasAspect = canvas.clientWidth / canvas.clientHeight;
  const imageAspect = bgTexture.image ? bgTexture.image.width / bgTexture.image.height : 1;
  const aspect = imageAspect / canvasAspect;
 
  bgTexture.offset.x = aspect > 1 ? (1 - 1 / aspect) / 2 : 0;
  bgTexture.repeat.x = aspect > 1 ? 1 / aspect : 1;
 
  bgTexture.offset.y = aspect > 1 ? 0 : (1 - aspect) / 2;
  bgTexture.repeat.y = aspect > 1 ? 1 : aspect;
 
  ...
 
  renderer.render(scene, camera);
 
  requestAnimationFrame(render);
}
```



- `.environment(texture)`

  若该值不为null，则该纹理贴图将会被设为场景中所有物理材质的环境贴图。 然而，该属性不能够覆盖已存在的、已分配给 MeshStandardMaterial.envMap 的贴图。默认为null。

  环境贴图是一种用于模拟物体周围环境（天空、地面、远处物体等）反射的贴图，可以用于增强场景的真实感和细节，在一些案例中，我们可以看到金属面反射周边环境，这就是环境贴图（`scene.environment`的作用）。

- `.fog( color : Integer, near : Float, far : Float )`

  一个fog实例定义了影响场景中的每个物体的雾的类型

  ```js
  // 设置迷雾
  this.scene.fog = new THREE.Fog(0xf1f1f1, 20, 100);
  ```

  `.near : Float`

  开始应用雾的最小距离。距离小于活动摄像机“near”个单位的物体将不会被雾所影响。

  默认值是1。

  `.far : Float`

  结束计算、应用雾的最大距离，距离大于活动摄像机“far”个单位的物体将不会被雾所影响。

  > 雾的颜色是根据 scene.background 来的

- `.getObjectByName(name:string)`

  用于查找scene中都某个物件，比如

  ```js
  cube.name = 'nameCube'
  scene.add(cube)
  const findRes = scene.getObjectByName('nameCube')
  console.log(findRes.position)
  ```

  ```js
  function removeCube(findRes){
  	if(findRes instanceof Mesh) {
          scene.remove(findRes)
      }
  }
  ```

- `traverse`

  同样的，scene继承了object3D，scene也有traverse方法，用于遍历后代，被调用者和每个后代对象都会调用该函数

  ```js
  scene.traverse((obj) => {
  	if(obj instanceof Mesh && obj != plane) {
          obj.rotation.x += 0.01;
          obj.rotation.y += 0.01;
          obj.rotation.z += 0.01;
      }
  })
  ```

- `.overrideMaterial : Material`

  如果不为空，它将强制场景中的**每个物体**使用这里的材质来渲染。默认值为null。



## 3.texture（纹理）

纹理贴图，texture其实就是一张图片，常常放置于材料啊、几何的表面，来呈现外观，可以看成一层“皮”

这里还有一个比较出名的3d纹理网站：https://3dtextures.me/

##### **Loader加载纹理图**

`TextureLoader`：加载texture的一个类。 内部使用ImageLoader来加载文件。

`.load ( url : String, onLoad : Function, onProgress : Function, onError : Function ) : Texture`

url — 文件的URL或者路径，也可以为 [Data URI](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs).
onLoad — 加载完成时将调用。回调参数为将要加载的texture.
onProgress — 将在加载过程中进行调用。参数为XMLHttpRequest实例，实例包含total和loaded字节。
onError — 在加载错误时被调用。

从给定的URL开始加载并将完全加载的texture传递给onLoad。该方法还返回一个新的纹理对象，该纹理对象可以直接用于材质创建。 如果采用此方法，一旦相应的加载过程完成，纹理可能会在场景中出现。

> 其实还有一个`CubeTextureLoader`，用来加载CubeTexture类，立方体贴图，一次性加载当前视角上下左右前后的图，形成一个立体的map



如果真对全局的加载（loading）情况，可以使用

**LoadingManager**

其功能是处理并跟踪已加载和待处理的数据。如果未手动设置加强管理器，则会为加载器创建和使用默认**全局**实例加载器管理器 - 请参阅 [DefaultLoadingManager](https://threejs.org/docs/index.html#api/zh/loaders/managers/DefaultLoadingManager).

一般来说，默认的加载管理器已足够使用了，但有时候也需要设置单独的加载器 - 例如，如果你想为对象和纹理显示单独的加载条。

```js
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {
  console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};
loadingManager.onLoad = function ( ) {
  console.log( 'Loading complete!');
};
loadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
  console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
};
loadingManager.onError = function ( url ) {
  console.log( 'There was an error loading ' + url );
};


//纹理加载器
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("color.jpg");
```



##### **给材质赋予纹理**

jpg贴图纹理（材质）

- `.map : Texture`

  颜色贴图。默认为null。

```js
const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xcccc
})
setEnvMap(hdr) {
    const textureLoader = new THREE.TextureLoader();
    const bricks = textureLoader.load("./images/brick.jpg");
    planeMaterial.map = bricks;
}
```

或者在初始化材料的时候

```js
//让立方体6个面图形不同
const materials = [
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-1.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-2.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-3.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-4.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-5.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-6.jpg')}),
];
const cube = new THREE.Mesh(geometry, materials);
```

> 但需要注意的是，并不是所有的几何体类型都支持多种材质。[`BoxGeometry`](https://threejs.org/docs/#api/zh/geometries/BoxGeometry) 和 [`BoxGeometry`](https://threejs.org/docs/#api/zh/geometries/BoxGeometry) 可以使用6种材料，每个面一个。[`ConeGeometry`](https://threejs.org/docs/#api/zh/geometries/ConeGeometry) 和 [`ConeGeometry`](https://threejs.org/docs/#api/zh/geometries/ConeGeometry) 可以使用2种材料，一种用于底部，一种用于侧面。 [`CylinderGeometry`](https://threejs.org/docs/#api/zh/geometries/CylinderGeometry) 和 [`CylinderGeometry`](https://threejs.org/docs/#api/zh/geometries/CylinderGeometry) 可以使用3种材料，分别是底部、顶部和侧面。对于其他情况，你需要建立或加载自定义几何体和（或）修改纹理坐标。

又或者是：(注意加载的异步处理)

```js
textureLoader.load("color.jpg", (texture) => {
  //创建正方体
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ map: texture });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(1, 0, 0);
  scene.add(cube);
});
```



- `.envMap : Texture`

  环境贴图。默认值为null。

- 纹理重复

  ```js
  //有2个属性，wrapS 用于水平包裹，wrapT 用于垂直包裹。
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  ```

  ```js
  //重复是用[repeat]重复属性设置的，一下两个值表示重复的次数
  const timesToRepeatHorizontally = 4;
  const timesToRepeatVertically = 2;
  someTexture.repeat.set(timesToRepeatHorizontally, timesToRepeatVertically);
  ```
  




##### hdr图设置纹理

当然也可以通过hdr图设置纹理背景

```js
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
//...
// 设置场景（环境背景）
setEnvMap(hdr) {
    // 回调得到的参数是纹理对象
    // 怎么感觉这里的路径是直接把hdr文件夹放在public下
    new RGBELoader().setPath("./hdr/").load(hdr + ".hdr", (texture) => {
        //告诉他该纹理背景是圆柱体映射
        texture.mapping = THREE.EquirectangularReflectionMapping
        this.scene.background = texture;
        this.scene.environment = texture;
    });
}
```



##### 立体贴图

如果你想体验立体的贴图环境，我们需要使用到 `CubeTextureLoader`，传入6个立方体面的贴图

```js
{
  const loader = new THREE.CubeTextureLoader();
  const texture = loader.load([
    'resources/images/cubemaps/computer-history-museum/pos-x.jpg',
    'resources/images/cubemaps/computer-history-museum/neg-x.jpg',
    'resources/images/cubemaps/computer-history-museum/pos-y.jpg',
    'resources/images/cubemaps/computer-history-museum/neg-y.jpg',
    'resources/images/cubemaps/computer-history-museum/pos-z.jpg',
    'resources/images/cubemaps/computer-history-museum/neg-z.jpg',
  ]);
  scene.background = texture;
}
```

我们可以看到效果

![](/simple-blog/three/scene1.png)

[尝试一下](https://codesandbox.io/s/compassionate-curran-gxbt01?file=/src/script.js)

此外，我们还可以通过[`WebGLCubeRenderTarget.fromEquirectangularTexture`](https://threejs.org/docs/#api/en/renderers/WebGLCubeRenderTarget.fromEquirectangularTexture)  直接渲染一张 360 全景相机图

 可以看这里的[案例](https://threejs.org/manual/#zh/backgrounds)



##### 优化：纹理内存

纹理往往是three.js应用中使用内存最多的部分。重要的是要明白，*一般来说*，纹理会占用 `宽度 * 高度 * 4 * 1.33` 字节的内存。

所以，一般为了让three.js使用纹理，必须把纹理交给GPU，而GPU*一般*都要求纹理数据不被压缩。所以，不仅仅要让你的纹理的文件大小小，还得让你的纹理尺寸小

但是，虽然我们可以用各种裁剪、缩放的方式，让图片宽高变小，但是这可能导致我们存在GPU的图片太小了，像素颜色可能会变成这样

![](/simple-blog/three/xiangsu.png)

不过，我们可以用mipmaps解决这个问题，要设置filter，

当在绘制的纹理大于其原始尺寸时设置过滤器，我们可以通过设置 `texture.magFilter`（THREE.LinearFilter、NearestFilter）来选择像素的[展示情况](https://threejs.org/manual/#zh/textures)

![](/simple-blog/three/texture.png)

当在绘制的纹理小于其原始尺寸时设置过滤器，你要设置 [`texture.minFilter`](https://threejs.org/docs/#api/zh/textures/Texture#minFilter) 

- `THREE.NearestFilter`

  同上，在纹理中选择最近的像素。

- `THREE.LinearFilter`

  和上面一样，从纹理中选择4个像素，然后混合它们



## 4.几个比较重要的类 + 概念

#### 三维向量（Vector3）

该类表示的是一个三维向量（3D [vector](https://en.wikipedia.org/wiki/Vector_space)）。 一个三维向量表示的是一个有顺序的、三个为一组的数字组合（标记为x、y和z）， 可被用来表示很多事物，例如：

- 一个位于三维空间中的点。
- 一个在三维空间中的方向与长度的定义。在three.js中，长度总是从(0, 0, 0)到(x, y, z)的 [Euclidean distance](https://en.wikipedia.org/wiki/Euclidean_distance)（欧几里德距离，即直线距离）， 方向也是从(0, 0, 0)到(x, y, z)的方向。
- 任意的、有顺序的、三个为一组的数字组合。

其他的一些事物也可以使用二维向量进行表示，比如说动量矢量等等； 但以上这些是它在three.js中的常用用途。

对 Vector3 实例进行遍历将按相应的顺序生成它的分量 (x, y, z)。

代码示例

```js
const a = new THREE.Vector3(0, 1, 0); //no arguments; will be initialised to (0, 0, 0) 
const b = new THREE.Vector3(); 
const d = a.distanceTo( b );
```

比如我要获取物体和相机的距离，或者物体距离某个点的距离

```js
const a = new THREE.Vector3(0, 1, 0);
//cube距离相机的距离
console.log(cube.position.distanceTo(camera.position));
```

有很多地方继承了Vector，比如Object3D的position属性、scale属性等。





#### 三维物体（Object3D）

这是Three.js中大部分对象的基类，提供了一系列的属性和方法来对三维空间中的物体进行操纵。

请注意，可以通过[.add](https://threejs.org/docs/index.html#api/zh/core/Object3D.add)( object )方法来将对象进行组合，该方法将对象添加为子对象，但为此最好使用[Group](https://threejs.org/docs/index.html#api/zh/objects/Group)（来作为父对象）。

他有postion、scale、rotation等属性，还有add、lookAt、traverse（用于遍历）等方法

可以把它看成js中的object那么通用

- `Object3D.scale.set(x, y, z)`：设置物体大小
- `Object3D.position.set(x, y, z)`：设置物体位置
- `Object3D.rotation.set(x, y, z)`：设置物体旋转角度，分别表示x、y、z轴旋转量（备注，如果在rotation有疑惑的时候，可以尝试一下.`cube.rotation.reorder('YXZ');`，他旋转角度会根据当前物体的x、y、z轴旋转 ）



#### Mesh：网格

表示基于以三角形为[polygon mesh](https://en.wikipedia.org/wiki/Polygon_mesh)（多边形网格）的物体的类，它继承object3D。 同时也作为其他类的基类，例如[SkinnedMesh](https://threejs.org/docs/index.html#api/zh/objects/SkinnedMesh)。

代码示例

```js
const geometry = new THREE.BoxGeometry( 1, 1, 1 );  //生成一个立方体
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });  //创建一个材质material
const mesh = new THREE.Mesh( geometry, material ); scene.add( mesh );
```

你可以理解他为一个类似pixi的sprite，但是它由一个物体几何（geometry） + 材料（material） 合成的，比如一颗木头就是由一个圆柱体 + 木材质合成的

![](/simple-blog/three/Mesh.png)

#### Group

它几乎和[Object3D](https://threejs.org/docs/index.html#api/zh/core/Object3D)是相同的，其目的是使得组中对象在语法上的结构更加清晰。

你可以就把他当成一个[Object3D](https://threejs.org/docs/index.html#api/zh/core/Object3D)来看，只不过他一般用于装载多个Mesh，在pixi里类似于container的概念

```js
const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );

const cubeA = new THREE.Mesh( geometry, material );
cubeA.position.set( 100, 100, 0 );

const cubeB = new THREE.Mesh( geometry, material );
cubeB.position.set( -100, -100, 0 );

//create a group and add the two cubes
//These cubes can now be rotated / scaled etc as a group
const group = new THREE.Group();
group.add( cubeA );
group.add( cubeB );

scene.add( group );
```



#### Float32Array

源自原生javascript

mdn： **`Float32Array`** 类型数组代表的是平台字节顺序为 32 位的浮点数型数组 (对应于 C 浮点数据类型) 。

对于 WebGL 应用程序，从`Array`到的潜在代价高昂的转换`Float32Array`需要包含在任何性能测量中。

- 它只能存储float数据
- 只能存储固定的长度
- 但是端上处理起来十分快速

```js
// 3个顶点，创建9个数值
const positionArr = new Float32Array(9);
//第一顶点（vertex）的x、y、z坐标
positionArr[0] = 0;
positionArr[1] = 0;
positionArr[2] = 0;
//第二顶点（vertex）的x、y、z坐标
positionArr[3] = 0;
positionArr[4] = 1;
positionArr[5] = 0;
//第三顶点（vertex）的x、y、z坐标
positionArr[6] = 1;
positionArr[7] = 0;
positionArr[8] = 0;

//第二种创建方式
const positionArr2 = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);
```



#### BufferAttribute

这个类用于存储与[BufferGeometry](https://threejs.org/docs/index.html#api/zh/core/BufferGeometry)相关联的 attribute（例如顶点位置向量（position），面片索引，法向量（normal），颜色值（color），UV坐标（uv）以及任何自定义 attribute ）。 利用 BufferAttribute，可以更高效的向GPU传递数据。

构造函数

`BufferAttribute( array : TypedArray, itemSize : Integer, normalized : Boolean )`

- array -- 必须是 [TypedArray](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/TypedArray). 类型，用于实例化缓存。
  该队列应该包含：`itemSize * numVertices`个元素，numVertices 是 [BufferGeometry](https://threejs.org/docs/index.html#api/zh/core/BufferGeometry)中的顶点数目
- itemSize -- 队列中与顶点相关的数据值的大小。举例，**如果 attribute 存储的是三元组（例如顶点空间坐标、法向量或颜色值）则itemSize的值应该是3**。
- normalized -- (可选) 指明缓存中的数据如何与GLSL代码中的数据对应。例如，如果array是 UInt16Array类型，且normalized的值是 true，则队列中的值将会从 0 - +65535 映射为 GLSL 中的 0.0f - +1.0f。 如果array是 Int16Array (有符号)，则值将会从 -32768 - +32767 映射为 -1.0f - +1.0f。若 normalized 的值为 false，则数据映射不会归一化，而会直接映射为 float 值，例如，32767 将会映射为 32767.0f.

```js
const positionArrtribute = new THREE.BufferAttribute(positionArr, 3); //positionArr为上方的Float32Array
```

因此，如果你要直接修改BufferAttribute，必须通过`setAttribute`的形式添加，并且传入 Float32Array 数组，详情可以看 下面 **Geometry** 部分



#### UV

uv坐标可以理解为纹理坐标，像前端精灵图一样，每一块·都会有对应的位置，而且也是二维的

这里引用**Bruno Simon** 的两张图表现texutre对应的平面坐标（二维uv位置， 在`BufferAttribute`中它的itemSize为2）

![](/simple-blog/three/uv.png)

![](/simple-blog/three/uv2.png)

设置uv

``` js
//创建缓冲几何
const geometry = new THREE.BufferGeometry();
const material = new THREE.MeshStandardMaterial();
material.map = xxTexture;
const mesh = new THREE.Mesh(geometry, material);
//通过setAttribute，传入一个BufferAttribute
//记住这里是二维的
geometry.setAttribute("uv2", BufferAttribute(mesh.geometry.attributes.uv.array, 2));
```

这里还有一个草图，很生动形象：https://blog.csdn.net/from_the_star/article/details/106594769

U（图片在显示器水平的坐标）和V（图片在显示器垂直的坐标） 范围是 0 - 1，通过setAttribute我们可以传入当前这个 BufferAttribute 的纹理坐标位置

> 可以在0~1.0之间任意取值(是百分比值，比如0.3，对应是30%的位置)，纹理贴图**左下角**对应的UV坐标是`(0,0)`，**右上角**对应的坐标`(1,1)`

而且我们还能通过设置 texture的offset偏移（实际上也是设置uv方向的偏移），来创建一个uv动画，看[这里](https://www.cnblogs.com/tiandi/p/17059347.html)(斑马线案例)





#### Normals

法向量维基百科概念：

法向量，是空间解析几何的一个概念，**垂直于平面的直线所表示的向量为该平面的法向量**。 法向量适用于解析几何。 由于空间内有无数个直线垂直于已知平面，因此一个平面都存在无数个法向量（包括两个单位法向量）。

normals表示的是法向量，一般和光照、反射、折射有关

![](/simple-blog/three/normals2.png)

比如在图片里，我们可以看到如果光照按照左上到右下的角度射进来，左上半球是有光照反应的，右下是逐渐变暗的，并且右下角会随之产生阴影，此时我们还能看到左上能形成反射的向量角度,

[这里](https://codesandbox.io/s/threejs-vertexnormalshelper-uc7ynj)我创建一个VertexNormalsHelper ，方便观察法向量

下面这个[例子](https://codesandbox.io/s/threejs-buffergeometry-qgu8ps?file=/src/constant.js:1380-1389)，我同方向光正常打光，按照红线的指示是正常的，此时上面的法向量为

```
[0, 1, 0]
```

![](/simple-blog/three/normal3.png)

但是当我们把顶点的法向量调整为

```
[1, 0, 0]
```

此时机会看到和侧面一样的打光情况

![](/simple-blog/three/normal4.png)





## 5.Mesh组成

#### 几何（Geometry）介绍

> 目前为止，threejs已删除之前有的Geometry，用的都是以BufferGeometry为基类的Geometry
>
> https://github.com/mrdoob/three.js/wiki/Migration-Guide#r124--r125

![](/simple-blog/three/no.png)

[官网介绍](https://threejs.org/docs/?q=geometry#api/zh/geometries/BoxGeometry)

用的比较多的[Box**Geometry**](https://threejs.org/docs/api/zh/geometries/BoxGeometry.html)、[Plane**Geometry**](https://threejs.org/docs/api/zh/geometries/PlaneGeometry.html) 、[Text**Geometry**](https://threejs.org/docs/examples/zh/geometries/TextGeometry.html)（TextGeometry生成网格前需要先加载 3D 字体数据。 数据的加载是异步的，所以在尝试创建几何体前需要等待。通过将字体加载 Promise 化，并且我们可以通过减少curveSegments、 bevelSegments的值进行优化）



一些大佬甚至可以靠 [Shape**Geometry**](https://threejs.org/docs/api/zh/geometries/ShapeGeometry.html) 或者是创建一个empty BufferGeometry改造成自己想要的形状

如果绘制一些像 [`PlaneGeometry`](https://threejs.org/docs/#api/zh/geometries/PlaneGeometry) 和 [`ShapeGeometry`](https://threejs.org/docs/#api/zh/geometries/ShapeGeometry) 这样的二维图形，没有内部, 如果不设置 `side: THREE.DoubleSide`，当从反面看时它们会消失。

对于碰撞检测，threejs默认使用sphere bouding

![](/simple-blog/three/bounding.png)

也就是一个球形

其实也就是Geometry的这两个属性

![](/simple-blog/three/bounding2.png)



**BufferGeometry**

在之前有个Geometry，一直和BufferGeometry进行对比：

- 基于 [`BufferGeometry`](https://threejs.org/docs/#api/zh/core/BufferGeometry) 的图元是面向性能的类型。 几何体的顶点是直接生成为一个高效的类型数组形式，可以被上传到 GPU 进行渲染。 这意味着它们能更快的启动，占用更少的内存。但如果想修改数据，就需要复杂的编程。

- 基于 `Geometry` 的图元更灵活、更易修改（建立在bufferGeometry之上封装好的api）。 它们根据 JavaScript 的类而来，像 [`Vector3`](https://threejs.org/docs/#api/zh/math/Vector3) 是 3D 的点，[`Face3`](https://threejs.org/docs/#api/zh/core/Face3) 是三角形。 它们需要更多的内存，在能够被渲染前，Three.js 会将它们转换成相应的 [`BufferGeometry`](https://threejs.org/docs/#api/zh/core/BufferGeometry) 表现形式。

  举个简单的例子，[`BufferGeometry`](https://threejs.org/docs/#api/zh/core/BufferGeometry) 不能轻松的添加新的顶点。 使用顶点的数量在创建时就定好了，相应的创建存储，填充顶点数据。 但用 `Geometry` 你就能随时添加顶点。

总结就是：消耗性能的地方最好用BufferGeometry(比如说烟、雾、雪、雨之类的)，但是BufferGeometry用起来很麻烦，普遍的地方正常用Geometry就好了

> 实际上，[`BufferGeometry`](https://threejs.org/docs/#api/zh/core/BufferGeometry) 本质上是一系列 [`BufferAttribute`](https://threejs.org/docs/#api/zh/core/BufferAttribute)s 的 *名称* 。每一个 [`BufferAttribute`](https://threejs.org/docs/#api/zh/core/BufferAttribute) 代表一种类型数据的数组：位置，法线，颜色，uv，等等…… 这些合起来， [`BufferAttribute`](https://threejs.org/docs/#api/zh/core/BufferAttribute)s 代表每个顶点所有数据的 *并行数组* 。

![](/simple-blog/three/buffergeometry.png)

而上面`position`, `normal`, `color`, `uv` ，它们指的是 *并行数组* ，代表每个属性的第N个数据集属于同一个顶点。index=4的顶点被高亮表示贯穿所有属性的平行数据定义一个顶点。

```js
//创建缓冲几何
const geometry = new THREE.BufferGeometry();
//通过setAttribute，传入一个BufferAttribute
geometry.setAttribute("position", positionArrtribute);
const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true
});
const mesh = new THREE.Mesh(geometry, material);
```

```js
console.log(geometry.attributes)
/*
{ 
  position: Float32BufferAttribute
  normal: Float32BufferAttribute
  uv: Float32BufferAttribute
}
*/
```



[案例](https://threejs.org/examples/#webgl_buffergeometry) （上万的粒子效果仍然特别流畅）



#### 材质（material）介绍

##### 基础属性

.[opacity](https://threejs.org/docs/index.html#api/zh/materials/Material.opacity) : Float

在0.0 - 1.0的范围内的浮点数，表明材质的透明度。值**0.0**表示完全透明，**1.0**表示完全不透明。
如果材质的transparent属性未设置为**true**，则材质将保持完全不透明，此值仅影响其颜色。 默认值为**1.0**。

经常用于 **过渡消失动画** 

.[side](https://threejs.org/docs/index.html#api/zh/materials/Material.side) : Integer

定义将要渲染哪一面 - 正面，背面或两者。 默认为[THREE.FrontSide](https://threejs.org/docs/index.html#api/zh/constants/Materials)。其他选项有[THREE.BackSide](https://threejs.org/docs/index.html#api/zh/constants/Materials) 和 [THREE.DoubleSide](https://threejs.org/docs/index.html#api/zh/constants/Materials)。

经常用于 **设置透明时更改为双面，可以看到后面那层** 



##### 类别

- `MeshBasicMaterial`：一个以简单着色（平面或线框）方式来绘制几何体的材质。这种材质不受光照的影响。（最佳性能）

- `MeshDepthMaterial`（深度网格材质）：一种按深度绘制几何体的材质。深度基于相机远近平面。白色最近，黑色最远，可用于阴影。

- `MeshMatcapMaterial`：`MeshMatcapMaterial` 不对灯光作出反应。 它将会投射阴影到一个接受阴影的物体上(and shadow clipping works)，但不会产生自身阴影或是接受阴影。[mapcat材质大全](https://github.com/nidorx/matcaps)

- `MeshToonMaterial`：一种实现**卡通**着色的材质。

- `MeshNormalMaterial`：一种把法向量映射到RGB颜色的材质。（有点赛博朋克、宇宙色彩系列的风格）

- `MeshLambertMaterial`：一种非光泽表面的材质，没有镜面高光。该材质使用基于非物理的[Lambertian](https://en.wikipedia.org/wiki/Lambertian_reflectance)模型来计算反射率。 这可以很好地模拟一些表面（例如未经处理的木材或石材），但不能模拟具有镜面高光的光泽表面（例如涂漆木材）。

- `MeshPhongMaterial`：一种用于具有镜面高光的光泽表面的材质。该材质使用非物理的[Blinn-Phong](https://en.wikipedia.org/wiki/Blinn-Phong_shading_model)模型来计算反射率。 与`MeshLambertMaterial`中使用的Lambertian模型不同，该材质可以模拟具有镜面高光的光泽表面（例如涂漆木材）。（观感更佳）

- `MeshStandardMaterial`：一种基于物理的标准材质，使用Metallic-Roughness工作流程。

  基于物理的渲染（PBR）最近已成为许多3D应用程序的**标准**，例如[Unity](https://blogs.unity3d.com/2014/10/29/physically-based-shading-in-unity-5-a-primer/)， [Unreal](https://docs.unrealengine.com/latest/INT/Engine/Rendering/Materials/PhysicallyBased/)和 [3D Studio Max](http://area.autodesk.com/blogs/the-3ds-max-blog/what039s-new-for-rendering-in-3ds-max-2017)。

  在实践中，该材质提供了比MeshLambertMaterial 或MeshPhongMaterial **更精确和逼真的结果**，代价是计算成本更高。

- `MeshPhysicalMaterial`：（最耗费性能）

  MeshStandardMaterial的扩展，提供了更高级的基于物理的渲染属性：

  - **Clearcoat:** 有些类似于车漆，碳纤，被水打湿的表面的材质需要在面上再增加一个透明的，具有一定反光特性的面。而且这个面说不定有一定的起伏与粗糙度。Clearcoat可以在不需要重新创建一个透明的面的情况下做到类似的效果。
  - **基于物理的透明度**:.opacity属性有一些限制:在透明度比较高的时候，反射也随之减少。使用基于物理的透光性.transmission属性可以让一些很薄的透明表面，例如玻璃，变得更真实一些。
  - **高级光线反射:** 为非金属材质提供了更多更灵活的光线反射。

  物理网格材质使用了更复杂的着色器功能，所以在每个像素的渲染都要比three.js中的其他材质更费性能，大部分的特性是默认关闭的，需要手动开启，每开启一项功能在开启的时候才会更耗性能。请注意，为获得最佳效果，您在使用此材质时应始终指定environment map。

通过

```js
material.wireframe = true
```

还可以查看顶点相关信息

- `PointsMaterial`: 点材料，主要用来制造点

每个材料的具体属性，可以在threejs官网查看







参考文章

- [Three.js Fundamentals](https://threejs.org/manual/#en/fundamentals)
