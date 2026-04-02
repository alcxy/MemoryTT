const n=[{question:"C# 中 value 关键字在哪里使用？它的作用是什么？",answer:`value 关键字用在属性的 set 访问器中，表示用户给属性赋值的值。在自动属性中编译器会自动生成一个隐藏的私有字段，value 就是传入的值。

示例：
public string Name {
  get => _name;
  set => _name = value; // 这里 value 就是外部传入的值
}`,difficulty:"easy",tags:["语法","关键字","属性"]},{question:"C# 中 const 和 readonly 有什么区别？",answer:`1. const 必须在声明时初始化，编译时常量，只能修饰基本类型和字符串
2. const 是静态的，不需要实例化就能访问
3. readonly 可以在声明时或者构造函数中初始化，可以修饰任意类型，可以是运行时常量
4. readonly 可以实例级别的也可以是静态的`,difficulty:"medium",tags:["关键字","常量","修饰符"]},{question:"C# 中结构体(struct)和类(class)有什么区别？",answer:`1. struct 是值类型，存储在栈上；class 是引用类型，存储在堆上
2. struct 不支持继承，class 支持继承
3. struct 默认值是所有字段清零，class 默认值是 null
4. struct 不会被垃圾回收，class 会被GC回收
5. struct 作为参数传递时是值拷贝，class 传递的是引用`,difficulty:"medium",tags:["基础类型","值类型","引用类型"]},{question:"C# 中什么是装箱和拆箱？",answer:`装箱：将值类型转换为 object 类型（或者任何接口类型），会在堆上分配对象，复制值过去
拆箱：将 object 类型转换为值类型，检查类型然后复制值到栈上

装箱会产生额外的堆分配，影响性能，频繁装箱拆箱会增加GC压力。`,difficulty:"medium",tags:["类型转换","性能"]},{question:"C# 中什么是Nullable引用类型？为什么要引入它？",answer:`Nullable引用类型是C# 8.0引入的特性，通过启用 \`<Nullable>enable</Nullable>\` 开启。
- 默认情况下引用类型都是非空的，如果允许为null需要加 ? 修饰符
- 帮助编译器在编译时检测空引用异常
- 提高代码安全性，减少NullReferenceException`,difficulty:"medium",tags:["新特性","空安全","编译检查"]},{question:"C# 中 async/await 的作用是什么？它和Task的关系？",answer:`async/await 是C# 5.0引入的语法糖，用于简化异步编程。
- async 标记方法为异步方法
- await 等待异步操作完成，不会阻塞主线程
- async方法返回Task或Task<T>，表示异步操作
- 编译器会生成状态机来处理异步操作的继续执行
相比回调方式，代码可读性更好，结构更清晰`,difficulty:"hard",tags:["异步","Task","语法糖"]},{question:"C# 中什么是扩展方法？它的定义要求是什么？",answer:`扩展方法允许你给已有的类型添加新方法而不用修改原类型源码也不用重新编译。
定义要求：
1. 必须定义在静态类中
2. 方法本身必须是静态的
3. 第一个参数必须用 this 关键字修饰，表示要扩展的类型
`,difficulty:"easy",tags:["语法","特性"]},{question:"C# 中 out 和 ref 参数有什么区别？",answer:`1. ref：参数必须在传入前初始化，方法可以读取和修改它
2. out：参数不需要在传入前初始化，方法必须在返回前给它赋值
3. out 主要用于多返回值，ref 用于参数传引用修改`,difficulty:"easy",tags:["参数","关键字"]},{question:"C# 中接口(interface)和抽象类(abstract class)有什么区别？",answer:`1. 接口不能包含实现，抽象类可以包含实现
2. 接口可以多继承，抽象类只能单继承
3. 接口支持回调，抽象类不能
4. 接口是针对contract设计，抽象类是针对继承设计
5. 值类型可以实现接口，但不能继承抽象类`,difficulty:"medium",tags:["面向对象","继承","多态"]},{question:"C# 中什么是垃圾回收(GC)？垃圾回收的原理是什么？",answer:`GC是.NET自动内存管理机制，负责回收不再被引用的内存。
原理：
1. 分代回收：将对象分为0代、1代、2代，新对象在0代，存活对象晋升到老年代
2. 标记-清除：标记可达对象，清除不可达对象
3. 压缩：清除后整理内存减少碎片

GC 只会回收堆内存，栈上分配不会回收。`,difficulty:"hard",tags:["内存管理","GC","运行原理"]},{question:"C# 中 string 是引用类型还是值类型？为什么说它是不可变的？",answer:`string 是引用类型，但它具有不可变性。
每次修改 string 都会创建一个新的字符串对象，原字符串不会改变。
这意味着：
- 字符串比较更快（可以比较引用）
- 线程安全
- 频繁拼接会产生大量临时对象，影响性能，建议用 StringBuilder`,difficulty:"medium",tags:["基础类型","字符串","不可变"]},{question:"C# 中 StringBuilder 和 string 拼接有什么区别？什么时候用 StringBuilder？",answer:`- string 不可变，每次拼接都会生成新对象，频繁拼接分配很多内存
- StringBuilder 在内部维护一个缓冲区，扩容时才重新分配，减少内存分配
- 当需要多次拼接字符串（比如循环中）时，一定要使用 StringBuilder`,difficulty:"easy",tags:["性能优化","字符串"]},{question:"C# 中 delegate 和 event 有什么关系？event 的作用是什么？",answer:`delegate 是类型，表示方法签名的引用类型。
event 是关键字，它基于 delegate，提供了发布-订阅模式的封装。

event 限制：
1. 只有发布者能触发，订阅者只能 += / -= 不能直接 = 也不能主动触发
2. 防止订阅者覆盖事件
3. 是面向观察者设计模式的语言级支持`,difficulty:"hard",tags:["委托","事件","设计模式"]},{question:"C# 中 Func 和 Action 的区别是什么？",answer:`都是泛型委托：
- Func<out T>：有返回值
- Action：无返回值
- Func<in T, out TResult>：接受参数并有返回值
- Action<in T>：接受参数无返回值

使用它们可以不用自定义委托类型，简化代码。`,difficulty:"easy",tags:["委托","泛型"]},{question:"C# 中什么是匿名方法？什么是Lambda表达式？",answer:`匿名方法(C# 2.0)：允许你创建匿名的delegate实例，inline定义方法体
Lambda表达式(C# 3.0)：更简洁的语法糖 => 语法

匿名方法：delegate(int x) { return x > 0; }
Lambda：x => x > 0

现在基本都用Lambda，匿名方法很少用了。`,difficulty:"easy",tags:["语法","匿名函数","Lambda"]},{question:"C# 中 var 和 dynamic 有什么区别？",answer:`- var：编译时推断类型，仍然是强类型，编译后类型确定
- dynamic：动态类型，编译时不检查，运行时解析，会绕过静态类型检查
- var 需要编译时能推断类型，dynamic可以用于动态场景比如COM互操作、DLR

滥用dynamic会失去类型安全，尽量少用。`,difficulty:"medium",tags:["类型系统","var","dynamic"]},{question:"C# 中什么是闭包？闭包会引起什么问题？",answer:`闭包是指匿名函数/Lambda能够捕获外部作用域的变量。

问题：
如果在循环中捕获循环变量，所有闭包都会捕获同一个变量（最后一次的值），因为循环变量在整个循环是同一个实例。
解决方法：在循环内创建一个临时变量再捕获。

另外闭包会延长捕获变量的生命周期，可能导致内存无法释放。`,difficulty:"hard",tags:["语法","闭包","陷阱"]},{question:"C# 中 LINQ 是什么？列举常见的 LINQ 方法",answer:`LINQ（Language Integrated Query）是C# 3.0引入的特性，让你能用统一的语法查询各种数据源。

两类LINQ：
1. 查询语法：from x in list where ... select x
2. 方法语法：list.Where(...).Select(...).OrderBy(...)

常见方法：Where, Select, SelectMany, OrderBy, GroupBy, Join, Take, Skip, First, Single, Any, All, Count, Sum, Average, Aggregate`,difficulty:"medium",tags:["LINQ","语言特性"]},{question:"C# 中 IQueryable 和 IEnumerable 有什么区别？",answer:`- IEnumerable：在内存中枚举，LINQ to Objects，整个查询在内存执行
- IQueryable：构建表达式树，由LINQ Provider（比如EF Core）翻译成SQL在数据库执行
- 如果在IQueryable上调用 AsEnumerable() 会把数据拉到内存再过滤，可能导致性能问题

理解关键点：表达式树 vs 委托。`,difficulty:"hard",tags:["LINQ","EF","性能"]},{question:"C# 中什么是泛型？为什么需要泛型？",answer:`泛型允许你在定义时不指定具体类型，使用时再指定。
好处：
1. 类型安全，编译时检查
2. 避免频繁装箱拆箱（值类型）
3. 代码复用，一份代码支持多种类型
4. 更好的可读性`,difficulty:"medium",tags:["泛型","类型安全"]},{question:"C# 中协变和逆变是什么？out 和 in 关键字的作用？",answer:`协变(out)：允许派生类转换到基类，对于泛型接口，输出类型支持协变
  比如 IEnumerable<Derived> 可以赋值给 IEnumerable<Base>
  
逆变(in)：允许基类转换到派生类，对于泛型接口，输入类型支持逆变
  比如 IAction<Base> 可以赋值给 IAction<Derived>

关键字：out 标记协变，in 标记逆变，只能用于接口和委托。`,difficulty:"hard",tags:["泛型","协变","逆变"]},{question:"C# 中什么特性(Attribute)？常用在什么场景？",answer:`Attribute 是一种元数据，可以附加到类型、方法、参数、属性等上面。
可以在运行时通过反射读取。

常用场景：
- 配置：比如 [HttpGet], [Route] 在ASP.NET Core中
- 验证：[Required], [Range] 在数据验证中
- 序列化：[JsonPropertyName] 指定序列化名称
- 日志：或者代码分析`,difficulty:"medium",tags:["特性","反射","元数据"]},{question:"C# 中反射是什么？反射的优缺点？",answer:`反射允许你在运行时获取程序集、类型、成员的信息，可以动态创建对象、调用方法。

优点：
- 高度灵活，可以动态处理
- 框架开发中常用，比如依赖注入、ORM

缺点：
- 性能比直接调用慢
- 破坏封装
- 代码可读性变差
- 如果使用不当容易出错`,difficulty:"hard",tags:["反射","运行时"]},{question:"C# 中 null 合并且?? 和 ?. 运算符是什么作用？",answer:`- ?. ：空条件运算符，如果对象不为null就访问成员，否则返回null
  比如 obj?.Method()，obj为null不会抛空引用异常

- ?? ：null合并运算符，如果左边不为null返回左边，否则返回右边
  比如 var name = defaultValue ?? "default";

两者可以组合使用： var city = user?.Address?.City ?? "Unknown";`,difficulty:"easy",tags:["语法","空安全","运算符"]},{question:"C# 中 record 类型是什么？它和 class 有什么区别？",answer:`record 是C# 9引入的，专为不可变数据和值相等性设计。
特点：
1. 默认不可变，init-only 属性
2. 自动实现值相等性（按所有属性比较）
3. 提供 ToString() 重写打印所有属性

适合：DTO、消息、不可变数据对象。
class 是引用相等性，record 是值相等性。`,difficulty:"medium",tags:["新特性","类型系统"]},{question:"C# 中什么是模式匹配？举例说明",answer:`模式匹配是C# 7+逐步增强的特性，允许你根据类型和值进行匹配。

举例：
1. 类型模式：if (obj is string s) { 使用s }
2. 属性模式：if (obj is Person { Age: >= 18 }) { ... }
3. 递归模式：支持嵌套匹配
4. 开关表达式：var result = value switch { ... };

简化了if-else和类型转换，代码更清晰。`,difficulty:"medium",tags:["新特性","语法"]},{question:"C# 中内存泄漏可能发生在哪些场景？",answer:`1. 未释放非托管资源（不调用Dispose）
2. 静态集合长期持有对象不清理
3. 事件订阅不取消（发布者寿命比订阅者长）
4. 闭包捕获意外引用
5. 长生命周期对象持有短生命周期对象
6. Task 异步代码未观察到异常，导致异常留在队列中`,difficulty:"hard",tags:["内存管理","调试","性能"]},{question:"C# 中 Task 和 Thread 的区别是什么？",answer:`- Thread：操作系统线程，重量级，上下文切换开销大
- Task：任务抽象，基于任务并行库，默认使用线程池
- Task 更轻量，更适合大量并发异步操作
- async/await 基于 Task，不是创建新线程
- 异步IO不占用线程，只有CPU计算需要线程`,difficulty:"hard",tags:["异步","多线程","Task"]},{question:"C# 中什么是原子操作？lock 和 Monitor 和 Mutex 的区别？",answer:`原子操作：不能被打断的操作，要么完成要么不完成，多线程下不会出问题。

- lock：语法糖，本质是Monitor.Enter/Exit，最常用，轻量，作用于当前进程
- Monitor：提供更细粒度控制，比如TryEnter
- Mutex：跨进程同步，内核对象，更重

Interlocked 类提供原子操作递增递减等。`,difficulty:"hard",tags:["多线程","同步","并发"]},{question:"C# 中 CancellationToken 的作用是什么？",answer:`CancellationToken 用于协作式取消异步操作。
- 传递给异步方法，方法可以检测 IsCancellationRequested 来响应取消
- 不会强制终止线程，是协作式的，更安全
- 常用在长时间操作、网络请求、循环中支持取消`,difficulty:"medium",tags:["异步","取消"]}];export{n as default};
