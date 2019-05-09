<template>

<div class="m-dp-pop m-pop--birth" id="j_ngBirth">
	<h3 class="f-title">
		<span>One Time Setup</span>
		<i
			class="m-icon-close"
			data-action="close"
			data-ret="close"
		></i>
	</h3>
	<section>
		<p class="f-tips">Verify your date of birth to use this bank account with Paystack.</p>
		<div class="f-line f-line--pos">
			<AfSelect
				:readonly="true"
				:data='monthData'
				placeholder="Month"
				v-model="monthModel" />
			<AfSelect
				:readonly="true"
				:data='dayData'
				placeholder="Day"
				v-model="day" />
			<AfSelect
				:readonly="true"
				:data='yearData'
				placeholder="Year"
				v-model="year" />
			<div class="f-error" v-if="birthdayErrInfo">
				<p>{{birthdayErrInfo}}</p>
			</div>
		</div>
		<div class="f-line f-line--opt">
			<af-button
				extraType="primary"
				@click="submit"
				:disabled="!submitStatus"
				:loading="loading"
			>{{subText}}</af-button>
		</div>
	</section>
</div>

</template>

<script>
import {
	mapActions
} from 'vuex';
import 'packages/button/button.vue';
import AfSelect from 'packages/select';
import {
	monthData, getMonthDayData, getBirthYearData
} from 'base/js/date4YearMonDay';

import pageMixin from '../js/pageMixin';

export default {
	mixins: [pageMixin],
	components: {
		AfSelect,
	},
	data() {
		return {
			monthData,
			dayData: getMonthDayData(),
			yearData: getBirthYearData(),
			year: '',
			monthModel: '',
			month: '',
			day: '',
			yearError: '',
			monthError: '',
			dayError: ''
		};
	},
	computed: {
		birthday() {
			return this.year + this.month + this.day;
		},
		submitStatus() {
			if (this.birthdayErrInfo) {
				return false;
			}

			return this.year && !this.yearError ||
				this.month && !this.monthError ||
				this.day && !this.dayError;
		},
		subText() {
			return this.loading ? 'Loading...' : 'Continue';
		},
		birthdayErrInfo() {
			return this.monthError || this.dayError || this.yearError || '';
		}
	},
	watch: {
		monthModel(val) {
			this.month = val.value;
			this.dayData = getMonthDayData(this.month, this.year);
			this.isBiggerThanDayMax();
		},
		// 年份变的时候主要影响闰年的2月份的天数和日期的选择，如果开始是闰年选择了29号，那更改年份后将天数置空
		year(val) {
			if (this.month === '02') {
				this.dayData = getMonthDayData(this.month, val);
				this.isBiggerThanDayMax();
			}

			this.yearError = '';
		},
		month(val) {
			this.monthError = '';
		},
		day(val) {
			this.dayError = '';
		}
	},
	methods: {
		...mapActions('deposit', [
			'tradeAddtional'
		]),
		// 检查天是否超出当前月份最大的天数，超出就置空
		isBiggerThanDayMax() {
			if (this.day && this.day > this.dayData[this.dayData.length - 1]) {
				this.day = '';
			}
		},
		submit() {
			if (!this.month) {
				this.monthError = 'Please choose a month.';
				return;
			}

			if (!this.day) {
				this.dayError = 'Please choose a date.';
				return;
			}

			if (!this.year) {
				this.yearError = 'Please choose a year.';
				return;
			}

			if (this.loading) {
				return;
			}

			this.loading = true;
			this.tradeAddtional({
				birthday: this.birthday
			});
		},
		handleEnterPress(event) {
			if (event.keyCode && event.keyCode === 13) {
				this.submit();
			}
		}
	},
	mounted() {
		document.querySelector('#j_ngBirth').addEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	},
	beforeDestory() {
		document.querySelector('#j_ngBirth').removeEventListener('keyup', e => {
			this.handleEnterPress(e);
		});
	}
};

</script>
<style media="screen" lang="less">
@import 'base/style/variable.less';
@import '../style/popDialog.less';
.es-dialog .es-dialog-body .es-dialog-main {
	overflow: visible;
}

.m-pop--birth {
	.f-line:first-of-type {
		margin-top: 14px;
	}

	.f-line--pos {
		font-size: 0;
	}

	.af-select {
		display: inline-block;
		vertical-align: top;
		margin: 0 4px;
		font-size: 14px;
		width: 100px;
		height: 38px;

		.af-select-list {
			border: none;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 30%);
			margin-top: 5px;
			height: 340px;
			overflow-y: scroll;
			.af-select-item {
				display: block;
				height: 34px;
				line-height: 34px;
				cursor: pointer;
				&.active,
				&.hover {
					background-color: @dimBlack;
				}
			}
		}
		.af-select-title {
			vertical-align: top;
			height: 36px;
			line-height: 36px;
			border-color: @grayBorder;
			cursor: pointer;
			.af-select-input {
				padding-left: 12px!important;
			}
			.icon {
				font-size: 0;
				position: relative;
				&::before {
					content: '';
					font-size: 0;
					position: absolute;
					right: 11px;
					top: 17px;
					border-width: 7px 5px 7px;
					border-color: @green transparent transparent;
					border-style: solid;
				}
			}
		}
	}

	.f-error {
		text-align: left;
		padding-left: 84px;
		box-sizing: border-box;
	}
}

</style>
