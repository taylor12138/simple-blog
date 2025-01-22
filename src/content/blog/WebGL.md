---
title: 'WebGL'
author: Hello
pubDate: 2023-06-12
categories: 前端
description: 'WebGL相关'
---

## 1.WebGL简介

**WebGL**是一种[JavaScript](https://zh.wikipedia.org/wiki/JavaScript) [API](https://zh.wikipedia.org/wiki/API)，用于在不使用[外挂程式](https://zh.wikipedia.org/wiki/插件)的情况下在任何相容的[网页浏览器](https://zh.wikipedia.org/wiki/網頁瀏覽器)中呈现交互式2D和3D图形[[3\]](https://zh.wikipedia.org/zh-hans/WebGL#cite_note-3)。WebGL完全整合到浏览器的所有网页标准中，可将影像处理和效果的GPU加速使用方式当做网页Canvas的一部分。WebGL元素可以加入其他HTML元素之中并与网页或网页背景的其他部分混合[[4\]](https://zh.wikipedia.org/zh-hans/WebGL#cite_note-4)。WebGL程序由JavaScript编写的控制代码和[OpenGL Shading Language](https://zh.wikipedia.org/wiki/OpenGL_Shading_Language)（GLSL）编写的[著色器](https://zh.wikipedia.org/wiki/着色器)代码组成，该语言类似于[C](https://zh.wikipedia.org/wiki/C語言)或[C++](https://zh.wikipedia.org/wiki/C%2B%2B)，并在电脑的[图形处理器](https://zh.wikipedia.org/wiki/圖形處理器)（GPU）上执行。WebGL由[非营利](https://zh.wikipedia.org/wiki/非營利)[Khronos Group](https://zh.wikipedia.org/wiki/Khronos_Group)设计和维护[[5\]](https://zh.wikipedia.org/zh-hans/WebGL#cite_note-WebGLWebsite-5)。

兼容性：（截止2023年6月）

![](/webgl/Snipaste_2023-06-12_00-05-01.png)



一个最简单的demo

```js
const canvas = document.getElementById('mycanvas')
// 获取上下文
const gl = getWebGLContext(canvas)
// 设置清空的颜色
gl.clearColor(0, 0, 0, .1)
// 清空
gl.clear(gl.COLOR_BUFFER_BIT)
```



#### GLSL

**GLSL** - **OpenGL Shading Language** 也称作 **GLslang**，是一个以[C语言](https://zh.wikipedia.org/wiki/C語言)为基础的[高阶](https://zh.wikipedia.org/wiki/高階程式語言)[着色语言](https://zh.wikipedia.org/wiki/著色語言)。它是由 [OpenGL ARB](https://zh.wikipedia.org/w/index.php?title=OpenGL_ARB&action=edit&redlink=1) 所建立，提供开发者对[绘图管线](https://zh.wikipedia.org/wiki/繪圖管線)更多的直接控制，而无需使用汇编语言或硬件规格语言。

想要使用WebGL作图就必须要使用到着色器（shader）。着色器包括：

- **顶点着色器**（Vertex shader）用来描述顶点的特征（位置、颜色、大小等），顶点指的就是空间中的某一个点。
- **片元着色器**（Fragment shader）处理每一个片元，片元可以理解成像素点。

比如说我们想画一个三角形首先要知道三角形的三个点在哪，这就需要我们通过顶点着色器来描述点的位置，然后如果要把这个三角形画出来就需要填充颜色，三角形上每个像素点需要什么颜色就可以使用片元着色器来决定。



- vec4是glsl特有的类型，由四个浮点数组成的矢量
- 位置使用了四个分量是因为顶点位置是齐次坐标，只要知道第四个分量是1.0就可以了，其他分别表示x，y，z三个分量。
- **gl_FragColor**的vec4类型，分别对应RGBA的四个分量
- [gl.drawArrays](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/drawArrays)

```js
const canvas = document.getElementById('mycanvas');
// 获取上下文
const gl = getWebGLContext(canvas);
// 设置清空的颜色
gl.clearColor(0, 0, 0, .1);
// 清空
gl.clear(gl.COLOR_BUFFER_BIT);
// 顶点着色器
const VSHADER_SOURCE = `
  void main() {
  	// 点的位置
  	gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  	// 点的大小, gl_PointSize类型是float
	  gl_PointSize = 10.0;
	}
 `;
// 片元着色器
const FSHADER_SOURCE = `
  void main() {
  	// 设置颜色
  	gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
	}
`;
// 初始化着色器
initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)
// 绘制一个点
gl.drawArrays(gl.POINTS, 0, 1)

```

[尝试一下](https://codepen.io/WindStormrage/pen/GRxNZLJ?editors=0010)



**gl_FragCoord**是片元着色器的内置变量，gl_FragCoord的x和y元素是当前片段的窗口空间坐标。它们的起始处是窗口的左下角。通过[变量].xy就可以获得变量的前两个分量。然后下面的代码意思是当前片元x大于50就会设置color为1.0也就是白色，否则就是0.0黑色。

```js
const VSHADER_SOURCE = `
  void main() {
  	gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
  	gl_PointSize = 90.0;
	}
 `;
const FSHADER_SOURCE = `
  // 精度限定词
  precision mediump float;
  void main() {
    // 当前片元坐标
    vec2 uv = gl_FragCoord.xy;
    float color = 0.0;
    if (uv.x > 50.0)
      color = 1.0;
  	gl_FragColor = vec4(color, color, color, 1.0);
	}
`;

```

![image-20240801160713126](/webgl/uv50.png)



#### 其他demo

所以，我们一般利用JavaScript中创建字符串的方式创建GLSL字符串：用串联的方式（concatenating）(用得最多)， 用AJAX下载，用多行模板数据。

> gl_FragColor是一个片段着色器主要设置的变量、gl_Position 是一个顶点着色器主要设置的变量

```js
// 顶点着色器glsl代码
 const vsSource = `
      attribute vec4 aVertexPosition;
      attribute vec4 aVertexColor;

      varying lowp vec4 vColor;

      void main() {
          gl_Position = aVertexPosition;
          vColor = aVertexColor;
      }
  `;
// 片元着色器glsl代码
  const fsSource = `
      varying lowp vec4 vColor;
      void main() {
      		gl_FragColor =  vColor;
      }
  `;
```



或者在这个例子里，我们可以将它们放在非JavaScript类型的标签中。

```html
<script id="vertex-shader-2d" type="notjs">
//xxxxxx
</script>
```



然后，我们通过对GLSL数据的上传，然后编译成。顶点/片元  着色器。

创建着色器需要走三步：

- createShader： 创建着色器对象
- shaderSource： 提供数据源
- compileShader： 编译 -> 生成着色器

```js
// 创建着色器，gl为上下文，type指明是顶点着色器还是片段着色器，source即为源码
  function createShader(gl, type, source) {
      const shader = gl.createShader(type); // 创建着色器对象
      gl.shaderSource(shader, source); // 提供数据源
      gl.compileShader(shader); //编译 -> 生成着色器
    
      var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      if (success) {
        return shader;
      } else {
        //一些处理
      }

      return shader;
  }
```

然后把着色器链接(link)到着色程序中

```js
//初始化着色程序
export function initShaderProgram(gl, vsSource, fsSource) {
  const vshader = createShader(gl, gl.VERTEX_SHADER, vsSource);
  const fshader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const shaderProgram = gl.createProgram(); // 创建着色器程序
  gl.attachShader(shaderProgram, vshader); // 链接着色器到对应的着色器程序中
  gl.attachShader(shaderProgram, fshader);
  gl.linkProgram(shaderProgram); // 关联着色器程序到整个绘制对象中

  var success = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
  if (success) {
    return shaderProgram;
  } else {
    //一些处理
  }
}
```



#### Basic 语法

##### （1）变量类型

- 属性（Attributes）和缓冲

  缓冲是发送到GPU的一些二进制数据序列，通常情况下缓冲数据包括位置，法向量，纹理坐标，顶点颜色值等。 你可以存储任何数据。我们可以理解为和threejs 的 attribute 类似

- 全局变量（Uniforms）

  全局变量在着色程序运行前赋值，在运行过程中全局有效。

- 纹理（Textures）

  纹理是一个数据序列，可以在着色程序运行中随意读取其中的数据。 大多数情况存放的是图像数据，但是纹理仅仅是数据序列， 你也可以随意存放除了颜色数据以外的其它数据。

- 可变量（Varyings）

  可变量是一种顶点着色器给片段着色器传值的方式，依照渲染的图元是点， 线还是三角形，顶点着色器中设置的可变量会在片段着色器运行中获取不同的插值。



##### （2）基本类型

**void**空类型,即不返回任何值

**bool**布尔类型 true,false

**int**带符号的整数 signed integer

**float**带符号的浮点数 floating scalar

**vec2, vec3, vec4**n维浮点数向量 n-component floating point vector

**bvec2, bvec3, bvec4**n维布尔向量 Boolean vector

**ivec2, ivec3, ivec4**n维整数向量 signed integer vector

**mat2, mat3, mat4**2x2, 3x3, 4x4 浮点数矩阵 float matrix

**sampler2D**2D纹理 a 2D texture

**samplerCube**盒纹理 cube mapped texture



##### 精度限定符

- 精度范围

  - 浮点数范围
    - highp (-2的62次方, 2的62次方);
    - mediump (-2的14次方, 2的14次方);
    - lowp (-2,2);
  - 整数范围
    - highp (-2的16次方, 2的16次方);
    - mediump (-2的10次方, 2的10次方);
    - lowp (-2的8次方, 2的8次方);

- 指定默认精度

  - precision

    - 顶点着色器预定义，预定义即为默认值

      ```js
       precision highp float; // 浮点数高精度
       precision highp int;  //  整型高精度
       precision lowp sampler2D; 
       precision lowp samplerCube;
      ```

    - 片段着色器预定义

      ```js
       precision mediump int;  // 整型中精度
       precision lowp sampler2D; 
       precision lowp samplerCube;
      ```



#### 兼容性

```js
var gl = canvas.getContext("webgl");
if (!gl) {
  // 你不能使用WebGL！
  ...
```



## 2.绘制多个点

之前都是对一个顶点进行绘制，一般的图形，三角形，立方体或建模同学导出的模型数据都是由多个顶点构成的，如果想要**一次绘制多个点**需要怎么传递数据呢。我们可以通过**缓冲区对象**(BufferObject)一次性向着色器传入多个顶点数据

[尝试一下](https://codepen.io/WindStormrage/pen/WNzoxrE?editors=0010)

首先根据上面的例子，在时创建3个点

```js
// 绘制方式; 开始顶点; 总顶点数;
gl.drawArrays(gl.TRIANGLES, 0, 3)
```

完整代码

- getAttribLocation可以理解为getState的感觉

- vertexAttribPointer可以理解为React setState的感觉

```js
const canvas = document.getElementById('mycanvas');
// 获取上下文
const gl = getWebGLContext(canvas);
// 设置清空的颜色
gl.clearColor(0, 0, 0, .1);
// 清空
gl.clear(gl.COLOR_BUFFER_BIT);

const VSHADER_SOURCE = `
  attribute vec4 a_Position;
  void main() {
  	gl_Position = a_Position;
	}
`;
const FSHADER_SOURCE = `
  precision mediump float;
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
	}
`;

// 初始化着色器
initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE);

initVertexBuffers()

// 绘制方式; 开始顶点; 总顶点数;
gl.drawArrays(gl.TRIANGLES, 0, 3);

function initVertexBuffers() {
  const vertices = new Float32Array([
    -0.5, 0.5,
    0.5, 0.5,
    0, -0.5,
  ])
  // 创建缓冲区对象
  const vertexBuffer = gl.createBuffer()
  // 将缓冲区对象绑定到目标
  // gl.ARRAY_BUFFER  缓冲区对象中包含顶点数量
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  // 向缓冲区对象写数据
  // 第二个参数的数据写入绑定了第一个参数的缓冲区对象
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
  const a_Position = gl.getAttribLocation(gl.program, 'a_Position')
  // 将缓冲区对象分配给变量
  // 参数分别为, 位置;大小(每一个顶点的分量数,两个就是x和y);类型
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0)
  // 连接变量和缓冲区对象
  gl.enableVertexAttribArray(a_Position)
}
```

**1、创建缓冲区对象：**

可以通过createBuffer创建一个WebGL的缓冲区对象。

**2、绑定缓冲区对象**

使用bindBuffer把创建的缓冲区对象绑定给**gl.ARRAY_BUFFER**，gl.ARRAY_BUFFER表示缓冲区中包含的是顶点数据，也可以绑定gl.ELEMENT_ARRAY_BUFFER表示数据是顶点索引。说句题外话：在js中ArrayBuffer 不是某种东西的数组，而是一段二进制数据缓冲区，需要使用类型化数组操作，具体可[看看这](https://link.juejin.cn?target=https%3A%2F%2Fzh.javascript.info%2Farraybuffer-binary-arrays)。

**3、将数据写入缓冲区对象**

缓冲区处理好了后就可以向缓冲区写入数据了，通过[bufferData](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FWebGLRenderingContext%2FbufferData)，向绑定了ARRAY_BUFFER的缓冲区写入数据，gl.STATIC_DRAW表示只会想缓冲区写入一次数据。

**4、将缓冲区对象分配给attribute变量**

先获得attribute变量的位置，然后通过**vertexAttribPointer**把整个缓冲区分配给变量。参数分别为，位置、每一个顶点数据大小，数据类型， 是否进行归一化处理，后面两个参数后续再说明。

**5、开启attribute变量**

使用**enableVertexAttribArray**开启。



## 3.chatGpt实现一个alpha video播放器

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alpha Video Player</title>
    <style>
        body { margin: 0; overflow: hidden; }
        canvas { display: block; }
    </style>
</head>
<body>
    <video id="video" src="path/to/your/video.mp4" style="display:none;" crossorigin="anonymous" autoplay loop muted></video>
    <canvas id="canvas"></canvas>

    <script src="app.js"></script>
</body>
</html>

```

```js
window.onload = () => {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        console.error('WebGL not supported');
        return;
    }

    const vertexShaderSource = `
        attribute vec2 a_position;
        attribute vec2 a_texcoord;
        varying vec2 v_texcoord;
        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
            v_texcoord = a_texcoord;
        }
    `;

    const fragmentShaderSource = `
        precision mediump float;
        varying vec2 v_texcoord;
        uniform sampler2D u_texture;
        void main() {
            gl_FragColor = texture2D(u_texture, v_texcoord);
        }
    `;

    function createShader(gl, source, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
        const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
        const fragmentShader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
        return program;
    }

    function initWebGL() {
        const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
        if (!program) return;

        gl.useProgram(program);

        const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
        const texcoordAttributeLocation = gl.getAttribLocation(program, 'a_texcoord');
        const textureLocation = gl.getUniformLocation(program, 'u_texture');

        const positions = [
            -1, -1,
             1, -1,
            -1,  1,
             1,  1,
        ];

        const texcoords = [
            0, 0,
            1, 0,
            0, 1,
            1, 1,
        ];

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        const texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.enableVertexAttribArray(texcoordAttributeLocation);
        gl.vertexAttribPointer(texcoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        gl.bindVertexArray(null);

        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        function updateTexture() {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
            gl.generateMipmap(gl.TEXTURE_2D);
        }

        function render() {
            if (video.readyState >= video.HAVE_CURRENT_DATA) {
                gl.clear(gl.COLOR_BUFFER_BIT);
                updateTexture();
                gl.bindVertexArray(vao);
                gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
                gl.bindVertexArray(null);
            }
            requestAnimationFrame(render);
        }

        render();
    }

    function onResize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
    }

    window.addEventListener('resize', onResize);
    onResize();
    initWebGL();
};

```



## 4.参考

[WebGL 基础概念](https://webglfundamentals.org/webgl/lessons/zh_cn/webgl-how-it-works.html#toc)

[webgl从0到写一个简易滤镜](https://juejin.cn/post/6883725230385299469)

[WebGL 手把手入门指南（一）](https://juejin.cn/post/7173645608790523918)

[WebGL 手把手入门指南（二）绘制三角形](https://juejin.cn/post/7173963961660866591)