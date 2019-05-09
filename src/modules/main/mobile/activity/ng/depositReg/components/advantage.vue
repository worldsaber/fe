<template>
	<div :class="['deposit-advantages-wrap-ng']">
		<div class="deposit-advantages-item" v-for="(advan, index) in advantages" :key="index">
			<img :src="advan.src" class="deposit-advan-image" />
			<div class="deposit-advan-text">{{advan.text}}</div>
		</div>
	</div>
</template>
<script>
import advan1 from '../images/advan-1.svg';
import advan2 from '../images/advan-2.svg';
import advan3 from '../images/advan-3.svg';
// import advan4 from '../images/advan-4.svg';

export default {
	props: {
		advantages: {
			type: Array,
			default() {
				return [{
					text: 'We Offer BEST ODDS',
					src: advan1,
				}, {
					text: 'Cashout & Partial CashOut',
					src: advan2,
				}, {
					text: 'Fast & Light App',
					src: advan3,
				}];
			}
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';

.deposit-advantages-wrap-ng{
	margin: 30/@rem 16/@rem 50/@rem;
	.deposit-advantages-item{
		display: flex;
		align-items: center;
		background-color: #096b27;
		height: 80/@rem;
		// line-height: 80/@rem;
		padding-left: 20/@rem;
		margin: 10/@rem 0;
	}
	.deposit-advan-image{
		height: 44/@rem;
		width: 44/@rem;
	}
	.deposit-advan-text{
		font-size: 16/@rem;
		color: #FFF;
		margin-left: 20/@rem;
	}
}
</style>

