# 横向滚动模拟mixins

## 功能改mixins可以提供组件拥有横向滚动的能力 -- (不是原生的滚动)

## 要求
1. 要求对于mixins的组件必须在refs中有nav属性，nav表示要滚动的元素
2. 会生成navStyle的样式，请应用到要滚动的元素上

# DEMO
``` html
<template>
	<div>
		<!-- 注意这里的navStyle必须有 ref也必须有 -->
		<ul class="navStyle" ref="nav"></ul>
	<div>
</template>
```
``` javascript
import translateScrollX from './translateScroll'

export default {
	mixins: [translateScrollX]
}

```

