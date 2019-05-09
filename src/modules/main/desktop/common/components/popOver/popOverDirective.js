import Vue from 'vue';
import PopOver from './popOver.vue';

export default {
	bind(el, bindings, vnode) {
		let content = bindings.value || el.getAttribute('pop-content') || '',
			title = el.getAttribute('pop-title') || '';

		if (!content && !title) {
			throw new Error('must pass content or title!');
		}

		if (content) {
			content = title;
			title = '';
		}

		const pop = new Vue({
			el: document.createElement('div'),
			render: h => h(PopOver, {
				props: {
					position: el.getAttribute('pop-position') || 'top',
					content,
					title,
					refParent: el,
					cssList: el.getAttribute('pop-styles') || ''
				}
			})
		});
		el.appendChild(pop.$el);
	}
};
