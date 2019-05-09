<template>
<!-- 在footer组件和注册组件中调用时宽度不对，需要fix，根据传入的fixWidth对宽度做出调整 -->
  <div :class="['m-region',{'fix-m-region-width':contentData.fixWidth}]">
	  <div class="m-pop-header">
		<i class="m-icon-close" data-action="close" data-ret="close"></i>
	  </div>
	  <div class="m-region-title">Location Preference</div>
	  <div class="m-region-list">
		  <template v-for="(item, index) in regionList">
			<a @click="handleChooseRegion(item.shortName)" :key="index" :class="['m-list-item', {
				active: item.isCurrenyRegion
			}]">
				<div class="m-region-flag">
					<img :src="item.flag" :alt="item.region">
				</div>
				<div class="m-region-name">{{item.region}}</div>
				<i class="m-icon" v-if="item.isCurrenyRegion"></i>
			</a>
		  </template>
	  </div>
  </div>
</template>

<script>
import { LS } from 'storage';
import dialog from 'components/dialog';
import regionList from '../config/regionConf.js';

export default {
	name: 'ChangeRegion',
	computed: {
		regionList () {
			return regionList.map(x => {
				x.isCurrenyRegion = x.shortName === window.ipCountry;
				return x;
			});
		}
	},
	methods: {
		handleChooseRegion(shortName) {
			LS.set('wap-set-region', shortName);
			// 如果目标国家与当前网站版本一致，则直接关闭本弹窗
			if (shortName === window.country) {
				dialog();
				this.$emit('close');
				return;
			}
			location.href = `/${shortName}/m`;
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.es-dialog.m-region-pop {
	padding-top: 0;
	width: auto!important;
	margin: 0!important;
	transform: translate(-50%, -50%);
	background-color: transparent!important;
	top: 50%;
	left: 50%;

	.es-dialog-body {
		background-color: transparent;
		.es-dialog-main {
			padding: 0;
			background-color: transparent;
			overflow: initial;
		}
	}
}

.m-region {
	background-color: @white;
	border-radius: 6/@rem;
	width: 280/@rem;
	padding: 32/@rem 20/@rem 79/@rem;
	box-sizing: border-box;
	.m-pop-header {
		width: 100%;
		.m-icon-close {
			color: @black;
			position: absolute;
			right: 14/@rem;
			top: 14/@rem;
			.m-icon-close();
			z-index: 200;
		}

	}
	.m-region-title {
		font-size: 16/@rem;
		font-weight: 500;
		text-align: center;
		color: @dark;
	}

	.m-region-list {
		margin-top: 55/@rem;

		.m-list-item {
			margin-bottom: 12/@rem;
			position: relative;
			display: flex;

			height: 48/@rem;
			justify-content: center;
			align-items: center;
			border-radius: 2px;
			border: 1px solid @fogGrayBorder;

			&.active {
				border-color: @green;

				.m-icon {
					position: absolute;
					right: 14/@rem;
					top: 50%;
					transform: translateY(-50%);
					.m-icon-success();
					&:before {
						color: @green;
					}
				}
			}

			.m-region-flag {
				margin-right: 13/@rem;

				img {
					display: block;
					width: 28/@rem;
					height: 18/@rem;
				}
			}

			.m-region-name {
				font-size: 12/@rem;
				font-weight: 500;
				color: @dark;
			}
		}
	}
}
.fix-m-region-width {
	width: unset;
}
</style>
