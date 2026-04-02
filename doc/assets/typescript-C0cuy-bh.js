const n=[{question:"TypeScript 和 JavaScript 是什么关系？TypeScript 有什么好处？",answer:`TypeScript 是 JavaScript 的超集，添加了可选的静态类型系统，最终编译成JavaScript运行。

好处：
1. 编译阶段就能发现类型错误，减少运行时bug
2. 更好的IDE支持，智能提示更准确
3. 代码可读性和可维护性更好，适合大型项目
4. 支持最新ES特性，能提前使用
5. 类型本身就是文档，方便重构`,difficulty:"easy",tags:["基础","类型系统"]},{question:"TypeScript 中 type 和 interface 有什么区别？",answer:`相同点：都可以定义对象形状或函数类型。

区别：
1. interface 可以声明合并，type 不行
2. type 可以定义基本类型别名、联合类型、交叉类型、元组等，interface 不行
3. interface 用 extends，type 用 & 交叉

推荐：能用 interface 就用 interface，需要type特性才用type。`,difficulty:"medium",tags:["类型","interface","type"]},{question:"TypeScript 中什么是泛型？为什么需要泛型？",answer:`泛型就是在定义函数/类/接口的时候不指定具体类型，使用的时候再传入类型参数。

好处：
1. 一份代码支持多种类型，不用写重复代码
2. 保持类型安全，不用写any
3. 更好的自动提示

例子：function identity<T>(arg: T): T { return arg; }`,difficulty:"medium",tags:["泛型","类型系统"]},{question:"TypeScript 中 never 和 void 有什么区别？",answer:`- void：表示函数没有返回值，函数执行了但不返回值
- never：表示永远不会有返回值（比如抛出错误、死循环）

never 是所有类型的子类型，可以赋值给任何类型，但没有类型是never的子类型（除了never自己）。

函数如果肯定不返回，就用never。`,difficulty:"medium",tags:["类型","never","void"]},{question:"TypeScript 中 any 和 unknown 有什么区别？",answer:`- any：关闭类型检查，任意操作都可以通过编译，放弃类型安全
- unknown：未知类型，你必须先缩小类型才能操作，更安全

推荐：尽量不用any，用unknown代替。unknown比any更安全。`,difficulty:"medium",tags:["类型","any","unknown"]},{question:"TypeScript 中联合类型和交叉类型是什么？",answer:`- 联合类型：type A = B | C，表示一个值可以是B或者C中的一种
  常用于一个值可能是多种类型的情况，需要用类型守卫缩小

- 交叉类型：type A = B & C，表示一个值同时具有B和C的所有成员
  常用于合并多个类型得到一个新类型`,difficulty:"medium",tags:["联合类型","交叉类型"]},{question:"TypeScript 中什么是类型守卫？举例说明",answer:`类型守卫就是一些表达式，它们在运行时检查类型，帮助TypeScript在编译时确定更具体的类型。

方式：
1. typeof x === 'string' 这种原生判断
2. instanceof 检查构造函数
3. 自定义类型守卫函数：function isFish(pet: Pet): pet is Fish {}
   pet is Fish 就是类型谓语，告诉TS如果返回true，pet类型就是Fish

解决联合类型需要缩小类型的问题。`,difficulty:"hard",tags:["类型守卫","联合类型"]},{question:"TypeScript 中什么是枚举(enum)？什么时候用枚举？",answer:`枚举就是定义一组命名常量，让代码更清晰易读。

enum Direction {
  Up,
  Down,
  Left,
  Right
}

默认从0开始数字编号，也可以手动指定值。
适合：一组固定的有限值，比如状态、方向、选择项。
现在也可以用const enum 或者对象字面量+as const来代替。`,difficulty:"easy",tags:["枚举","基础"]},{question:"TypeScript 中 namespace 是什么？现在还推荐用吗？",answer:`namespace（命名空间）是TS早期用来组织代码防止命名冲突的方式，用 internal 模块。
现在推荐用 ES Modules（import/export），每个文件本身就是模块。
所以不推荐用namespace了，模块系统更好。`,difficulty:"medium",tags:["命名空间","模块化"]},{question:"TypeScript 中什么是断言？as const 有什么作用？",answer:`类型断言就是你告诉编译器"相信我，我知道类型是什么"，编译器就按你说的来。

as const 是把表达式标记为只读字面量类型，推断更精确的类型而不是宽泛的string/number。

比如：
const route = '/home' as const;
// 类型是 '/home' 而不是 string

配合对象：
const colors = { red: 'red' } as const;
// 所有属性都是只读，类型更精确`,difficulty:"medium",tags:["断言","类型推断"]},{question:"TypeScript 中 keyof 关键字有什么用？",answer:`keyof T 获取类型T的所有属性名组成的联合类型。

常用于泛型中约束泛型参数，比如：
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}

这样就保证key一定是obj的属性，类型安全。`,difficulty:"hard",tags:["keyof","泛型"]},{question:"TypeScript 中 typeof 类型操作符有什么用？",answer:`JS中typeof 是返回值的类型字符串，TS中typeof 可以用来获取一个变量的类型。

比如：
const obj = { x: 1, y: 2 };
type ObjType = typeof obj; 
// 得到 { x: number; y: number }

从已有值推断类型，非常方便。`,difficulty:"medium",tags:["typeof","类型操作符"]},{question:"TypeScript 中 Partial<T> 是什么？如何实现？",answer:`Partial<T> 是TS内置工具类型，把T的所有属性变成可选的。

实现：
type Partial<T> = { [P in keyof T]?: T[P] };

用途：常用于更新对象，只需要传部分属性。`,difficulty:"hard",tags:["工具类型","映射类型"]},{question:"TypeScript 中什么是逆变协变？什么是双向协变？",answer:`协变：子类型可以赋值给父类型，比如 Dog extends Animal，Dog 可以赋值给 Animal，这就是协变，大部分情况都是协变。
逆变：反过来，父类型可以赋值给子类型，函数参数是逆变的。

strictFunctionTypes 开启后，函数参数默认是逆变的。
--strict 模式默认开启。`,difficulty:"hard",tags:["协变","逆变","类型系统"]},{question:"TypeScript 中 declare 关键字什么时候用？",answer:`declare 用来声明类型，告诉编译器这个东西存在，不要报错，实际定义在别的地方。

常用于：
1. 声明第三方模块的类型（.d.ts 文件）
2. 声明全局变量
3. 声明全局函数
4. 声明JSON模块等非JS模块

declare 只给类型信息，不会生成JS代码。`,difficulty:"medium",tags:["declare","声明"]},{question:"TypeScript 中类型兼容性是什么规则？",answer:`TS类型兼容性基本规则是：结构兼容，只要具有需要的属性就是兼容的。

基于结构类型系统，不是名义类型系统。
只要一个对象结构满足，就兼容，不管你是不是声明了这个类型。

比如：
interface Person { name: string }
function greet(p: Person) { ... }
// 一个对象{ name: 'Alice', age: 20 } 也可以传进去，因为有name属性，兼容。`,difficulty:"hard",tags:["类型兼容","结构类型"]},{question:"TypeScript 中什么是映射类型？用途是什么？",answer:`映射类型就是基于已有类型生成新类型，遍历key创建新类型。
语法：type Mapped<T> = { [K in keyof T]: ... }

用途：
- 批量修改类型（全部变成可选，全部变成只读）
- 从枚举生成类型
- 内置工具类型很多都是映射类型实现的（Partial, Readonly, Pick）`,difficulty:"hard",tags:["映射类型","高级"]},{question:"TypeScript 中可选链 ?. 是空合并 ?? 有什么用？",answer:`- 可选链 ?.：安全访问嵌套对象属性，遇到undefined/null就停止，返回undefined，不抛错
  比如 a?.b?.c，比 a && a.b && a.b.c 简洁

- 空合并 ??：给null/undefined提供默认值，和||不同，|| 会把 0/false/'' 也当成假
  比如 const value = input ?? defaultValue;
  只有input是 null/undefined 才用默认值`,difficulty:"easy",tags:["可选链","空合并","ES"]}];export{n as default};
