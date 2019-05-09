import { mapActions, mapMutations } from 'vuex';
import { TOGGLE_RIGHT } from 'store/layout/mutationTypes';

export default {
	data() {
		return {
			bookingCodes: []
		};
	},
	methods: {
		...mapActions('betslip', ['loadBetslip']),
		...mapMutations('layout', {
			toggleRight: TOGGLE_RIGHT
		}),
		// 解析 booking code 字符串
		resolveBookingCode(text = '', commentId) {
			const reg = /bc[\S]{5}/ig;
			this.bookingCodes = text.match(reg) || [];

			if (!this.bookingCodes.length) return [];

			const textArr = [];
			text.split(reg).forEach((s, i) => {
				textArr.push(s);
				if (this.bookingCodes[i]) {
					textArr.push(this.bookingCodes[i]);
				}
			});
			return textArr;
		},
		async goToBetslip(text) {
			if (this.bookingCodes.includes(text)) {
				try {
					await this.loadBetslip({
						betCode: text
					});
					this.toggleRight(true);
				} catch (err) {
					console.log(err); // eslint-disable-line
					this.$toast(err);
				}
			}
		},
	}
};
