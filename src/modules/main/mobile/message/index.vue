<template>
	<Layout :isHaveBottomNav="false" :isHaveLoading="false" :isHasFooter="false" :isNeedScroll="true" :isHaveRightPagelet="true">
		<BackBar slot="afterNav"></BackBar>

		<div class="m-message-wrap" slot="mid">
			<AfTabs v-model="currentTab" class="m-message-tabs" size="small" @change="changeTab">
				<AfTabPane label="Message" name="message">
					<!-- message -->
					<MessagePanel v-if="isMessageMounted" :visible="currentTab === 'message'"></MessagePanel>
				</AfTabPane>

				<AfTabPane label="System" name="system">
					<!-- system message -->
					<SystemPanel v-if="isSystemMounted" :visible="currentTab === 'system'"></SystemPanel>
				</AfTabPane>
			</AfTabs>
		</div>
	</Layout>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import 'packages/tabs';
import loginMixin from 'base/js/loginMixin';
import Layout from 'components/layout/main';
import BackBar from 'components/navbar';
import MessagePanel from './MessagePanel';
import SystemPanel from './SystemPanel';

export default {
	name: 'Message',
	mixins: [loginMixin],
	components: {
		Layout,
		BackBar,
		MessagePanel,
		SystemPanel
	},
	data() {
		return {
			currentTab: 'message',
			isMessageMounted: false,
			isSystemMounted: false
		};
	},
	computed: {
		...mapState('message', ['messagesUnreadCount', 'systemMessagesUnreadCount']),
	},
	watch: {
		currentTab: {
			immediate: true,
			handler() {
				this.mountTab();
			}
		}
	},
	methods: {
		...mapActions('message', ['getMessagesUnreadCount', 'getSystemMessagesUnreadCount']),
		mountTab() {
			if (this.currentTab === 'message' && !this.isMessageMounted) {
				this.isMessageMounted = true;
			}
			if (this.currentTab === 'system' && !this.isSystemMounted) {
				this.isSystemMounted = true;
			}
		},
		changeTab(tab) {
			this.currentTab = tab;
			this.replaceHistoryWithTab(tab);
		},
		replaceHistoryWithTab(tab) {
			let modifiedUrl = URL.removePara(document.URL, 'tab');
			modifiedUrl = URL.addPara(modifiedUrl, { tab });

			if (history.replaceState) {
				history.replaceState(null, document.title, modifiedUrl);
			}
		},
		// 获取用户未读消息数量
		async fetchtNoticeCount() {
			try {
				await Promise.all([
					this.getMessagesUnreadCount(),
					this.getSystemMessagesUnreadCount()
				]);
				const tabs = document.querySelectorAll('.m-message-wrap .m-tabs-nav .m-tabs-tab');
				if (tabs.length) {
					if (this.messagesUnreadCount > 0) {
						tabs[0].addClass('unread');
					} else {
						tabs[0].removeClass('unread');
					}

					if (this.systemMessagesUnreadCount > 0) {
						tabs[1].addClass('unread');
					} else {
						tabs[1].removeClass('unread');
					}
				}
			} catch (err) {
				console.log(err); // eslint-disable-line
				if (err.login === false) {
					return this.login();
				}
			}
		}
	},
	created() {
		const tab = URL.getPara('tab');
		if (tab) {
			this.changeTab(tab);
		}
	},
	mounted() {
		this.fetchtNoticeCount();
	},
};
</script>


<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-message-tabs {
	.m-tabs-nav {
		width: 240/@rem;
		margin: 0 auto;
	}
	.m-tabs-tab {
		width: 120/@rem;
		height: 48/@rem;
		line-height: 48/@rem;
		text-align: center;
		padding: 0;
		margin: 0;
		color: @dark;
		font-size: 14/@rem;
		font-weight: 500;

		&-active {
			font-weight: bold;
			color: @dark;
		}

		&:hover {
			color: @dark;
		}
	}

	.m-tabs-ink-bar {
		height: 3/@rem;
		background: @red;
	}

	.m-tabs-content {
		border-top: 1px solid @fogGrayBorder;
		margin-top: -1px;
	}

	.unread {
		position: relative;

		&:before {
			content: '';
			display: block;
			width: 6px;
			height: 6px;
			border-radius: 50%;
			background: @red;
			position: absolute;
			top: 13/@rem;
			right: 19/@rem;
		}
	}
}

.m-message-wrap {
	margin-bottom: 20/@rem;

	.m-loading-wrap {
		position: relative;
	}

	.m-no-more {
		margin: 14/@rem auto;
		font-size: 12/@rem;
		color: @darkGray;
		text-align: center;
	}
}
</style>
