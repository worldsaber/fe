<template lang="html">
	<div :class="getWrapperStyle">
		<div class="m-pop-header">
			<span>{{contentData.title}}</span>
			<i
				class="m-icon-close"
				data-action="close"
				data-ret="close"
			></i>
		</div>
		<div class="m-pop-main">
			<p v-html="contentData.msg"></p>
			<div class="m-btn-wrapper">
				<af-Button
					data-action="btn"
					data-ret="ok"
				>{{contentData.okBtn || 'OK'}}</af-Button>
				<af-Button
					v-if="contentData.cancelBtn"
					data-action="btn"
					data-ret="cancel"
					:extraType="contentData.cancalBtnType || 'primary'"
				>{{contentData.cancelBtn || 'Cancel'}}</af-Button>
			</div>
		</div>
	</div>
</template>

<script>
import 'packages/button';

export default {
	name: 'commonPop',
	computed: {
		getWrapperStyle() {
			const cssList = this.contentData.cssList || '';
			let ret = ['m-dialog-wrapper'];
			if (cssList) {
				ret = ret.concat(cssList);
			}

			return ret;
		}
	}
};
</script>
