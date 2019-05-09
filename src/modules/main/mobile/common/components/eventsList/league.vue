<template>
	<div class="m-league">
		<div :class="[
			'm-league-title',
			{
				hide: !isShow
			}
		]" @click="changeDisplay">
			<span class="icon-triangle"></span>
			<span class="text">{{name}}</span>
			<a :href="oddsBoostUrl" v-if="isBoost"><img class="boost" src="./boost-icon.svg" /></a>
			<span class="m-event-size">{{eventSize}}</span>
		</div>

		<div class="m-league-conent" v-show="isShow">
			<slot></slot>
		</div>
	</div>
</template>

<script>
import { oddsBoostActivity } from 'config/activity/activityConfig';

export default {
	props: {
		isShowContent: {
			'default': true,
			type: Boolean
		},
		name: {
			type: String,
			required: true
		},
		eventSize: {
			type: Number
		},
		isBoost: {
			type: Boolean,
			'default': false
		}
	},
	data () {
		return {
			oddsBoostUrl: oddsBoostActivity,
			isShow: true
		};
	},
	watch: {
		isShowContent (val) {
			this.isShow = val;
		}
	},
	created () {
		this.isShow = this.isShowContent;
	},
	methods: {
		changeDisplay () {
			this.isShow = !this.isShow;
			this.$emit('change', this.isShow);
		},
		setShowDisplay(isShow) {
			this.isShow = isShow;
		}
	}
};
</script>

<style lang="less">
@import '~base/styles/variable.less';
@import '~base/styles/mixin.less';
@import 'base/styles/icon.less';

@leagueHeight: 44/@rem;

.m-league {
	.m-league-title{
		display: flex;
		align-items: center;
		overflow: hidden;
		background-color: @white;
		color: @darker;
		font-size: 14/@rem;
		height: @leagueHeight;
		line-height: @leagueHeight;
		padding: 0 40/@rem 0 10/@rem;
		box-sizing: border-box;
		border-top: 1px solid @fogGray;

		.text{
			.ellipsis();
			// display: inline-block;
			padding-left: 10/@rem;
			font-weight: 500;
		}
		.boost{
			flex-shrink: 0;
			width: 24/@rem;
			height: 24/@rem;
			margin-left: 4/@rem;
		}
		.icon-triangle{
			display: inline-block;
			&:after{
				content: '\e6a3';
				font-family: "iconfont" !important;
				font-size: 10/@rem;
				font-style: normal;
				display: inline-block;
				-webkit-font-smoothing: antialiased;
				-moz-osx-font-smoothing: grayscale;
				line-height: 1.4;
				height: 14/@rem;
				overflow: hidden;
				vertical-align: middle;
				color: @midGreen;
			}
		}
		&.hide{
			.icon-triangle{
				transform: rotate(-90deg);
			}
		}

		.m-event-size {
			position: absolute;
			right: 17/@rem;
			height: @leagueHeight;
			color: @dark;
			font-size: 12/@rem;
		}
	}
}
</style>
