<template>
  <div class="m-ac-form-wrap">
		<topNavBar :backClick="backHandler">
			<div slot="right" v-if="step === 1 || step === 2">
                <homeNav/>
            </div>
		</topNavBar>
		<oldPassword v-show="step === 1" @stepOneBackHandler="stepOneBackHandler"/>
		<newPassword v-if="step === 2" :token="token" :oldPassword="password"/>
  </div>
</template>
<script>
import topNavBar from 'components/navbar';
import homeNav from 'components/homeNav';
import oldPassword from './oldpassword';
import newPassword from './newpassword';

export default {
	components: {
		topNavBar,
		oldPassword,
		newPassword,
		homeNav
	},
	data () {
		return {
			step: 1,  // 标志现在处于那一步 1:旧密码验证  2新密码验证
			token: '', // 修改密码需要等token，查询旧密码的时候获取
		};
	},
	methods: {
		backHandler () {
			if (this.step === 2) {
				this.step = 1;
			} else {
				window.location.reload();
			}
		},
		stepOneBackHandler ({ token, password }) {
			this.step = 2;
			this.token = token;
			this.password = password;
		}
	}
};
</script>


