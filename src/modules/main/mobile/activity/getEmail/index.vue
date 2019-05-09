<template>
	<div class="get-email-wrapper">
		<img v-if="country==='ke'" src="./image/banner-ke.jpg" class="banner">
		<img v-if="country==='ng'" src="./image/banner-ng.jpg" class="banner">
		<img v-if="country==='gh'" src="./image/banner-gh.jpg" class="banner">
		<form>
			<!-- 姓名部分 -->
			<div class="item">
				<p class="label">Name</p>
				<div class="name-wrapper">
					<AfInput
						:disabled="emialHasBeenVerified"
						placeholder="First Name"
						v-model="formData.firstName.value"
						:icon="emialHasBeenVerified?'':'delete'"
						:maxlength="50"
						:error="formData.firstName.isError"
						:iconClick="clearFirstName"
						@change="itemChangeHanlder(formData.firstName)"
						>
					</AfInput>
					<AfInput
						placeholder="Last Name"
						:disabled="emialHasBeenVerified"
						v-model="formData.lastName.value"
						:icon="emialHasBeenVerified?'':'delete'"
						:maxlength="50"
						:error="formData.lastName.isError"
						:iconClick="clearLastName"
						@change="itemChangeHanlder(formData.lastName)"
						>
					</AfInput>
				</div>
				<p class="m-error-infos">{{formData.firstName.errInfo}}</p>
				<p class="m-error-infos">{{formData.lastName.errInfo}}</p>
			</div>
			<!-- 生日部分 -->
			<div class="item">
				<p class="label">Date of Birth</p>
				<div class="birthday-wrapper">
					<!-- 出错时边框标红 -->
					<div :class="{'on-err': formData.birthday.isError}">
						<!-- 天未选择时，默认显示Date -->
						<span v-if="!selectedDay">Date</span>
						<!-- 邮箱已经验证过时选择器禁用 -->
						<select v-model="selectedDay" :disabled="emialHasBeenVerified">
							<!-- 从days对象中找到当前所选年份及月份对应的天数，默认年份为当前年份往前推18年，默认月份为1月 -->
							<option v-for="day in days[selectedYear][selectedMonth]" :key="day">{{day}}</option>
						</select>
					</div>
					<div :class="{'on-err': formData.birthday.isError}">
						<!-- 当月份还没有被选择时noMonth值为初始的true,因为selectedMonth有初始的默认值，watch该值，发生变化时noMonth置为false -->
						<span v-if="noMonth">Month</span>
						<select :class="{'hide':noMonth}" v-model="selectedMonth" :disabled="emialHasBeenVerified">
							<option class="month" v-for="month in months" :key="month">{{month}}</option>
						</select>
					</div>
					<div :class="{'on-err': formData.birthday.isError}">
						<!-- noYear同noMonth，年份未被选择时，该处显示文案为Year，因为selectedYear设置了默认值，选择框内会显示该值，所以此时将颜色设置为白色 -->
						<span v-if="noYear">Year</span>
						<select :class="{'hide':noYear}" v-model="selectedYear" :disabled="emialHasBeenVerified">
							<option v-for="year in years" :key="year">{{year}}</option>
						</select>
					</div>	
				</div>
				<p class="m-error-infos">{{formData.birthday.errInfo}}</p>
			</div>
			<!-- 性别部分 -->
			<div class="item">
				<p class="label">Gender</p>
				<div class="gender-wrapper">
					<!-- 出错时边框置为红色，选中时边框为绿，点击时将此时选中的值传给gender，邮箱已验证过不可点 -->
					<div :class="[{'on-err': formData.gender.isError},{'checked': gender===1}]" @click="getGender(1)">
						<span :class="{'checked-gender': gender===1}"></span>
						<span class="gender">Male</span>
					</div>
					<div :class="[{'on-err': formData.gender.isError},{'checked': gender===2}]" @click="getGender(2)">
						<span :class="{'checked-gender': gender===2}"></span>
						<span class="gender">Female</span>	
					</div>	
				</div>
				<p class="m-error-infos">{{formData.gender.errInfo}}</p>
			</div>
			<!-- 地点部分 -->
			<div class="item">
				<p class="label">Location</p>
				<div class="birthday-wrapper">
					<div :class="{'on-err': formData.state.isError}">
						<!-- 当第一级未选择时，根据国家不同显示不同默认文案 -->
						<span v-if="!selectedState">{{countryMap[country]}}</span>
						<select v-model="selectedState" :disabled="emialHasBeenVerified">
							<option v-for="(item, i) in statesList" :key="i">{{item.state}}</option>
						</select>
					</div>
					<div :class="{'on-err': formData.area.isError}" v-if="country!=='ke'">
						<!-- 当第二级未选择时，根据国家不同显示不同默认文案 -->
						<span v-if="!selectedArea">{{country==='ng'?'Government':'District'}}</span>
						<select v-model="selectedArea" :disabled="emialHasBeenVerified">
							<option v-for="(item,i) in areaList" :key="i">{{item.area}}</option>
						</select>
					</div>
				</div>
				<p class="m-error-infos">{{formData.state.errInfo || formData.area.errInfo}}</p>
			</div>
			<!-- 邮件部分 -->
			<div class="item">
				<p class="label">Email Address</p>
				<p class="note">*Once your email address is verified, it can no longer be changed.</p>
				<AfInput
					v-model="formData.email.value"
					:icon="emialHasBeenVerified?'':'delete'"
					:maxlength="200"
					:error="formData.email.isError"
					:iconClick="clearEmail"
					@change="itemChangeHanlder(formData.email)"
					class="email"
					:disabled="emialHasBeenVerified"
					>
				</AfInput>
				<p class="m-error-infos">{{formData.email.errInfo}}</p>
			</div>
			<!-- 提交按钮 -->
			<div class="m-btn-wrapper">
				<AfButton
					extraType="primary"
					:loading="loading"
					@click.prevent="submitHandler"
					:disabled="emialHasBeenVerified"
					>
					<template v-if='!loading'>Verify Information</template>
					<template v-else>Submitting...</template>
				</AfButton>
			</div>
			<!-- 已验证过邮箱的提示 -->
			<p class="verified" v-if="emialHasBeenVerified">*You already verified all your information before. Kindly go to <a :href="jump2MyAccountInfo"></a>"My Account Info" to view all your personal information.</p>
			<!-- terms and conditions -->
			<div class="terms">
				<p>Terms & Conditions</p>
				<ul>
					<li v-for="(item, i) in terms" :key="i">{{item}}</li>
				</ul>
			</div>
		</form>	
	</div>
</template>

<script>
import { LS } from 'storage';
import { AfInput } from 'packages/input';
import AfButton from 'packages/button/button.vue';
import { userCenterUrl } from 'config/mycenter/dataConfig';
import { getAccountInfo } from '../../deposit/ke/js/fetchMobile';

export default {
	data() {
		return {
			emialHasBeenVerified: false, // 判断邮箱是否已被验证过
			gender: null,
			years: [], // 保存生日年份
			months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', 10, 11, 12], // 保存生日月份
			days: {}, // 保存能根据年份和月份取出对应天数的对象
			selectedYear: new Date().getFullYear() - 18, // 默认年份为18周岁用户的出生年份
			selectedMonth: '01', // 默认月份为1月
			selectedDay: null, // 默认已选天为空
			noYear: true, // 表示未对年份做出选择
			noMonth: true, // 表示未对月份做出选择
			statesList: [], // 保存第一级地点
			areaList: [], // 保存第二级地点
			selectedState: '',
			selectedArea: '',
			alreadyChoseArea: false, // 拉取用户信息时，如果用户已填写过第二级地点，则该值为true
			formData: { // 保存表单数据的值、label、是否出错及错误提示
				firstName: {
					value: '',
					label: 'First Name',
					isError: false,
					errInfo: '',
				},
				lastName: {
					value: '',
					label: 'Last Name',
					isError: false,
					errInfo: '',
				},
				email: {
					value: '',
					label: 'Email Address',
					isError: false,
					errInfo: '',
				},
				birthday: {
					value: '',
					label: 'Date of Birth',
					isError: false,
					errInfo: '',
				},
				gender: {
					value: null,
					label: 'Gender',
					isError: false,
					errInfo: '',
				},
				state: {
					value: '',
					label: 'Location',
					isError: false,
					errInfo: '',
				},
				area: {
					value: '',
					label: 'Location',
					isError: false,
					errInfo: '',
				},
			},
			integrity: true, // 判断表单所有数据是否已填写完整
			loading: false,
			country: window.country,
			countryMap: { // 一级地点不同国家对应名称
				ke: 'County',
				ng: 'State',
				gh: 'Region'
			},
			terms: [
				'1. To qualify for the SportyBet Gift, you must be a registered SportyBet account holder and be over the age of 18.',
				'2. The promotion is valid for all SportyBet customers, including old customers and newly registered customers.',
				'3. This promotion\'s Gift will only be awarded when real information is provided.',
				'4. This promotion\'s Gift will only be awarded when all information has been filled. (including "First Name", "Last Name", "Date of Birth", "Gender", and "Email Address")',
				'5. This promotion\'s Gift will only be awarded when the email verification is completed.',
				'6. Each customer will only be awarded once for verifying his/her account\'s information on his/her first time.',
				'7. This promotion\'s Gift can only be used on matches with Odds of 3.15 or over.',
				'8. This promotion\'s Gift will expire 7 days after being distributed to the customer\'s account.'
			],
			jump2MyAccountInfo: userCenterUrl.myAccountInfo, // 已验证过邮箱时，点击提示文案，跳转个人中心
		};
	},
	watch: {
		selectedYear() { // 当用户选择年份时，将noYear置为false，同时清空错误提示
			if (this.noYear) this.noYear = false;
			this.clearBirthdayErr();
		},
		selectedMonth() { // 当用户选择月份时，将noMonth置为false，同时清空错误提示
			if (this.noMonth) this.noMonth = false;
			this.clearBirthdayErr();
		},
		selectedDay() { // 选择日期后清空错误提示
			this.clearBirthdayErr();
		},
		// selectedState初始值为空，alreadyChoseArea初始值为false，创建时，根据用户信息中area的值更新alreadyChoseArea，
		// 如果用户信息中state也有值，赋给selectedState，此时如果alreadyChoseArea为true，将其值更新为false；
		// 当用户执行state选择操作时，随着selectedState的更新，拉取对应的area列表数据，将selectedArea置为空，并清除错误提示。
		selectedState() {
			if (!this.alreadyChoseArea) {
				this.getArea();
				this.selectedArea = '';
				this.clearStateErr();
			}
			this.alreadyChoseArea = false;
		},
		selectedArea() {
			this.clearAreaErr();
		},
		gender() {
			this.formData.gender.isError = false;
			this.formData.gender.errInfo = '';
		}
	},
	components: {
		AfInput,
		AfButton
	},
	created() {
		// 为选择框创建数据
		this.getYears();
		this.getDays();
		this.getState();
		// 判断该用户是否已通过验证
		fetch('/patron/mail/verify/check').then(res => res.json()).then(res => {
			if (res.bizCode === 10000) {
				if (res.data === true) {
					this.emialHasBeenVerified = true;
				}
			}
		}).catch(e => console.log(e));
		// 拉取用户信息，整理信息并填入页面对应位置及formData对象
		getAccountInfo().then(res => {
			if (res.area) {
				this.selectedArea = res.area;
				this.alreadyChoseArea = true;
				this.getArea(res.state);
			}
			if (res.state) {
				this.selectedState = res.state;
			}
			if (res.birthday) {
				this.selectedYear = res.birthday.slice(0, 4);
				this.selectedMonth = res.birthday.slice(4, 6);
				this.selectedDay = res.birthday.slice(6, 8);
				this.noMonth = false;
				this.noYear = false;
			}
			if (res.gender) {
				this.gender = res.gender;
			}
			Object.keys(res).forEach(key => {
				if (this.formData[key]) {
					this.formData[key].value = res[key];
				}
			});
			this.hideLoading();
		}).catch(e => {
			console.log(e);
			this.hideLoading();
			this.$toast('Sorry, something went wrong, please try again later.');
		});
	},
	methods: {
		hideLoading() {
			document.querySelector('#pageLoading').style.display = 'none';
		},
		clearBirthdayErr() {
			this.formData.birthday.isError = false;
			this.formData.birthday.errInfo = '';
		},
		clearStateErr() {
			this.formData.state.isError = false;
			this.formData.state.errInfo = '';
		},
		clearAreaErr() {
			this.formData.area.isError = false;
			this.formData.area.errInfo = '';
		},
		// 清空输入框
		clearFirstName() {
			if (!this.emialHasBeenVerified) this.formData.firstName.value = '';
		},
		clearLastName() {
			if (!this.emialHasBeenVerified) this.formData.lastName.value = '';
		},
		clearEmail() {
			if (!this.emialHasBeenVerified) {
				this.formData.email.value = '';
				this.formData.email.isError = false;
				this.formData.email.errInfo = '';
			}
		},
		// 输入框值改变时，去掉空格，清空错误提示
		itemChangeHanlder(item) {
			item.value = item.value.replace(/\s/g, '');
			item.isError = false;
			item.errInfo = '';
		},
		getState() {
			if (LS.get(`statesList_${this.country}`)) {
				this.statesList = JSON.parse(LS.get(`statesList_${this.country}`));
				return;
			}
			fetch('/patron/locations').then(res => res.json()).then(res => {
				if (res.bizCode === 10000) {
					const statesList = []; // 保存ng，gh去重后的state
					const stateMap = {};
					// state去重
					res.data.forEach(item => {
						if (!stateMap[item.state]) {
							stateMap[item.state] = 1;
							statesList.push(item);
						}
					});
					this.statesList = statesList;
					LS.set(`statesList_${this.country}`, JSON.stringify(statesList));
				}
			}).catch(e => console.log(e));
		},
		getArea() {
			fetch(`/patron/locations?state=${this.selectedState}`).then(res => res.json()).then(res => {
				if (res.bizCode === 10000) {
					this.areaList = res.data;
				}
			}).catch(e => {
				console.log(e);
			});
		},
		getYears() {
			let year = new Date().getFullYear() - 18;
			const years = [];
			for (let i = 0; i < 100; i++) {
				years.push(year);
				year--;
			}
			this.years = years;
		},
		getDays() {
			const datePicker = {};
			const years = this.years;
			const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
			years.forEach(year => {
				datePicker[year] = {};
				months.forEach(month => {
					const days = new Date(year, month, 0).getDate();
					const date = [];
					for (let i = 1; i < days + 1; i++) {
						date.push(i < 10 ? `0${i}` : i);
					}
					datePicker[year][month < 10 ? `0${month}` : month] = date;
				});
			});
			this.days = datePicker;
		},
		getGender(val) {
			if (!this.emialHasBeenVerified) this.gender = val;
		},
		submitHandler() {
			// 当生日的年月日都已选择时，拼出生日的值，赋给formData.birthday
			if (!this.noYear && !this.noMonth && this.selectedDay) {
				this.formData.birthday.value = `${this.selectedYear}${this.selectedMonth}${this.selectedDay}`;
			}
			this.formData.gender.value = this.gender; // 将性别赋给formData.gender
			this.formData.state.value = this.selectedState; // 将所选state赋给formData.gender
			// 当国家为ke时，删除formData.area，否则将selectedArea的值赋给它
			if (this.country === 'ke') {
				delete this.formData.area;
			} else {
				this.formData.area.value = this.selectedArea;
			}
			// 此时先将判断表单填写是否完整的integrity置为true，后面如果判断到formData其中有值为空或邮箱校验不通过，置为false
			this.integrity = true;
			const reg = /^\w+[-+.\w]*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
			// 遍历formData, 如果某一项值为空，显示对应错误提示；遇到email且其值不为空时，如果未通过邮箱校验，显示错误提示
			Object.keys(this.formData).forEach(key => {
				if (!this.formData[key].value) {
					this.formData[key].isError = true;
					const verb = ['firstName', 'lastName', 'email'].includes(key) ? 'enter' : 'select';
					this.formData[key].errInfo = `Please ${verb} your '${this.formData[key].label}'`;
					this.integrity = false;
				}
				if (key === 'email' && this.formData.email.value && !reg.test(this.formData.email.value)) {
					this.formData.email.isError = true;
					this.formData.email.errInfo = 'Please enter a vaild \'Email Address\'.';
					this.integrity = false;
				}
			});
			// 当表单数据填写完整时，发送表单同时后台发送验证邮件，成功后弹出提示，点击OK刷新页面
			if (this.integrity) {
				if (this.loading) return;
				this.loading = true;
				const params = {};
				Object.keys(this.formData).forEach(key => {
					params[key] = this.formData[key].value;
				});
				fetch('/patron/mail/verify/submit', {
					method: 'PUT',
					headers: new Headers({
						'Content-Type': 'application/json'
					}),
					body: JSON.stringify(params)
				}).then(res => res.json()).then(res => {
					if (res.bizCode === 10000) {
						this.loading = false;
						this.$dialog({
							title: null,
							content: 'A message was sent to the email address you provided. Kindly click on the link inside the message to finish verifying your account. The verification link is only valid for 72 hours',
							button: ['OK']
						}).onClose(() => {
							location.reload();
						});
					} else if (res.bizCode === 12001) {
						this.loading = false;
						this.$toast('Your email address has been verified in SportyBet, please try another one.');
					} else {
						this.loading = false;
						this.$toast(res.message);
					}
				}).catch(e => {
					this.loading = false;
					console.log(e);
					this.$toast('Sorry, something went wrong, please try again later.');
				});
			}
		},
	}
};
</script>

<style lang="less">
@import "~base/styles/variable.less";
@import "~base/styles/icon.less";

.get-email-wrapper {
	font-size: 14/@rem;
	color: @dark;
	.banner {
		width: 100%;
		background: @fogGray;
		display: block;
	}
	form {
		padding: 6/@rem 15/@rem;
		.item {
			margin-top: 20/@rem;
			select {
				appearance: none;
				background: transparent;
				border: none;
			}
			.m-input-wrapper {
				border: 1/@rem solid @lightGray;
			}
			.m-input-wrapper--active .m-input{
				border: 1/@rem solid @green;
			}
			.on-err {
				border: 1/@rem solid @red !important;
			}
			.name-wrapper {
				display: flex;
				flex-flow: row nowrap;
				.m-input-wrapper:first-child {
					margin-right: 8/@rem;
				}
			}
			.birthday-wrapper {
				display: flex;
				flex-flow: row nowrap;
				justify-content: space-around;
				div {
					border: 1/@rem solid @lightGray;
					line-height: 38/@rem;
					padding: 0 10/@rem;
					width: 100%;
					display: flex;
					color: @darkGray;
					&:not(:first-child) {
						margin-left: 6/@rem;
					}
					select {
						font-size: 14/@rem;
						height: 38/@rem;
						width: 100%;
						&:focus {
							outline: none;
						}
					}
					.hide {
						color: @white;
					}
				}
			}
			.m-error-infos {
				color: @red;
				font-size: 12/@rem;
			}
			.gender-wrapper {
				width: 166/@rem;
				line-height: 38/@rem;
				display: flex;
				div {
					border: 1/@rem solid @lightGray;
					width: 100%;
					text-align: center;
					display: flex;
					.gender {
						margin-left: 10/@rem;
					}
					.checked-gender {
						margin: -13/@rem -5/@rem 0 -1/@rem;
						color: @green;
						.m-icon-checkbox();
					}
				}
				div:first-child {
					margin-right: 6/@rem;
					
				}
				.checked {
					border: 1/@rem solid @green;	
				}
			}
			.note {
				font-size: 12/@rem;
				color: @darkGray;
			}
			.email {
				width: 100%;
			}
		}
		.m-btn-wrapper {
			text-align: center;
			.af-button {	
				background: @green;
				margin-top: 30/@rem;
				margin-bottom: 38/@rem;
			}
		}
		.verified {
			color: @red;
			font-size: 12/@rem;
			margin-top: -20/@rem;
			margin-bottom: 30/@rem;
			a {
				color: @linkBlue;
				text-decoration-line: underline;
			}
		}
		.terms {
			p {
				margin-bottom: 12/@rem;
			}
			ul {
				margin-bottom: 33/@rem;
				font-size: 12/@rem;
				li {
					margin-bottom: 5/@rem;
				}
			}
		}
	}
}
</style>
