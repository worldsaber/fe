import Vue from 'vue';
import loading from './loading.vue';

const Loading = Vue.extend(loading);

const retry = function () {
	window.location.reload();
};
// pageLoading组件
Vue.directive('loading', {
	// 绑定
	bind (el, binding, vnode) {
		el.__loadingDom = document.createElement('div');
		const modifiers = binding.modifiers;
		el.__loading = new Loading({
			propsData: {
				isLoading: binding.value,
				theme: modifiers.dark ? 'dark' : 'light'
			}
		});
	},
	inserted (el, binding, vnode) {
		const arg = binding.arg;
		let retryFun = retry;
		if (arg && vnode.context[arg] && typeof vnode.context[arg] === 'function') {
			retryFun = vnode.context[arg];
		}
		let elPos = window.getComputedStyle(el);
		elPos = elPos.position;
		if (elPos !== 'fixed' && elPos !== 'absolute' && elPos !== 'relative') {
			el.style.position = 'relative';
		}
		el.__retry = function () {
			retryFun.call(vnode.context);
		};
		el.appendChild(el.__loadingDom);
		el.__loading.$mount(el.__loadingDom);
		el.__loading.$on('fail', el.__retry);
	},
	// 组件更新
	componentUpdated (el, binding, vnode) {
		if (el.__loading) {
			el.__loading.isLoading = binding.value;
		}
	},
	// 解除绑定
	unbind (el, binding, vnode) {
		if (el.__loading) {
			el.__loading.$destroy();
			// el.removeChild(el.__loadingDom);
			el.__loading = null;
			el.__loadingDom = null;
		}
	}
});
