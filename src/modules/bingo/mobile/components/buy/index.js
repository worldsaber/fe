import Vue from 'vue';
import Buy from './index.vue';

let instance;

/**
 * 格式化商品信息
 * @param  {Object} data 单个商品
 * @return {Object}      格式化的商品
 */
function formatGoodsInfo(data = {}) {
	const goods = Object.assign({}, data);
	goods.stock = goods.stock || {};
	// 拍平 stock, 把单价、剩余份数、总量拎出来
	goods.sharePrice = (goods.stock.sharePrice || 0) / 10000;
	goods.leftAmount = goods.stock.leftAmount || 0;
	goods.stockAmount = goods.stock.amount || 0;
	delete goods.stock;
	return goods;
}

function setProps(options = {}, instance = instance) {
	const goods = formatGoodsInfo(options.goods);
	instance.goods = Object.assign({}, goods);
	instance.callback = options.callback;
}

const initInstance = options => {
	const BuyConstructor = Vue.extend(Buy).mixin({
		store: window.v_store,
		router: window.v_router
	});

	const el = document.createElement('div');
	document.body.appendChild(el);

	instance = new BuyConstructor();
	setProps(options, instance);
	instance.$mount(el);

	Vue.nextTick(() => {
		instance.visible = true;
	});
};

const BuyBox = function(options = {}, callback) {
	if (!options) {
		BuyBox.close();
	}

	if (callback) {
		options.callback = callback;
	}

	if (!instance) {
		initInstance(options);
	} else {
		instance.reset();
		setProps(options, instance);
		instance.show();
	}
};

BuyBox.close = () => {
	if (instance) {
		instance.close();
		instance.visible = false;
	}
};

export default BuyBox;
