<template>
	<div class="timer-wrap">
		<div class="timer-label">Offer Ends In</div>
		<div class="time-list">
			<TimeCard class="time-item" :unit="key" :time="value" v-for="(value, key) in times" :key="key"/>
		</div>
	</div>
</template>
<script>
import TimeCard from './time-card.vue';

export default {
	props: {
		delta: {
			type: Number
		}
	},
	components: {
		TimeCard,
	},
	data() {
		return {
			time: Math.ceil(this.delta / 1000)
		};
	},
	computed: {
		times() {
			let time = this.time;
			if (time < 0) {
				time = 0;
			}
			const secs = time % 60;
			time = Math.floor(time / 60);
			const mins = time % 60;
			time = Math.floor(time / 60);
			const hrs = time % 24;
			time = Math.floor(time / 24);
			const day = time;

			return {
				day: String(day).padStart(2, 0),
				hrs: String(hrs).padStart(2, 0),
				mins: String(mins).padStart(2, 0),
				secs: String(secs).padStart(2, 0)
			};
		}
	},
	created() {
		this.interval = setInterval(() => {
			this.time -= 1;
			if (this.time < 0) {
				clearInterval(this.interval);
				this.interval = null;
				this.$emit('timeout');
			}
		}, 1000);
	},
	destroyed() {
		this.interval && clearInterval(this.interval);
		this.interval = null;
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
.timer-wrap{
	text-align: center;
	.timer-label{
		color: #FFF;
		margin-bottom: 5/@rem;
		font-weight: bold;
	}
	.time-list{
		display: flex;
		justify-content: center;
	}
	.time-item{
		margin: 0 1/@rem;
	}
}
</style>

