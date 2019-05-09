<template>
		<ul class="m-uc-nav">
			<li
				@click.stop="clickHandler(index)"
				class="m-nav-item"
				v-for="(item,index) in tabList"
				:class="{'m-nav-item--active':active == index}"
				:key="index"
			>
				<span>{{item}}</span>
			</li>
			<slot name="append" />
		</ul>
</template>

<script>
export default {
	props: {
		active: [String, Number],
		tabs: {
			type: Array
		},
		isDisabled: {
			type: Boolean,
			'default': false
		}
	},
	data() {
		return {
			tabList: this.tabs || ['All', 'Settled', 'Unsettled'],
		};
	},
	methods: {
		clickHandler (index) {
			if (this.isDisabled) {
				return;
			}

			if (this.active !== index) {
				this.$emit('click', index);
			}
		}
	},
};
</script>

<style lang="less">
@import 'base/styles/variable.less';
.m-uc-nav{
	height: 48/@rem;
	background: @white;
	display: flex;
	justify-content: center;
	position: relative;
	z-index: 1;
	.m-nav-item{
		font-size: 14/@rem;
		line-height: 48/@rem;
		width: 33.4%;
		text-align: center;
		text-transform: capitalize;
		&--active{
			font-weight: bold;
			border-bottom: 3/@rem solid @green;
		}
		box-sizing:border-box;
	}
}
</style>
