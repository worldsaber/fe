<template>
  <div class="m-ac-form-wrap">
		<topNavBar backText="Back" :backClick="backHandler" id="top-navbar">
			<div slot="right">
				<homeNav/>
			</div>
		</topNavBar>
		<form>
			<AfInput
				:placeholder="placeHolder[sendData.key]"
				v-model="key"
				icon="delete"
				:maxlength="maxlength"
				:error="isError"
				:iconClick="clearInputValue"
				@change="itemChangeHanlder"
				>
				<template v-if="sendData.key==='nickname'">
					<span :class="['left-words',{'fixPos':occupied>0}]">{{occupied}}/15</span>
				</template>
			</AfInput>
			
			<p class="m-error-infos">{{errInfo}}</p>
			<div class="m-btn-wrapper">
				<AfButton
					extraType="primary"
					:loading="loading"
					@click.prevent="submitHandler"
					:disabled="emailIsEmpty"
					>
					<template v-if='!loading'>{{sendData.key==='email' ? 'Verify' : 'Save'}}</template>
					<template v-else>{{loadingText}}</template>
				</AfButton>
			</div>
		</form>
  </div>
</template>
<script>
import { mapMutations, mapActions } from 'vuex';
import { UPDATE_BASE_ACCOUNT_INFO } from 'store/me/mutationTypes';
import topNavBar from 'components/navbar';
import { AfInput } from 'packages/input';
import homeNav from 'components/homeNav';
import AfButton from 'packages/button/button.vue';
import popMsg from '../../deposit/ke/js/popMsg';
import { saveAccountItem } from '../js/helper';
import '../../mockData/myAccount/index?debug';

export default {
	mixins: [popMsg],
	components: {
		topNavBar,
		AfInput,
		AfButton,
		homeNav
	},
	props: ['sendData'],
	data () {
		return {
			key: this.sendData.value,
			loading: false,
			errInfo: '',
			maxlength: 50,
			placeHolder: {
				firstName: 'First Name',
				lastName: 'Last Name',
				email: 'Email Address',
				nickname: 'Nickname'
			},
			occupied: 0,
		};
	},
	mounted () {
		if (this.sendData.key === 'email') {
			this.maxlength = 200;
		} else if (this.sendData.key === 'nickname') {
			this.maxlength = 15;
			if (this.key) this.occupied = this.key.length;
		}
	},
	computed: {
		emailIsEmpty() {
			return this.sendData.key === 'email' && !this.key;
		},
		isError () {
			return this.errInfo !== '';
		},
		loadingText() {
			if (this.sendData.key === 'nickname') {
				return 'Saving...';
			} else if (this.sendData.key === 'email') {
				return 'Submitting...';
			}
			return 'Loading...';
		}
	},
	methods: {
		...mapActions('me', ['quanziLogin']),
		...mapMutations('me', {
			updateAccountInfo: UPDATE_BASE_ACCOUNT_INFO
		}),
		backHandler () {
			this.$emit('backEvent', -1);
		},
		clearInputValue () {
			this.key = '';
			this.errInfo = '';
			this.occupied = 0;
		},
		itemChangeHanlder (data) {
			// 如果是邮箱则自动去除首位和中间的空格
			if (['email', 'nickname'].includes(this.sendData.key)) {
				this.key = this.key.replace(/\s/g, '');
			}
			if (this.sendData.key === 'nickname') {
				if (this.key) this.occupied = this.key.length;
			}
			this.errInfo = '';
		},
		// 验证邮箱
		verifyEmail() {
			if (this.loading) return;
			this.loading = true;
			fetch('/patron/mail/verify/send', {
				method: 'PUT',
				body: JSON.stringify({ mail: this.key }),
				headers: new Headers({
					'Content-Type': 'application/json'
				})
			}).then(res => res.json()).then(res => {
				if (res.bizCode === 10000) {
					this.$dialog({
						title: null,
						content: 'An Email has been sent to the address above! Go check it and click the link inside in 72 hours to finish the verification.',
						button: ['OK']
					}).onClose(res => {
						this.$emit('backEvent', { key: 'email', value: this.key });
					});
				} else if (res.bizCode === 12001) {
					this.showToast('This Email address exists already.');
				} else {
					this.showToast(res.message);
				}
				this.loading = false;
			}).catch(e => {
				this.loading = false;
				this.showToast('No internet connection, try again.');
				console.log(e);
			});
		},
		submitHandler () {
			if (this.sendData.key === 'email') {
				if (this.key && /^\w+[-+.\w]*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.key)) {
					this.errInfo = '';
					this.verifyEmail();
				} else {
					this.errInfo = 'Please enter a vaild Email Address.';
					return false;
				}
			} else { // 如果是姓名则提交的时候过滤首位空格
				this.key = this.key.trim();
				if (this.loading) return;
				this.loading = true;
				const param = {
					key: this.sendData.key,
					value: this.key
				};
				saveAccountItem(param).then(code => {
					if (code === 10000) {
						this.showToast('Succeeded');
						window.setTimeout(() => {
							this.$emit('backEvent', param);
						}, 2000);
						if (this.sendData.key === 'nickname') { // 设置昵称成功
							this.updateAccountInfo({
								nickname: this.key
							});
							this.quanziLogin();
						}
					} else if (code === 11010) { // 邮箱错误
						this.errInfo = 'Please enter a vaild Email Address.';
					} else if (code === 11011) { // 邮箱错误
						this.errInfo = 'This nickname was taken, please try another one.';
						this.key = '';
					} else if (this.sendData.key === 'nickname') {
						this.showToast('Failed to Save Nickname');
					}
					this.loading = false;
				}).catch(() => {
					this.loading = false;
					if (this.sendData.key === 'nickname') {
						this.showToast('Failed to Save Nickname');
					} else {
						this.showToast('No internet connection, try again.');
					}
				});
			}
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/mixin.less';
@import "base/styles/icon.less";

	.m-ac-form-wrap{
		.m-home-icon{
			.m-icon-home();
			color: @dark;
			text-align: right;
			font-size: 14/@rem;
			display: inline-block;
			width: 49%;
			&:before{
				padding-right: 4/@rem;
				color: @dark;
				height: 24/@rem;
				width: 24/@rem;
				font-size: 16/@rem;
				display: inline-block;
			}
		}
	}
</style>
