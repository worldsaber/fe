<template>
	<form class="deposit-birth-verify">
		<p class="birth-message">Verify your date of birth to use this bank account.</p>
		<div class="label-container">
			<span class="date-label">Month</span>
			<span class="date-label">Date</span>
			<span class="date-label">Year</span>
		</div>
		<div class="date-container">
			<select
				class="date-selector"
				:data='monthData'
				v-model="month">
			<option v-for="month in monthData" :label="month.name" :value="month.value"/>
			</select>
			<select
				class="date-selector"
				:data='dayData'
				v-model="day">
			<option v-for="day in dayData" :label="day" :value="day"/>
			</select>
			<select
				class="date-selector"
				:data='yearData'
				v-model="year">
			<option v-for="year in yearData" :label="year" :value="year"/>
			</select>
		</div>
		<div class="error-msg">{{errText}}</div>
		<af-button class="submit" :autofocus="false" @click.prevent="submit" :disabled="submitDisabled" :loading="submitLoading" :error="submitErr">{{submitLoading ? 'Loading...' : 'Continue'}}</af-button>
	</form>
</template>

<script>
import { mapMutations } from 'vuex';
import * as mutationTypes from 'store/deposit/ng/mutationTypes.js';
import AfButton from 'packages/button';
import dialog from 'components/dialog';
import {
	monthData, getMonthDayData, getBirthYearData
} from 'base/js/date4YearMonDay';
import { statusToDialog } from '../js/config.js';

export default {
	props: {
		tradeId: {
			type: [Number, String],
			'default': ''
		}
	},
	components: {
		AfButton
	},
	data() {
		return {
			monthData,
			dayData: getMonthDayData(),
			yearData: getBirthYearData(),
			month: '',
			day: '',
			year: '',
			submitErr: false,
			submitLoading: false,
			errText: ''
		};
	},
	methods: {
		...mapMutations('deposit', {
			updateDisplayMsg: mutationTypes.UPDATE_DISPLAY_MSG
		}),
		isBiggerThanDayMax() {
			if (this.day && this.day > this.dayData[this.dayData.length - 1]) {
				this.day = '';
			}
		},
		submit() {
			this.submitLoading = true;
			const params = {
				tradeId: this.tradeId,
				type: 6,
				birthday: this.birthday
			};
			fetch('/pocket/v1/bankTrades/bankTrade/' + this.tradeId + '/additional', {
				headers: {
					'content-type': 'application/json'
				},
				method: 'POST',
				body: JSON.stringify(params)
			}).then(res => {
				this.submitLoading = false;
				return res.json();
			}).then(res => {
				if (res.login === false) {
					this.$dialog();
					this.$popupLogin.show();
					return;
				}
				const { bizCode, data } = res;
				if (bizCode === 10000) {
					if (data.status === 20) {
						console.log('deposit success');
						this.$emit('trigger', 'goStep', {
							step: 'success'
						});
					} else if (data.status === 87) {
						location.href = data.jumpUrl;
						// this.$emit('trigger', 'dialog', {
						// 	options: statusToDialog[data.status],
						// 	tradeId: this.tradeId
						// });
					} else if (data.status === 30) {
						const options = statusToDialog[data.status];
						options.dialog.content = res.message ? res.message : options.dialog.content;
						this.$emit('trigger', 'dialog', {
							options,
							tradeId: this.tradeId
						});
					} else {
						if (data.displayMsg) {
							this.updateDisplayMsg(data.displayMsg);
						}
						this.$emit('trigger', 'dialog', {
							options: statusToDialog[data.status],
							tradeId: this.tradeId
						});
					}
				} else if (bizCode === 62100) { // 超过后台配置日交易限额，使用后台错误信息
					this.$dialog();
					dialog.alert(res.message, ['OK']);
				} else if (bizCode === 11000 || bizCode === 19000) {
					const status = 30; // 11000同样提示失败
					const options = statusToDialog[status];
					options.dialog.content = res.message ? res.message : options.dialog.content;
					this.$emit('trigger', 'dialog', {
						options,
						tradeId: this.tradeId
					});
				} else if (bizCode === 65001) { // 所选资产不存在
					this.$emit('trigger', 'refresh', res.message);
				} else {
					this.submitErr = true;
					this.errText = res.message || 'We are unable to accept your payment at this time. Please check your payment information and try again later.';
				}
			}).catch(e => {
				console.log(e);
				this.submitLoading = false;
				this.$dialog();
				if (!navigator.onLine) {
					dialog.alert('No internet connection, try again.');
				} else {
					dialog.alert('Sorry，something went wrong. Please try again later.');
				}
			});
		}
	},
	computed: {
		birthday() {
			return this.year + this.month + this.day;
		},
		submitDisabled() {
			return !this.year || !this.month || !this.day || this.submitErr;
		}
	},
	watch: {
		month(val) {
			this.dayData = getMonthDayData(val, this.year);
			this.isBiggerThanDayMax();
		},
		birthday(val) {
			if (val.length === 8) {
				this.birthdayErrInfo = '';
			}
		},
		// 年份变的时候主要影响闰年的2月份的天数和日期的选择，如果开始是闰年选择了29号，那更改年份后将天数置空
		year(val) {
			if (this.month === '02') {
				this.dayData = getMonthDayData(this.month, val);
				this.isBiggerThanDayMax();
			}
		}
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
.deposit-birth-verify {
	.birth-message {
		font-size: 16/@rem;
		line-height: 1.5;
		text-align: left;
		color: @dark;
	}
	.label-container {
		margin-top: 18/@rem;
		display: flex;
		align-items: center;
		justify-content: center;
		.date-label {
			flex: 1;
			margin-right: 10/@rem;
			text-align: left;
			font-size: 14/@rem;
			line-height: 16/@rem;
			&:last-child {
				margin-right: 0;
			}
		}
	}
	.date-container {
		margin-top: 2/@rem;
		display: flex;
		align-items: center;
		justify-content: center;
		.date-selector {
			flex: 1;
			margin-right: 10/@rem;
			height: 42/@rem;
			background-color: @white;
			border: 1px solid @darkGray;
			&:last-child {
				margin-right: 0;
			}
		}
	}
	.error-msg {
		min-height: 12px;
		line-height: 12px;
		font-size: 10px;
		text-align: left;
		color: @red;
		margin-top: 2/@rem;
		margin-bottom: 13/@rem;
	}
	.submit {
		width: 100%;
		height: 42/@rem;
		margin-bottom: 18/@rem;
		background-color: @green;
		text-align: center;
		border: none;
	}
}
</style>
