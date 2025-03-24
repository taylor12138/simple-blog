---
author: Hello
categories: 前端
title: sequelize-typescript学习
description: 'sequelize-typescript相关'
---

## 基础

#### 数据库基础定义

模型需要扩展类， `Model` 并且必须使用 `@Table` 装饰器进行注释。

在数据库中应显示为列的所有属性都需要 `@Column` 注释。

```ts
import { Table, Column, Model, HasMany } from 'sequelize-typescript';

@Table
class Person extends Model {
  @Column
  name: string;

  @Column
  birthday: Date;

  @HasMany(() => Hobby)
  hobbies: Hobby[];
}
```



基础模型

```ts
import { Model } from 'sequelize-typescript';

/**
 * 所有模型都必须实现的接口。
 */
export interface IModel extends Model {
  id: number;
  createTime: Date;
  updateTime: Date;
  deleted?: Date;
}
```

主键 （ `id` ） 将从基类 `Model` 继承。

默认情况下，此主键是 an `INTEGER` 和 has `autoIncrement=true` （此行为是本机续集）。

通过将另一个属性标记为主键，可以很容易地覆盖 id。因此，要么设置 `@Column({primaryKey: true})` ，要么与 `@Column` 一起使用 `@PrimaryKey` 。

```ts
export default class xxModal extends BaseModel {
  @PrimaryKey
  @AutoIncrement
  @Comment('打包 ID')
  @Column
  id: number;
}
```



#### 模型关联

关系可以通过 、 `@HasMany` 、 `@HasOne` `@BelongsTo` `@BelongsToMany` 和 `@ForeignKey` 注释直接在模型中描述。

##### ForeignKey

![](/sequelize-typescript学习/1.png)



##### 一对多

```ts
@Table
class Player extends Model {
  @Column
  name: string;

  @Column
  num: number;

  @ForeignKey(() => Team)
  @Column
  teamId: number;

  @BelongsTo(() => Team)
  team: Team;
}

@Table
class Team extends Model {
  @Column
  name: string;

  @HasMany(() => Player)
  players: Player[];
}
```



```ts
Team.findOne({ include: [Player] }).then((team) => {
  team.players.forEach((player) => console.log(`Player ${player.name}`));
});
```

![](/sequelize-typescript学习/2.png)





##### 多对多

```ts
@Table
class Book extends Model {
  @BelongsToMany(() => Author, () => BookAuthor)
  authors: Author[];
}

@Table
class Author extends Model {
  @BelongsToMany(() => Book, () => BookAuthor)
  books: Book[];
}

@Table
class BookAuthor extends Model {
  @ForeignKey(() => Book)
  @Column
  bookId: number;

  @ForeignKey(() => Author)
  @Column
  authorId: number;
}
```

若要安全地访问通表实例（上例中的 instanceOf `BookAuthor` ）类型，需要手动设置该类型。对于 `Author` 模型，可以这样实现：

```ts
@BelongsToMany(() => Book, () => BookAuthor)
books: Array<Book & {BookAuthor: BookAuthor}>;
```

![](/sequelize-typescript学习/3.png)



##### 一对一

对于一对一使用 `@HasOne(...)` （关系的外键存在于另一个模型上）和 `@BelongsTo(...)` （关系的外键存在于此模型上）





##### 不使用外键

这里有说明一些关于[循环引用问题](https://sequelize.org/docs/v6/other-topics/constraints-and-circularities/)

实际上@ForeignKey可以不使用,改为放在@BelongsTo里,见如下示例

```ts
export default class Player extends Model<Player> {
  @Column
  teamName: string;

  @Column
  gameName: string;

  @Column
  teamId: number;

  // 传入targetKey指定目标模型的外联key
  @BelongsTo(() => Team, { foreignKey: 'teamName', targetKey: 'tname' })
  team: Team;
  // 关联其他模型
  @BelongsTo(() => Game, { foreignKey: 'gameName', targetKey: 'gname' })
  game: Game;

  static async findData() {
    return this.findOne({
      include: [{
        model: Team,
        // 获取目标模型某些key
        attributes: ['type'],
     }],
      raw: true,
    })
  }
}
```

```ts
@Table({
  tableName: 'team'
})

export default class Team extends Model<Team> {
  @Column
  tname: string;
}
```

```ts
@Table({
  tableName: 'game'
})

export default class Game extends Model<Game> {
  @Column
  gname: string;
}
```



然后我们再对它进行稍作修改，设置 `constraints: false`

```ts
export default class Player extends Model<Player> {
  @Column
  teamName: string;

  @Column
  gameName: string;

  @Column
  teamId: number;

  // 传入targetKey指定目标模型的外联key
  @BelongsTo(() => Team, { foreignKey: 'teamName', targetKey: 'tname', constraints: false })
  team: Team;
  // 关联其他模型
  @BelongsTo(() => Game, { foreignKey: 'gameName', targetKey: 'gname', constraints: false })
  game: Game;

  static async findData() {
    return this.findOne({
      include: [{
        model: Team,
        // 获取目标模型某些key
        attributes: ['type'],
     }],
      raw: true,
    })
  }
}
```



## 使用

*sequelize-typescript* 使用文档[详情](https://github.com/Haochen2499/sequelize-typescript-doc-zh?tab=readme-ov-file#%E4%BD%BF%E7%94%A8)

除了一些微小的变化， *sequelize-typescript* 使用起来像原汁原味的 sequelize。 (查阅 sequelize [文档](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/))





## 为什么我不建议你使用外键

MySQL 外键最大的作用就是有助于维护数据的**一致性和完整性**。

- 一致性：如果一个订单表引用了一个客户表的外键，外键可以确保订单的客户 ID 存在于客户表中，从而保持数据的一致性。
- 完整性：外键可以防止在引用表中删除正在被其他表引用的记录，从而维护数据的完整性。

但是，其实在很多大型互联网公司中，很少用外键的，甚至阿里巴巴 Java 开发手册中明确规定了：

【强制】不得使用外键与级联，一切外键概念必须在应用层解决。

说明: 以学生和成绩的关系为例，学生表中的 student_id 是主键，那么成绩表中的 student_id 则为外键。如果更新学生表中的 student_id，同时触发成绩表中的 student_id 更新，即为级联更新。外键与级联更新适用于单机低并发，不适合分布式、高并发集群; 级联更新是强阻塞，存在数据库更新风暴的风险; 外键影响数据库的插入速度。



## 更新风暴问题

数据库更新风暴（Database Update Storm）通常指的是在高并发环境下，多个客户端同时对数据库进行大量的更新操作，导致数据库性能急剧下降或完全崩溃的情况。



当多个客户端同时执行大量的写入操作（如插入、更新或删除记录），数据库系统可能无法及时处理所有的请求，导致请求堆积和阻塞。这可能会导致以下问题：

- 响应时间延长：由于请求堆积，数据库无法及时响应客户端的请求，导致延迟增加，响应时间变长。

- 锁竞争与死锁：多个客户端同时对同一数据进行修改时，可能会引起锁竞争和死锁，导致数据库出现阻塞和无法继续处理请求的情况。

- 性能下降与系统崩溃：数据库系统可能无法承受来自大量并发更新的压力，导致系统性能急剧下降甚至崩溃。



为了避免数据库更新风暴，可以考虑以下策略：

- 优化数据库设计与索引：合理设计数据库结构、选择适当的数据类型和建立合适的索引，以提高数据库的写入性能。
- 批量提交与事务管理：将多个独立的更新操作合并为批量提交，减少与数据库的交互次数，并使用事务管理来确保数据的一致性和完整性。
- 负载均衡与缓存：通过负载均衡将请求分散到多个数据库实例上，并使用缓存技术来减轻数据库的压力。
- 异步处理与消息队列：将写入操作异步化，并使用消息队列来缓冲和调度写入请求，降低数据库的负荷。
- 垂直或水平扩展：根据需要增加数据库服务器的数量或配置，通过垂直或水平扩展来提高数据库系统的性能和吞吐量。



## 参考

[sequelize-typescript联表查询](https://jiandandkl.github.io/2019/01/04/sequelize-typescript%E8%81%94%E8%A1%A8%E6%9F%A5%E8%AF%A2/)

