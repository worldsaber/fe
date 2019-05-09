<template>
	<div class="set-nickname-wrap">
		<p class="nickname-desc">Give yourself a cool nickname to start the conversation.</p>
		<af-input class="nickname-value" ref="input" v-model="nickname" placeholder="up to 15 characters" icon="delete" :iconClick="iconCLick" :maxlength="15"/>
		<div class="action-wrap">
			<div class="action-btn" @click="close">LATER</div>
			<div v-if="!isLoading" :class="['action-btn bold', {'disable': disabled}]" @click="save">SAVE</div>
			<i v-else class="action-btn loading-icon"/>
		</div>
	</div>
</template>

<script>
import { AfInput } from 'components/input';
import store from 'store/me';
import { LS } from 'storage';

export default {
	components: {
		AfInput
	},
	data() {
		return {
			nickname: '',
			isLoading: false
		};
	},
	computed: {
		disabled() {
			return false && this.nickname.length === 0;
		}
	},
	watch: {
		nickname() {
			this.nickname = this.nickname.replace(/\s/g, '');
		},
	},
	methods: {
		iconCLick() {
			this.nickname = '';
		},
		// 记录点击时间点
		recordPopTime() {
			LS.set('wap_nickname_poped', Date.now());
			// 距上次点击later 24小时后，用户若再次点击later，就再也不弹窗了
			const count = LS.get('wap_nickname_poped_count') || 0;
			LS.set('wap_nickname_poped_count', count + 1);
		},
		close() {
			this.recordPopTime();
			this.$dialog();
			this.$toast('You can set nickname in your account');
		},
		save() {
			if (this.nickname.length === 0) {
				this.$dialog.toast('Please enter a nickname', 2000);
				return;
			}
			this.isLoading = true;
			store._actions['me/updateNickname'][0](this.nickname).then(data => {
				this.isLoading = false;
				if (data.code === 10000) {
					this.$dialog();
					store._actions['me/quanziLogin'][0]();
				}
				this.$dialog.toast(data.msg, 2000);
			}).catch(msg => {
				this.isLoading = false;
				this.$dialog.toast(msg, 2000);
			});
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.set-nickname-wrap {
	.nickname-desc {
		font-size: 16/@rem;
		line-height: 24/@rem;
		color: @dark;
	}
	.nickname-value {
		margin-top: 4/@rem;
		width: 100%;
	}
	.action-wrap {
		margin-top: 37/@rem;
		padding-left: 80/@rem;
		padding-bottom: 17/@rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14/@rem;
		.action-btn {
			flex: 0 0 auto;
			color: @green;
			&.bold {
				margin-left: 36/@rem;
				font-weight: bold;
				&.disable {
					font-weight: normal;
					color: @darkGray;
				}
			}
			&.loading-icon {
				margin-left: 36/@rem;
				.m-icon-loading();
				&::before {
					font-size: 14/@rem;
				}
			    // display: inline-block;
			    animation: loading-rotate 2s linear infinite;
			}
		}
	}
	.m-input-wap-wrapper.m-input-wap-wrapper--active {
		border-color: @green;
	}
}
</style>
