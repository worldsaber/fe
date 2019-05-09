/* AlloyFinger v0.1.0 for Vue
 * By june01
 * Github: https://github.com/AlloyTeam/AlloyFinger
 */
import Vue from 'vue';
import AlloyFinger from './finger';

const AlloyFingerPlugin = {
	install (Vue, options) {
		options = options || {};
		const isVue2 = !!(+Vue.version.substr(0, 1) === 2);
		if (!AlloyFinger) {
			throw new Error('you need include the AlloyFinger!');
		}

		const EVENTMAP = {
			'touch-start': 'touchStart',
			'touch-move': 'touchMove',
			'touch-end': 'touchEnd',
			'touch-cancel': 'touchCancel',
			'multipoint-start': 'multipointStart',
			'multipoint-end': 'multipointEnd',
			tap: 'tap',
			'double-tap': 'doubleTap',
			'long-tap': 'longTap',
			'single-tap': 'singleTap',
			rotate: 'rotate',
			pinch: 'pinch',
			'press-move': 'pressMove',
			swipe: 'swipe'
		};

		const CACHE = [];

		let directiveOpts = {};

		// get the index for elem in CACHE
		const getElemCacheIndex = function (elem) {
			for (let i = 0, len = CACHE.length; i < len; i++) {
				if (CACHE[i].elem === elem) {
					return i;
				}
			}

			return null;
		};

		// do on or off handler
		const doOnOrOff = function (cacheObj, options) {
			const eventName = options.eventName;
			const elem = options.elem;
			const func = options.func;
			const oldFunc = options.oldFunc;

			if (cacheObj && cacheObj.alloyFinger) {
				if (cacheObj.alloyFinger.off && oldFunc) cacheObj.alloyFinger.off(eventName, oldFunc);
				if (cacheObj.alloyFinger.on && func) cacheObj.alloyFinger.on(eventName, func);
			} else {
				options = {};
				options[eventName] = func;

				CACHE.push({
					elem,
					alloyFinger: new AlloyFinger(elem, options)
				});
			}
		};

		// for bind the event
		const doBindEvent = function (elem, binding) {
			const func = binding.value;
			const oldFunc = binding.oldValue;
			let eventName = binding.arg;

			eventName = EVENTMAP[eventName];

			const cacheObj = CACHE[getElemCacheIndex(elem)];

			doOnOrOff(cacheObj, {
				elem,
				func,
				oldFunc,
				eventName
			});
		};

		// for bind the event
		const doUnbindEvent = function (elem) {
			const index = getElemCacheIndex(elem);

			if (!isNaN(index)) {
				const delArr = CACHE.splice(index, 1);
				if (delArr.length && delArr[0] && delArr[0].alloyFinger.destroy) {
					delArr[0].alloyFinger.destroy();
				}
			}
		};

		if (isVue2) {
			directiveOpts = {
				bind: doBindEvent,
				update: doBindEvent,
				unbind: doUnbindEvent
			};
		} else {
			console.log('in else');
			// vue1.xx
			directiveOpts = {
				update (newValue, oldValue) {
					const binding = {
						value: newValue,
						oldValue,
						arg: this.arg
					};
					const elem = this.el;
					doBindEvent.call(this, elem, binding);
				},
				unbind () {
					const elem = this.el;
					doUnbindEvent.call(this, elem);
				}
			};
		}
		// definition
		Vue.directive('finger', directiveOpts);
	}
};
Vue.use(AlloyFingerPlugin);

export default AlloyFingerPlugin;
