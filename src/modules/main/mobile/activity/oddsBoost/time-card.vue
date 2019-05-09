<template>
	<div class="time-card-wrap">
		<div class="card-head"></div>
		<div class="card-foot">
			<div class="time">{{time}}</div>
			<div class="time-unit">{{unit}}</div>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		unit: {
			type: String,
		},
		time: {
			type: [String, Number]
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
.time-card-wrap{
	width: 52/@rem;
	.card-head{
		height: 16/@rem;
		background-color: #994ecb;
		margin-bottom: 1/@rem;
	}
	.card-foot{
		position: relative;
		height: 32/@rem;
		background-image: linear-gradient(to bottom, #b264dc, #7b34b7);
	}
	.time{
		position: absolute;
		top: -14/@rem;
		width: 100%;
		font-size: 18/@rem;
		font-weight: bold;
		color: #FFF;
	}
	.time-unit{
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 16/@rem;
		line-height: 16/@rem;
		color: #FFF;
		font-size: 11/@rem;
		font-weight: bold;
		background-color: rgba(74, 60, 173, 0.8);
	}
}
</style>
