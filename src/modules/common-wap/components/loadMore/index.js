import Vue from 'vue';

const handleScroll = function(e, el, opts) {
	// console.log(opts);
	const { hasMore, loadMore, threshold, wrap, scrollFun, throttle, context } = opts;
	if (scrollFun) {
		if (throttle > 0) {
			if (!el.__scrollTimerId) {
				el.__scrollTimerId = setTimeout(() => {
					scrollFun.call(context);
					el.__scrollTimerId = null;
				}, throttle);
			}
		} else {
			scrollFun.call(context);
		}
	}
	if (wrap.scrollTop === 0) {
		// 非正常滚动行为，比如切换列表内容导致滚动条消失
		return;
	}
	if (wrap.scrollTop + wrap.clientHeight + threshold >= wrap.scrollHeight && !el.__isLoading && hasMore) {
		el.__isLoading = true;
		loadMore.call(context).then(() => {
			// 这里loadMore中数据已更新，then相当于nextTick效果
			el.__isLoading = false;
		}).catch(() => {
			el.__isLoading = false;
		});
	}
};

let passiveSupported = false;

try {
	const options = Object.defineProperty({}, 'passive', {
		get: () => {
			passiveSupported = true;
		}
	});

	window.addEventListener('__detectEventPassive__', options, options);
	window.removeEventListener('__detectEventPassive__', options, options);
} catch (e) {
	passiveSupported = false;
}
// pageLoading组件
Vue.directive('loadMore', {
	// 绑定
	inserted (el, binding, vnode) {
		// console.log('insert', el, binding, vnode);
		let { className } = binding.value;
		const arg = binding.arg || '';
		className = className || '.m-main-mid'; // 如果使用了layout，可以使用该元素作为容器
		const wrap = document.querySelector(className);
		let throttle = binding.value.throttle;
		throttle = Object.prototype.toString.call(throttle) === '[object Number]' && throttle > 0 ? throttle : 0;
		if (wrap) {
			el.__isLoading = false;
			el.__scrollFun = e => {
				// console.log('scroll');
				handleScroll.call(this, e, el, {
					wrap,
					hasMore: vnode.context[arg] || false,
					loadMore: binding.value.onLoadMore,
					threshold: binding.value.threshold || 0,
					scrollFun: binding.value.onScroll,
					throttle,
					context: vnode.context
				});
			};
			el.__scrollWrap = wrap;
			wrap.addEventListener('scroll', el.__scrollFun, passiveSupported ? { passive: true } : false);
			// 使用原生滚动，不会去禁默认行为
		} else {
			console.error('Can\'t find scroll container');
		}
	},
	// //绑定
	// bind (el, binding, vnode) {
	// 	console.log('bind', el, binding, vnode);
	// },
	// // 组件更新
	// componentUpdated (el, binding, vnode) {
	// 	console.log('componentUpdated', el, binding, vnode);
	// },
	// 解除绑定
	unbind (el, binding, vnode) {
		// console.log('unbind', el, binding, vnode);
		el.__scrollWrap && el.__scrollWrap.removeEventListener('scroll', el.__scrollFun);
		delete el.__isLoading;
		delete el.__scrollFun;
		delete el.__scrollWrap;
	}
});
