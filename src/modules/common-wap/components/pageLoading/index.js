import Vue from 'vue';
// pageLoading组件
Vue.directive('pageLoading', {
	// 绑定
	bind (el, binding, vnode) {
		let loading = document.querySelector('#pageLoading');
		if (!loading) {
			loading = document.createElement('div');
			loading.innerHTML = `
			<div class="m-page-loading-wrap" id="pageLoading">
				<div class="m-page-loading">
					<div class="loading">Loading...</div>
					<div class="loading-page-fail">
						<p class="fail-text">Failed to load game data.Please refresh the page.</p>
						<div class="fail-btn">Rload</div>
					</div>
				</div>
			</div>`;
			document.body.appendChild(loading);
			loading = document.querySelector('#pageLoading');
		}
		loading.querySelector('.fail-btn').addEventListener('click', () => {
			window.location.reload();
		});
		if (binding.value === -1) {
			loading.addClass('m-page-loading-fail');
		} else {
			loading.removeClass('m-page-loading-fail');
		}
		loading.style.display = binding.value === 0 || binding.value === false ? 'none' : '';
		el.loading = loading;
	},
	// 组件更新
	componentUpdated (el, binding, vnode) {
		if (el.loading) {
			if (binding.value === -1) {
				el.loading.addClass('m-page-loading-fail');
			} else {
				el.loading.removeClass('m-page-loading-fail');
			}
			el.loading.style.display = binding.value === 0 || binding.value === false ? 'none' : '';
		}
	},
	// 解除绑定
	unbind (el, binding, vnode) {
		if (el.loading) {
			el.loading.style.display = 'none';
			delete el.loading;
		}
	}
});
