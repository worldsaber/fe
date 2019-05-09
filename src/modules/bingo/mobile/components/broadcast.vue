<template>
	<div class="bingo-broadcast-wrap">
		<div class="bingo-broadcast-list" :style="animationStyle">
			<span class="bingo-broadcast-item" v-for="(item,index) in list" :key="index"> 
				{{ item.time }}: {{ item.phone }} won 
				<span class="bingo-broadcast-item-em"> {{ item.currency }} {{ item.winning }} </span>
				in Round No.{{ item.roundNo }}
			</span>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		list: {
			type: Array,
			default() {
				return [];
			}
		},
		timeout: {
			type: Number,
			'default': 150  // s
		}
	},
	computed: {
		animationStyle() {
			const value = `${this.timeout}s`;
			return {
				animationDuration: value,
			};
		}
	}

};
</script>
<style lang="less">
@import 'base/styles/variable.less';

.bingo-broadcast-wrap{
	display: block;
	position: relative;
	z-index: 10;
	overflow: hidden;
	height: 32/@rem;
}
.bingo-broadcast-item{
	margin: 0 10/@rem;
	font-size: 12/@rem;
	color: #1b1e25;
}
.bingo-broadcast-list{
	position: absolute;
	padding-left: 150/@rem;
	white-space: nowrap;
	animation: circle linear infinite;
	will-change: transform;
}
@keyframes circle {
	100%{
		transform: translate(-100%, 0);
	}
}
</style>

