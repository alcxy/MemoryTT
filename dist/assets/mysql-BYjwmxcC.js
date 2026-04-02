const n=[{question:"MySQL 中 InnoDB 和 MyISAM 的区别是什么？",answer:`1. InnoDB 支持事务，MyISAM 不支持事务
2. InnoDB 支持行级锁，MyISAM 只支持表级锁
3. InnoDB 支持外键约束，MyISAM 不支持
4. InnoDB 支持崩溃后的安全恢复，MyISAM 不支持
5. MyISAM 适合读多写少，InnoDB 适合读写都多
6. MyISAM 会保存总行数，count(*) 不需要遍历全表，InnoDB 需要`,difficulty:"medium",tags:["存储引擎","对比"]},{question:"什么是索引？为什么索引能提高查询速度？",answer:`索引是帮助MySQL高效获取数据的数据结构，比如B+树。

索引能提高查询速度原因：
1. 索引对数据排序，减少了需要扫描的数据量
2. 索引把随机IO变成顺序IO
3. B+树结构是平衡多路查找树，查找时间复杂度O(log n)，远快于全表扫描O(n)`,difficulty:"medium",tags:["索引","原理"]},{question:"什么是事务？事务的ACID特性是什么？",answer:`事务是一组数据库操作，要么全部成功要么全部失败。

ACID：
- Atomicity（原子性）：事务中的操作要么全做要么不做
- Consistency（一致性）：事务执行前后数据库完整性一致
- Isolation（隔离性）：多个事务并发执行互不干扰
- Durability（持久性）：事务提交后修改永久保存到数据库`,difficulty:"medium",tags:["事务","基础"]},{question:"事务隔离级别有哪些？各解决了什么问题？",answer:`从低到高：
1. READ UNCOMMITTED（读未提交）：可以读到未提交的事务修改，会脏读
2. READ COMMITTED（读已提交）：只能读到已提交的修改，解决脏读，会不可重复读
3. REPEATABLE READ（可重复读）：同一事务中多次读取同一数据结果一致，MySQL默认级别，解决脏读、不可重复读，会幻读（InnoDB通过MVCC解决了幻读）
4. SERIALIZABLE（串行化）：强制串行执行，解决所有并发问题，性能差`,difficulty:"hard",tags:["事务","隔离级别","并发"]},{question:"什么是脏读、不可重复读、幻读？",answer:`脏读：一个事务读到了另一个事务还未提交的数据
不可重复读：一个事务中同一查询两次读取结果不一样（另一个事务修改了数据并提交）
幻读：一个事务按条件查询，两次返回行数不一样（另一个事务插入了满足条件的新数据）`,difficulty:"medium",tags:["事务","并发问题"]},{question:"什么是联合索引？最左前缀原理是什么？",answer:`联合索引是在多个列上建立一个索引。

最左前缀原理：查询时where条件要包含联合索引最左边的列，索引才会被使用。

例如索引 (a,b,c)：where a=1，where a=1 and b=2 都能用索引，where b=2 不能用到索引。

原因：B+树按照索引最左列排序，然后才是第二列，所以查询必须从左开始。`,difficulty:"hard",tags:["索引","优化"]}];export{n as default};
