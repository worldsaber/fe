<template>
	<div :class="['question-option', { 'option-selected': active }]" @click="onClick">
		<span class="option-no">{{option.seq}}</span>
		<span class="option-label">{{option.label}}</span>
	</div>
</template>
<script>
export default {
	props: {
		option: {
			type: Object,
			required: true
		},
		selected: Object
	},
	computed: {
		active() {
			return this.selected && this.selected.seq === this.option.seq;
		}
	},
	methods: {
		onClick() {
			this.$emit('selected', this.option);
		}
	}
};
</script>
<style lang="less">
@import 'base/styles/variable.less';

.question-option{
	display: flex;
	min-height: 43/@rem;
	align-items: center;
	overflow: hidden;
	color: #1b1e25;
	background: #FFF;
	border-radius: 4/@rem;
	padding: 6/@rem 12/@rem;
	font-size: 16/@rem;
	margin: 6/@rem 0;
	cursor: pointer;
	font-family: 'MyriadPro';
	font-weight: bold;
	.option-no {
		flex-shrink: 0;
		flex-basis: 26/@rem;
		width: 26/@rem;
		height: 26/@rem;
		text-align: center;
		line-height: 26/@rem;
		font-size: 18/@rem;
		font-weight: bold;
		background: #1b1e25;
		color: #FFF;
		border-radius: 50%;
		margin-right: 16/@rem;
	}
	.option-label{
		flex: 1;
		// overflow: hidden;
		// text-overflow: ellipsis;
		// white-space: nowrap;
	}
	&.option-selected{
		background: #c6ff00;
	}

}
</style>

