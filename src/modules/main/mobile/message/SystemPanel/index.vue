<template>
	<div class="m-system-panel" v-loading:fetchSystemMessageList="loading">
		<div class="m-system-list" v-if="systemMessages.length">
			<template v-for="(item, index) in systemMessages">
				<SystemItem :key="index" :item="item"></SystemItem>
			</template>

			<div class="m-no-more" v-if="noMoreData && systemMessages.length >= 20" v-show="!loading">No more info</div>
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
import SystemItem from './pagelet/item';

export default {
	name: 'SystemPanel',
	mixins: [loginMixin],
	components: {
		SystemItem,
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
		...mapState('message', ['systemMessages'])
	},
	watch: {
		// 滚动加载更多
		scrollPayload({ clientHeight, scrollHeight, scrollTop }) {
			if (!this.visible || this.loading || this.noMoreData) {
				return;
			}

			if (clientHeight + scrollTop >= scrollHeight) {
				// 加载下一页
				this.fetchSystemMessageList();
			}
		}
	},
	methods: {
		...mapActions('message', ['getSystemMessages']),
		async fetchSystemMessageList() {
			this.loading = true;
			try {
				const res = await this.getSystemMessages(this.lastId);
				// 不足20条说明没有下一页
				if (!res.data || res.data.length < 20) {
					this.noMoreData = true;
				} else {
					const lastMessage = this.systemMessages[this.systemMessages.length - 1];
					if (lastMessage) {
						this.lastId = lastMessage.id;
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
			this.fetchSystemMessageList();
		} else {
			EventBus.$on(commonEvent.UPDATE_LOGIN_STATUS, () => {
				this.fetchSystemMessageList();
			});
		}
	}
};
</script>
