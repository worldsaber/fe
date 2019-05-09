<template>
	<div class="m-uploader-progress-wrap">
		<div>{{progress}}%</div>
		<div>Uploading...</div>
		<div class="progress-bar-wrap"><span class="progress-bar" :style="{
			width: `${progress}%`
			}"/></div>
		<div class="cancel-btn" @click="cancel">CANCEL</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			progress: 0
		};
	},
	methods: {
		change(val) {
			this.progress = val || 0;
		},
		cancel() {
			this.$emit('cancel');
		}
	},
	created() {
		this.$on('change', this.change);
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';

.m-uploader-progress-wrap {
	div {
		text-align: center;
		font-size: 16px;
		line-height: 24px;
	}
	.progress-bar-wrap {
		margin: 16px 12px 36px 12px;
		background: @midGray;
		height: 6px;
		text-align: left;
		.progress-bar {
			transition-duration: 200ms;
			transition-timing-function: ease-in;
			vertical-align: top;
			display: inline-block;
			background: @green;
			height: 100%;
		}
	}
	.cancel-btn {
		color: @green;
		padding-bottom: 12px;
	}
}
</style>
