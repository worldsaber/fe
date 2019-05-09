<template>
	<div class="m-play-guides-wrap">
		<div class="m-play-guides" ref="container">
			<div class="m-guides-header">
				<div class="m-guides-title">PLAY GUIDES</div>
				<i class="m-icon-close" data-action="close" data-ret="close" @click="close"></i>
			</div>

			<div class="m-guides-banner">
				<img src="./images/desk.png">
			</div>

			<div class="m-guides-desc">
				<ul class="m-desc-list" v-if="guidesList">
					<template v-for="(item, index) in guidesList">
						<li class="m-desc-item" :key="index">
							<div class="m-item-order">{{index + 1}}</div>
							<div class="m-item-title">{{item.title}}</div>
							<div class="m-item-desc">{{item.desc}}</div>
							<small>
								<span class="m-label">{{item.label}}</span>
								<span>{{item.limit}}</span>
							</small>
						</li>
					</template>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'PlayGuides',
	computed: {
		...mapState('roulette', ['guidesList'])
	},
	methods: {
		close() {
			this.$emit('toggleGuide', false);
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.set-center() {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
}

.m-play-guides-wrap {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: fade(#000, 80%);
}

.m-play-guides {
	width: 82.5%;
	margin: 0 auto;
	padding-bottom: 12/@rem;
	color: #fff;
	position: relative;
	background: url(./images/bg.png) no-repeat 0 0;
	background-size: 100% 100%;
	.set-center();

	img {
		width: 100%;
		vertical-align: top;
	}

	.m-guides-bg {
		width: 100%;
		max-height: 100%;
	}

	.m-guides-header {
		padding: 10/@rem 12/@rem;
		position: relative;
	}

	.m-icon-close {
		position: absolute;
		right: 8/@rem;
		top: 6/@rem;
		z-index: 200;
		border: 1px solid fade(#fff, 80%);
		border-radius: 50%;
		width: 21/@rem;
		height: 21/@rem;
		text-align: center;
		box-sizing: border-box;
		.m-icon-close();

		&:before {
			line-height: 1;
			font-size: 14/@rem;
			.set-center();
		}
	}

	.m-guides-title {
		font-size: 21.9/@rem;
		font-weight: 600;
		line-height: 1;
		text-align: center;
	}

	.m-guides-banner {
		height: 36.72vh;
		margin: 0 auto;
		text-align: center;

		img {
			width: auto;
			height: 100%;
			vertical-align: top;
		}
	}

	.m-guides-desc {
		width: 88.55%;
		margin: 0 auto;
		margin-top: 22/@rem;
		font-size: 10.2/@rem;
		overflow: auto;
		padding-right: 13/@rem;
		box-sizing: border-box;
		height: 37.5vh;
	}

	.m-desc-item {
		line-height: 1;
		margin-bottom: 23/@rem;
		padding: 3/@rem 10/@rem 3/@rem 31/@rem;
		position: relative;

		&:last-child {
			margin-bottom: 0;
		}

		.m-item-order {
			width: 18/@rem;
			height: 18/@rem;
			box-sizing: border-box;
			border: 1px solid #fff;
			border-radius: 50%;
			position: absolute;
			left: 0;
			top: 0;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.m-item-title {
			font-size: 13.3/@rem;
			font-weight: 500;
		}

		.m-item-desc {
			font-size: 10.2/@rem;
			font-weight: 500;
			margin: 8/@rem 0 14/@rem;
		}

		small {
			font-size: 8.8/@rem;
			font-weight: 500;

			.m-label {
				margin-right: 16/@rem;
			}
		}
	}
}
</style>
