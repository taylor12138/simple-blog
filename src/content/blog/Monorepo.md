---
author: Hello
categories: 前端
title: Monorepo
description: '基本常识相关'
---

## monorepo

一个 monorepo 是一个代码库中许多不同应用程序和包的集合。

用于替代**polyrepo**方案，你可以理解为 `monorepo` 就是将制定的都项目移动到一个存储库中，这些项目可以相互依赖，因此它们可以共享代码。并且几乎不需要包管理器，毕竟所有模块都托管在同一个存储库中



#### 在polyrepo中

假设您拥有三个独立的存储库 - `app`、`docs`和`shared-utils`。和`app`都`docs`依赖于`shared-utils`，它作为一个包发布在 npm 上。

此时 `shared-utils` 出现严重问题，但是你的 `app`、`docs` 都依赖了   `shared-utils`  ，此时你需要：

1. 提交`shared-utils`修复错误
2. 运行一个`publish`任务`shared-utils`发布到 npm
3. 升级 `app` 的依赖版本
4. 升级 `docs` 的依赖版本
5. 重新部署 `docs`、`app` 项目

感觉流程是不是比较长.



#### 在monorepo中

遇到以上问题，你只需

1. 提交`shared-utils`修复错误
2. 重新部署 `docs`、`app` 项目



![](/Monorepo/m1.png)



#### 优点

- **可见性**：每个人都可以看到其他人的代码。此属性可以带来更好的协作和跨团队的贡献——不同团队中的开发人员可以修复代码中你甚至不知道存在的错误。
- **更简单的依赖管理**：共享依赖是微不足道的。几乎不需要包管理器，因为所有模块都托管在同一个存储库中。
- **单一事实来源**：每个依赖的一个版本意味着没有版本冲突，也没有依赖地狱。
- **一致性**：当您将所有代码库放在一个地方时，执行代码质量标准和统一风格会更容易。
- **共享时间表**：API 或共享库中的重大更改会立即公开，迫使不同的团队提前沟通并联合起来。每个人都投入精力跟上变化。
- **原子提交**：原子提交使大规模重构更容易。开发人员可以在一次提交中更新多个包或项目。
- **隐式 CI**：[持续集成](https://semaphoreci.com/continuous-integration)得到保证，因为所有代码都已经统一在一个地方。
- **统一 CI/CD**：您可以对存储库中的每个项目使用相同的[CI/CD部署过程。](https://semaphoreci.com/cicd)
- **统一构建过程**：我们可以为 repo 中的每个应用程序使用共享[构建过程。](https://semaphoreci.com/blog/build-stage)



#### 缺点

- **性能不佳**：monorepos 难以扩展。像这样的命令`git blame`可能会花费不合理的长时间，IDE 开始滞后并且生产力受到影响，并且在每次提交时测试整个 repo 变得不可行。
- **损坏的 main/master**：损坏的 master 会影响在 monorepo 中工作的每个人。这可以被视为灾难性的，也可以被视为保持测试清洁和最新的良好动机。
- **学习曲线**：如果存储库跨越许多紧密耦合的项目，新开发人员的学习曲线会更陡峭。
- **大量数据**：monorepos 可以达到庞大的数据量和每天的提交量。
- **所有权**：维护文件的所有权更具挑战性，因为像 Git 或 Mercurial 这样的系统没有内置的目录权限。（但是有解决方式）
- **代码审查**：通知会变得非常嘈杂。例如，GitHub 的通知设置有限，不适合大量的拉取请求和代码审查。
- **更多的考虑**：迁移到 monorepo 需要您重新考虑如何进行持续集成。毕竟，您不再构建单个应用程序。您只是在构建受您的更改影响的东西。



## 运作模式

monorepo 的主要构建块是[workspace](https://turbo.build/repo/docs/handbook/workspaces)。您构建的每个应用程序和包都将位于自己的工作区中，并带有自己的`package.json`. 正如您将从我们的指南中了解到的，工作空间可以**相互依赖**，这意味着您的`docs`工作空间可以依赖于`shared-utils`：

npm：

```json
{
  "dependencies": {
    "shared-utils": "*"
  }
}
```

yarn：

```json
{
  "dependencies": {
    "shared-utils": "*"
  }
}
```

pnpm

```json
{
  "dependencies": {
    "shared-utils": "workspace:*"
  }
}
```

参考：

[what is monorepo](https://turbo.build/repo/docs/handbook/what-is-a-monorepo)

[What is monorepo? (and should you use it?)](https://semaphoreci.com/blog/what-is-monorepo)

[Misconceptions about Monorepos: Monorepo != Monolith](https://blog.nrwl.io/misconceptions-about-monorepos-monorepo-monolith-df1250d4b03c)