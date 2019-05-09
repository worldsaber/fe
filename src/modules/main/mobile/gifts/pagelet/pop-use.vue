<template>
	<div class="pop-use-dialog">
		<div class="pop-use-desc">There are two types of gifts which could be used as your stake</div>
		<div class="pop-use-image">
			<img class="pop-use-arrow" src="../image/right-arrow.svg"/>
			<img class="pop-use-gift" :src="useUrl"/>
		</div>
		<div class="pop-use-btn-wrap">
			<af-Button
				class="m-btn-gift"
				extraType="text"
				data-action="close"
				data-ret="gift"
				@click="goGifts" 
				>How to Use Gift</af-Button>
			<af-Button
				class="m-btn-bet"
				extraType="text"
				data-action="close"
				data-ret="bet"
				@click="goBet" 
				>Bet Now</af-Button>
		</div>
	</div>
</template>
<script>
import router from 'routers/gifts';
/* eslint-disable */
const useUrl = {
	ke: require('../image/gift-use-ke.jpg'),
	ng: require('../image/gift-use-ng.jpg'),
	gh: require('../image/gift-use-gh.jpg')
};
/* eslint-enable */

export default {
	data () {
		return {
			useUrl: useUrl[window.country]
		};
	},
	methods: {
		goGifts() {
			router.push({
				name: 'giftsDesc'
			});
		},
		goBet() {
			location.href = this.contentData.useUrl;
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';

.m-gift-pop-dialog{
	.es-dialog-head{
		h1{
			font-size: 15/@rem;
			font-weight: bold;
		}
		.es-dialog-close{
			display: block;
			font-size: 12/@rem;
			padding: 0;
			line-height: 1;
			top: 10/@rem;
			right: 10/@rem;
			em:before{
				font-size: 12/@rem;
			}
		}
	} 
	
}
.pop-use-desc{
	font-size: 12/@rem;
	line-height: 1.5;
	color: #353a45;
}
.pop-use-image{
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 24/@rem 0 36/@rem;
}
.pop-use-arrow{
	width: 32/@rem;
	height: 32/@rem;
	margin-top: -35/@rem;
}
.pop-use-gift{
	width: 212/@rem;
}
.pop-use-btn-wrap{
	display: flex;
	justify-content: center;
	margin-bottom: 20/@rem;

	.m-btn-gift{
		width: 156/@rem;
		font-size: 14/@rem;
		background-color: #FFF;
		color: #0d9737;
		margin-right: 10/@rem;
		border: 1/@rem solid #0d9737;
	}
	.m-btn-bet{
		width: 98/@rem;
		font-size: 14/@rem;
		color: #FFF;
		background-color: #0d9737;
	}
}
</style>

