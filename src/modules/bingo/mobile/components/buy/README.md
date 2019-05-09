# Bingo Buy 浮层

## 调用操作
* 打开购买浮层:

```js
import bingoBuy from 'bingo/components/buy';

bingoBuy({
	goods: {...}, // 要购买的商品信息
	callback({ type, data }) {
		if (type === 'success') {
			// todo...
		} else if (type === 'error') {
			// todo...
		}
	}
});
```

* 下单 Goods 信息

```js
* goods.goodsId         商品id
* goods.roundId         期次id
* goods.stock 			库存信息
	- goods.stock.leftAmount	剩余库存
	- goods.stock.sharePrice	单位金额
	- goods.stock.amount 		总库存
```

* **callback**说明：下单成功或失败后, 先弹窗，点击弹窗上的指定按钮，再执行回调。也就是说，下单失败只有部分状态会调callback, 另一些是不会调用callback的

## 说明
购买浮层初始化时会去校验登录操作等，所以你直接打开浮层，更新商品信息即可。

* 购买后退
	如果当前是详情页，点击back时，需要回到history中的列表页，如果上一页仍是详情页，则需replace router
