import { formatNumber } from 'utils';

export function getConfig() {
	return fetch('/common/config/query', {
		method: 'POST',
		headers: new Headers({
			'Content-Type': 'application/json'
		}),
		body: JSON.stringify([{
			appId: 'pocket',
			namespace: 'application',
			configKey: 'withdraw.fee.range', // 提现的奖励
			operId: '1'
		},
		{
			appId: 'pocket',
			namespace: 'application',
			configKey: 'withdraw.range.free.threshold', // 提现免费阈值
			operId: '1'
		}, {
			appId: 'pocket',
			namespace: 'application',
			configKey: 'paych.alert.content', // 充值免费阈值
			operId: 1
		}])
	}).then(res => res.json())
	.then(res => {
		if (res.bizCode === 10000) {
			const data = res.data;
			const notifyMap = {};
			const linesMap = {};
			let notify = data.find(item => item.configKey === 'paych.alert.content');
			if (JSON.parse(notify.configValue).entityList) {
				notify = JSON.parse(notify.configValue).entityList;
				for (const item of notify) {
					notifyMap[item.methodId] = item.alert;
					linesMap[item.methodId] = item.descriptionLines;
				}
			}
			// 阶梯
			const rangeConfig = data.find(item => item.configKey === 'withdraw.fee.range');
			let feeRange = [];
			try {
				const value = rangeConfig.configValue;
				let config = JSON.parse(value);
				// 预防错误
				if (!Array.isArray(config)) {
					config = [];
				}
				feeRange = config.map(item => ({
					lower: item.lower / 10000,
					upper: item.upper / 10000,
					amount: formatNumber(item.amount / 10000, 2),
				}));
			} catch (err) {
				feeRange = [];
			}
			// 第一个收费的
			const first = feeRange.find(item => item.lower === 0) || { amount: '33.00' };

			// 免费的阈值
			const thresholdConfig = data.find(item => item.configKey === 'withdraw.range.free.threshold');
			const freeThreshold = parseInt(thresholdConfig.configValue, 10) / 10000;

			return {
				notifyContent: key => notifyMap[key],
				lines: key => linesMap[key],
				additionalFee: first.amount,
				freeThreshold,
				feeRange,
			};
		}
		return Promise.reject('failed to fetch config');
	}); // end callback
}

export default {
	getConfig
};
