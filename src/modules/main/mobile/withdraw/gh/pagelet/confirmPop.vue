<template lang="html">
	<div class="m-dialog-wrapper">
		<p class="m-pop-main">{{infos.msg || ""}}</p>
		<div class="m-btn-wrapper">
			<af-Button
				extraType="text"
				@click="handleCancel"
			>Cancel</af-Button>
			<af-Button
				:loading="loading"
				@click="handleContinue"
			>Continue</af-Button>
		</div>
	</div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import 'packages/button';

export default {
	data() {
		return {
			infos: {},
			loading: false
		};
	},

	computed: {
		...mapState('withdraw', [
			'errorInfo',
			'reqLoading'
		]),
		getCodeText() {
			if (this.loading) {
				return ' Loading...';
			}

			return 'Continue';
		},
	},
	watch: {
		reqLoading(val) {
			if (!val) {
				this.loading = false;
			}
		}
	},
	methods: {
		...mapActions('withdraw', [
			'withdraw'
		]),
		handleContinue() {
			if (this.loading) {
				return;
			}

			this.loading = true;
			this.withdraw();
		},
		handleCancel() {
			if (this.loading) {
				return;
			}
			window.location.reload();
		}
	},
	mounted() {
		this.infos = this.errorInfo || {};
	}
};
</script>
<style media="screen" lang="less">
@import 'base/styles/variable.less';

.m-dialog-wrapper {
	width: 100%;
	padding-bottom: 20/@rem;
	box-sizing: border-box;

	.m-pop-main {
		font-size: 14/@rem;
		line-height: 20/@rem;
		color: @dark;
		margin-bottom: 28/@rem;
	}

	.m-btn-wrapper {
		width: 100%;
		padding: 0 13/@rem;
		box-sizing: border-box;
		text-align: right;

		.af-button {
			font-size: 14/@rem;
			font-weight: bold;
		}
	}

	.af-button--text {
		color: @green;
	}

	.af-button--primary {
		background: @green;
		color: @white;
		height: 36/@rem;
		width: 120/@rem;
		border: none;
		border-radius: 2/@rem;
		margin-left: 10/@rem;
	}
}


</style>
