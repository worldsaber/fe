<template>
	<router-view></router-view>
</template>

<script>
export default {
	mounted() {
		document.querySelector('#pageLoading').remove();
	}
};
</script>

<style lang="less">
.m-withdrawBlockTip-dialog {
	&.es-dialog {
		.es-dialog-footer {
			.es-dialog-btn {
				width: auto;
				min-width: 30%;
			}
		}
	}
}
</style>
