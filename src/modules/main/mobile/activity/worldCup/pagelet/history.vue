<template>
	<div class="m-guess-score">
		<div class="m-form-wrap">
			<form class="m-phone-wrap">
				<h2 class="m-score-title">Enter mobile number to check prediction history</h2>
				<af-input class="m-phone-input" type="tel" icon="delete" :iconClick="iconClick" :maxlength="18" v-model="phone" :error="showError">
					<div slot="prepend">{{countryCode}}</div>
				</af-input>
				<p class="m-score-error">{{error}}</p>
				<af-button @click.prevent="checkPhone" class="m-phone-submit" :disabled="disabled" :loading="isLoading">{{isLoading ? 'Loading' : 'Submit'}}</af-button>
			</form>
		</div>
		<p class="m-no-prediction" v-if="isNoPredict && !isLoading">Oops. You have yet to make a prediction.</p>
		<div class="m-history-cur-list-wrap">
			<Round v-for="(item, index) in curHistory" :key="index" :item="item" />
		</div>
		<div class="m-history-list-line" v-if="curLen && correctLen"></div>
		<div class="m-history-corrlect-title" v-if="correctLen">Matches with a score predicted correctly!</div>
		<div class="m-history-correct-list-wrap">
			<div class="m-history-correct-item-wrap" v-for="(item, index) in correctHistory" :key="index">
				<Round :item="item" class="m-history-correct-item" />
			</div>
		</div>
	</div>
</template>

<script>
import {
	mapState
}
from 'vuex';
import {
   fixPhone
} from 'base/js/utils';
import { AfInput } from 'components/input';
import afButton from 'packages/button/index';
import { showCurrencyOrigin } from 'config/currencyConfig';
import { formatNumber } from 'utils';
import { cookie } from 'storage';

// import dateFormat from 'kernel/js/dateFormat';
// import matchTracker from './matchTracker.vue';
import Round from './round.vue';

export default {
	components: {
		AfInput,
		afButton,
		Round
	},
	data() {
		const query = this.$route.query;
		let phone = '';
		if (window.loginStatus) {
			phone = cookie('phone');
		}
		return {
			phone: query.phone || phone,
			curHistory: [],
			correctHistory: [],
			isNoPredict: false,
			isLoading: false,
			error: ''
		};
	},
	created() {
		console.log(this);
	},
	computed: {
		...mapState('worldCup', [
			'countryCode'
		]),
		disabled() {
			return this.error !== '';
		},
		showError() {
			return this.error !== '';
		},
		curLen() {
			return this.curHistory.length;
		},
		correctLen() {
			return this.correctHistory.length;
		}
	},
	watch: {
		phone() {
			this.error = '';
			this.phone = this.phone.replace(/[^0-9]/g, '');
		}
	},
	methods: {
		check() {
			if (this.phone === '') {
				this.error = 'Mobile number is required.';
			}
		},
		checkPhone() {
			this.check();
			if (this.error) {
				return;
			}
			this.phone = fixPhone(this.phone);
			this.isLoading = true;
			fetch(`/patron/phone/check?phone=${this.phone}`, {
				method: 'GET'
			}).then(res => res.json()).then(res => {
				this.isLoading = false;
				if (res.bizCode === 10000) {
					if (res.data.result) {
						this.fetchHistory();
					} else {
						this.error = res.message || 'Please enter a valid mobile number.';
					}
				} else {
					this.$dialog({
						title: null,
						content: 'Sorry,something went wrong. Please try again later.',
						button: ['OK']
					});
				}
			}).catch(() => {
				this.$dialog();
				this.$toast('No internet connection, try again.', 2000);
			});
		},
		fetchHistory() {
			this.isLoading = true;
			fetch(`/promotion/v1/activities/score/history?phone=${this.phone}`, {
				method: 'GET'
			}).then(res => res.json()).then(res => {
				this.isLoading = false;
				if (res.bizCode === 10000) {
					const data = res.data;
					const curHistory = this.format(data.curRound, true);
					this.curHistory = curHistory.slice(0, 3);
					data.correctHist.forEach(item => {
						item.realHomeScore = item.homeScore;
						item.realAwayScore = item.awayScore;
					});
					this.correctHistory = this.format(data.correctHist);

					const curLen = data.curRound.length;
					const correctLen = data.correctHist.length;
					this.isNoPredict = curLen === 0 && correctLen === 0;
				} else {
					this.$dialog({
						title: null,
						content: 'Sorry,something went wrong. Please try again later.',
						button: ['OK']
					});
				}
			}).catch(() => {
				this.$dialog();
				this.$toast('No internet connection, try again.', 2000);
			});
		},
		format(history, openTip) {
			if (!history || history.length <= 0) {
				return [];
			}
			let isFirstFinal = false;
			history.forEach(item => {
				// item.showRoundTime = dateFormat.format(item.deadLine, 'DD/MM');
				item.isFinal = [3, 4].includes(item.eventStatus);
				// item.showRealScore = (item.eventStatus === 1) ? `${item.realHomeScore} - ${item.realAwayScore}` : '--';
				if (openTip && item.isFinal && !isFirstFinal) {
					isFirstFinal = true;
					item.isFirstFinal = true;
					item.giftAmountText = `${showCurrencyOrigin} ${formatNumber(item.giftAmount / 10000) || ''}`;
				}
			});
			return history;
		},
		iconClick() {
			this.phone = '';
		},
		// goLiveTracker(item) {
		// 	if (item && item.eventId) {
		// 		this.$dialog({
		// 			title: null,
		// 			css: 'guess-score-tracker',
		// 			content: matchTracker,
		// 			height: '100%',
		// 			width: '100%',
		// 			contentData: {
		// 				eventId: item.eventId
		// 			},
		// 			button: []
		// 		});
		// 	}
		// }
	}
};
</script>

<style lang="less">
@import 'base/styles/variable';
@import 'base/styles/icon.less';

.m-guess-score {
	min-height: 100%;
	width: 100%;
	// position: absolute;
	z-index: 1;
	padding-bottom: 20/@rem;
	// background: linear-gradient(to right, #0255b9, #0762c2 50%, #0255b9);
	.m-form-wrap {
		padding-top: 32/@rem;
		padding-bottom: 10/@rem;
		// background-image: url('../image/history-bg.png');
	}
	.m-phone-wrap {
		margin: 0 24/@rem;
		padding: 16/@rem 14/@rem;
		text-align: center;
		border-radius: 4/@rem;
		background-image:  linear-gradient(to bottom, #0078d9, #55a4e7);;
		box-shadow: 0 3/@rem 8.4/@rem 2.6/@rem rgba(2, 4, 0, 0.23);
		
		.m-score-title {
			font-size: 12/@rem;
			line-height: 12/@rem;
			margin: 10/@rem 0;
			color: #fffefe;
			font-weight: 500;
			text-align: left;
		}
		.m-phone-input {
			width: 100%;
			height: 36/@rem;
			margin-top: 6/@rem;
			
			&.m-input-wap-group .m-input-wap-prepend {
				border-radius: 0;
			}
			&.m-input-wap-wrapper .m-input-wap-icon::before {
				vertical-align: middle;
			}
			&.m-input-wap-wrapper .m-input-wap {
				height: 36/@rem;
			}
		}
		.m-score-error {
			text-align: right;
			color: #ff0000;
			font-size: 12/@rem;
			line-height: 12/@rem;
			min-height: 12/@rem;
			margin-top: 3/@rem;
			margin-bottom: 3/@rem;
		}
		.m-phone-submit {
			width: 131/@rem;
			height: 36/@rem;
			font-size: 14/@rem;
			font-weight: bold;
			border-radius: 18/@rem;
			border: none;
			box-shadow: 0 2px 4px 0 rgba(255, 239, 72, 0.5);
			background-image: linear-gradient(to top, #ffbc01, #ffec04);
			background-color: #ffbc01;
			color: #3b029a;
			&.af-button {
				padding: 8/@rem 15/@rem;
			}
			span, i {
				vertical-align: middle;
			}
		}
		
		
	}
	.m-no-prediction {
		height: 50/@rem;
		font-size: 12/@rem;
		line-height: 50/@rem;
		margin: 0 24/@rem;
		color: #fffefe;
		font-weight: 500;
		padding-top: 7/@rem;
		text-align: center;
		background-image: linear-gradient(to top, #70a1e6, #659ef6);
		box-shadow: 0px 3px 8.4px 2.6px rgba(2, 4, 0, 0.23);
		border-radius: 2/@rem;
	}
	.m-history-cur-list-wrap {
		margin: 9/@rem 24/@rem 0;
		padding-bottom: 30/@rem;
	
	}
	.m-history-list-line{
		height: 1px;
		border-bottom: solid 1px rgba(255,255,255,0.5);
		margin: 0 24/@rem;
	}
	.m-history-correct-list-wrap{
		margin-top: 9/@rem;
		padding: 0 24/@rem;
	}
	.m-history-correct-item{
		z-index: 10;
		position: relative;
		background: none;
		.round-tip{
			display: none;
		}
	}
	.m-history-correct-item-wrap{
		position: relative;
		background-color: #eebd18;
		border-radius: 2/@rem;

		.m-icon-wincup();
		&::before{
			position: absolute;
			left: 30/@rem;
			top: -12/@rem;
			transform: rotate(-30deg);
			color: #FED109;
			font-size: 72/@rem;
			z-index: 5;
		}
	}
	.m-history-corrlect-title{
		margin: 0 24/@rem ;
		height: 30/@rem;
		line-height: 30/@rem;
		padding-top: 10/@rem;
		text-align: center;
		font-size: 12/@rem;
		color: #fbf204;
	}
}

.guess-score-tracker.es-dialog.m-dialog {
	height: 100%;
	width: 100%;
	padding: 0;
	
	.es-dialog-body.m-dialog-body {
		height: 100%;
		width: 100%;
	}
	.es-dialog-main.m-dialog-main {
		padding: 0;
		background-color: #1b1e25;
	}
}
</style>
