<template>
	<div class="world-match-info-wrap">
		<div class="world-match-logo">Sporty Predict & Win</div>
		<div class="world-match-title">MATCHES INFORMATION</div>
		<div class="world-match-loading" v-if="loading">
			<i class="m-icon-loading"></i>
			<span class="m-text-msg">Loading...</span>
		</div>
		<div class="world-match-pending-list-wrap">
			<PendingRound v-for="(item, index) in pendingList" :key="index" :item="item" />
		</div>
		<div class="word-match-pending-list-empty" v-if="isNoPending">Stay tuned for the next match! Coming soon!</div>

		<div class="world-match-list-wrap">
			<Round v-for="(item, index) in endList" :key="index" :item="item" />
		</div>
	</div>
</template>
<script>
// import dateFormat from 'kernel/js/dateFormat';
import Round from './round.vue';
import PendingRound from './pending-round.vue';

export default {
	components: {
		Round,
		PendingRound,
	},
	data() {
		return {
			loading: true,
			isNoPending: false,
			endList: [],
			pendingList: []
		};
	},
	mounted() {
		this.loadList();
	},
	methods: {
		loadList() {
			this.loading = true;
			fetch('/promotion/v1/activities/score/roundEvents', {
				method: 'GET'
			}).then(res => res.json())
			.then(res => {
				this.loading = false;
				if (res.bizCode === 10000) {
					const data = res.data;
					const pendingList = [];
					const endList = [];
					data.forEach(item => {
						if ([0, 1].includes(item.status)) {
							pendingList.push(item);
						} else {
							endList.push(item);
						}
					});
					this.pendingList = pendingList;
					this.isNoPending = pendingList.length === 0;
					this.endList = this.formatData(endList);
				}
			}).catch(err => {
				this.loading = false;
				err.message && this.$dialog.toast(err.message);
			});
		},
		formatData(history) {
			if (!history || history.length <= 0) {
				return [];
			}
			history.forEach(item => {
				item.isFinal = false; // [3, 4].includes(item.status);
				item.deadLine = item.effectTime;
				item.homeScore = item.homeTeamScore;  // 真实比赛比分
				item.awayScore = item.awayTeamScore;
			});
			return history;
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';
.world-match-logo{
	height: 24/@rem;
	width: 144/@rem;
	line-height: 24/@rem;
	background-image: linear-gradient(to top, #7614e5, #c704d6);
	font-size: 12/@rem;
	text-align: center;
	font-weight: bold;
	margin: 0 auto 15/@rem;
	border-radius: 10/@rem;
	color: #FFF;
}
.world-match-info-wrap{
	padding: 12/@rem 0 50/@rem;
}
.world-match-title{
	color: #fbf204;
	font-size: 16/@rem;
	font-weight: bold;
	margin-bottom: 20/@rem;
	text-align: center;
}
.world-match-pending-list-wrap{
	margin: 0 24/@rem;
	margin-bottom: 15/@rem;
}
.word-match-pending-list-empty{
	height: 55/@rem;
	line-height: 55/@rem;
	font-size: 13/@rem;
	text-align: center;
	background-image: linear-gradient(to top, #70a1e6, #659ef6);
	box-shadow: 0px 3px 8.4px 2.6px rgba(2, 4, 0, 0.23);
	border-radius: 2/@rem;
	margin: 0 24/@rem 15/@rem 24/@rem;
}
.world-match-loading{
	padding: 40/@rem 0;
	height: 20/@rem;
	margin: 0 24/@rem;
	line-height: 20/@rem;
	text-align: center;
	font-size: 16/@rem;
	color: #FFF;
	background-color:#70a1e6;
	.m-icon-loading {
		display: inline-block;
		.m-icon-loading-circle();
		animation: loading-rotate 2s linear infinite;
	}
}
.world-match-list-wrap{
	margin: 0 24/@rem;
}
@keyframes loading-rotate {
	100% {
		transform: rotate(360deg);
	}
}
</style>

