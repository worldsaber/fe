import Vue from 'vue';

import BalanceTips from '../pagelet/balanceTips.vue';

export function showBetHistoryTips(options) {
	let amountSelector = options && options.amountDom || null;
	if (!amountSelector) {
		amountSelector = '#j_betHistory .tips-wrapper';
	}

	const amountDom = document.querySelector(amountSelector);
	if (!amountDom) {
		console.log('if amountDom is not #j_betHistory, amountDom is required');
		return;
	}

	new Vue({
		el: amountSelector,
		render: h => h(BalanceTips)
	});
}

export default showBetHistoryTips;

window.showBetHistoryTips = showBetHistoryTips;
