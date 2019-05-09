<template>
	<div class="m-sport-bet">
		<a class="sport-item sport" :href="sportOrderLink">
			<template v-if="hasJackpot">
				<span>Sports</span><span>Bet History</span>
			</template>
			<template v-else>
				<span class="one">Sports Bet History</span>
			</template>
		</a>
		<!-- 尼日没有jackpotOrder -->
		<a class="sport-item jackpot" :href="jackpotOrderLink" v-if="hasJackpot">
			<span>Jackpot</span><span>Bet History</span>
		</a>
	</div>
</template>

<script>
import { userCenterUrl } from 'config/mycenter/dataConfig';
import { pagePath } from 'config/pageConfig';

export default {
	name: 'HistoryList',
	computed: {
		sportOrderLink() {
			return this.addSource(userCenterUrl.sportOrder);
		},
		jackpotOrderLink() {
			return this.addSource(userCenterUrl.jackpotOrder);
		},
		hasJackpot() {
			// 现在都有 jackpot
			return true;
		}
	},
	methods: {
		addSource(url) {
			return URL.addPara(url || pagePath.home, {
				source: 'me'
			});
		}
	}
};
</script>

<style lang="less" scoped>
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-sport-bet{
	padding: 0 16/@rem;
	background: @white;
	display: flex;
	justify-content: space-between;

	.sport-item{
		display: block;
		color: @white;
		flex: 1;
		border-radius: 2/@rem;
		font-size: 14/@rem;
		line-height: 16/@rem;
		font-weight: 500;
		box-sizing: border-box;
		padding: 7/@rem 12/@rem;
		padding-right: 32/@rem;
		position: relative;
		font-weight: bold;
		.m-icon-arrow--right();

		&:before {
			right: 10/@rem;
			font-weight: normal;
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
		}
		&.sport {
			background-color: @green;
			margin-right: 10/@rem;
		}
		&.jackpot{
			background-color: @red;
		}
		>span{
			display: block;
			line-height: normal;
		}
		.one{
			display: block;
			height: 44/@rem;
			line-height: 44/@rem;
		}
	}
}
</style>
