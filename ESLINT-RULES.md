# eslint rules 相关说明

> [Airbnb JS 编码规范中文版](https://github.com/yuche/javascript)

## 说明
1. `git commit` 提交时，会自动进行 `eslint`, 并且自动进行简单的 fix，需注意检查fix后的代码。如eslint检测未通过，则提交失败，需fix符合要求后再提交;

2. lint 需要一定的时间，请放松心情，耐心等待;

3. 如果想只显示lint出的errors，可以在 `eslint` 命令后加参数 `--quiet`，如
	```
	eslint --ext .js,.vue src --fix --quiet
	```

## 目前存在的主要问题
1. eslint warings
	主要是不符合`.eslintrc`规则，如 “空格类型”，“单双引号”，“分号”，“单行代码长度限制”，“逻辑运算符混用”等。

2. eslint error
	+ 变量声明或引入后未使用
	+ 混用逻辑运算符
	+ 保留字
	+ 分号
	+ ...

3. 编辑器不统一，eslint插件不统一，导致代码风格不一致。可启用eslint auto fix相关插件，相关配置见下文。

## 编辑器配置
1. VS Code
可添加如下配置，lint相关文件，并且启用保存时自动fix，可解决一些常见warning，如“空格类型”，“单双引号”，“分号”。

```json
"eslint.autoFixOnSave": true,
"eslint.validate": [
	"javascript",
	"javascriptreact",
	{ "language": "vue", "autoFix": true },
	{ "language": "html", "autoFix": true }
]
```

2. Atom
请自行研究。。。
