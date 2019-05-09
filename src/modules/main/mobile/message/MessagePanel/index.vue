<template>
	<div class="m-message-panel" v-loading:getMessages="loading">
		<div class="m-message-list" v-if="messages.length">
			<template v-for="(item, index) in messages">
				<MessageItem :key="index" :item="item"></MessageItem>
			</template>

			<div class="m-no-more" v-if="noMoreData && messages.length >= 20" v-show="!loading">No more info</div>
		</div>

		<NoDataTips v-else-if="!loading">No message available</NoDataTips>
	</div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import loginMixin from 'base/js/loginMixin';
import { EventBus } from 'kernel/js/eventBus';
import commonEvent from 'config/eventConfig/commonEvent';
import NoDataTips from 'components/NoDataTips';
import MessageItem from './pagelet/Item';

export default {
	name: 'MessagePanel',
	mixins: [loginMixin],
	components: {
		MessageItem,
		NoDataTips
	},
	props: {
		visible: {
			type: Boolean,
			defautl: true
		}
	},
	data() {
		return {
			loading: false,
			noMoreData: false,
			lastId: ''
		};
	},
	computed: {
		...mapState('layout', ['scrollPayload']),
		...mapState('message', ['messages'])
	},
	watch: {
		// 滚动加载更多
		scrollPayload({ clientHeight, scrollHeight, scrollTop }) {
			if (!this.visible || this.loading || this.noMoreData) {
				return;
			}

			if (clientHeight + scrollTop >= scrollHeight) {
				// 加载下一页
				this.fetchMessageList();
			}
		}
	},
	methods: {
		...mapActions('message', ['getMessages']),
		async fetchMessageList() {
			this.loading = true;
			try {
				const res = await this.getMessages(this.lastId);

				if (res.result === 100) {
					if (!res.messages || !res.messages.length) {
						this.noMoreData = true;
					} else {
						const lastMessage = this.messages[this.messages.length - 1];
						if (lastMessage) {
							this.lastId = lastMessage.messageId;
						}
					}
				}
				this.loading = false;
			} catch (err) {
				// eslint-disable-next-line
				console.log('err', err);
				this.loading = -1;

				if (err.login === false) {
					return this.login();
				}
			}
		}
	},
	created() {
		// 校验及登录
		if (this.checkLogin()) {
			this.fetchMessageList();
		} else {
			EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, () => {
				this.fetchMessageList();
			});
		}
	}
};
</script>
