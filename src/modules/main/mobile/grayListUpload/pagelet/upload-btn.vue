<template>
	<div class="m-upload-btn">
		<slot>
			<div class="default-btn-wrap">
				<i class="icon-plus">+</i>
				<span class="btn-text">Upload File</span>
			</div>
		</slot>
		<input class="m-upload-input" type="file" @change="handleChange" accept="*" ref="input"/>
	</div>
</template>

<script>
export default {
	methods: {
		handleChange() {
			const file = this.$refs.input.files[0];
			this.$parent.addFile(file);
			this.$refs.input.value = '';
		}
	}
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
@import 'base/styles/icon.less';
@import 'base/styles/mixin.less';

.m-upload-btn {
	position: relative;
	display: inline-block;
	.default-btn-wrap {
		display: inline-block;
		padding: 0 12/@rem;
		border: 1px solid @green;
		border-radius: 2/@rem;
		color: @green;
		.icon-plus {
			line-height: 34/@rem;
			font-size: 16/@rem;
		}
		.btn-text {
			line-height: 34/@rem;
			font-size: 12/@rem;
			font-weight: bold;
		}
	}
	.m-upload-input {
		position: absolute;
		top: 0;
		left: 0;
		opacity: 0;
		width: 100%;
		height: 100%;
	}
}
</style>
