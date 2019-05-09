import { formatNumber } from 'utils';

const countryMap = {
	ke: '1',
	ng: '2',
	gh: '3'
};
export function getConfig() {
	return fetch('/common/config/query', {
		method: 'POST',
		headers: new Headers({
			'Content-Type': 'application/json'
		}),
		body: JSON.stringify([{
			appId: 'pocket',
			namespace: 'application',
			configKey: 'deposit.bounty.range', // 充值的奖励
			operId: countryMap[window.country]
		},
		{
			appId: 'pocket',
			namespace: 'application',
			configKey: 'deposit.bounty.quickInput',  // 充值的奖励小方块(49和99)
			operId: countryMap[window.country]
		},
		{
			appId: 'pocket',
			namespace: 'application',
			configKey: 'paych.notify.content', 	// 通知公告
			operId: countryMap[window.country]
		}, {
			appId: 'pocket',
			namespace: 'application',
			configKey: 'deposit.range.free.threshold', // 充值免费阈值
			operId: countryMap[window.country]
		}, {
			appId: 'pocket',
			namespace: 'application',
			configKey: 'paych.alert.content', // 充值免费阈值
			operId: countryMap[window.country]
		}])
	}).then(res => res.json())
	.then(res => {
		if (res.bizCode === 10000) {
			const data = res.data;
			// 设置通知内容
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
			// 格式化 配置数据
			const quickInputConfig = data.find(item => item.configKey === 'deposit.bounty.quickInput');

			let items = [];
			let title;
			try {
				const value = quickInputConfig.configValue;
				const quickConfig = JSON.parse(value);
				items = quickConfig.quickInputItems || [];
				title = quickConfig.title;
			} catch (err) {
				items = [];
				title = '';
			}

			let extra = [];

			for (const item of items) {
				item.amount = Math.floor(item.amount / 10000);
				extra.push(item);
			}
			extra = extra.sort((itema, itemb) => itema.order - itemb.order);

			const quickInput = {
				extraOffer: extra,
				title,
			};

			// 阶梯
			const rangeConfig = data.find(item => item.configKey === 'deposit.bounty.range');
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

			// 免费的阈值
			const thresholdConfig = data.find(item => item.configKey === 'deposit.range.free.threshold');
			const freeThreshold = parseInt(thresholdConfig.configValue, 10) / 10000;
			return {
				notifyContent: key => notifyMap[key],
				lines: key => linesMap[key],
				quickInput,
				feeRange,
				freeThreshold
			};
		}
		return Promise.reject('failed to fetch config');
	}); // end callback
}

export default {
	getConfig
};

