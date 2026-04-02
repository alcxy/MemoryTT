const e=[{question:"Git 和 SVN 有什么区别？",answer:`1. Git 是分布式版本控制，SVN 是集中式
2. Git 每个开发者本地都有完整仓库，离线也能提交，SVN必须联网提交
3. Git 分支更轻量，创建切换分支更快
4. Git 内容按哈希存储，保证内容完整性，SVN按文件存储
5. Git 工作流更灵活，支持多人协作更方便`,difficulty:"easy",tags:["基础","版本控制"]},{question:"Git 中 HEAD、working tree、index 分别是什么？",answer:`- working tree（工作区）：就是你当前看到编辑的文件目录，你正在编辑的
- index（暂存区/索引）：一个文件，保存了下次要提交的文件列表信息
- HEAD：指向当前分支最新提交，HEAD~ 是上一个提交

工作区修改 → git add → 暂存区 → git commit → 仓库`,difficulty:"medium",tags:["基础","Git区域"]},{question:"Git 中 git add 和 git commit 做了什么？",answer:`- git add：把工作区的修改添加到暂存区(index)，记录文件当前状态
- git commit：把暂存区的内容提交到当前分支的仓库中，生成一个新的commit对象

commit 生成唯一的hash，保存了提交信息、作者时间、父commit`,difficulty:"easy",tags:["基础命令"]},{question:"Git 分支为什么比 SVN 高效？",answer:`SVN 分支是拷贝一份工作目录，文件多大分支就多大，创建切换慢。
Git 分支只是一个指向commit的指针，40个字节，创建分支就是新建一个指针，非常快，切换分支也是移动指针，非常高效。`,difficulty:"medium",tags:["分支","原理"]},{question:"Git 中 merge 和 rebase 有什么区别？",answer:`merge：把两个分支的历史合并，会生成一个新的merge commit，保留完整历史，但是会让历史变乱。

rebase：把当前分支的commits replayed 到目标分支上，把当前分支起点移到目标分支最新，历史变成线性，没有merge commit，历史更干净。

注意：不要rebase已经推送到公共仓库的commit，因为改写了历史，别人pull会有冲突。

推荐：保持历史线性，用rebase，本地分支整理后再merge。`,difficulty:"hard",tags:["合并","rebase","merge"]},{question:"Git 中 revert 和 reset 区别是什么？",answer:`- revert：撤销一个已经提交的commit，它会新建一个commit，把那个commit的修改反过来做，历史保留，安全不丢改变
- reset：移动HEAD指针，可以回退暂存区和工作区，会丢弃后面的commit，历史改变

如果commit已经推送到远程，推荐用revert，不要reset，因为reset改写历史，别人合并会出问题。`,difficulty:"hard",tags:["回滚","reset","revert"]},{question:"Git 中 fast-forward 是什么？什么时候会发生？",answer:`fast-forward（快进合并）是merge的一种特殊情况。
当你merge一个分支到当前分支，当前分支的HEAD是目标分支的祖先，不需要新创建merge commit，直接移动HEAD指针就行，这就是快进。

如果不想快进，想要保留分支信息，可以用 git merge --no-ff 强制生成merge commit。`,difficulty:"hard",tags:["merge","快进"]},{question:"git pull 和 git fetch 区别是什么？",answer:`- git fetch：从远程仓库下载新的commit到本地，不会自动合并到本地分支，你可以看完再merge
- git pull：相当于 git fetch + git merge，直接把远程更新合并到当前分支

推荐：先fetch看看diff，没问题再merge，比直接pull更可控。`,difficulty:"easy",tags:["远程操作"]},{question:"如何解决git冲突？",answer:`当两个人修改了同一个文件同一行，Git不知道哪一个对，就会产生冲突，需要手动解决。

步骤：
1. Git 标记冲突，<<<<<<< HEAD 到 ======= 是你本地的修改，======= 到 >>>>>>> 是远程的修改
2. 手动编辑文件，保留需要的内容，去掉冲突标记
3. git add 标记解决冲突
4. git commit 完成合并`,difficulty:"medium",tags:["冲突解决"]},{question:"Git 中 git reflog 是做什么用的？",answer:`git reflog 记录所有分支的HEAD移动记录，包括reset掉的commit也能找到。

用处：
如果你reset错了，丢掉了一些commit，用reflog找到commit的hash，再reset回去就能恢复。
是救命稻草，找丢失commit用的。`,difficulty:"medium",tags:["恢复","调试"]},{question:"Gitflow工作流是什么？和Trunk-based比哪个好？",answer:`Gitflow：
- master 主干放正式发布代码
- develop 开发分支，日常开发在这里
- feature/* 分支开发新功能，从develop拉，合并回develop
- release/* 分支准备发布
- hotfix/* 修复线上bug

Trunk-based：
- 所有人都提交到main/trunk，短小生命周期分支，频繁合并，持续集成

现在互联网开发推荐Trunk-based + CI/CD，更适合持续交付。Gitflow适合传统瀑布模型发布周期长的项目。`,difficulty:"hard",tags:["工作流","流程"]},{question:"Git 中cherry-pick是什么？用途是什么？",answer:`cherry-pick 把指定的某个commit拿到当前分支，重新应用生成一个新的commit。

用途：
- 把bugfix从develop cherry-pick 到master分支
- 想要把某个分支上特定commit拿到另一个分支，不需要合并整个分支

很方便按需搬运commit。`,difficulty:"medium",tags:["cherry-pick","高级"]},{question:"Git 变基rebase会改写历史，什么时候不要用rebase？",answer:`记住：已经推送到公共远程仓库的commit，已经被别人用了，就不要rebase。
因为rebase改写了commit的hash，整个commit变了，别人pull的时候会产生重复commit和冲突，非常麻烦。

只有本地私有分支可以放心rebase整理历史，推出去了就别动。`,difficulty:"hard",tags:["rebase","最佳实践"]},{question:"git stash 是做什么的？使用场景？",answer:`git stash 把当前工作区未提交的修改暂存起来，让工作区干净，可以切换分支干别的。

场景：
你写了一半代码，突然要切分支改bug，不想提交一个半成品commit，就git stash暂存，改完回来git stash pop恢复。`,difficulty:"medium",tags:["暂存","命令"]},{question:"Git 中怎么忽略不想跟踪的文件？",answer:`创建 .gitignore 文件，每一行写一个忽略模式。

语法：
- # 注释
- /node_modules 忽略根目录下的node_modules
- *.log 忽略所有.log文件
- !main.log 虽然上面忽略了，但是main.log不忽略

Gitignore 只忽略没add的文件，已经add进Git的文件要忽略需要先rm缓存。`,difficulty:"easy",tags:[".gitignore"]}];export{e as default};
