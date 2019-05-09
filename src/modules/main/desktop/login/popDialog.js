import Vue from 'vue';
import store from 'store/loginRegister';
import dialog from 'components/dialog';
import PopDialog from './popDialog.vue';

export default function popDialog() {
	const SubApp = Vue.extend(PopDialog).mixin({
		store
	});

	return dialog({
		title: null,
		content: SubApp,
		button: [],
		position: {
			left: 'auto',
			top: '138px'
		}
	});
}
