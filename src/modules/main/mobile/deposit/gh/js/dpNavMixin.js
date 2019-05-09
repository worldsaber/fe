import { pagePath } from 'config/pageConfig.js';
import {
	mapMutations
} from 'vuex';
import {
	UPDATEPAGEMODULE
} from 'store/deposit/gh/mutationTypes';

export default {
	methods: {
		...mapMutations('deposit', {
			chgPageModule: UPDATEPAGEMODULE
		}),
		backHandler() {
			this.chgPageModule('index');
		},
		depositHelp() {
			location.href = pagePath.help + '#/how-to-play/others/how-to-deposit';
		},
	}
};
