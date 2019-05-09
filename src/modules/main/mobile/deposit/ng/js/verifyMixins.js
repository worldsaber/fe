import { mapState, mapMutations } from 'vuex';
import * as mutationTypes from 'store/deposit/ng/mutationTypes.js';
import dialog from 'components/dialog';
import { statusToDialog } from './config.js';

export default {
	data () {
		return {
			submitLoading: false,
			submitErr: false,
			errText: '',
			isPolling: false,
			isLast: false
		};
	},
	computed: {
		...mapState('deposit', ['displayMsg'])
	},
	methods: {
		...mapMutations('deposit', {
			updateDisplayMsg: mutationTypes.UPDATE_DISPLAY_MSG
		}),
		resetError () {
			this.errText = '';
			this.submitErr = false;
		},
		/**
		 * 提交交易的补充信息, 做了公共处理，如成功、失败、pending等弹窗
		 * 注意：目前只有 holding.vue，otpSpecial.vue 用到了，其他几个验证暂时未动（多处重复），考虑下是否合并。
		 * @param  {String} options.tradeId trade id
		 * @param  {Object} options.params  表单数据
		 * @param  {String} options.lockKey fetch lockKey
		 * @return {Promise}                返回promise，供回调
		 */
		getTradeAdditional ({ params, currentStatus = 0, lockKey = '' }) {
			return new Promise(async (resolve, reject) => {
				const { tradeId } = params;
				if (!tradeId) {
					return reject('params.tradeId is required!');
				}

				if (!navigator.onLine) {
					dialog.alert('No internet connection, try again.');
					return reject();
				}

				this.submitLoading = true;
				try {
					const res = await fetch(`/pocket/v1/bankTrades/bankTrade/${tradeId}/additional`, {
						headers: {
							'content-type': 'application/json'
						},
						method: 'POST',
						body: JSON.stringify(params)
					}, lockKey).then(res => res.json());

					if (res.login === false) {
						this.$dialog();
						this.$popupLogin.show();
						return;
					}
					const { bizCode, data, message } = res;
					if (bizCode === 10000) {
						// 轮询时，pending是10时，不处理，最后一次才处理
						if (this.isPolling && !this.isLast && data.status === 10) {
							return;
						}

						// 拦截 holding 状态，以免重置
						if (data.status === currentStatus && data.status === 11) {
							this.submitErr = true;
							this.errText = message;
							return;
						}

						if (data.status === 20 || data.status === 71) {
							this.$emit('trigger', 'goStep', {
								step: 'success',
								originData: data
							});
						} else if (data.status === 87) {
							window.open(data.jumpUrl);
							this.$emit('trigger', 'dialog', {
								options: statusToDialog[data.status],
								tradeId
							});
						} else if (data.status === 30) {
							const options = statusToDialog[data.status];
							options.dialog.content = message || options.dialog.content;
							this.$emit('trigger', 'dialog', {
								options,
								tradeId
							});
						} else {
							// dialog 展示文案
							if (data.displayMsg) {
								this.updateDisplayMsg(data.displayMsg);
							}
							this.$emit('trigger', 'dialog', {
								options: statusToDialog[data.status],
								tradeId
							});
						}
					} else if (bizCode === 62100) { // 超过后台配置日交易限额，使用后台错误信息
						this.$dialog();
						dialog.alert(message, ['OK']);
					} else if (bizCode === 11000 || bizCode === 19000) {
						const status = 30; // 11000同样提示失败
						const options = statusToDialog[status];
						options.dialog.content = message || options.dialog.content;
						this.$emit('trigger', 'dialog', {
							options,
							tradeId
						});
					} else if (bizCode === 65001) { // 所选资产不存在
						this.$emit('trigger', 'refresh', message);
					} else {
						// this.submitErr = true;
						// this.errText = message;
						dialog();
						dialog.alert(message || 'We are unable to accept your payment at this time. Please check your payment information and try again later.', ['OK']);
					}
					resolve(res);
				} catch (err) {
					dialog();
					dialog.alert('Sorry，something went wrong. Please try again later.', ['OK']);
					reject(err);
				}
				this.submitLoading = false;
			});
		}
	}
};
