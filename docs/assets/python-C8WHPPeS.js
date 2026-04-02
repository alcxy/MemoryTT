const n=[{question:"Python 中列表和元组有什么区别？",answer:`1. 列表是可变的(mutable)，创建后可以修改添加删除元素
2. 元组是不可变的(immutable)，创建后不能修改
3. 元组占用内存更小，迭代更快
4. 元组可以作为字典的key，列表不行
5. 列表用于存储动态变化的数据，元组用于不可变的数据`,difficulty:"easy",tags:["基础","数据结构"]},{question:"Python 中 *args 和 **kwargs 是什么？怎么用？",answer:`- *args：接收任意多个位置参数，打包成元组
- **kwargs：接收任意多个关键字参数，打包成字典

常用于函数参数定义，接受任意参数，或者调用函数时解包参数。

示例：
def func(*args, **kwargs):
    print(args)  # 元组
    print(kwargs) # 字典`,difficulty:"easy",tags:["函数","参数"]},{question:"Python 中什么是装饰器(decorator)？举例说明用途",answer:`装饰器是用来装饰函数的，它可以在不修改原函数代码的情况下给函数添加额外功能。
本质上是一个接受函数参数并返回新函数的高阶函数。

常见用途：
- 日志记录
- 性能计时
- 权限检查
- 缓存
- 输入验证`,difficulty:"medium",tags:["函数","装饰器","高阶函数"]},{question:"Python 中生成器(generator)是什么？yield 的作用？",answer:`生成器是一种特殊的迭代器，可以边循环边生成值，不需要一次性生成所有值放在内存里。
使用 yield 关键字返回值，yield 会暂停函数执行，保存当前状态，下次调用继续执行。

优点：
- 节省内存，特别适合大数据量
- 惰性计算，需要的时候才生成

比如生成斐波那契数列，读取大文件逐行处理。`,difficulty:"medium",tags:["迭代器","生成器","内存优化"]},{question:"Python 中迭代器和可迭代对象有什么区别？",answer:`- 可迭代对象(Iterable)：实现了 __iter__() 方法，可以返回一个迭代器，for 循环可以遍历
- 迭代器(Iterator)：实现了 __iter__() 和 __next__() 方法，每次调用next()得到下一个值
- __iter__ 返回 self，__next__ 返回下一个值，没有抛出 StopIteration

总结：所有迭代器都是可迭代对象，但不是所有可迭代对象都是迭代器。`,difficulty:"medium",tags:["迭代","协议"]},{question:"Python 中什么是GIL？它对多线程有什么影响？",answer:`GIL（Global Interpreter Lock）是CPython解释器中的全局解释器锁。
它保证同一时刻只有一个线程在解释器中执行Python字节码。

影响：
- CPU密集型任务：多线程不能利用多核，因为GIL释放导致其实还是串行，不如多进程
- IO密集型任务：多线程还是有好处，因为IO等待时GIL会释放
- 所以CPU密集用多进程，IO密集用多线程+协程`,difficulty:"hard",tags:["解释器","GIL","并发"]},{question:"Python 中深拷贝和浅拷贝有什么区别？",answer:`- 浅拷贝：只拷贝对象本身，不拷贝嵌套对象，嵌套对象还是引用
  新对象和原对象共享嵌套对象
  
- 深拷贝：递归拷贝所有嵌套对象，完全独立，修改不影响原对象
  
使用：
- 浅拷贝：copy.copy()
- 深拷贝：copy.deepcopy()

如果对象都是不可变的，深浅拷贝区别不大。`,difficulty:"medium",tags:["内存","拷贝"]},{question:"Python 中 __init__ 和 __new__ 有什么区别？",answer:`- __new__：是静态方法，负责创建对象实例，分配内存，返回新实例
- __init__：是实例方法，负责初始化已经创建好的实例，给属性赋值

__new__ 在 __init__ 之前执行。
__new__ 很少需要自定义，除非要实现单例模式或者控制实例创建。`,difficulty:"medium",tags:["面向对象","魔术方法"]},{question:"Python 中什么是上下文管理器？with 语句的作用？",answer:`上下文管理器实现了 __enter__ 和 __exit__ 方法，可以自动管理资源。
with 语句会在进入块时调用 __enter__，退出块时自动调用 __exit__ 释放资源。

最常见例子：打开文件 with open('file') as f:，自动关闭文件，不用手动f.close()，即使异常也能正确关闭。

可以用来管理任何需要成对操作的资源：网络连接、锁、数据库连接等。`,difficulty:"medium",tags:["资源管理","语法"]},{question:"Python 中 mutable 和 immutable 是什么？举例哪些是可变哪些不可变",answer:`mutable（可变）：对象创建后内容可以修改
immutable（不可变）：对象创建后内容不能修改

可变：list, dict, set, 自定义类实例
不可变：int, float, bool, str, tuple, frozenset

注意：tuple本身不可变，但如果里面包含可变对象，那个嵌套对象还是可以变的。`,difficulty:"easy",tags:["基础","对象"]},{question:"Python 中字典的keys有什么限制？可以用列表作为key吗？",answer:`字典的key必须是可哈希的(hashable)。
一个对象如果有哈希值(__hash__方法)，并且在生命周期中不变，就是可哈希的。

不可变对象一般都是可哈希的：str, int, tuple, frozenset
可变对象不是可哈希的，因为内容变了哈希值也会变。

所以不能用列表作为字典key，可以用元组（如果元组所有元素都是可哈希）。`,difficulty:"medium",tags:["字典","哈希"]},{question:"Python 中什么是鸭子类型(duck typing)？",answer:`鸭子类型是动态类型的一种风格，不关注对象本身是什么类型，只关注它有没有需要的方法/属性。
"如果它走起来像鸭子，叫起来像鸭子，那它就是鸭子"

比如：你不需要参数一定是list，只要它能迭代就行，只要实现了 __iter__ 就能迭代。
优点：更灵活，代码更通用。`,difficulty:"hard",tags:["类型系统","面向对象"]},{question:"Python 中装饰器怎么带参数？",answer:`装饰器带参数需要再包一层。
外层函数接收参数，返回真正的装饰器，真正的装饰器接收函数，返回包装后的函数。

结构：
def decorator(arg):
    def actual_decorator(func):
        def wrapper(*args, **kwargs):
            # 使用arg
            return func(*args, **kwargs)
        return wrapper
    return actual_decorator

使用：@decorator('参数')`,difficulty:"hard",tags:["装饰器","进阶"]},{question:"Python 中如何实现单例模式？有几种方法？",answer:`单例模式保证一个类只有一个实例。

常见方法：
1. 使用模块导入（Python最自然的单例）
2. 装饰器
3. __new__ 方法控制实例创建
4. 元类

最常用的是模块导入或者重写 __new__。`,difficulty:"hard",tags:["设计模式","单例"]},{question:"Python 中 metaclass 元类是什么？用途是什么？",answer:`元类是用来创建类的类。
类本身也是对象，元类就是创建类对象的工厂。

用途：
- 拦截类的创建
- 修改类的定义
- 自动注入属性方法
- 实现ORM、API框架等

__metaclass__ 属性可以指定用什么元类创建类。
日常开发很少需要手动用元类，框架内部常用。`,difficulty:"hard",tags:["进阶","元类"]},{question:"Python 中 asyncio 是什么？怎么理解事件循环？",answer:`asyncio 是Python用于编写并发异步代码的库，基于事件循环和协程。

事件循环：
- 循环等待事件发生
- 把事件分发给处理函数
- 单线程内切换协程实现并发

适合IO密集型任务（网络请求、文件IO），比多线程轻量。
async/await 是语法糖，让异步代码写起来像同步。`,difficulty:"hard",tags:["异步","asyncio","并发"]},{question:"Python 中什么是猴子补丁(monkey patching)？",answer:`猴子补丁是在运行时动态修改模块或类的方法/属性，不用修改原代码。

比如：
- 给第三方库的方法打补丁改变行为
- unittest 中 mock 某个方法
- 运行时切换实现

优点灵活，缺点是破坏了原有结构，可能带来难以调试的问题。`,difficulty:"hard",tags:["进阶","动态"]},{question:"Python 中列表推导式和生成器表达式区别？",answer:`- 列表推导式：[x for x in iter]，一次性生成整个列表在内存
- 生成器表达式：(x for x in iter)，返回生成器，惰性计算，每次生成一个值

如果结果很大，不需要全部放内存，用生成器表达式更省内存。`,difficulty:"easy",tags:["语法","内存"]},{question:"Python 中 range 和 xrange 区别？",answer:`Python 2中：
- range 一次性生成整个列表放内存
- xrange 是生成器，惰性生成，省内存

Python 3中：
xrange 改名为 range，range 现在就是惰性的，没有xrange了。
原来Python 2的range 在Python 3中没有了。`,difficulty:"easy",tags:["基础","版本差异"]},{question:"Python 中如何处理异常？try-except-else-finally 各部分作用？",answer:`- try：放可能抛出异常的代码
- except：捕获指定类型的异常处理
- else：如果try没有抛出异常，就会执行else
- finally：无论有没有异常都会执行，用来清理释放资源

一般：资源打开在try，关闭在finally。`,difficulty:"easy",tags:["异常处理"]},{question:"Python 中 isinstance 和 type 有什么区别？判断类型用哪个？",answer:`- type：返回对象的类型，不考虑继承关系
- isinstance：判断对象是否是某个类型（或其子类）的实例

如果要判断类型并且考虑继承，用 isinstance。
通常我们都用 isinstance，因为它符合多态。`,difficulty:"medium",tags:["类型检查","面向对象"]},{question:"Python 中LEGB规则是什么？解释变量查找顺序",answer:`LEGB 就是Python变量查找顺序：
L：Local - 当前函数内部
E：Enclosing - 外部嵌套函数（闭包）
G：Global - 模块全局
B：Built-in - Python内置变量

按这个顺序从小到大查找，找到了就用，找不到抛NameError。`,difficulty:"medium",tags:["作用域","变量查找"]},{question:"Python 中 global 和 nonlocal 关键字作用？",answer:`- global：声明变量使用全局作用域的变量，不是创建局部变量
  要在函数内修改全局变量需要global
  
- nonlocal：声明变量使用外部嵌套函数（外层非全局）的变量
  在闭包中修改外层函数变量需要nonlocal
  
没有关键字默认是创建局部变量。`,difficulty:"medium",tags:["作用域","变量"]},{question:"Python 中什么是装饰器@lru_cache？用途是什么？",answer:`@lru_cache 是 functools 模块提供的装饰器，用来缓存函数调用结果。
Least Recently Used 缓存策略，最近最少使用，缓存满了淘汰最久没访问的。

用途：
- 递归函数（比如斐波那契）避免重复计算
- 纯函数，相同输入总是相同输出
- 对相同参数重复调用可以直接返回缓存，加速`,difficulty:"medium",tags:["装饰器","缓存","性能优化"]},{question:"Python 中为什么默认递归深度有限制？最大大概多少？",answer:`Python解释器的调用栈是有深度限制的，防止栈溢出崩溃。
默认递归深度限制大概是 1000 左右。

如果递归太深超过限制会抛出 RecursionError。
这种情况需要改写成迭代或者用尾递归优化（但Python不做尾递归优化）。`,difficulty:"medium",tags:["递归","解释器"]}];export{n as default};
