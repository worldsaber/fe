<template lang="html">
  <div class="m-grands" v-if="showGrands">
	  <div class="m-gd-title">Grand Prize Winners</div>
	  <Broadcast>
		  <div slot="bdcastList">
		  	<template v-for="(item, index) in grandList">
		  		<div
		  			class="m-gd-item"
		  			:key="item.id || index"
		  		>
		  			<div class="i-wrapper">
						<i class="i-gd-bg"></i>
		  				<div class="i-con">
							<div class="i-phone">{{item.phone}} won</div>
			  				<div class="i-total">{{showCurrency}}{{item.showWinning}}</div>
			  				<div class="i-type">{{item.showType}}</div>
		  				</div>
		  			</div>

		  			<div class="i-time">{{item.showTime}}</div>
		  		</div>
	      </template>
		 </div>
	  </Broadcast>
  </div>
</template>

<script>
import { showCurrency } from 'config/currencyConfig';
import 'components/broadcast';

export default {
	props: {
		grandList: {
			type: Array,
			default() {
				return [];
			}
		}
	},
	data() {
		return {
			showCurrency
		};
	},
	computed: {
		showGrands() {
			return !!this.grandList.length;
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.m-grands {
	.m-gd-title {
		line-height: 21/@rem;
		font-size: 18/@rem;
		font-weight: bold;
		color: @dark;
		margin: 9/@rem 10/@rem;
	}

	.m-bdcast {
		padding-left: 2/@rem;
		box-sizing: border-box;
        font-size: 0;
	}

	.m-gd-item {
		display: inline-block;
		vertical-align: top;
		margin: 0 8/@rem;
	}

	.i-wrapper {
		background: @dark;
		position: relative;
		overflow: hidden;
		z-index: 2;
		height: 66/@rem;
		width: 140/@rem;
		border-radius: 2/@rem 2/@rem 33/@rem 2/@rem;

		.i-gd-bg {
			.m-icon-jackpot();
			position: absolute;
			top: 0;
			right: 0;
			width: 64/@rem;
			height: 50/@rem;
			transform: rotate(18deg) translate3d(13/@rem, -7/@rem, 0) scale(1.2);
			background: fadeout(@dark, 45%);
			&::before {
				font-size: 52/@rem;
				color: fadeout(@white, 88%);
			}
		}

		.i-con {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 22;
			padding: 12/@rem 14/@rem;
			box-sizing: border-box;
		}

		.i-phone {
			line-height: 11/@rem;
			font-size: 10/@rem;
			font-weight: bold;
			color: @white;
		}

		.i-total {
			margin-top: 2/@rem;
			line-height: 16/@rem;
			font-size: 13/@rem;
			font-weight: 900;
			font-style: italic;
			color: @midGreen;
		}

		.i-type {
			margin-top: 2/@rem;
			line-height: 11/@rem;
			font-size: 10/@rem;
			font-weight: bold;
			color: @white;
		}
	}

	.i-time {
		margin-top: 4/@rem;
		line-height: 11/@rem;
		font-size: 10/@rem;
		font-weight: 500;
		color: @darkGray;
	}
}
</style>
