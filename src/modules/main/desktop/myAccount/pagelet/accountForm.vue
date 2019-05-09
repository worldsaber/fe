<template>
	<form class="m-fm-wrap">
		<div class="m-fm-row" style="padding:15px 0 0;">
				<div class="m-fm-left">Mobile Number</div>
				<div class="m-fm-right">{{phone}}</div>
		</div>
		<div class="m-fm-row">
			<div class="m-fm-left">First Name</div>
			<div class="m-fm-right">
				<AfInput
					v-model="firstName"
					icon="delete"
					:maxlength="50"
					:iconClick="clearFirstNameInput"
					@change="firstNameChangeHanlder"
					>
				</AfInput>
			</div>
		</div>
		<div class="m-fm-row">
			<div class="m-fm-left">Last Name</div>
			<div class="m-fm-right">
				<AfInput
					v-model="lastName"
					icon="delete"
					:maxlength="50"
					:iconClick="clearLastNameInput"
					@change="lastNameChangeHanlder"
					>
				</AfInput>
			</div>
		</div>
		<div class="m-fm-row">
			<div class="m-fm-left">Date of Birth</div>
			<div class="m-fm-right" :class="{'m-row-select-error':this.birthdayErrInfo !== ''}">
				<AfSelect
					:readonly="true"
					:data='monthData'
					placeholder="Month"
					v-model="monthModel"/>
					<AfSelect
					:readonly="true"
					:data='dayData'
					placeholder="Day"
					v-model="day"/>
					<AfSelect
					:readonly="true"
					:data='yearData'
					placeholder="Year"
					v-model="year"/>
					<span class="m-error-infos">{{birthdayErrInfo}}</span>
			</div>
		</div>
		<div class="m-fm-row">
			<div class="m-fm-left">Gender</div>
			<div class="m-fm-right">
				<em class="m-fm-radio" :class="{'m-fm-radio-selected': gender == 1}" @click="genderClick(1)">Male</em>
				<em class="m-fm-radio" :class="{'m-fm-radio-selected': gender == 2}" @click="genderClick(2)">Female</em>
			</div>
		</div>
		<div class="m-fm-row">
			<div class="m-fm-left">Email</div>
			<div class="m-fm-right">
				<AfInput
					v-model="email"
					icon="delete"
					:maxlength="200"
					:error="isEmailError"
					:iconClick="clearEmailInput"
					@change="emailChangeHanlder"
					@blur="emailBlurHandler"
					>
				</AfInput>
				<span class="m-error-infos">{{emailErrInfo}}</span>
			</div>
		</div>
			<div class="m-fm-row">
				<div class="m-fm-left">&nbsp;</div>
				<div class="m-fm-right">
					<div class="m-btn-wrapper">
						<AfButton
							extraType="primary"
							:disabled="submitStatus"
							:loading="loading"
							@click.prevent="submitHandler"
							><template v-if="isSuccess == true"><em class="bm-icon--success"></em>Succeeded</template>
							<template v-else><template v-if='!loading'>Save</template><template v-else>Loading...</template></template></AfButton>
						</div>
				</div>
			</div>
	</form>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import * as mutationTypes from 'store/usercenter/mutationTypes';
import AfButton from 'packages/button/button.vue';
import { AfInput } from 'packages/input';
import AfSelect from 'packages/select';
import popMsg from '../../deposit/ke/js/popMsg';
import { monthData, getMonthDayData, getYearData } from '../js/helper';

import '../../mockData/myAccount/index?debug';

export default {
	mixins: [popMsg],
	components: {
		AfButton,
		AfInput,
		AfSelect,
	},
	watch: {
		oFirstName (val) {
			this.firstName = val;
		},
		oLastName (val) {
			this.lastName = val;
		},
		oBirthday (val) {
			if (val && val.length >= 8) {
				const birth = val;
				this.year = birth.slice(0, 4);
				this.monthModel = monthData[+birth.slice(4, 6) - 1];
				this.day = birth.slice(6, 8);
			}
		},
		oGender (val) {
			this.gender = val;
		},
		oEmail (val) {
			this.email = val;
		},
		monthModel (val) {
			this.month = val.value;
			this.dayData = getMonthDayData(this.month, this.year);
			this.isBiggerThanDayMax();
		},
		birthday (val) {
			if (val.length === 8) {
				this.birthdayErrInfo = '';
			}
		},
		// 年份变的时候主要影响闰年的2月份的天数和日期的选择，如果开始是闰年选择了29号，那更改年份后将天数置空
		year (val) {
			if (this.month === '02') {
				this.dayData = getMonthDayData(this.month, val);
				this.isBiggerThanDayMax();
			}
		}
	},
	computed: {
		...mapState('userCenter', {
			phone: 'phone',
			oFirstName: 'firstName',
			oLastName: 'lastName',
			oBirthday: 'birthday',
			oGender: 'gender',
			oEmail: 'email'
		}),
		birthday () {
			return this.year + this.month + this.day;
		},
		isEmailError () {
			return this.emailErrInfo !== '';
		},
		submitStatus () {
			return !!(this.isEmailError || this.birthdayErrInfo);
		}
	},
	data () {
		return {
			monthData,
			dayData: getMonthDayData(),
			yearData: getYearData(),
			year: '',
			monthModel: '',
			month: '',
			day: '',
			loading: false,
			isSuccess: false,
			emailErrInfo: '',
			birthdayErrInfo: '',
			firstName: '',
			lastName: '',
			gender: 0,
			email: ''
		};
	},
	methods: {
		...mapMutations('userCenter', {
			updateUserInfo: mutationTypes.UPDATE_BASE_ACCOUNT_INFO
		}),
		// 检查天是否超出当前月份最大的天数，超出就置空
		isBiggerThanDayMax () {
			if (this.day && this.day > this.dayData[this.dayData.length - 1]) {
				this.day = '';
			}
		},
		monthChange (data) {
			this.day = '';
			this.getDayData();
		},
		emailBlurHandler () {
			const reg = /^\w+[-+.\w]*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
			if (!this.email || reg.test(this.email)) {
				this.emailErrInfo = '';
			} else {
				this.emailErrInfo = 'Please enter a vaild Email Address.';
			}
		},
		clearFirstNameInput () {
			this.firstName = '';
		},
		clearLastNameInput () {
			this.lastName = '';
		},
		clearEmailInput () {
			this.email = '';
			this.emailErrInfo = '';
		},
		firstNameChangeHanlder (data) {
			this.firstName = this.firstName;
		},
		lastNameChangeHanlder (data) {
			this.lastName = this.lastName;
		},
		emailChangeHanlder (data) {
			this.email = this.email.replace(/\s/g, '');
			if (this.email) {
				this.emailErrInfo = '';
			}
		},
		genderClick (value) {
			if (this.gender === value) {
				this.gender = 0;
			} else {
				this.gender = value;
			}
		},
		submitHandler () {
			if (!this.submitStatus) {
				if (this.birthday && this.birthday.length !== 8) {
					this.birthdayErrInfo = 'Please select your birthday.';
					return false;
				}
				if (this.loading) return;
				this.submitPost().catch(() => {
					this.loading = false;
					this.showMsgPop({
						msg: 'Please check your internet connection and try again.'
					});
				});
			}
		},
		submitPost () {
			const param = {
				phone: this.phone
			};
			['firstName', 'lastName', 'birthday', 'email', 'gender'].forEach(name => {
				let val = this[name];
				if (name !== 'gender') {
					val = val.trim();
				}
				param[name] = val;
			});
			this.loading = true;
			// console.log(param);
			return new Promise((resolve, reject) => {
				fetch('/patron/account/info/whole', {
					method: 'PUT',
					body: param
				})
				.then(res => res.json())
				.then(data => {
					this.loading = false;
					const code = data.bizCode;
					if (code === 10000) {
						this.isSuccess = true;
						this.updateUserInfo(param);
						window.setTimeout(() => {
							this.isSuccess = false;
						}, 2000);
					} else if (code === 11010) {
						this.emailErrInfo = 'Please enter a vaild Email Address.';
					} else {
						this.showMsgPop({ msg: 'Sorry，something went wrong. Please try again later.' });
					}
				}).catch(err => reject(err));
			});
		},
	}
};
</script>
