/*
 * 本地化存储(localStorage) 组件
 * 不支持本地存储的将创建一个 window.localStorage 对象来提供类似接口
 * 二次包装的接口 LS 提供以下方法和属性（如果有jQuery则同样会扩展该对象）
	set : function(key, vlaue)
	get : function(key)
	remove : function(key)
	clear : function()
	each : function(callback) callback接受两个参数 key 和 value
	obj : function() 返回一个对象描述的localStorage副本
 */
const noop = () => {};
const notSupport = { set: noop, get: noop, remove: noop, clear: noop, each: noop, obj: noop, length: 0 };
const LS = window.localStorage || notSupport;
let COM = { // eslint-disable-line
	/**
	 * @name  LS.set
	 * @description 设置本地存储内容
	 * @param {string} key   本地存储的字段key
	 * @param {string} value 本地存储的设置的value，必须只能是字符串
	 * @function
	 */
	set (key, value) {
		// fixed iPhone/iPad 'QUOTA_EXCEEDED_ERR' bug
		if (this.get(key) !== undefined) {
			this.remove(key);
		}
		LS.setItem(key, value);
		this.length = LS.length;
	},
	/**
	 * @name  LS.get
	 * @description 获取本地存储内容
	 * @param {string} key   本地存储的字段key
	 * @return {string} 指定key的本地存储内容，如果没有值，则返回undefined
	 * @function
	 */
	get (key) {
		const v = LS.getItem(key);
		return v === null ? undefined : v;
	},
	/**
	 * 删除本地存储内容
	 * @name  LS.remove
	 * @param {string} key   本地存储的字段key
	 * @function
	 */
	remove (key) {
		LS.removeItem(key);
		this.length = LS.length;
	},
	/**
	 * @name  LS.clear
	 * @description 清空本地存储内容
	 * @function
	 */
	clear () {
		LS.clear();
		this.length = 0;
	},
	/**
	 * @name  LS.each
	 * @description 遍历本地存储内容
	 * @param {string} handler   遍历检查函数，改函数接受两个参数 key 和 value，如果返回false则终止遍历
	 * @function
	 */
	each (handler) {
		const list = this.obj();
		const fn = handler || noop;
		let key;
		for (key in list) {
			if (fn.call(this, key, this.get(key)) === false) {
				break;
			}
		}
	},
	/**
	 * @name  LS.obj
	 * @description 获取一个本地存储数据的对象副本
	 * @function
	 */
	obj () {
		const list = {};
		let i = 0;
		let key;
		const n = LS.length;
		for (; i < n; i++) {
			key = LS.key(i);
			list[key] = this.get(key);
		}
		return list;
	},
	length: LS.length
};

try {
	// 测试是否能够设置或者移除值，如果抛出错误也认为不支持
	COM.set('test', 'test');
	COM.remove('test');
} catch (e) {
	COM = notSupport;
}
export default COM;
