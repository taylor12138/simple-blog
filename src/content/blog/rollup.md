---
author: Hello
categories: 前端
title: rollup
description: '框架相关'
---
## 开始

参见 [rollup-starter-lib](https://github.com/rollup/rollup-starter-lib) 和 [rollup-starter-app](https://github.com/rollup/rollup-starter-app)，以查看使用 Rollup 的示例库和应用程序项目。

（注意，该项目都是用rollup1.x版本，不推荐直接使用）

以下案例为rollup搭建react组件，如果要搭建lib，则用官网示例即可



#### 配置TS

安装依赖

```shell
npm i @rollup/plugin-typescript typescript tslib -D
```

根目录配置tsconfig.json

```json
{
    "compilerOptions": {
      "baseUrl": "./",
      "outDir": "dist",
      "target": "ESNext",
      "module": "ESNext",
      "jsx": "preserve",
      "moduleResolution": "Node",
      "useDefineForClassFields": true,
      "allowSyntheticDefaultImports": true,
      "strict": true,
      "sourceMap": false,
      "resolveJsonModule": true,
      "isolatedModules": true,
      "esModuleInterop": true,
      "skipLibCheck": true,
      "declaration": true,
      "lib": [
        "ESNext",
        "DOM"
      ],
      "paths": {
        "@/*": [
          "src/*"
        ]
      }
    },
    "include": [
      "src/**/*.ts",
      "src/**/*.d.ts",
      "src/**/*.tsx"
    ]
  }
```



#### 将对等依赖排除

假设你正在构建一个具有对等依赖项（peer dependency）的库，例如 React 或 Lodash。如果按照上面描述的设置 externals，你的 rollup 将会打包 *所有* 导入的依赖项：

js

```
import answer from 'the-answer';
import _ from 'lodash';
```

你可以精细调整哪些导入将被打包，哪些将被视为外部导入。在此示例中，我们将把 `lodash` 视为外部导入，但不将 `the-answer` 视为外部导入。

以下是配置文件：

js

```js
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';

export default {
	input: 'src/main.js',
	output: {
		file: 'bundle.js',
		format: 'cjs'
	},
	plugins: [
		resolve({
			// 将自定义选项传递给解析插件
			moduleDirectories: ['node_modules']
		})
	],
	// 指出哪些模块应该视为外部模块
	external: ['lodash']
};
```

现在，`lodash` 将被视为外部导入，不会与你的库捆绑在一起。



#### babel配置

我们将 `.babelrc.json` 文件放在 `src` 目录中，而不是项目根目录中，如果以后需要，这可以让我们为诸如测试之类的事物拥有不同的 `.babelrc.json` 文件 - 有关项目范围和文件相对配置的更多信息，请参见 [Babel 文档](https://babeljs.io/docs/en/config-files#project-wide-configuration)。

安装依赖

```shell
npm i -D @rollup/plugin-babel @rollup/plugin-node-resolve @babel/core @babel/preset-env @babel/preset-react
```

babel配置文件进行预设配置

```json
{
	"presets": [
        ["@babel/env"],
        ["@babel/preset-react"]
    ]
}
```



#### less配置

```shell
npm i rollup-plugin-postcss less -D
```



#### 配置rollup.config

```js
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import postcss from 'rollup-plugin-postcss'
import babel from '@rollup/plugin-babel';

export default [
	{
		input: 'src/main.tsx',
		output: [
            {
              dir: 'dist',
              format: 'es',
              entryFileNames: () => `[name].mjs`
            },
            {
              dir: 'dist',
              format: 'cjs',
              exports: 'named',
              entryFileNames: () => `[name].cjs`
            }
        ],
		plugins: [
            typescript({
                tsconfig: './tsconfig.json'
            }),
            postcss(),
            babel({
                babelHelpers: 'bundled', 
                extensions: ['.ts', '.tsx'] 
            }),
			resolve(),
			commonjs(),
		],
        external: ['react']
	}
];
```

- `output.dir`

  该选项用于指定所有生成的 chunk 被放置在哪个目录中。如果生成一个以上的 chunk，那么这个选项是必需的。否则，可以使用 `file` 选项来代替。

- `output.file`

  该选项用于指定要写入的文件。如果适用的话，也可以用于生成 sourcemap。只有在生成的 chunk 不超过一个的情况下才可以使用。

- `output.format`

  | 类型 | `string`                          |
  | :--: | --------------------------------- |
  | CLI  | `-f`/`--format <formatspecifier>` |
  | 默认 | `"es"`                            |

  该选项用于指定生成的 bundle 的格式。满足以下其中之一：

  - `amd` – 异步模块加载，适用于 RequireJS 等模块加载器

  - `cjs` – CommonJS，适用于 Node 环境和其他打包工具（别名：`commonjs`）

  - `es` – 将 bundle 保留为 ES 模块文件，适用于其他打包工具，以及支持 `<script type=module>` 标签的浏览器。（别名：`esm`，`module`）

  - `iife` – 自执行函数，适用于 `<script>` 标签（如果你想为你的应用程序创建 bundle，那么你可能会使用它）。`iife` 表示“自执行 [函数表达式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function)”

  - `umd` – 通用模块定义规范，同时支持 `amd`，`cjs` 和 `iife`

  - `system` – SystemJS 模块加载器的原生格式（别名：`systemjs`）

    

- `output.name`

  | 类型： | `string`                     |
  | :----- | ---------------------------- |
  | CLI：  | `-n`/`--name <variableName>` |

  **对于输出格式为 `iife` / `umd` 的 bundle 来说**

  若想要使用全局变量名来表示你的 bundle 时，该选项是必要的。同一页面上的其他脚本可以使用这个变量名来访问你的 bundle 输出。

  ```js
  // rollup.config.js
  export default {
    ...,
    output: {
      file: 'bundle.js',
      format: 'iife',
      name: 'MyBundle'
    }
  };
  ```



- `output.exports`

  | 类型： | `"auto" | "default"| "named"| "none"` |
  | :----- | ------------------------------------- |
  | CLI：  | `--exports <exportMode>`              |
  | 默认： | `'auto'`                              |

  该选项用于指定导出模式。默认是 `auto`，指根据 `input` 模块导出推测你的意图：

  - `default` – 适用于只使用 `export default ...` 的情况；请注意，此操作可能会导致生成想要在与 ESM 输出可互换的 CommonJS 输出时出现问题，具体可见下文
  - `named` – 适用于使用命名导出的情况
  - `none` – 适用于没有导出的情况（比如，当你在构建应用而非库时）

  由于这只是一个输出的转换过程，因此仅当默认导出是所有入口 chunk 的唯一导出时，你才能选择 `default`。同样地，仅当没有导出时，才能选择 `none`，否则 Rollup 将会抛出错误。

  `default` 和 `named` 之间的差异会影响其他人使用你的 bundle 的方式。例如，如果该选项的值为 `default` 时，那么 CommonJS 用户可以通过以下方式使用你的库，例如：

  ```js
  // your-lib 包入口
  export default 'Hello world';
  
  // CommonJS 消费者
  /* require( "your-lib" ) 返回 "Hello World" */
  const hello = require('your-lib');
  ```

  如果该选项的值是 `named`，那么用户则通过以下方式使用你的库：

  ```js
  // your-lib 包入口
  export const hello = 'Hello world';
  
  // CommonJS 消费者
  /* require( "your-lib" ) 返回 {hello: "Hello World"} */
  const hello = require('your-lib').hello;
  /* 或使用解构 */
  const { hello } = require('your-lib');
  ```

  问题是，如果你使用 `named` 导出，但 *也* 会有一个 `default` 导出，用户将不得不类似这样做来使用默认导出：

  ```js
  // your-lib 包入口
  export default 'foo';
  export const bar = 'bar';
  
  // CommonJS 消费者
  /* require( "your-lib" ) 返回 {default: "foo", bar: "bar"} */
  const foo = require('your-lib').default;
  const bar = require('your-lib').bar;
  /* 或使用解构 */
  const { default: foo, bar } = require('your-lib');
  ```

  请注意：一些工具，如 Babel、TypeScript、Webpack 和 `@rollup/plugin-commonjs`，它们能够解析 CommonJS 的 `require(...)` 调用，并将其转换为 ES 模块。如果你正在生成想要在与这些工具的 ESM 输出可互换的 CommonJS 输出，则应始终使用 `named` 导出模式。原因是这些工具中大多数默认情况下会在 `require` 中返回 ES 模块的命名空间，其中默认导出是 `.default` 属性。

  换句话说，对于这些工具，你无法创建一个包接口，在该接口中 `const lib = require("your-lib")` 能够产生与 `import lib from "your-lib"` 相同的结果。但是，使用 `named` 导出模式，`const {lib} = require("your-lib")` 将与 `import {lib} from "your-lib"` 等效。



## 几个重要的插件

#### [@rollup/plugin-node-resolve](https://cn.rollupjs.org/tools/#rollupplugin-node-resolve)

[@rollup/plugin-node-resolve](https://github.com/rollup/plugins/tree/master/packages/node-resolve) 插件可以让 Rollup 找到外部模块。让我们安装它…

```
npm install --save-dev @rollup/plugin-node-resolve
```

…然后将它添加到我们的配置文件中：

```
// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';

export default {
	input: 'src/main.js',
	output: {
		file: 'bundle.js',
		format: 'cjs'
	},
	plugins: [resolve()]
};
```

这一次，当你运行 `npm run build` 时，不会发出警告 - bundle 包含了导入的模块。