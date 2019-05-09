# 页面加载指令

# 原理

- 在ftl中已经提前加载好dom，进入页面直接显示loading,从而保证速度
- 样式在core.less中

#使用
1. `在最外面的.vue的模板文件中加入指令调用`

``` html
	<template>
		<!--  通过isLoading的值去确定当前的加载状态是什么,true表示加载中，false表示加载完成-->
		<div class='container' v-pageLoading="isLoading">
		</div>
	</template>
```


# 使用注意
1. 页面加载指令是整个页面用一个loading遮住，当页面加载好后，遮罩消失，所以每个页面只能有一个
2. 页面加载指令的状态需要由组件自己进行控制
3. layout组件已经默认加载layout的store和pageloading组件，需要从layout的store中取loading状态
4. isLoading 1或者true表示加载中，0或false表示加载成功，-1表示加载失败
