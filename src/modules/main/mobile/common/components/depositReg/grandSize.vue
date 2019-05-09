<template>
	<GrandPrize :grandList="grandInfo" />
</template>
<script>
import { formatNumber } from 'utils';
import GrandPrize from '../../../index/pagelet/grand.vue';

export default {
	components: {
		GrandPrize,
	},
	data() {
		return {
			grandInfo: [],
		};
	},
	created() {
		this.clearBdInfo();
	},
	methods: {
		clearBdInfo() {
			const bdConfig = window.bdcastConf || [],
				bizType2key = {
					1: 'Sports Betting',
					2: 'Virtual',
					3: 'Jackpot'
				};

			this.grandInfo = [];

			for (const item of bdConfig) {
				const { groupType, infos = [] } = item;

				switch (groupType) {
				case 20:
					for (const grandItem of infos) {
						const { detail = {}} = grandItem,
							temp = {};

								// msgType为1是中奖通知
						if (detail.msgType === 1) {
							temp.id = grandItem.id;
							temp.showTime = this.getTimeRange(detail.bizTime);
							temp.showWinning = detail.winning && formatNumber(detail.winning / 10000, 2) || 0;
							temp.showType = `in ${bizType2key[detail.bizType]}`;
							temp.phone = detail.phone;
							this.grandInfo.push(temp);
						}
					}
					break;
				default:
				}
			}
		},
		getTimeRange(date) {
			// IDEA: 小于1小时精确到分显示 X min ago, 不足1分钟显示 1 min ago。大于1小时精确到小时显示 X hr ago。超过72小时显示为 72 hr ago。

			if (!+date) {
				return '';
			}

			const now = +new Date();
			const dis = now - date;
			const MINUTE = 60 * 1000,
				HOUR = 60 * MINUTE,
				HOUR_72 = 72 * HOUR;

			if (dis > HOUR_72) {
				return '72hr ago';
			}

			if (dis > HOUR) {
				return `${parseInt(dis / HOUR, 10)}hr ago`;
			}

			if (dis > MINUTE) {
				return `${parseInt(dis / MINUTE, 10)}min ago`;
			}

			if (dis <= 0) {
				return '';
			}

			return '1min ago';
		}
	}
};
</script>
