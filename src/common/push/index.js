/* eslint-disable */
import io from 'socket.io-client';
// import md5 from 'blueimp-md5';
import base64 from 'base64';

import cookie from 'storage/cookie';

const countryConfig = __countryConfig__ || {}; // eslint-disable-line

function generateDeviceId() {
	let d = new Date().getTime();
	const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
	return uuid;
}

const uuid = (function () {
	let uid = 0;
	return function () {
		return ++uid;
	};
})();

// window.atob 不支持中文 utf8 的 base64 解码 所以不能用系统自带的atob方法
const SPLIT_CHAR = '@@';

/** 正则通配符
 * bingoWin^boughtAmount^37^~  //末位
 * bingoWin^~^37  // 中间
 * 不适用与开头就是通配符的，需要调整下面规则
 * */
const REGEXP_MAP = {
	'^~': '^[^^]+',
};

const regExpKeys = Object.keys(REGEXP_MAP);

// REGEXP_MAP中的key包含的char，用于将REGEXP_MAP中的key转换为regexp进行全局替换
const constRegexpKey = /(\^|\~)/g;

function Push(opt) {
	const config = opt || {};
	// 类型
	config.devType = config.devType || 'WEB';
	// 产品code
	config.productCode = countryConfig.productCode || config.productCode || 6;
	// 设备id
	if (!config.deviceId) {
		const id = cookie('device-id');
		if (id) {
			config.deviceId = id;
		} else {
			config.deviceId = generateDeviceId();
			cookie('device-id', config.deviceId, {
				path: '/',
				expires: 1000
			});
		}
	}
	// 账户
	config.accountId = config.accountId || '';
	// server直接写死
	// config.server = '//alive.sportybet.com';

	// http://www.sportybet.com/
	// http://hi.test.easebet.com/ke/m
	const host = location.host;
	const reg = /(?:.+(\.sportybet\.com))|(?:.+(\.test\.easebet\.com))/;
	const res = reg.exec(host);
	if (res && (res[1] || res[2])) {
		config.server = '//alive' + (res[1] || res[2]);
	}
	if (!config.server) {
		config.server = '//alive.sportybet.com';
	}
	config.socketOptions = config.socketOptions || {};
	config.socketOptions.transports = ['websocket', 'polling'];

	this.config = config;
	this.socket = null;
	this.isReady = false;
	// 请求的回调map
	this.requestCallbacks = {};
	// 话题的订阅者
	this.topicListeners = {};
	// 是否就绪
	this.isReady = false;
	// 通配符方式
	this.topicRegListeners = {};
	// 通配符方式：topic 与regexp的对应关系
	this.topicRegMap = {};
	this.setupConnect();
}
/**
 * multi 推送：向相同 accountId 的设备进行推送，当有多个在线时全部收到，当不在线时进行消息缓存，当任意一个上线拿走消息。
 * special 推送：向指定 deviceId 的设备推送，全局唯一，支持缓存。
 * group 推送：向 topic 内所有进行推送，不支持缓存。
 */
Push.PUSH_TYPE = {
	MULTI: 'MULTI',
	GROUP: 'GROUP',
	SPECIAL: 'SPECIAL'
};
Push.prototype.setupConnect = function () {
	this.socket = io(this.config.server, this.config.socketOptions);
	this.socket.on('connect', () => {
		// 这里也可能是 reconnect
		// 建立连接后立马注册
		this.register(function () {
			// ready 置为 true，后续的新 sub 可以直接发 subRequest
			this.isReady = true;
			// disconnect之后，之前sub的话题服务器都会不认，
			// 需要重新订阅
			for (const listenerKey in this.topicListeners) {
				if (this.topicListeners[listenerKey] && this.topicListeners[listenerKey].length) {
					const keys = listenerKey.split(SPLIT_CHAR);
					// 主题
					const topic = keys[0];
					// 推送类型
					const pushType = keys[1];
					this.postSubRequest(topic, pushType);
				}
			}

			// 通配符方式的topic
			for (const listenerRegKey in this.topicRegListeners) {
				if (this.topicRegListeners[listenerRegKey] && this.topicRegListeners[listenerRegKey].length) {
					const keys = listenerRegKey.split(SPLIT_CHAR);
					// 主题
					const topic = keys[0];
					// 推送类型
					const pushType = keys[1];
					this.postSubRequest(topic, pushType);
				}
			}
		});
	});
	this.socket.on('disconnect', () => {
		// 一旦 disconnect,需要把isReady设置为false
		this.isReady = false;
	});
	// 收到请求开始处理
	this.socket.on('data', data => {
		this.responseHandler(data);
	});
};
// 像数据平台注册
Push.prototype.register = function (cb) {
	const data = {
		devType: this.config.devType,
		deviceId: this.config.deviceId
	};
	this.postRequest(data, 'reg', cb);
};
/**
 * @desc 发送请求，用作内部调用，不作为暴露的API
 */
Push.prototype.postRequest = function (data, type, cb) {
	const requestId = uuid();
	if (typeof cb === 'function') {
		this.requestCallbacks[requestId] = cb; // 保存回调函数
	}
	data.requestId = requestId;
	data.productCode = this.config.productCode;
	this.socket.emit('data', {
		data: JSON.stringify(data),
		type
	});
};
// 响应socket接受到的数据
Push.prototype.responseHandler = function (ret) {
	ret = ret || {};
	const data = JSON.parse(ret.data || '{}');
	if (ret.type === 'resp') {
		// 对于一个request，此时得到一个 response 了
		// 找到这个request的callback，执行callback
		// data=>{requestId,retCode}
		const callback = this.requestCallbacks[data.requestId];
		if (callback) {
			callback.call(this, data);
			delete this.requestCallbacks[data.requestId];
		}
	// topic消息
	} else if (ret.type === 'ret') {
		// topic 推送消息过来了
		// data=>{topic,pushType,body}
		const topic = data.topic;
		const pushType = data.pushType;
		const body = base64.decode(data.body);
		// console.log(topic);
		// 处理不含有通配符的topic
		const listenerKey = topic + SPLIT_CHAR + pushType + '';

		let listenerList;
		// 针对已经订阅主题的请求去调用
		listenerList = this.topicListeners[listenerKey] || [];
		for (let i = 0; i < listenerList.length; i++) {
			listenerList[i].call(this, body);
		}

		// 处理含有通配符的topic
		const regKeys = Object.keys(this.topicRegListeners);
		for (const regKey of regKeys) {
			listenerList = [];

			if (this.topicRegMap[regKey]) {
				if (new RegExp('^' + this.topicRegMap[regKey] + '$').test(listenerKey)) {
					listenerList = this.topicRegListeners[regKey] || [];
					for (let i = 0; i < listenerList.length; i++) {
						listenerList[i].call(this, body);
					}
				}
			}
		}
	}
};
// 订阅主题请求
Push.prototype.postSubRequest = function (topic, pushType, cb) {
	const data = {
		topic,
		subType: 'SUB',
		pushType
	};
	// multi push
	if (this.config.accountId && pushType === Push.PUSH_TYPE.MULTI) {
		data.accountId = this.config.accountId;
	}
	this.postRequest(data, 'sub', cb);
};
/**
 * topic 主题
 * pushType 订阅 类型 MULTI GROUP SPECIAL
 * cb 订阅后触发
 * listener 主题被触发的时候触发
 */
Push.prototype.sub = function (param) {
	const topic = param.topic;
	const pushType = param.pushType;
	const listener = param.listener;
	const cb = param.callback;
	const listenerKey = topic + SPLIT_CHAR + pushType + '';
	let listenerList,
		isReg = false,
		tempKey = listenerKey;

	for (const regKey of regExpKeys) {
		if (listenerKey.indexOf(regKey) !== -1) {
			const regKeyTemp = regKey.replace(constRegexpKey, '\\$1');
			const tmp = new RegExp(regKeyTemp, 'g');
			let arr = tmp.exec(tempKey);
			// 采用循环替换替换^~^这是为了解决  2个连接在一起的问题如^~^~^
			while (arr) {
				tempKey = tempKey.replace(regKey, REGEXP_MAP[regKey]);
				arr = tmp.exec(tempKey);
			}
			// tempKey = tempKey.replace(new RegExp(regKeyTemp, 'g'), REGEXP_MAP[regKey]);
			!isReg && (isReg = true);
		}
	}

	if (isReg) {
		listenerList = this.topicRegListeners[listenerKey] || [];
		tempKey = tempKey.replace(/\./g, '\\.').replace(/\|/g, '\\|').replace(/\^(?!\^)/g, '\\^');
		this.topicRegMap[listenerKey] = tempKey;
	} else {
		listenerList = this.topicListeners[listenerKey] || [];
	}

	if (listenerList.length) {
		// 已经有人订阅此话题
		listenerList.push(listener);
		if (typeof cb === 'function') {
			setTimeout(() => {
				cb.call(this);
			}, 0);
		}
	} else {
		listenerList.push(listener);
		if (isReg) {
			this.topicRegListeners[listenerKey] = listenerList;
		} else {
			this.topicListeners[listenerKey] = listenerList;
		}
		if (this.isReady) {
			this.postSubRequest(topic, pushType, cb);
		}
	}
};
// 发出取消订阅的请求
Push.prototype.postUnsubRequest = function (topic, pushType, cb) {
	const data = {
		topic,
		subType: 'UNSUB',
		pushType
	};
	this.postRequest(data, 'sub', cb);
};
// 取消订阅主题
Push.prototype.unsub = function (param) {
	const topic = param.topic;
	const pushType = param.pushType;
	const listener = param.listener;
	const cb = param.callback;
	const regExpKeys = Object.keys(REGEXP_MAP);
	let listenerList,
		listenerKey = topic + SPLIT_CHAR + pushType + '',
		isReg = false;

	for (const regKey of regExpKeys) {
		if (listenerKey.indexOf(regKey) !== -1 && !isReg) {
			isReg = true;
			break;
		}
	}

	if (isReg) {
		listenerList = this.topicRegListeners[listenerKey] || [];
	} else {
		listenerList = this.topicListeners[listenerKey] || [];
	}

	if (listenerList && listenerList.length > 0) {
		if (!listener) {
			// 全部取消sub
			listenerList.length = 0;
		} else {
			// 取消当前listener
			for (let i = 0; i < listenerList.length; i++) {
				if (listenerList[i] === listener) {
					listenerList.splice(i, 1);
					break;
				}
			}
		}
		if (listenerList.length === 0) {
			// 没有人再订阅这个topic了
			if (isReg) {
				delete this.topicRegListeners[listenerKey];
			} else {
				delete this.topicListeners[listenerKey];
			}

			if (this.isReady) {
				this.postUnsubRequest(topic, pushType, cb);
			}
			return;
		}
	}
	if (typeof cb === 'function') {
		setTimeout(() => {
			cb.call(this);
		}, 0);
	}
};
export default Push;
