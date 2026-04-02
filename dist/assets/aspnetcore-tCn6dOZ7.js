const n=[{question:"ASP.NET Core 中间件是什么？工作原理是什么？",answer:`中间件是一种管道模型，每个请求都会经过一系列中间件处理。每个中间件既可以处理请求，也可以把请求传递给下一个中间件，还可以在回来的时候做响应处理。

工作原理：
1. 中间件是一个委托，按顺序组成请求管道
2. 每个中间件在Invoke方法中处理请求
3. 可以选择调用next.Invoke传递给下一个中间件
4. 也可以直接短路不传递，直接返回响应`,difficulty:"medium",tags:["管道","中间件"]},{question:"ASP.NET Core 依赖注入是什么？有什么好处？",answer:`依赖注入是DI，是一种设计模式，用于实现控制反转(IoC)，降低代码耦合。

好处：
1. 依赖关系由容器管理，不用自己new对象
2. 易于单元测试，可以轻易mock依赖
3. 降低耦合，模块可替换
4. 生命周期管理，框架自动处理对象创建和销毁

ASP.NET Core 内置了DI容器，支持构造函数注入。`,difficulty:"medium",tags:["DI","设计模式"]},{question:"ASP.NET Core 生命周期有哪些？Transient、Scoped、Singleton区别？",answer:`- Transient：瞬时，每次请求服务都创建新实例
- Scoped：范围，同一个请求范围内创建一次（Web请求是一个Scope）
- Singleton：单例，整个应用生命周期只创建一次

注意：不能从单例服务中直接依赖Scoped服务，生命周期不一致会出问题。`,difficulty:"medium",tags:["DI","生命周期"]},{question:"ASP.NET Core 中 Program 和 Startup 的区别，.NET 6+ 之后有什么变化？",answer:`.NET 5及以前：
- Program.Main 创建WebHost，调用Startup
- Startup 里 ConfigureServices 注册服务，Configure 配置中间件管道

.NET 6+ 变成了顶级语句，统一写到Program.cs：
- var builder = WebApplication.CreateBuilder(args); 注册服务
- var app = builder.Build(); 构建应用，配置中间件
- app.Run(); 启动

简化了代码，去掉了Startup类，结构更简洁。`,difficulty:"easy",tags:["基础","变化"]},{question:"什么是路由？ASP.NET Core 中路由匹配顺序是什么？",answer:`路由是把请求URL映射到对应的控制器/action处理的过程。

匹配顺序：
1. 按注册顺序匹配，先注册的先匹配
2. 更具体的路由不会优先，所以一般把更具体的路由放前面
3. 特性路由比约定路由优先级高`,difficulty:"medium",tags:["路由","匹配"]}];export{n as default};
