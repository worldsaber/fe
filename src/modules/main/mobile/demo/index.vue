<template lang="html">
<div>
	<!-- <WinningsTips :contentData="contentData"></WinningsTips> -->
	<!-- <GiftTips :contentData="contentData"></GiftTips> -->
	<!-- {{test}} -->
	<MakeImgDemo></MakeImgDemo>
</div>
</template>

<script>
import { formatNumber } from 'utils';
import { bizType2key } from 'config/couponsConfig';
// import demo from 'packages/select/demo.vue';
// import Slider from 'packages/slider/demo.vue';
import GiftTips from 'components/popDialog/gifts';
import WinningsTips from 'components/popDialog/winnings';
// import 'components/popDialog/winnings';
import changeRegion from 'components/popDialog/region';

import dialog from 'components/dialog';
import { formatMoneyShow } from 'config/showMoneyConfig';
import MakeImgDemo from './makeImgDemo';

let popDialog;

// const testData = {
// 	title: 'Congratulations!',
// 	text: 'You\'ve got a new gift',
// 	amount: 30000000,
// 	currency: 'KES',
// 	linkUrl: 'https://online.easebet.com/ke/sport/football',
// 	kind: 2,
// 	isMultiple: true,
// 	leastOrderAmount: 100000,
// 	usableTime: 1520380800000,
// 	expireTime: 1529107199000,
// 	activityName: 'Gift Resource text here.Gift Resource text here.Gift Resource text here'
// };

const testData = {"type":"recent_winning_order","data":{"orderId":"1712120748527105886734","shortId":"702932","bizType":3,"subBizType":2,"betType":null,"periodNumber":null,"correctEvents":null,"status":25,"winningStatus":20,"currency":"KES","totalStake":"300000.00","paymentAmount":"300000.00","favorAmount":null,"favor":null,"totalWinnings":"303000.00","totalBonus":null,"potentialWinnings":null,"bets":null,"createTime":1513064932000}};

export default {
	components: {
		// demo,
		// Slider
		GiftTips,
		WinningsTips,
		MakeImgDemo
	},
	data() {
		return {
			contentData: {
				isLapse: false,
				amount: '222',
			}
			// contentData: {
			// 	sportType: 'jackpot',
			// 	showWinnings: '12,324.00',
			// 	shortId: '222',
			// }
		};
	},
	created () {
		window.test = this;
	},
	methods: {
	},
	mounted() {
		// popDialog = dialog({
		// 	title: null,
		// 	'class': 'm-gift-pop',
		// 	contentData: clearGiftsData(testData),
		// 	content: GiftTips,
		// 	button: []
		// }).onBtnClick(btnType => {
		// 	popDialog && popDialog.close();
		// 	popDialog = null;
		// 	return false;
		// });
		// popDialog = dialog({
		// 	title: null,
		// 	'class': 'm-winnings-pop',
		// 	contentData: clearPushData(testData),
		// 	content: WinningsTips,
		// 	button: []
		// }).onBtnClick(btnType => {
		// 	popDialog && popDialog.close();
		// 	popDialog = null;
		// 	return false;
		// });
		document.querySelector('#pageLoading').style.display = 'none';
		changeRegion();
	}
};

function clearPushData(data = {}) {
	if (!data) {
		return;
	}

	// const orderInfo = data.data || null;
	// let winningInfo;

	// if (orderInfo) {
	// 	orderInfo.sportType = bizType2key[orderInfo.bizType];
	// 	orderInfo.showWinnings = orderInfo.totalWinnings && formatNumber(+orderInfo.totalWinnings, 2);
	// 	winningInfo = orderInfo;
	// }

	// return winningInfo;
}

function clearGiftsData(orderInfo) {
	const amount = +orderInfo.amount || 0;
	orderInfo.amount = amount / 10000;
	if (orderInfo.leastOrderAmount) {
		orderInfo.leastOrderAmount /= 10000;
		orderInfo.showCondition = formatMoneyShow(orderInfo.leastOrderAmount);
	}

	orderInfo.isLapse = orderInfo.kind === 1;

	return orderInfo;
}
</script>

<style lang="less">
</style>
