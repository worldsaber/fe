<template>
	<div class="m-reconciliation-panel">
		<div class="m-panel-header">Manual Reconciliation</div>
		<div class="m-panel-content">
			<div class="m-title">{{manualConfig.desc}}</div>
			<div class="m-panel-form">
				<AfInput
					v-model="code"
					icon="delete"
					:iconClick="handleClear"
					placeholder="Enter code">
				</AfInput>
				<afButton
					:disabled="isDisabled"
					:loading="loading"
					@click="handleConfirm"
				>
					Confirm
				</afButton>
			</div>
			<div class="m-desc">
				<p>{{manualConfig.ruleTitle}}</p>
				<ol>
					<template v-for="item in manualConfig.rules">
					  <li>{{item}}</li>
					</template>
				</ol>
				<p>{{manualConfig.info}}</p>
			</div>
		</div>
	</div>
</template>

<script>
// 对账功能，目前是针对mpesa。注意：当前ke才有mpesa，ng没有
import 'packages/button';
import 'packages/input';
import CommonPop from 'components/popDialog/commonPop';
import { getManualConfig } from '../js/config';

export default {
	name: 'Reconciliation',
	data () {
		return {
			code: '',
			loading: false,
			manualConfig: getManualConfig()
		};
	},
	computed: {
		isDisabled () {
			return !this.loading && !this.code;
		}
	},
	methods: {
		handleClear () {
			this.code = '';
		},
		handleDialog (msg, cb) {
			this.$dialog();
			let popDialog = this.$dialog({
				title: null,
				contentData: {
					title: '',
					msg,
				},
				content: CommonPop,
				button: []
			}).onBtnClick(() => {
				popDialog.close();
				popDialog = null;
				cb && cb();
			});
		},
		handleConfirm () {
			this.loading = true;
			fetch('/pocket/v1/paych/front/manualClaim', {
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({
					chTxId: this.code
				})
			})
			.then(res => res.json())
			.then(({ bizCode, data = {}}) => {
				this.loading = false;

				if (data.isMatch === 1) {
					this.handleDialog(data.reason, () => {
						location.reload();
					});
				} else {
					this.handleDialog(data.reason);
				}
			})
			.catch(() => {
				this.loading = false;
				const msg = 'Match failed. Please contact Customer Service for more details.';
				this.handleDialog(msg);
			});
		}
	}
};
</script>

<style lang="less">
@import 'base/style/variable.less';

.m-reconciliation-panel {
	color: @dark;

	.m-panel-header {
		font-size: 16px;
		font-weight: bold;
		text-align: center;
		margin: 0 17px;
		padding: 19px 0 16px;
		border-bottom: 1px solid @fogGrayBorder;
	}

	.m-panel-content {
		font-size: 14px;
		padding: 35px 70px 60px;

		.m-title {
			line-height: 16px;
		}

		.m-panel-form {
			margin-top: 20px;

			.m-input-wrapper {
				width: 210px;

				&.m-input-wrapper--active {
					.m-input {
						border: 1px solid @green;
					}
				}

				.m-input {
					border: 1px solid @darkGray;
					font-size: 16px;
					height: 38px;
				}

				.m-input-icon--clickable {
					&:hover {
						cursor: pointer;
						color: @green;
						& + .m-input {
							border-color: @green;
						}
					}
				}
			}

			.af-button--primary {
				margin-left: 14px;
				width: 160px;
				height: 38px;
				background: @green;
				border: none;
				border-radius: 2px;
				font-size: 16px;
				font-weight: bold;
				vertical-align: middle;

				&:focus,
				&:hover {
					background: @midGreen;
				}

				&:active {
					background: @darkGreen;
				}
			}
		}

		.m-desc {
			margin-top: 40px;
			color: @darkGray;
			line-height: 16px;

			ol {
				line-height: 18px;
				margin: 3px 0 16px;
			}
		}
	}
}
</style>
