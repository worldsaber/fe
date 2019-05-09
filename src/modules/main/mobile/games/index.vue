<template>
	<Layout class="m-games" :isHaveBottomNav="false" :isHaveNavBar="true" :isHasFooter="false">
		<div slot="mid">
			<topNavBar/>
			<ul class="game-list">
				<li class="game-item" v-for="(game, i) in gameList" :key="i">
					<img class="game-bg" :src="game.img" @click="jmpTo(game)">
					<div class="game-detail">
						<div class="left">
							<div class="game-title">{{game.title}}</div>
							<div class="game-online-num" v-if="nums">{{nums[game.countKey]}} online players</div>
						</div>
						<div class="right play-btn" @click="jmpTo(game)">PLAY</div>
					</div>
				</li>
			</ul>
		</div>
	</Layout>
</template>

<script>
import { mapMutations } from 'vuex';
import { CHANGE_LOADING } from 'store/layout/mutationTypes';
import { formatNumber } from 'utils';
import topNavBar from 'components/navbar/index.vue';
import Layout from 'components/layout/main.vue';
import { gameList } from './games';

export default{
	name: 'games',
	components: {
		Layout,
		topNavBar
	},
	data () {
		return {
			gameList,
			nums: ''
		};
	},
	created() {
		this.getOnlineNum();
	},
	mounted() {
		// document.querySelector('#pageLoading').remove();
		this.pageLoading(false);
	},
	methods: {
		...mapMutations('layout', {
			pageLoading: CHANGE_LOADING
		}),
		getOnlineNum() {
			return fetch('/virtual/user/count').then(res => res.json()).then(res => {
				if (res.bizCode === 10000) {
					this.nums = this.format(res.data);
				}
			});
		},
		format(data) {
			Object.keys(data).forEach(key => {
				data[key] = formatNumber(data[key], 0);
			});
			return data;
		},
		jmpTo(game) {
			location.href = game.jmpTo;
		},
		goBack() {
			history.go(-1);
		}
	}
};
</script>
<style lang="less">
@import '~base/styles/variable.less';
@import 'base/styles/icon.less';

.m-games {
	.m-main-mid {
		background-color: @darker;
	}
	.game-list {
		box-sizing: border-box;
		padding-top: 16/@rem;
		padding-left: 16/@rem;
		list-style: none;
		.game-item {
			.game-bg {
				display: inline-block;
				width: 100%;
			}
			.game-detail {
				display: flex;
				align-items: center;
				justify-content: center;
				padding: 12/@rem 16/@rem 15/@rem 0;
				.left {
					flex: 1 1 auto;
					.game-title {
						line-height: 20/@rem;
						font-size: 16/@rem;
						color: @white;
					}
					.game-online-num {
						// padding-left: 10/@rem;
						color: @darkGray;
						font-size: 12/@rem;
						line-height: 14/@rem;
					}
				}
				.right {
					flex: 0 0 auto;
					&.play-btn {
						width: 80/@rem;
						height: 36/@rem;
						line-height: 36/@rem;
						background: @lightGreen;
						border-radius: 2/@rem;
						color: @darker;
						font-size: 12/@rem;
						font-weight: bold;
						text-align: center;
					}
				}
			}
		}
	}
}
</style>
