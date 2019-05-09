# 图片浏览器

> 依赖于 [v-viewer](https://github.com/mirari/v-viewer#readme) 和 [viewerjs](https://github.com/fengyuanchen/viewerjs#getting-started)

### demo

* directive

```vue
<div class="m-img-container" v-viewer>
	<img src="./images/example2.png" alt="">
</div>
```

* component

```vue
<viewer :images="images">
	<img v-for="src in images" :src="src" :key="src">
</viewer>
```


### 配置参数

```js
Viewer.setDefaults({
	toolbar: false,
	navbar: false,
	title: false,
	minZoomRatio: 0.5,
	maxZoomRatio: 10
});
```
