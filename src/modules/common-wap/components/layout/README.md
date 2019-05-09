# 页面布局组件

1. 所有页面都应该引入该组件
2. 入口为main

## 页面模块
1. left模块，为左侧azMenu模块
2. main为中间模块
3. right模块为右侧betslip嵌入模块

> 通常开发左右模块不动，只有中间模块更改

> layout组件已经默认加载layout的store和pageloading组件，需要从layout的store中取loading状态

## 使用方法
``` html
	<template>
		<layout>
			content....
		<layout>
	</template>
```

## 组件参数

- isHaveBottomNav 是否显示底部导航 默认true
- isHaveNavBar 是否显示顶部navBar 默认true
- isHaveLoading 是否默认显示loading 默认true
- isHasFooter 是否显示footer 默认true
- isNeedScroll 是否需要滚动事件 默认false
- isHaveLeftPagelet 是否显示左侧AZ-menu浮窗 默认true
- isHaveRightPagelet 是否显示右侧betslip下单浮窗 默认false

## 组件使用事项
- 强依赖 betslip和layout的store，请在根节点注入

``` javascript
const store = new Vuex.Store({
	modules: {
		layout,
		betslip
	}
});

```
