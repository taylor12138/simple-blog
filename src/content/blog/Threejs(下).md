---
author: Hello
pubDate: 2022-03-20
categories: 前端
title: Threejs(下)
description: '动画相关'
---

## 5.实践

#### 小实践

（场景+阴影+小立方体）

```js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//一般可以设置为75°、45°的角度等
const renderer = new THREE.WebGLRenderer();
//设置渲染器初始颜色
renderer.setClearColor(new THREE.Color(0xFFFFFF))
renderer.setSize(window.innerWidth, window.innerHeight);
// 显示渲染物体的阴影
renderer.shadowMapEnabled = true;
//显示三维坐标系
const axes = new THREE.AxisHelper(20)
//添加到场景中
scene.add(axes)

/*************************地面*************************/
//设置一个地面几何体
const planeGeometry = new THREE.PlaneGeometry(50, 50)
//给地面上色
const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xcccc
})
//结合材质
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
//物品移动位置          
plane.rotation.x = -0.5 * Math.PI
// 设置地面阴影+接受其他阴影
plane.castShadow = true;
plane.receiveShadow = true
scene.add(plane)

/***********************添加立方体*****************/
//设置一个立方体，传入长宽高
const cubeGeometry = new THREE.BoxGeometry(4, 4, 4)
//MeshBasicMaterial材质不受光照的影响，所以这里用MeshLambertMaterial
const cubeMaterial = new THREE.MeshLambertMaterial({
    color: 0x00ff
})
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
cube.position.y = 5
//对象是否渲染到阴影贴图当中
cube.castShadow = true;
scene.add(cube)

/***********创建一个聚光灯（才会有阴影效果）***********/
// 传入一个参数，为灯光颜色
const spotLight = new THREE.SpotLight(0xFFFFFF);
spotLight.position.set(130, 130, -130);
spotLight.castShadow = true;
// 添加聚光灯
scene.add(spotLight)

/***************定位相机，并且指向场景中心***********/
camera.position.x = 30;
camera.position.y = 30;
camera.position.z = 30;
camera.lookAt(scene.position)

//最后再添加到文档中
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera)
```



#### 小实践推荐网站

https://github.com/JChehe/blog/issues/44  一个换肤小椅子作为实践

https://github.com/JChehe/blog/issues/45 3d任务交互（进阶版）





## 6.控制器

这里说的控制器，不如说是相机的控制器，一般来说我们可以通过设置控制器，控制镜头，或者其他物体进行变换

这里示范一个轨道控制器(最常用)

```js
//导入控制器，轨道控制器（围绕物体查看）
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//镜头控制器
initControls() {
    // 这里我在dom中控制镜头,进行轨道移动
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
}
```

此时我们就可以转动摄像头进行360°旋转了！

（内部实际上感觉是通过mousemove之类的监听当前dom元素的事件，然后sin、cos调整camera的position，此时形成一个轨道的效果）

然后在使用轨道控制器时，还可以设置target：

- .[target](https://threejs.org/docs/index.html#examples/zh/controls/OrbitControls.target) : [Vector3](https://threejs.org/docs/index.html#api/zh/math/Vector3) 

  控制器的焦点，[.object](https://threejs.org/docs/index.html#examples/zh/controls/OrbitControls.object)的轨道围绕它运行，默认为`Vector3(0, 0, 0)`。 它可以在任何时候被手动更新，以更改控制器的焦点。

  请注意，如果该值被启用，你将必须在你的动画循环里调用.update()。

  ```js
  controls.target.set( 0, 0.5, 0 );
  ```

  



另外一个常用的就是指针锁定控制器（PointerLockControls）

该类的实现是基于[Pointer Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API)的。 对于第一人称3D游戏来说， PointerLockControls 是一个非常完美的选择。

其他控制器可以在这里[查看](https://threejs.org/docs/?q=Controls#examples/zh/controls/OrbitControls)



#### OrbitControls部分属性

> 注意：使用了控制器之后记得在每次动画render的时候controls.update();

当然也可以自己添加些控制器的属性

```js
this.controls.maxPolarAngle = Math.PI / 2;
this.controls.minPolarAngle = Math.PI / 3;
this.controls.enableDamping = true;
this.controls.enablePan = false;
this.controls.dampingFactor = 0.1;
this.controls.autoRotate = false; //
this.controls.autoRotateSpeed = 0.2; // 30
```

- `.enabled: Boolean`

  当设置为false时，将暂时关闭控制器，默认为true

- `.maxPolarAngle : Float`

  你能够垂直旋转的角度的上限，范围是0到Math.PI，其默认值为Math.PI。

- `.enableDamping : Boolean`

  将其设置为true以启用阻尼（惯性），这将给控制器带来重量感。默认值为false。你可以理解为它会让你控制器的动作更丝滑，符合物理性质
  请注意，如果该值被启用，你将必须在你的动画循环里调用.update()。

- `.enablePan : Boolean`

  启用或禁用摄像机平移，默认为true。

- `.dampingFactor : Float`

  当.enableDamping设置为true的时候，阻尼惯性有多大。
  请注意，要使得这一值生效，你必须在你的动画循环里调用.update()。

- `.autoRotate : Boolean`

  将其设为true，以自动围绕目标旋转。
  请注意，如果它被启用，你必须在你的动画循环里调用.update()。

- `.autoRotateSpeed : Float`

  当.autoRotate为true时，围绕目标旋转的速度将有多快，默认值为2.0，相当于在60fps时每旋转一周需要30秒。
  请注意，如果.autoRotate被启用，你必须在你的动画循环里调用.update()。

因为启用了以上部分属性，所以需要在animate中调用update

> 注意，如果通过改变相机位置而发生当前视角偏移，相机视角没有聚焦于对象的情况下，在动画animate中调用this.controls.update()也可以解决

```js
// 动画函数
animate() {
    this.controls.update();
    this.renderer.setAnimationLoop(this.render.bind(this));
}
```



## 7.添加模型

除了自己手动创建集合体，来给当前场景添加模型，当然也可以导入模型（glb文件、OBJ文件、GLTF文件）

glb文件：GLB文件是以图形语言传输格式（GLTF）保存的3D模型，它以二进制格式存储有关3D模型的信息，包括节点层级、摄像机、材质、动画和网格。GLB文件是[.GLTF](https://www.wenjianbaike.com/gltf.html)文件的二进制版本。

#### 文件格式（File Format）

显然 Three.js 支持很多 3D 对象文件格式，但它推荐的格式之一是 glTF(.glb)。同时 Blender 也支持导出该格式，所以毫无疑虑。

```js
// 导入模型解析器
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
```

```js
setModel(modelName) {
    // 由于添加模型是异步操作，所以可以封装一个promise给它
    return new Promise((res, rej) => {
        //public/gltf/模型文件
        const loader = new GLTFLoader().setPath("gltf/");
        loader.load(modelName, (gltf) => {
            this.model = gltf.scene.children[0];
            // 调整模型大小,或者不设置也行
          	this.model.scale.set(7, 7, 7);
            this.scene.add(this.model);
            res(modelName + "添加成功");
        });
    });
}
```

此时modal继承Object 3D，可以设置模型大小、模型位置、模型旋转角度

删除模型：

```js
this.model && this.model.removeFromParent()
```



#### 模型traverse方法

一般blender的glb模型，通过gltf.scene得到的模型（model），都会有 `traverse` 方法，方法遍历所有网格（mesh）以启用投射和接收阴影的能力。该操作需要在 `scene.add(model)` 前完成。

因此我们可以通过 ``traverse` `遍历 修改模型中的某个部位的材质、颜色、阴影

```js
//添加阴影，调整模型材质
this.model.traverse((o) => {
    if (o.isBone) {
        console.log(o.name);//输出model里面包含的骨头
    }
    if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        o.material = stacy_mtl; // Add this line
    }
});
```



#### 添加模型地板

```js
// 添加地板
setFloor() {
    // Floor
    var floorGeometry = new THREE.PlaneGeometry(5000, 5000, 1, 1);
    var floorMaterial = new THREE.MeshPhongMaterial({
        color: 0xeeeeee,
        shininess: 0,
    });

    var floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -0.5 * Math.PI;
    floor.receiveShadow = true;
    floor.position.y = -11;
    this.scene.add(floor);
}
```

- `PlaneGeometry`

  一个用于生成平面几何体的类。

  - width — 平面沿着X轴的宽度。默认值是1。
  - height — 平面沿着Y轴的高度。默认值是1。
  - widthSegments — （可选）平面的宽度分段数，默认值是1。
  - heightSegments — （可选）平面的高度分段数，默认值是1。

当然也可以设置网格

```js
var gridHelper = new THREE.GridHelper(200, 25);
gridHelper.position.y = -11;
this.scene.add(gridHelper);
```



#### 模型素材

一般前端人员很难自己去造素材，以下是一些3d模型得素材网站

https://www.mixamo.com/

使用mixamo的模型之后，可以通过以下网站，将动画导入模型：https://nilooy.github.io/character-animation-combiner/

https://sketchfab.com/   （部分付费）

还有一个关于建模很酷的网站：https://marmoset.co/



#### FBX文件

而网站上一些素材下载以后是 `.fbx` 文件格式，这时候我们使用的加载器可以为FBXLoader

```js
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
```

而它的使用方式仍然是和 `GLTFLoader` 差不多，通过 `setPath` 和 `.load`方法去使用

```js
const loader = new FBXLoader().setPath(`fbx/${this.charactorName}/`);
return new Promise((res, rej) => {
    loader.load(
        "people.fbx",
        (fbx) => {
            console.log(fbx, "fbx");
            // this.loaderAnim.remove();
            fbx.scale.setScalar(0.3);
            this.model = fbx;
            this.model.position.y = -10;
            this.model.rotation.y = Math.PI / 2;
            // 添加阴影
            this.model.traverse((o) => {
                if (o.isMesh) {
                    o.castShadow = true;
                    o.receiveShadow = true;
                }
            });
            this.scene.add(this.model);
            res();
        },
        undefined,
        function (error) {
            console.error(error);
        }
    );
});
```



## 8.灯光

缺少光，摄像机就不能看到任何有反光材质的东西



#### 光源介绍

- `SpotLight( color : Integer, intensity : Float, distance : Float, angle : Radians, penumbra : Float, decay : Float ) ` 聚光灯，一个光照范围为锥体的灯（方向光）

  - color - (可选参数) 十六进制光照颜色。 缺省值 0xffffff (白色)。
  - intensity - (可选参数) 光照强度。 缺省值 1。
  - distance - 从光源发出光的最大距离，其强度根据光源的距离线性衰减。
  - angle - 光线散射角度，最大为Math.PI/2。
  - penumbra - 聚光锥的半影衰减百分比。在0和1之间的值。默认为0。
  - decay - 沿着光照距离的衰减量。

  光线从一个点沿一个方向射出，随着光线照射的变远，光线圆锥体的尺寸也逐渐增大，和手电筒类似（产生阴影）



- `AmbientLight( color : Integer, intensity : Float )`（环境光）（不能投射阴影）

  - color - (参数可选）颜色的rgb数值。缺省值为 0xffffff。
  - intensity - (参数可选)光照的强度。缺省值为 1。

  环境光会**均匀**的照亮场景中的所有物体。特点也就是均匀照亮，让我们看的见物体，实际上我们可以将其视为“亮度”

  环境光不能用来投射阴影，因为它没有方向。



- `PointLight( color : Integer, intensity : Float, distance : Number, decay : Float )` 点光源（方向光）

  - color - (可选参数)) 十六进制光照颜色。 缺省值 0xffffff (白色)。
  - intensity - (可选参数) 光照强度。 缺省值 1。
  - distance - 这个距离表示从光源到光照强度为0的位置。 当设置为0时，光永远不会消失(距离无穷大)。缺省值 0.
  - decay - 沿着光照距离的衰退量。缺省值 2。

  从一个点向各个方向发射的光源。一个常见的例子是**模拟一个灯泡**发出的光。



- `RectAreaLight( color : Integer, intensity : Float, width : Float, height : Float )`平面光光源（方向光）

  - color - (可选参数) 十六进制数字表示的光照颜色。缺省值为 0xffffff (白色)
  - intensity - (可选参数) 光源强度／亮度 。缺省值为 1。
  - width - (可选参数) 光源宽度。缺省值为 10。
  - height - (可选参数) 光源高度。缺省值为 10。

  平面光光源从一个矩形平面上均匀地发射光线，长得像一个打光板一样，这种光源可以用来模拟像**明亮的窗户**或者条状灯光光源。常应用于家具建模

  还可以通过 `RectAreaLight.lookAt(x, y, z)` 去设置面向的方向

  > 注意：不支持阴影，只支持 MeshStandardMaterial 和 MeshPhysicalMaterial 两种材质，你必须在你的场景中加入 [RectAreaLightUniformsLib](https://threejs.org/examples/jsm/lights/RectAreaLightUniformsLib.js) ，并调用**init()**。

  ```js
  import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js
  ```

  

- `HemisphereLight`：（环境光）（不能投射阴影） 

  - skyColor - (可选参数) 天空中发出光线的颜色。 缺省值 0xffffff。
  - groundColor - (可选参数) 地面发出光线的颜色。 缺省值 0xffffff。
  - intensity - (可选参数) 光照强度。 缺省值 1。

  半球光，光源直接放置于场景之上，光照颜色从天空光线颜色渐变到地面光线颜色。有点像AmbientLight的升级版，可以兼顾上方和下方的环境光

  为室外场景创造更加自然的光照

  ```js
  var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
  hemiLight.position.set(0, 50, 0);
  // Add hemisphere light to scene
  this.scene.add(hemiLight);
  ```




- `DirectionalLight`：定向光，距离很远的光，他的所有光都是平行的（方向光，模拟太阳光， 有target）

  - color - (可选参数) 16进制表示光的颜色。 缺省值为 0xffffff (白色)。
  - intensity - (可选参数) 光照的强度。缺省值为1。

  平行光是沿着特定方向发射的光。这种光的表现像是无限远,从它发出的光线都是平行的。常常用平行光来模拟太阳光 的效果; 太阳足够远，因此我们可以认为太阳的位置是无限远，所以我们认为从太阳发出的光线也都是平行的。

  ```js
  var dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
  dirLight.position.set(-8, 12, 8);
  dirLight.castShadow = true;
  // Add directional Light to this.scene
  this.scene.add(dirLight);
  ```

  但是即使是模拟太阳光，但是他也有光照范围（可以使用  `CameraHelper` 查看阴影的覆盖范围，记住一定要添加完阴影才有效 ）

  对于有方向的光，我们可以通过以下方法来指定光照目标

  ```js
  dirLight.target.position.set(-5, 0, 0);
  //平行光的方向是从它的位置到目标位置。默认的目标位置为原点 (0,0,0)。
  //注意: 对于目标的位置，要将其更改为除缺省值之外的任何位置,它必须被添加到 scene 场景中去。
  this.scene.add(light.target);
  ```

  还可以用DirectionalLightHelper辅助查看光线

  DirectionalLightHelper： 用于模拟场景中平行光 [DirectionalLight](https://threejs.org/docs/index.html#api/zh/lights/DirectionalLight) 的辅助对象. 其中包含了表示光位置的平面和表示光方向的线段.

  代码示例

  ```js
  const light = new THREE.DirectionalLight( 0xFFFFFF ); 
  const helper = new THREE.DirectionalLightHelper( light, 5 ); 
  scene.add( helper );
  ```

这里来一个小例子

让你自己尝试下～：https://codesandbox.io/s/threejs-light-xdehpp?file=/src/script.js



关于光照的思路：

关于光照，我们尚未提及的是 [`WebGLRenderer`](https://threejs.org/docs/#api/zh/renderers/WebGLRenderer) 中有一个设置项 `physicallyCorrectLights`。这个设置会影响（随着离光源的距离增加）光照如何减弱。这个设置会影响点光源（[`PointLight`](https://threejs.org/docs/#api/zh/lights/PointLight)）和聚光灯（[`SpotLight`](https://threejs.org/docs/#api/zh/lights/SpotLight)），矩形区域光（[`RectAreaLight`](https://threejs.org/docs/#api/zh/lights/RectAreaLight)）会自动应用这个特性。

在设置光照时，基本思路是不要设置 `distance` 来表现光照的衰减，也不要设置 `intensity`。而是设置光照的 [`power`](https://threejs.org/docs/#api/zh/lights/PointLight#power) 属性，以流明为单位，three.js 会进行物理计算，从而表现出接近真实的光照效果。在这种情况下 three.js 参与计算的长度单位是米，一个 60瓦 的灯泡大概是 800 流明强度。并且光源有一个 [`decay`](https://threejs.org/docs/#api/zh/lights/PointLight#decay) 属性，为了模拟真实效果，应该被设置为 `2`。

更多详情可以在[这里](https://threejs.org/manual/#zh/lights)找到



> 注意，我们除了可以给场景scene添加灯光，还可以给摄像机camera添加灯光，比如常见的点光源：pointLight



#### 光源辅助线

```js
//辅助函数
//光源辅助工具
const lightHelper = new THREE.DirectionalLightHelper(dirLight);
//可以看到当前相机可视范围，这里查看的事阴影的覆盖范围
const shadowCameraHelper = new THREE.CameraHelper(dirLight.shadow.camera);
this.scene.add(lightHelper);
this.scene.add(shadowCameraHelper);
```

根据以上方法，我们也可以在使用不同的光线时，从库中引用不同的辅助线 `xxxLightHelper`

生产环境下我们可以隐藏掉

```js
shadowCameraHelper.visible = false
```



#### 镜头光晕（Lensflare）

创建一个模拟追踪着灯光的镜头光晕。

`LensflareElement( texture : Texture, size : Float, distance : Float, color : Color )`

- texture - 用于光晕的THREE.Texture（贴图）
- size - （可选）光晕尺寸（单位为像素）
- distance - （可选）和光源的距离值在0到1之间（值为0时在光源的位置）
- color - （可选）光晕的（Color）颜色

代码示例

```js
const light = new THREE.PointLight( 0xffffff, 1.5, 2000 ); 
const textureLoader = new THREE.TextureLoader(); 
const textureFlare0 = textureLoader.load( "textures/lensflare/lensflare0.png" ); //阳光贴图
const textureFlare1 = textureLoader.load( "textures/lensflare/lensflare2.png" ); //阳光贴图
const textureFlare2 = textureLoader.load( "textures/lensflare/lensflare3.png" ); //阳光贴图
const lensflare = new Lensflare(); 
lensflare.addElement( new LensflareElement( textureFlare0, 512, 0 ) ); 
lensflare.addElement( new LensflareElement( textureFlare1, 512, 0 ) ); 
lensflare.addElement( new LensflareElement( textureFlare2, 60, 0.6 ) ); 
light.add( lensflare );
```



#### 光的性能

光源的数量，当然也是影响性能的一部分，越少越好，最小的性能消耗为2个环境光（AmbientLight、HemisphereLight ），最耗费性能的是SpotLight、RectAreaLight，光的性能和阴影的制造 + 渲染次数是捆绑在一起的



## 9.阴影

threejs在渲染的时候，如果需要渲染阴影，会帮我们使用 `MeshDepthMaterial` 的材质替换所有材质（material），并且生成 + 存储一种名为 shadow maps 的阴影贴图（texture），改shadow maps 记录了产生阴影的物体对应的二维阴影图像

#### 阴影的性能

首先关于阴影的性能问题：

Three.js 默认使用*shadow maps（阴影贴图）*，阴影贴图的工作方式就是具有投射阴影的光能对所有能被投射阴影的物体从光源渲染阴影，所以你可以理解为阴影这一层，threejs已经帮我们做好了，灯光数量，决定阴影的渲染。所以阴影这部分完全没有啥操作，难的在于阴影的优化部分

那么说明：

如果你有 20 个物体对象、5 个灯光，并且所有的物体都能被投射阴影，所有的光都能投射阴影，那么这个场景这个场景将会绘制 6 次。第一个灯光将会为所有的物体投影阴影，绘制场景。然后是第二个灯光绘制场景，然后是第三个灯光，以此类推。最后一次（即第六次）将通过前五个灯光渲染的数据，渲染出最终的实际场景。

解决方法：

1. 只使用一个光源，从而减少阴影数量
2. 使用光照贴图或者环境光贴图，预先计算离线照明的效果。不过这将导致静态光照（引用不会动）
3. 使用假的阴影
   -  [Animal Crossing Pocket Camp](https://www.google.com/search?tbm=isch&q=animal+crossing+pocket+camp+screenshots)，在其中你可以看到每个字符都有一个简单的原型阴影。这种方式很有效，也很方便。[Monument Valley 纪念碑谷](https://www.google.com/search?q=monument+valley+screenshots&tbm=isch)看起来似乎也使用这种阴影。

常规一点的优化方法：

1. 优化性能：减小阴影贴图大小（mapsize）
2. 优化质量：减少阴影覆盖范围（光照投射范围）（shadowmap范围内被投射的物体体积大了（相对），能得到更高质量的阴影）
3. 优化性能：尝试设置低质量阴影贴图



[尝试一下](https://codesandbox.io/s/threejs-shadow-kwcsn8?file=/src/script.js:2886-2893)



#### 添加模型阴影

第一步，在初始化renderer的时候先设置shadowMap，让渲染器开启阴影

```js
this.renderer.shadowMap.enabled = true;
```

- `.shadowMap : WebGLShadowMap`

  如果使用，它包含阴影贴图的引用。
  \- enabled: 如果设置开启，允许在场景中使用阴影贴图。默认是 **false**。



第二步，给灯光添加阴影投射支持：

- `xxx.castShadow = true`

  是否投射阴影



第三步，添加地板时需要：

- `floor.receiveShadow = true;`

  是否能接受阴影



对于场景中的每一个需要阴影的物体，都需要设置 `castShadow` 、`receiveShadow`



在 loader 函数内，我们能遍历 3D 模型（的组成元素）。因此，跳到 loader 函数，在 `theModel = gltf.scene;` 下添加这个操作。为 3D 模型的每一个元素（椅腿、坐垫等）启用投射和接收阴影的选项。该遍历方法在后续会被再次使用。

```js
const loader = new GLTFLoader();
loader.load(
    modelName,
    (gltf) => {
        this.model = gltf.scene;
        // 添加阴影
        this.model.traverse((o) => {
            if (o.isMesh) {
                o.castShadow = true;
                o.receiveShadow = true;
            }
        });
        this.scene.add(this.model);
    },
    undefined,
    function (error) {
        console.error(error);
    }
);
```



#### 设置阴影

我们给定向光设置阴影，此时通过打印shadow属性可以看到她的shadowmap尺寸

```js
 //方向光
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.castShadow = true;
  directionalLight.position.set(10, 10, 5);
  console.log(directionalLight.shadow);
```

```
mapSize: Vector2
x: 512
y: 512
isVector2: true
```



因此我们还可以设置阴影大小怎么样：

`xxlight.shadow.mapSize = new THREE.Vector2(1024, 1024);`

阴影尺寸越大，性能消耗越大，但是阴影质量越好

下面的图片分别对应 512、1024、128

![](/simple-blog/three/mapsize512.png)

![](/simple-blog/three/mapsize1024.png)

![](/simple-blog/three/mapsize128.png)



`DirectionalLight`小实践

```js
let d = 8.25;
let dirLight = new THREE.DirectionalLight(0xffffff, 0.54);
dirLight.position.set(-8, 12, 8);
dirLight.castShadow = true;
//二维向量（Vector2）
//表示2D vector（二维向量）的类。 一个二维向量是一对有顺序的数字（标记为x和y），可用来表示很多事物，例如：
dirLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
dirLight.shadow.camera.near = 0.1;
dirLight.shadow.camera.far = 1500;
dirLight.shadow.camera.left = d * -1;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = d * -1;
```

这里根据作者的解释：我凭借个人感觉将定向光放置在一个适当的位置。随后，启用其投射阴影的能力并设置了阴影的分辨率。阴影的其余设置则与光的视场相关（译者注：定向光是使用正交摄像机计算阴影，参考 [DirectionalLightShadow](https://threejs.org/docs/index.html#api/en/lights/shadows/DirectionalLightShadow)），这概念对我来说也有些模糊，但只要清晰知道：可通过调整变量 `d` 以确保阴影**不被裁剪。**



#### 减少阴影覆盖范围

`xxLight.shadow.camera` 是一个正交相机，可以通过调控修改改灯光下阴影的覆盖范围

通过CameraHelper，我们可以看到当前光源内阴影的覆盖范围，我们可以根据需求稍微调整，提高性能

```js
//这是一个正交相机
//减少覆盖距离
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;
//减少覆盖大小,可以参考正交相机部分的参数
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = -2;
directionalLight.shadow.camera.right = -2;
```

刚好到达范围内是最好的

![](/simple-blog/three/shadow.png)

并且还可以通过radius控制阴影虚化

.[radius](https://threejs.org/docs/index.html#api/zh/lights/shadows/LightShadow.radius) : Float

将此值设置为大于1的值将模糊阴影的边缘。
较高的值会在阴影中产生不必要的条带效果 - 更大的[mapSize](https://threejs.org/docs/index.html#api/zh/lights/shadows/LightShadow.mapSize)将允许在这些效果变得可见之前使用更高的值。

```js
directionalLight.shadow.radius = 10;
```

[尝试一下吧](https://codesandbox.io/s/threejs-shadow-test-73wgrd?file=/src/script.js:1068-1153)～



#### 阴影类型

- THREE.BasicShadowMap：低质量高性能阴影贴图
- THREE.PCFShadowMap：贴图边缘平滑，性能消耗不高，threejs默认使用的shadow map
- THREE.PCFSoftShadowMap：性能消耗高于THREE.PCFShadowMap，更加平滑，表现能力更好,radius（阴影虚化）无法生效
- THREE.VSMShadowMap

```js
renderer.shadowMap.type = THREE.PCFShadowMap
```

我们通过light.shadow.type 进行控制





## 10.动画

动画方面的制作可以参考threejs官网的AnimationAction系列，不过一般都要传入由blender制作的模型动画会比较方便

以下实例使用的是AnimationMixer，一个动画混合器，它是用于场景中特定对象的动画的播放器。当场景中的多个对象独立动画时，每个对象都可以使用同一个动画混合器。（传入blender制作好的动画）

```js
 setModel(modelName) {
    // 由于添加模型是异步操作，所以可以封装一个promise给它
    return new Promise((res, rej) => {
      const loader = new GLTFLoader().setPath("gltf/");
      loader.load(modelName, (gltf) => {
        console.log(gltf);
        this.model = gltf.scene.children[0];
        // 把里面的scene都传进去
        this.scene.add(gltf.scene);
        //摄像头都改为模型应用的摄像头
        this.camera = gltf.cameras[0];
        //调用动画,我们可以把AnimationMixer当作一个设置好关键帧的播放器
        //这里主要还是摄像头在动,children[1]里面放一个摄像机camera
        this.mixer = new THREE.AnimationMixer(gltf.scene.children[1]);
        this.animateAction = this.mixer.clipAction(gltf.animations[0]);
        // 设置动画播放时长
        this.animateAction.setDuration(20).setLoop(THREE.LoopOnce);
        // 播放完毕停止
        this.animateAction.clampWhenFinished = true;
        this.animateAction.play();
        //设置模型内部灯光
        const spotlight1 = gltf.scene.children[2].children[0];
        spotlight1.intensity = 1;
        const spotlight2 = gltf.scene.children[3].children[0];
        spotlight2.intensity = 1;
        const spotlight3 = gltf.scene.children[4].children[0];
        spotlight3.intensity = 1;
        console.log(gltf, "again");
        res(modelName + "添加成功");
      });
    });
```

- `AnimationMixer( rootObject : Object3D )`：动画混合器是用于场景中特定对象的动画的播放器，参数为动画的对象
- `AnimationClip`：动画剪辑（AnimationClip）是一个可重用的关键帧轨道集，可以理解为它就是动画。可以从模型中获取的，案例中为 `gltf.animations[0]`
- `AnimationActions` ，可以理解为使用动画的工具，用来调度存储在AnimationClips中的动画。案例中为 `this.animateAction`
- `clipAction`：一个方法， =》 ` AnimationActions = mixer.clipAction(AnimationClip);`



#### AnimationActions 

对于存储动画的AnimationActions对象，有以下几个常用的方法

- `.play () : this`

  让混合器激活动作。此方法可链式调用。

- `.enabled : Boolean`

  **enabled** 值设为**false**会禁用动作, 也就是无效.默认值是**true**

- `.setLoop ( loopMode : Number, repetitions : Number ) : this`

  设置循环（loop mode）及循环重复次数（repetitions）。改方法可被链式调用。

  我们通常用来设置动画播放次数

- `.reset () : this`

  重置动作。此方法可链式调用。

- `.crossFadeTo ( fadeInAction : AnimationAction, durationInSeconds : Number, warpBoolean : Boolean ) : this`

  在传入的时间段内, 让此动作淡出（fade out），同时让另一个动作淡入。此方法可链式调用。

  常用于动画中切换动作

  如果warpBoolean值是true, 额外的 warping (时间比例的渐变)将会被应用。



#### 添加动态效果

然后再添加threejs提供的计时器

```js
this.clock = new THREE.Clock(); //three提供的计时器
```

该对象用于跟踪时间。如果[performance.now](https://developer.mozilla.org/en-US/docs/Web/API/Performance/now)可用，则 Clock 对象通过该方法实现，否则回落到使用略欠精准的[Date.now](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date/now)来实现。

在每一次render获取每一帧的时间差

但是一般不建议使用getDelta，because 你可能会获取到去乖的值，makes no sense

```js
render() {
    const delta = this.clock.getDelta();
    this.mixer && this.mixer.update(delta);
    this.renderer.render(this.scene, this.camera);
}
```



当然也可以把mixer作为数组存储，把每一次动画存储到mixer中

```js
loader.load("dancing.fbx", (anim) => {
    console.log(anim, "anim");
    const m = new THREE.AnimationMixer(this.model);
    this.mixer.push(m);
    this.animateAction = m.clipAction(anim.animations[0]);
    this.animateAction.play();
});
```

然后再渲染函数中逐个调用

```js
// 渲染函数
render() {
    const delta = this.clock.getDelta();
    if (this.mixer.length > 0) {
        this.mixer.map((m) => m.update(delta));
    }
    this.renderer.render(this.scene, this.camera);
}
```

> 注意：这种方式可能导致得到的animation仍遗留上一个动作的某个肢体动作，导致动画动作“不规范”



## 11.对于动画中的事件监听

- 窗口大小调整：`resize`

  对于窗口大小调整，可以使用

  ```js
  window.addEventListener("resize", this.windowResize.bind(this));
  ```

  ```js
  windowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight; //其实也就是调整camera第二个参数
      // 更新一下摄像机转换3d投影的矩阵
      this.camera.updateProjectionMatrix();
    	//更新渲染器渲染大小
      this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  ```

- 鼠标移动：`mousemove`

  对于鼠标移动可以使用

  ```js
  window.addEventListener("mousemove", this.windowMouseMove.bind(this));
  ```

- 鼠标点击、桌面触屏：`click`、`touchend`

  对于鼠标点击，我们并不能单纯为标签添加点击事件，毕竟不是dom的一部分，这里采用射线实现

  即向一定方向发射激光束，然后返回被击中的对象集合。在该案例中，激光线是从摄像机射向光标。

  - `Raycaster()`

    这个类用于进行[raycasting](https://en.wikipedia.org/wiki/Ray_casting)（光线投射）。 光线投射用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）。

    ```js
    // 通过摄像机和鼠标位置更新射线
    raycaster.setFromCamera( pointer, camera );
    // 计算物体和射线的焦点
    const intersects = raycaster.intersectObjects( scene.children );
    ```

    

  ```js
  const raycaster = new THREE.Raycaster();
  const currentlyAnimating = false;
  window.addEventListener('click', e => raycast(e));
  window.addEventListener('touchend', e => raycast(e, true));
  
  function raycast(e, touch = false) {
      var mouse = {};
      if (touch) {
          mouse.x = 2 * (e.changedTouches[0].clientX / window.innerWidth) - 1;
          mouse.y = 1 - 2 * (e.changedTouches[0].clientY / window.innerHeight);
      } else {
          mouse.x = 2 * (e.clientX / window.innerWidth) - 1;
          mouse.y = 1 - 2 * (e.clientY / window.innerHeight);
      }
      // update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);
  
      // calculate objects intersecting the picking ray
      var intersects = raycaster.intersectObjects(scene.children, true);
  
      if (intersects[0]) {
          var object = intersects[0].object;
          if (object.name === 'stacy') {
              //判断 currentlyAnimating 是否为 false，即当有动画正在执行，那么就不会执行新动画。
              if (!currentlyAnimating) {
                  currentlyAnimating = true;
                  playOnClick();
              }
          }
      }
  }
  ```

  

## 12.精灵和粒子点云

#### 精灵材质

平时我们见到的很多下雨、下雪、烟雾效果，都是采用粒子系统功能

使用的材料：

点精灵材质(`SpriteMaterial`)，一种使用Sprite的材质。

```js
//创建精灵材质
createSprites() {
    for (let x = -30; x < 30; x++) {
        for (let y = -20; y < 20; y++) {
            for (let z = 0; z < 5; z++) {
                const material = new THREE.SpriteMaterial({
                    opacity: 1.0,
                    color: Math.random() * 0xffffff,
                });
                const sprite = new THREE.Sprite(material);
                sprite.position.set(x * 4, y * 4, z * 100);
                this.scene.add(sprite);
            }
        }
    }
}
```



#### 点云效果

在我们创建的精灵数量不多的情况下，精灵对象也可以实现复杂的点云效果，但是会卡到爆炸，这时候的渲染效率是我们所不能接受的

threejs给我们提供了更好的点云方案

```js
// 创建点云
  createPoints() {
    //创建一个缓冲几何体
    const geom = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({
      size: 2, //粒子大小
      vertexColors: true, //设置顶点颜色开关是否采用缓冲几何体
      color: 0xffff,
    });
    const positions = [];
    const colors = [];
    for (let x = -30; x < 30; x++) {
      for (let y = -20; y < 20; y++) {
        for (let z = -30; z < 30; z++) {
          positions.push(x * 4, y * 4, z * 100);
          const clr = new THREE.Color(Math.random() * 0xffffff);
          colors.push(clr.r, clr.g, clr.b);
        }
      }
    }
    geom.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    const cloud = new THREE.Points(geom, material);
    this.scene.add(cloud);
  }
```

不过感觉主要还是缓冲几何体解决了卡顿问题

- `BufferGeometry`：缓存几何体，是面片、线或点几何体的有效表述。包括顶点位置，面片索引、法相量、颜色值、UV 坐标和自定义缓存属性值。使用 BufferGeometry 可以有效减少向 GPU 传输上述数据所需的开销。

  读取或编辑 BufferGeometry 中的数据，见 BufferAttribute 文档。

- 点材质(`PointsMaterial`)

  Points使用的默认材质。



#### 下雨效果小实践

```js
// 创建雨滴
createRain() {
    //创建一个缓冲几何体
    const geom = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({
        size: 4, //粒子大小
        vertexColors: true, //采用每个粒子的颜色
        transparent: true,
        depthWrite: false, //让黑色背景透明显示
        opacity: 0.6,
        map: this.getTexture("img/rain2.png"),
        blending: THREE.AdditiveBlending, //选择附加的混合模式，模式含义为在画新像素时颜色会被添加到新像素上
        sizeAttenuation: true, //雨滴粒子远小近大
        color: new THREE.Color(0xffffff),
    });
    const positions = [];
    const colors = [];
    const velocities = []; //每个粒子偏移量
    const range = 500;
    for (let i = 0; i < 15000; i++) {
        positions.push(
            Math.random() * range - range / 2,
            Math.random() * range - range / 2,
            Math.random() * range - range / 2
        );
        velocities.push((Math.random() - 0.5) / 3, 0.1 + Math.random() / 5);
        const color = new THREE.Color(0x00eeff);
        const asHSL = {};
        color.getHSL(asHSL);
        // 颜色采用HSL色彩模式，我们对亮度采用随机值的设置
        color.setHSL(asHSL.h, asHSL.s, asHSL.l * Math.random());
        colors.push(color.r, color.g, color.b);
    }
    geom.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
    );
    geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    // 自定义属性，制造动画下雨效果
    geom.setAttribute(
        "velocity",
        new THREE.Float32BufferAttribute(velocities, 2)
    );
    this.cloud = new THREE.Points(geom, material);
    console.log(this.cloud);
    this.scene.add(this.cloud);
}
//下雨效果动画
raining() {
    const pos_BufferAttr = this.cloud.geometry.getAttribute("position");
    const vel_BufferAttr = this.cloud.geometry.getAttribute("velocity");
    for (let i = 0; i < pos_BufferAttr.count; i++) {
        let pos_x = pos_BufferAttr.getX(i);
        let pos_y = pos_BufferAttr.getY(i);
        let vel_x = vel_BufferAttr.getX(i);
        let vel_y = vel_BufferAttr.getY(i);
        pos_x = pos_x - vel_x;
        pos_y = pos_y - vel_y;
        // 边界判断
        if (pos_x <= -20 || pos_x >= 20) vel_x = vel_x * -1;
        if (pos_y <= 0) pos_y = 60;
        pos_BufferAttr.setX(i, pos_x);
        pos_BufferAttr.setY(i, pos_y);
        vel_BufferAttr.setX(i, vel_x);
    }
    //关键代码:把两个缓冲属性的needUpdate属性设置为真,驱使threejs对刚才修改的数值进行更新
    pos_BufferAttr.needsUpdate = true;
    vel_BufferAttr.needsUpdate = true;
}
```

然后再每一次render中调用下雨函数即可

```js
render() {
    if (this.cloud !== null) {
        this.raining();
    }
    this.renderer.render(this.scene, this.camera);
}
```





## 13.其他细节

#### rotation

一个cube

![](/simple-blog/three/rotate1.png)

```js
//第一步
cube.rotation.y = Math.PI / 2;
```

![](/simple-blog/three/rotate3.png)

![](/simple-blog/three/rotate2.png)

```js
//第二步
cube.rotation.x = Math.PI / 2;
```

![](/simple-blog/three/rotate4.png)

此时的旋转时直接指根据当前标准的坐标轴旋转

如果想要根据物体自身的x、y、z轴（会根据旋转角度变化的坐标）来转，需要在旋转前增加 `reorder`

应用场景：第一人称视角的应用

```js
//回到第二步
cube.rotation.reorder("YXZ");
cube.rotation.y = Math.PI / 2;
cube.rotation.x = Math.PI / 2;
```

![](/simple-blog/three/rotate5.png)



#### gsap动画库

gsap库除了能运用于正常的dom和对象，还能在three中使用

```js
import gsap from 'gsap'
gsap.to(mesh.position, {duration: 1, x: 2})
gsap.to(mesh.position, {duration: 2, y: 2})
```



#### 其他优化细节

- [响应式渲染](https://threejs.org/manual/#zh/rendering-on-demand)（主要是通过取消requestAnimationFrame减少性能消耗）

  其内容主要是通过取消requestAnimationFrame减少性能消耗，对于一些整体动画要求不高的3d场景，我们此时可能之需要转动镜头观察可以，可以避免使用requestAnimationFrame，可以通过

  ```js
  controls.addEventListener('change', render);
  ```

  来实时监听相机的变动，然后再render

  并且启用阻尼 （`enableDamping`）,让翻转更加丝滑

- [`OffscreenCanvas`](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas) 是一个相对较新的浏览器功能，目前仅在Chrome可用，但显然未来会适用到别的浏览器上。 `OffscreenCanvas` 允许使用Web Worker去渲染画布，这是一种减轻繁重复杂工作的方法，比如把渲染一个复杂的3D场景交给一个Web Worker，避免减慢浏览器的响应速度。它也意味着数据在Worker中加载和解析，因此可能会减少页面加载时的卡顿。

- 实例化网格`InstancedMesh`

  一种具有实例化渲染支持的特殊版本的[Mesh](https://threejs.org/docs/index.html#api/zh/objects/Mesh)。你可以使用 InstancedMesh 来渲染大量具有相同几何体与材质、但具有不同世界变换的物体。 使用 InstancedMesh 将帮助你减少 draw call 的数量，从而提升你应用程序的整体渲染性能。

  一般用于大量重复的mesh

  ```js
  const total = 1000000;
  let insGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
  //创建具有多个实例的实例化几何体
  let instanceMeshs = new THREE.InstancedMesh(insGeometry, material, total);
  //修改位置
  let transform = new THREE.Object3D();
  for (let index = 0; i < total; i++) {
      transform.position.set(Math.random() * 2000, Math.random() * 2000, Math.random() * 2000);
      transform.scale.set(Math.random() * 50 + 50, Math.random() * 50 + 50, Math.random() * 50 + 50);
      transform.updateMatrix();
      //修改实例化几何体中的单个实例的矩阵以改变大小、方向、位置等
      instanceMeshs.setMatrixAt(i, transform.matrix);
  }
  ```

  

  ##### 内存清理

Three.js应用经常使用大量的内存，大多数的three.js应用在初始化的时候加载资源，并且一直使用这些资源直到页面关闭。但是，如果你想随时间的变动加载和改变资源怎么办呢？

不像大多数的JavaScript库，three.js不能自动的清除这些资源。 如果你切换页面，浏览器会清除这些资源，需要我们自己来管理这些东西。

```js
const boxGeometry = new THREE.BoxGeometry(...);
const boxTexture = textureLoader.load(...);
const boxMaterial = new THREE.MeshPhongMaterial({map: texture});
```

然后在你处理完了它们之后，进行内存的释放

```js
boxGeometry.dispose();
boxTexture.dispose();
boxMaterial.dispose();
```

如果你嫌麻烦的话，可以造一个类，来自动管理资源清除



#### 一些容易出现的bug

[防止canvas被清空](https://threejs.org/manual/#zh/tips#preservedrawingbuffer)

[canvas截图](https://threejs.org/manual/#zh/tips#screenshot)

[获取键盘输入](https://threejs.org/manual/#zh/tips#tabindex)

[透明化canvas](https://threejs.org/manual/#zh/tips#transparent-canvas)

[透明立方体后半部分消失问题](https://threejs.org/manual/#zh/transparency)



参考文章

- [Three.js Fundamentals](https://threejs.org/manual/#en/fundamentals)
- 学习视频：[Three.js Journey](https://threejs-journey.xyz/)
