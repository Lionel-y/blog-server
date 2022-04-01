# 请求操作类型分类

{
  statusCode: 200,
  msg: "xxx",
  
}

## 查询操作
- 查询文章列表
```json
{
  "pid": "xxx",
  "title": "xxx",
  "author": "xxx",
  "desc": "xxxxx",
  "category": "xxxx",
  "tags": ["xxx","xxx"],
  "likes": 999,
  "views": 999,
  "createAt": "2021-02-23"
}
```
- 查询文章详情
```json
{
  "pid": "xxx",
  "title": "xxx",
  "author": "xxx",
  "desc": "xxxxx",
  "category": "xxxx",
  "tags": ["xxx","xxx"],
  "likes": 999,
  "views": 999,
  "createAt": "2021-02-23",
  "content": "xxx"
}
```
- 查询指定分类文章列表
- 查询指定标签文章列表
- 查询用户基本信息
- 查询分类列表
- 查询标签列表

## 数据操作

- 新建文章
- 新建分类
- 新建标签
- 修改文章
- 修改分类
- 修改标签
- 删除文章
- 删除分类
- 删除标签
