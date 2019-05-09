# loadmore使用方法

 在模版中

``` html
	<template>
		<!--  通过isLoading的值去确定当前的加载状态是什么,true表示加载中，false表示加载完成-->
		<ul class='list' v-loadMore:hasMore="loadMoreConfig">
			<li></li>
		</ul>
	</template>
```
## 参数说明
hasMore对应当前组件中的计算属性，用来标识是否已加载到底部。
loadMoreConfig是一个对象，包括以下参数:
	className | String: 滚动容器的选择器字符串, 默认是'.m-main-mid'(即 使用了layout组件时的默认滚动容器).
	onLoadMore | function: 获取分页数据的请求, 应返回一个Promise对象(fetch也可).
	scrollFun | function: 滚动过程中需要执行的方法. 常见需求比如滚动时对一些元素做fix定位.
	throttle | Number: 用于函数节流，scrollFun方法触发的时间间隔, 单位毫秒
	threshold | Number: 加载下一页的阈值， 页面距离底部threshold个px时开始加载下一页.

loadMore指令不关心具体请求格式和分页参数，只根据hasMore和滚动事件去触发数据请求， 用户自行维护hasMore， 并在数据请求方法中更新列表数据和分页信息即可， 具体见demo.
