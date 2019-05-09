<template lang="html">
	<div class="m-main m-layout-main">

		<div class="m-main-top">
			<slot name="top"></slot>
		</div>

		<AfTable class="m-main-bottom">
			<AfTableRow>
				<AfTableCell class="m-main-left" :style="getLeftStyle" v-if="hasLeft">
					<slot name="left"></slot>
				</AfTableCell>
				<AfTableCell class="m-main-mid" :style="getMainStyle">
					<slot name="mid">
						<router-view></router-view>
					</slot>
				</AfTableCell>
				<AfTableCell class="m-main-right" :style="getRightStyle" v-if="hasRight">
					<slot name="right"></slot>
				</AfTableCell>
			</AfTableRow>
		</AfTable>

	</div>
</template>

<script>
import 'packages/tableLayout';

export default {
	name: 'MainPagelet',
	componentName: 'MainPagelet',
	props: {
		leftWidth: {
			type: [String, Number],
			validator(val) {
				return /(px|em|rem|%|\d)$/.test(val);
			}
		},
		rightWidth: {
			type: [String, Number],
			validator(val) {
				return /(px|em|rem|%|\d)$/.test(val);
			}
		}
	},
	computed: {
		getLeftStyle() {
			const width = +this.leftWidth ? this.leftWidth + 'px' : this.leftWidth;

			return {
				width,
				'min-width': width
			};
		},
		getRightStyle() {
			const width = +this.rightWidth ? this.rightWidth + 'px' : this.rightWidth;
			return {
				width,
				'min-width': width
			};
		},
		getMainStyle() {
			// const screenInfo = window.screen;
			// const screenWidth = screenInfo.availWidth;
			const suffix = this.rightWidth ? this.rightWidth.replace(/\d*/g, '') : this.leftWidth ? this.leftWidth.replace(/\d*/g, '') : 'px';
			const width = `${1000 - parseInt(this.rightWidth || 0, 10) - parseInt(this.leftWidth || 0, 10)}${suffix || 'px'}`;

			return {
				width,
				'min-width': width
			};
		},
		hasRight() {
			return !!this.$slots.right;
		},
		hasLeft() {
			return !!this.$slots.left;
		}
	}
};
</script>

<style lang="less">
@import 'base/style/mixin.less';

.m-layout-main{
	// overflow: hidden;
	width: 100%;
	height: 100%;
	min-height: 100%;

	.clearfix();

	> *{
		min-height: 100%;
	}

	.m-main-bottom {
		width: 1000px;
		min-width: 1000px;
		margin: 0 auto;
	}

	.m-main-right,
	.m-main-mid,
	.m-main-left {
		vertical-align: top;
	}
}
</style>
