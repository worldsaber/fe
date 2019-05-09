import throttle from 'utils/throttle';

// scroll container selector
const selector = '.m-main-mid';
const cacheKey = 'offset';
// 第三个参数option支持检查
let passiveSupported = false;
try {
	const options = Object.defineProperty({}, 'passive', {
		get: () => {
			passiveSupported = true;
		}
	});

	window.addEventListener('test', options, options);
} catch (e) {
	passiveSupported = false;
}
const passiveOptions = passiveSupported ? { passive: true } : false;

export default () => {
	// 主要是unbind 时需要去除scroll 事件； 采用缓存事件

	let scrollListener = null;
	let $mid = null;

	// 处理当前绑定元素 置顶样式
	let padDiv = null;

	const elListener = el => {
		// 处理滚动位置
		const isFixed = el.dataset.fixed === '1';
		const ele = isFixed ? padDiv : el;  // 确定是否在视图内的元素
		const rect = ele.getBoundingClientRect();

		const top = parseInt(el.dataset[cacheKey] || 0, 10);
		const cls = el.dataset.cls;

		if (rect.top <= top) { // 需要置顶
			if (el.dataset.fixed === '1') {
				return;
			}
			padDiv = document.createElement('div');
			// 占位空白的宽高
			const width = el.clientWidth;
			const height = el.clientHeight;
			padDiv.style.width = `${width}px`;
			padDiv.style.height = `${height}px`;

			// 缓存以前的值，以待恢复
			el.dataset.position = el.style.position;
			el.dataset.top = el.style.top;
			el.dataset.zIndex = el.style.zIndex;
			// 置顶top
			el.style.position = 'fixed';
			el.style.top = `${top / 12}rem`;
			el.style.zIndex = 1000;

			el.classList.add(cls);

			const parent = el.parentNode;
			parent && parent.insertBefore(padDiv, el);

			el.dataset.fixed = '1';
		} else { // 移除置顶
			if (!el.dataset.fixed) {
				return;
			}
			// 移除占位空白
			if (padDiv) {
				padDiv.parentNode.removeChild(padDiv);
				padDiv = null;
			}
			// 恢复以前的位置样式
			el.style.position = el.dataset.position;
			el.style.top = el.dataset.top;
			el.style.zIndex = el.dataset.zIndex;
			el.classList.remove(el.dataset.cls);
			// 移除标记
			delete el.dataset.fixed;
		}
	};

	return {
		bind(el, binding) {
			// offset的值
			el.dataset[cacheKey] = binding.value || 0;
			el.dataset.cls = binding.arg;
			$mid = document.querySelector(selector);
			scrollListener = throttle(() => {
				elListener(el);
			}, 100);

			$mid.addEventListener('scroll', scrollListener, passiveOptions);
		},
		componentUpdated(el, binding) {
			el.dataset[cacheKey] = binding.value || 0;
		},
		unbind() {
			// 去除scroll监听
			$mid.removeEventListener('scroll', scrollListener, passiveOptions);
			$mid = null;
			scrollListener = null;
		}
	};
};

// 用法
/**
 * v-fixed
 * v-fixed="20" // px
 * v-fixed="cls"
 */
