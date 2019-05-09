<template>
	<div :class="['deposit-advantages-wrap-gh']">
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
import advan4 from '../images/advan-4.svg';

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
				}, {
					text: 'Free Deposit',
					src: advan4,
				}];
			}
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';

.deposit-advantages-wrap-gh{
	margin: 30/@rem 12/@rem 50/@rem;
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	.deposit-advantages-item{
		display: flex;
		align-items: center;
		background-color: #096b27;
		height: 80/@rem;
		line-height: 80/@rem;
		padding: 0 25/@rem;
		margin: 10/@rem 0;
		margin: 4/@rem;
		flex-basis: 30%;
		width: 30%;
		flex: 1;
		flex-direction: column;
		height: 140/@rem;
	}
	.deposit-advan-image{
		margin: 24/@rem 0 12/@rem;
		height: 44/@rem;
		width: 44/@rem;
	}
	.deposit-advan-text{
		width: 120/@rem;
		text-align: center;
		line-height: 1.2;
		font-size: 16/@rem;
		color: #FFF;
	}
}
</style>

