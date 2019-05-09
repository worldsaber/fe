<template>
<div id="popupLogin" v-if="display">
	<login :forceInitStep="type"></login>
</div>
</template>
<script>
import commonEvent from 'config/eventConfig/commonEvent';
import { EventBus } from 'kernel/js/eventBus';
import login from './login.vue';
import { isInApp, isAppLogin } from './tools.js';

export default {
	data() {
		return {
			display: false,
			type: '' // login或者regist
		};
	},
	components: {
		login
	},
	methods: {
		close() {
			this.display = false;
			this.type = '';
		},
		showType(type, success, fail) {
			this.type = type || '';
			this.show(success, fail);
		},
		show(success, fail) {
			// 拦截登录
			if (isInApp() && isAppLogin()) {
				AppCore.login(location.href, () => {
					EventBus.$emit(commonEvent.UPDATE_LOGIN_STATUS);  // 模拟wap login 触发事件，供业务使用
				}, () => {
					EventBus.$emit(commonEvent.UPDATE_POP_LOGIN_BACK);
				});
			} else {
				this.display = true;
				// 绑定事件
				const failCallback = () => {
					fail && fail();
					EventBus.$off(commonEvent.UPDATE_LOGIN_STATUS, successCallback);
					EventBus.$off(commonEvent.SAVE_LOGIN_STATUS, registCallback);
				};
				const successCallback = () => {
					if (window.loginStatus) {
						this.display = false;
						success && success();
						EventBus.$off(commonEvent.UPDATE_POP_LOGIN_BACK, failCallback);
						EventBus.$off(commonEvent.SAVE_LOGIN_STATUS, registCallback);
					}
				};
				const registCallback = () => {
					if (window.loginStatus) {
						// 兼容以前直接调用show的场景，此时没有success回调，注册成功时不自动关闭的；如果存在success,说明是新的调用方式
						if (success) {
							this.display = false;
							success();
						}
						EventBus.$off(commonEvent.UPDATE_POP_LOGIN_BACK, failCallback);
						EventBus.$off(commonEvent.UPDATE_LOGIN_STATUS, successCallback);
					}
				};

				EventBus.$once(commonEvent.UPDATE_POP_LOGIN_BACK, failCallback);
				EventBus.$once(commonEvent.UPDATE_LOGIN_STATUS, successCallback);
				EventBus.$once(commonEvent.SAVE_LOGIN_STATUS, registCallback); // 注册成功，弹层消失
			}
		}
	}
};
</script>

<style lang='less'>
@import '~base/styles/variable.less';
#popupLogin {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: @white;
	overflow-y: auto;
    z-index: 999; //这里popup的z-index需要比dialog插件的遮罩层小
}
</style>
