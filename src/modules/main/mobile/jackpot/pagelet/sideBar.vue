<template>
	<aside class="nav-bar">
		<nav class="left-nav">
			<ul>
				<li :class="{'active':this.index === 'betting'}">
					<a :href="jackpotUrl">Sporty {{gameSize || '--'}}</a>
				</li>
				<li :class="{'active':this.index === 'result'}">
					<a :href="jackpotResultUrl">Previous Results</a>
				</li>
				<li>
					<a :href="`${helpUrl}#/how-to-play/jackpot`">How to Play</a>
				</li>
			</ul>
		</nav>
	</aside>
</template>
<script>
import { pagePath } from 'config/pageConfig';
import { mapState } from 'vuex';

export default {
	data() {
		return {
			index: '',
			jackpotUrl: pagePath.jackpot,
			jackpotResultUrl: pagePath.jackpotResult,
			helpUrl: pagePath.help
		};
	},
	computed: {
		...mapState('jackpot', ['gameSize'])
	},
	methods: {
		getActive() {
			this.index = this.$route.name;
		},
	},
	mounted() {
		this.getActive();
	}
};
</script>
<style lang="less">
@import 'base/styles/mixin.less';
@import 'base/styles/icon.less';
.nav-bar {
	.left-nav {
		background-color: @blueBlack;
		ul {
			font-size: 12/@rem;
			line-height: 45/@rem;
			display: table;
			width: 100%;
			li {
				display: table-cell;
				height: 45/@rem;
				width: 33%;
				color: @white;
				a {
					color: inherit;
					&:active,
					&:hover {
						color: inherit;
						text-decoration: none;
					}
					text-align: center;
					display: block;
					position: relative;

				}
				&.active {
					border-bottom: 3/@rem @green solid;
					color: @white;
				}
			}
		}
	}
}
</style>
