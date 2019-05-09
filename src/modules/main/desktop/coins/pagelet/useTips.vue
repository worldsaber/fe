<template lang="html">
	<ul class="m-coins--use f-count">
		<li
			v-for="(item, index) in cfg.useTips"
			:key="index"
			class="m-item--use"
		>
			<div class="m-l-left f-count-item"></div>
			<div class="m-l-right">
				<h3 class="m-t-12 m-t-l14 m-t-bblack">{{item.txt}}</h3>
				<div class="m-img-wrapper">
					<img :src="item.img" alt="" />
				</div>
			</div>
		</li>
	</ul>
</template>

<script>
import { useTips } from '../js/config';

export default {
	data() {
		return {
			cfg: Object.freeze({
				useTips
			})
		};
	}
};
</script>

<style lang="less" scoped>
@import 'base/style/variable.less';
@import 'base/style/icon.less';
@import '../style/text.less';

.m-coins--use {
	margin-top: 43px;
	width: 100%;

	.m-item--use {
		display: inline-block;
		vertical-align: top;
		font-size: 0;
		width: 206px;
		margin-right: 40px;

		&:last-of-type {
			margin-right: 0;
		}
	}

	.m-img-wrapper {
		width: 100%;
		overflow: hidden;
		margin-top: 22px;

		>img {
			width: 100%;
			height: 100%;
		}
	}

	.m-l-left,
	.m-l-right {
		display: inline-block;
		vertical-align: top;
	}

	.m-l-right {
		width: calc(100% - 28px);
	}

	.m-l-left {
		width: 28px;
		padding-right: 8px;
		box-sizing: border-box;
	}

	.f-count {
		counter-reset: index;
	}

	.f-count-item {

		&::before {
			display: inline-block;
			width: 18px;
			height: 16px;
			border-radius: 50%;
			background: @blueBlack;
			line-height: 16px;
			text-align: center;
			color: @white;
			font-size: 12px;
			font-weight: bold;
			content: counter(index);
			counter-increment: index;
		}
	}
}
</style>
