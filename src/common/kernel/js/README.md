# kernel框架 #

## 入口 ##
- core/desktop  默认入口，可以简写为 `core`
- core/mobile	移动端入口

> myInit 方法已经不再具备初始化功能，请使用 init 方法。

## console ##
给低版本浏览器增加模拟 console 占位对象，提供以下占位方法：
	
```js
	console.log();
	console.error();
	console.info();
	console.warn();
```

所以你可以在业务代码中放心使用 console对象的上述方法而不用担心在低版本IE中会报错。
> 注：占位方法没有任何实体代码。

## 垫片 ##
polyfill为垫片，只加载必要的垫片模块，如果有疑问，后者想增加垫片，可以在polyfill.js中增加，polyfill.js依赖 core-js
