# Canvas 图片制作

## 说明
绘制图片资源如跨域，请设置该资源服务允许跨域访问。否则，应使用同源图片。

## 用法

1. 初始化

	```js
	const ins = new ImageMaker(options)
	```

2. 一键绘制方法 -- `render`

	传入整体参数，将参数列表中的图片和文案，一次性绘制出来

	```js
	ins.render()
	```

	+ 绘制文本 -- `renderImage`

		```js
		ins.renderImage(options)
		```

	+ 绘图 -- `renderText`

		```js
		ins.renderText(options)
		```


5. 获取图像的 Blob 数据 -- `toBlob`

	```js
	const data = ins.toBlob()
	```

## 参数格式

```js
export default {
	imageList: [{
		// 图片地址
		src: String,
		// 横坐标, [可选]
		dx: Number,
		// 纵坐标, [可选]
		dy: Number,
		// 绘制多宽, [可选]
		dWidth: Number,
		// 绘制多高, [可选]
		dHeight: Number
	}],
	// 文案内容列表，按顺序绘制
	textList: [{
		// 横坐标位置
		x: Number,
		// 纵坐标位置
		y: Number,
		// 准备绘制的文案内容
		text: String,
		// 文案最大宽度，若超过会缩放, [可选]
		maxWidth: Number,
		// 字体样式, 参考 css 写法, [可选]
		font: {
			// font-size, eg. 30px
			size: String,
			// font-family
			family: String,
			// font-weight
			weight: [Number, String],
			// line-height
			lineHeight: [Number, String],
		},
		// 字体颜色, css color, [可选]
		color: String,
		// 对齐方式
		textAlign: String
		// 同 css textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
		textShadow: {
			color: String,
			// 水平偏移量 x
			offsetX: Number,
			// 垂直偏移量 y
			offsetY: Number,
			// 模糊程度
			blur: Number
		}
	}]
}
```

*目前仅支持以上属性，如有需要，请再添加*
