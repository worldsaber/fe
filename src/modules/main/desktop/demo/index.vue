<template lang='html'>
<div class="container">
  <!-- <div class='m-page-wrapper'> -->
	<!-- <button type='button' name='button' @click='showPopDialog'>show Dialog</button>
	<SlidePopDialog :pageCount='5' width='320px' height='300px' :show='showPop'>
		<template v-for='(item,index) in 5'>
		  <pageItem :pageIndex='index'>
			  <p>{{item}}</p>
			  <div class='m-operation'>
				  <button type='button' name='prev' @click.stop.prevent='goPrev(index)'>prev</button>
				  <button type='button' name='next' @click.stop.prevent='goNext(index)'>next</button>
			  </div>
		  </pageItem>
		</template>
	</slidePopDialog>-->
	<!-- <Step /> -->
	<!-- <PopOver /> -->
	<!-- <button id='a' type='button' name='button' @click='handleClick'>debounce</button> -->
	<!-- <AfInput /> -->
	<!-- <AfTab style='width: 300px; margin: 20px auto;'/> -->
	<!-- <Login/> -->
	<!-- <Tips /> -->
	<!-- <sportList></sportList> -->
	<!-- <BetTable></BetTable> -->
	<!-- <AfSelect /> -->
	<!-- <Slider /> -->
	<!-- <AfCarousel :itemsList = 'list' :carouselOps = 'ops'></AfCarousel> -->
	<!-- <Demo/> -->

	<!-- <BetslipPrint /> -->
	<!-- <Broadcast :list="bdList" :config="bdConfig">
		<div slot="bdcastList" style="overflow: hidden">
			<div style="height: 20px; background: red"></div>
			<div style="height: 30px; background: lightblue"></div>
			<div style="height: 25px; background: pink"></div>
		</div>
	</Broadcast> -->
  </div>
</template>

<script>
import Vue from 'vue';
// import { EventBus } from 'kernel/js/eventBus';
// import SlidePopDialog from 'components/slidePopDialog/slideDialogContainer.vue';
// import pageItem from 'components/slidePopDialog/pageItem.vue';
// import popDialogEvent from 'config/eventConfig/popDialogEvent';
// import Step from 'components/steps/demo.vue';
// import PopOver from 'components/popOver/demo.vue';
// import AfInput from 'packages/input/demo.vue';
// import Demo from 'components/loading/demo';
// import AfTab from 'packages/tabs/demo.vue';

// import Login from 'components/login/pagelet/index.vue';
// import Login from 'components/login/pagelet/code.vue';
// import Login from 'components/login/pagelet/SMS.vue';
// import Login from 'components/login/pagelet/success.vue';
// import Login from 'components/login/pagelet/phone.vue';
// import Login from 'components/login/pagePsd.vue';

// import Tips from 'components/tips/demo.vue';
// import sportList from 'components/sportList/sportList';
// import BetTable from 'packages/tableLayout/demo.vue';
// import BetTable from 'components/table/demo.vue'
// import AfSelect from 'packages/select/demo.vue';
// import Slider from 'packages/slider/demo.vue';
// import AfCarousel from 'packages/carousel';

// import { debounce } from 'utils/debounce';
// import { throttle } from 'utils/throttle';
//
import { bizType2key } from 'config/couponsConfig';
import { formatNumber } from 'utils';

// import BetslipPrint from 'components/betslips/pagelet/betslipsPrint';

import PopTips from 'components/popDialog/winnings';
import GiftsTips from 'components/popDialog/gifts';
import dialog from 'components/dialog';

let popDialog;
import CommonPop from 'components/popDialog/commonPop';
import Broadcast from 'components/broadcast';
import PopActivity from 'components/popDialog/popActivity';
import { formatMoneyShow } from 'config/showMoneyConfig';

export default {
	name: 'demo',
	components: {
		// SlidePopDialog,
		// pageItem,
		// Step,
		// PopOver,
		// AfInput,
		// Demo,
		// Login,
		// AfTab,
		// Tips,
		// sportList,
		// BetTable,
		// AfSelect,
		// Slider,
		// AfCarousel,
		// BetslipPrint
	},
	data() {
		return {
		// 	// showPop: false
		// 	list: [
		// 		{
		// 			link: 'https://i.epay.126.net/a/8a/static/share-1702.html',
		// 			img: 'http://pimg1.126.net/hyg/product/images/duobao/headFigure/1488277745655_1.png'
		// 		},
		// 		{
		// 			img: 'http://pimg1.126.net/hyg/product/images/duobao/headFigure/1488277745655_1.png'
		// 		}
		// 	],
		// 	ops: {
		// 		indicators: true,
		// 		interval: 5000,
		// 		controls: true
		// 	}
			// bdList: [
				// {
				// 	link: '',
				// 	text: 'test not link, http://pimg1.126.net/hyg/product/images/duobao/headFigure/1488277745655_1.png'
				// },
				// {
				// 	link: 'http://pimg1.126.net/hyg/product/images/duobao/headFigure/1488277745655_1.png',
				// 	text: 'test link, https://i.epay.126.net/a/8a/static/share-1702.html'
				// }
			// ],
			// bdConfig: {
			// 	direction: 'vertical'
			// }
		};
	},
	methods: {
		// goPrev(index){
		//     // to do something
		//     EventBus.$emit(popDialogEvent.PREV_PAGE, index, 'prev');
		// },
		// goNext(index){
		//     // to do something
		//     EventBus.$emit(popDialogEvent.NEXT_PAGE, index, 'next');
		// },
		// showPopDialog(){
		//     this.showPop = true;
		// },
		// hidePopDialog(popObj){
		//     this.showPop = popObj.showPop;
		// }
		// handleClick() {
		// 	const a = throttle(function() {
		// 		console.log(1);
		// 	}, 500);
		// 	a();
		// }
	},
	mounted() {
		// EventBus.$on(popDialogEvent.CLOSE_POPMASK,this.hidePopDialog);
		// document.querySelector('#a').addEventListener('click', debounce(function() {
		// 	console.log(1);
		// }, 300));

		// const testData = {"type":"recent_winning_order","data":{"orderId":"1712120748527105886734","shortId":"702932","bizType":3,"subBizType":2,"betType":null,"periodNumber":null,"correctEvents":null,"status":25,"winningStatus":20,"currency":"KES","totalStake":"300000.00","paymentAmount":"300000.00","favorAmount":null,"favor":null,"totalWinnings":"303000.00","totalBonus":null,"potentialWinnings":null,"bets":null,"createTime":1513064932000}};
		// console.log(clearPushData(testData));
		// popDialog = dialog({
		// 	title: null,
		// 	contentData: clearPushData(testData),
		// 	content: PopTips,
		// 	button: []
		// }).onBtnClick(btnType => {
		// 	popDialog && popDialog.close();
		// 	popDialog = null;
		// 	return false;
		// });

		const testData = {
			"title": "Congratulations!",
			"text": "You've got a new gift",
			"amount": 30001000,
			"currency": "KES",
			"linkUrl": "https://online.easebet.com/ke/sport/football",
			"kind": 2,
			"isMultiple": false,
			"leastOrderAmount": 100000,
			"usableTime": 1520380800000,
			"expireTime": 1529107199000,
			"activityName": "Gift Resource text here.Gift Resource text here.Gift Resource text here"
		};
		popDialog = dialog({
			title: null,
			contentData: clearGiftsData(testData),
			content: GiftsTips,
			button: []
		}).onBtnClick(btnType => {
			popDialog && popDialog.close();
			popDialog = null;
			return false;
		});

		// dialog({
		// 	title: null,
		// 	contentData: {
		// 		title: 'test',
		// 		msg: 'Sorry，something went wrong. Please try again later.',
		// 		okBtn: 'Bet Now',
		// 		cancelBtn: 'Go Home'
		// 	},
		// 	content: CommonPop,
		// 	button: []
		// }).onBtnClick(btnType => {
		// 	console.log(btnType);
		// });
		// dialog({
		// 	title: null,
		// 	contentData: {
		// 		imgUrl: '//127.0.0.1/desktop/common/components/login/image/popSuc.jpg'
		// 	},
		// 	content: PopActivity,
		// 	button: []
		// });
	},
	created () {
		// window.setTimeout(() => {
		// 	this.list = [
		// 		{
		// 			link: 'https://i.epay.126.net/a/8a/static/share-1702.html',
		// 			img: 'http://pimg1.126.net/hyg/product/images/duobao/headFigure/1488277745655_1.png'
		// 		},
		// 		{
		// 			img: 'http://pimg1.126.net/hyg/product/images/duobao/headFigure/1488277745655_1.png'
		// 		},
		// 		{
		// 			img: 'http://pimg1.126.net/hyg/product/images/duobao/headFigure/1484735717296_1.jpg'
		// 		},
		// 		{
		// 			img: 'http://pimg1.126.net/hyg/product/images/duobao/headFigure/1488277745655_1.png'
		// 		}
		// 	];
		// }, 500);
	}
};

function clearPushData(data = {}) {
	if (!data) {
		return;
	}

	const orderInfo = data.data || null;
	let winningInfo;

	if (orderInfo) {
		orderInfo.sportType = bizType2key[orderInfo.bizType];
		orderInfo.showWinnings = orderInfo.totalWinnings && formatNumber(+orderInfo.totalWinnings, 2);
		winningInfo = orderInfo;
	}

	return winningInfo;
}

function clearGiftsData(orderInfo) {
	const amount = +orderInfo.amount || 0;
	orderInfo.amount = formatMoneyShow(amount / 10000, false);
	if (orderInfo.leastOrderAmount) {
		orderInfo.leastOrderAmount /= 10000;
		orderInfo.showCondition = formatMoneyShow(orderInfo.leastOrderAmount, false);
	}

	orderInfo.isLapse = orderInfo.kind === 1;

	return orderInfo;
}
</script>

<style lang='less'>
.container {
	width: 200px;
	height: 100px;
	margin: 20px auto;
	border: 1px solid red;
}
</style>
