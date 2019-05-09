# popover引入方式，只支持directive

```
	1. slot方式(弹窗里面的样式自己控制---cssList)
	<div v-popOver:test style="padding: 10px; border: 1px solid red; font-size: 20px; width: 150px;margin-left: 200px;">
	    <PopOver ref="test" position="right">
	        sfddsfdsf
	    </PopOver>
	    <p>slot方式</p>
	</div>
```

```
    2. props方式
    <div v-popOver:test2 style="padding: 10px; border: 1px solid red; font-size: 20px; width: 120px;margin-left: 200px;">
        <PopOver ref="test2" title="test title" content="test message" position="top" :showArrow="false"></PopOver>
        <p>props方式：title和content</p>
    </div>
```

```
	3. attribute方式

	<div v-popOver:test3="content" pop-title="test directive" style="padding: 10px; border: 1px solid red; font-size: 20px; width: 120px;margin-left: 200px;">1234567</div>

	<div v-popOver:test3 pop-title="directive title" pop-content="directive content" style="padding: 10px; border: 1px solid red; font-size: 20px; width: 120px;margin-left: 200px;">1234567</div>
```
