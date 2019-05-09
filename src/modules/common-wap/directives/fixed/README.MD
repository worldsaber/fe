# v-fixed

## 用法

```js
import getFixed from 'directives/fixed';
export default {
	// 组件内的指令
	directives: {
		fixed: getFixed(), // 需要闭包保存一些变量
	}
};
/**
v-fixed="value" 或者 v-fixed [value 此时为 0]

value 表示的是置顶时距离顶部的高度，默认的是0; 单位是`/rem`， 也就是值为: `${value/12}rem`

@example:

v-fixed 表示 置顶

v-fixed="100" 表示置顶在距离顶部 (100/12)rem位置

*/
```

## 不用全局指令和mixin

主要是指令实现包含闭包，每个地方需要 单独生成，不能公用；

缓存后会造成公用。

## 置顶样式

置顶后的样式目前没有特殊处理，和常规是一样的；置顶只处理了position,top,zIndex。
如果特殊需要，可以指定cls，`v-fix:cls="value"` 形式; 置顶时会给置顶元素增加cls classname; 非置顶时移除。

## 应用

1. eventDetail 页面， market group 置顶功能
