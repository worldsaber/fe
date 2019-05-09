# loading使用方法

1. 在模版中

``` html
	<template>
		<!--  通过isLoading的值去确定当前的加载状态是什么,true表示加载中，false表示加载完成-->
		<div class='container' v-loading:loading.dark="isLoading">
		</div>
	</template>
```
## 参数说明
1. isLoading 表示加载状态 true表示加载中，false表示加载完成 -1表示加载失败 arg中的loading表示加载失败后点击 重试按钮要调用的方法 
2. dark 表示主题是黑色,否则是浅色的
