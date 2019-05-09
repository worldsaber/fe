<template>
	<div class="m-me-header">
		<div class="m-account-info">
			<div class="user-img" v-if="avatarUrl">
				<img :src="avatarUrl">
			</div>

			<div :class="['m-user-info', {
				'has-user-nick': nickname || firstName
			}]"
				v-loading.loadingUser="loadingUserStatus"
				@click="goToUrl(userCenterUrl['myAccountInfo'])">
				<div class="user-phone" v-if="showPhone">{{showPhone}}</div>
				<div class="user-nick" v-if="showName">{{showName}}</div>
			</div>
		</div>

		<div class="btns">
			<div class="logout" @click="logout">Log Out</div>
		</div>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { showCurrency } from 'config/currencyConfig';
import { userCenterUrl } from 'config/mycenter/dataConfig';
import { pagePath } from 'config/pageConfig';
import { EventBus } from 'kernel/js/eventBus';
import commonEvent from 'config/eventConfig/commonEvent';

export default {
	name: 'Account',
	data () {
		return {
			userCenterUrl,
			homeUrl: pagePath.home,
			showCurrency,
			country: window.country,
			loadingUserStatus: false,
			overlyStyle: {}
		};
	},
	created() {
		// 每次创建的时候更新数据，因为acountInfo已经取过，不需要加载中的状态
		this.loadingUser();
		// 登录状态发生变化刷新余额
		EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, status => {
			this.loadingUser();
		});
		// 主动发起同步账户余额
		EventBus.$on(commonEvent.UPDATE_ACCOUNT_BALANCE, () => {
			this.loadingUser();
		});
	},
	computed: {
		...mapState('me', ['avatar', 'nickname', 'firstName', 'phone']),
		avatarUrl() {
			const avatar = this.avatar;
			return avatar && `${__cdnOrigin__}/${avatar}`;
		},
		showPhone () {
			const phone = this.phone || '';
			if (this.country === 'gh') {
				return phone.replace(/(\d{2})(\d{4})(\d{3})/g, (m, m1, m2, m3) => `${m1}${'*'.repeat(m2.length)}${m3}`);
			}
			return phone.replace(/(\d{2})(\d{5})(\d{3})/g, (m, m1, m2, m3) => `${m1}${'*'.repeat(m2.length)}${m3}`);
		},
		showName () {
			if (this.nickname) return this.nickname;
			return `${this.firstName || ''} ${this.lastName || ''}`.trim();
		}
	},
	methods: {
		...mapActions('me', ['fetchAccountBaseInfo']),
		goToUrl (url) {
			window.location.href = URL.addPara(url || this.homeUrl, {
				source: 'me'
			});
		},
		logout () {
			fetch('/patron/accessToken/delete', {
				method: 'DELETE'
			}).then(res => res.json())
				.then(data => {
					if (data.bizCode === 10000) {
						this.goToUrl();
					}
				});
		},
		/**
		* 理论上 来说这里一定是登录后才能调用,而且是该组件一开始加载就请求，所以不存在自未登录的情况
		*/
		async loadingUser () {
			this.loadingUserStatus = true;
			try {
				const data = await this.fetchAccountBaseInfo();
				// 未登录
				if (data.login === false || data.bizCode === 401) {
					this.loadingUserStatus = false;
				} else {
					const code = data.bizCode;
					if (code === 10000) {
						this.loadingUserStatus = false;
					} else {
						this.loadingUserStatus = -1;
					}
				}
			} catch (err) {
				this.loadingUserStatus = -1;
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-me-header{
	display: flex;
	padding: 16/@rem;
	justify-content: space-between;
	align-items: center;

	.m-account-info {
		width: 57%;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.m-user-info {
		flex: 1;
		position: relative;
		line-height: 1;
		.m-icon-arrow--right();

		&:before {
			position: absolute;
			right: 0;
			top: 50%;
			font-size: 14/@rem;
			transform: translateY(-50%);
			color: @midGray;
		}

		&.has-user-nick {
			.user-phone {
				font-size: 14/@rem;
			}
		}
	}
	.user-img {
		flex: none;
		background: #eaecef;
		width: 32/@rem;
		height: 32/@rem;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 10/@rem;
		text-align: center;

		img {
			vertical-align: top;
			width: 100%;
			height: 100%;
		}
	}
	.user-nick{
		margin-top: 2/@rem;
		color: @dark;
		overflow: hidden;
		word-break: break-all;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 12/@rem;
	}
	.user-phone{
		font-size: 14/@rem;
		color: @darker;
	}
	.btns {
		width: 42%;
		text-align: right;
	}
	.logout{
		display: inline-block;
		min-width: 67/@rem;
		height: 32/@rem;
		line-height: 32/@rem;
		padding: 0 12/@rem;
		box-sizing: border-box;
		border-radius: 16/@rem;
		background: @fogGray;
		font-size: 12/@rem;
		font-weight: 500;
		color: @dark;
		text-align: center;
	}
}
</style>

