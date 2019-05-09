<template>
	<AdTips v-if="bonusTips">{{bonusTips}}</AdTips>
</template>

<script>
/* Bonus 奖金提示 */
import { mapState } from 'vuex';
import AdTips from './adTips';

export default {
	name: 'BonusTips',
	components: {
		AdTips
	},
	props: {
		// 添加的 bet 比赛信息列表
		betslips: {
			type: Array,
			required: true
		}
	},
	computed: {
		...mapState('betslipStake', ['bonusRatios']),
		bonusTips () {
			const oddsLimit = 1.2;
			const betMaxLength = 30;
			const { betslips, bonusRatios } = this;

			if (!bonusRatios || Object.keys(bonusRatios).length < 1 ||
				!betslips || betslips.length >= betMaxLength) return;

			// 同一比赛的不同 outcome 只能算作一场比赛，所以这里需要对 eventId 进行去重
			let tmpEventIds = {};
			const validBonusEvents = betslips.filter(x => {
				const { statusDesc } = x.outcomeInfo;
				const isUnavailable = statusDesc === 'unavailable';
				const isSuspended = statusDesc === 'suspended';

				// unavailable, suspended 不考虑
				if (isUnavailable || isSuspended) {
					return false;
				}

				const odds = parseFloat(x.outcomeInfo.odds);

				if (odds >= oddsLimit && !tmpEventIds[x.eventId]) {
					tmpEventIds[x.eventId] = true;
					return true;
				}
				return false;
			});

			tmpEventIds = null;

			const num = validBonusEvents.length;
			// 超过最大值
			if (num >= betMaxLength) return;
			let bonus = 0;
			let moreGameNum = 0;
			for (const key in bonusRatios) {
				if (num < key) {
					moreGameNum = key - num;
					bonus = parseInt(bonusRatios[key] * 100, 10);
					break;
				}
			}
			if (moreGameNum === 0 || bonus === 0) {
				return;
			}
			return `Select ${moreGameNum} more games (Each odd ≥ ${oddsLimit}), get ${bonus}% extra bonus!`;
		}
	}
};
</script>
