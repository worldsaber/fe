<template>
 <div class="m-ac-form-wrap">
	<topNavBar backText="Back" :backClick="backHandler" id="top-navbar">
		<div slot="right">
			<homeNav/>
		</div>
	</topNavBar>
	<div class="m-ac-info-wrap">
		<ul>
			<li>
				<em>Month</em>
				<span>{{monthShow}}</span>
				<select v-model="month">
					<option :value="item.value" v-for="item in monthData" :key="item.name">{{item.name}}</option>
				</select>
			</li>
			<li>
				<em>Day</em>
				<span>{{day}}</span>
				<select v-model="day">
					<option :value="item" v-for="item in dayData" :key="item">{{item}}</option>
				</select>
			</li>
			<li>
				<em>Year</em>
				<span>{{year}}</span>
				<select v-model="year">
					<option :value="item" v-for="item in yearData" :key="item">{{item}}</option>
				</select>
			</li>
		</ul>
		<div class="m-btn-wrapper">
			<AfButton
				extraType="primary"
				:loading="loading"
				@click.prevent="submitHandler"
				><template v-if='!loading'>Save</template><template v-else>Loading...</template></AfButton>
		</div>
	</div>
</div>
</template>
<script>
import topNavBar from 'components/navbar';
import AfButton from 'packages/button/button.vue';
import homeNav from 'components/homeNav';
import popMsg from '../../deposit/ke/js/popMsg';
import { saveAccountItem, monthData, getMonthDayData, getYearData } from '../js/helper';

export default {
	mixins: [popMsg],
	components: {
		topNavBar,
		AfButton,
		homeNav
	},
	props: ['sendData'],
	data () {
		return {
			monthData,
			yearData: getYearData(),
			dayData: getMonthDayData((this.sendData.value || '').slice(4, 6) || 2),
			month: (this.sendData.value || '').slice(4, 6),
			year: (this.sendData.value || '').slice(0, 4),
			day: (this.sendData.value || '').slice(6, 8),
			loading: false,
		};
	},
	computed: {
		monthShow () {
			if (this.month !== '') {
				return this.monthData[+this.month - 1].name;
			}
		},
		birthday () {
			if (this.year && this.month && this.day) {
				return this.year + this.month + this.day;
			}
			return '';
		},
	},
	watch: {
		// 月份改变更改一个的天数
		month (val) {
			this.dayData = getMonthDayData(val);
			this.isBiggerThanDayMax();
		},
		year () {
			if (this.month === '02') {
				this.dayData = getMonthDayData(this.month);
				this.isBiggerThanDayMax();
			}
		}
	},
	methods: {
		// 检查天是否超出当前月份最大的天数，超出就置空
		isBiggerThanDayMax () {
			if (this.day && this.day > this.dayData[this.dayData.length - 1]) {
				this.day = '';
			}
		},
		backHandler () {
			this.$emit('backEvent', -1);
		},
		submitHandler () {
			const hasSelectPart = !this.birthday && (this.year || this.month || this.day);
			if (!hasSelectPart) {
				this.loading = true;
				const param = {
					key: 'birthday',
					value: this.birthday
				};
				saveAccountItem(param).then(code => {
					if (code === 10000) {
						this.showToast('Succeeded');
						window.setTimeout(() => {
							param.showKey = 'birthdayStr';
							param.showValue = this.birthday ? this.month + '/' + this.day + '/' + this.year : '';
							this.$emit('backEvent', param);
						}, 2000);
					}
					this.loading = false;
				}).catch(() => {
					this.loading = false;
					this.showToast('No internet connection, try again.');
				});
			} else {
				this.showToast('Please select your birthday.');
			}
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/mixin.less';
</style>
