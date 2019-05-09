const operMap = {
	254: 1,
	234: 2
};

export function getActivityConfig(key, appId = 'web') {
	const params = [{
		appId,
		namespace: 'activities',
		operId: operMap[window.countryCode],
		configKey: 'key',
	}];

	return fetch('/common/config/query', {
		method: 'POST',
		headers: new Headers({
			'Content-Type': 'application/json',
		}),
		body: JSON.stringify(params),
	})
	.then(res => res.json())
	.then(res => {
		if (res.bizCode === 10000) {
			const data = res.data || [];
			return data[0];
		}
		return null;
	}).then(data => {
		// 配置失效
		if (!data) {
			return;
		}

		let value = data.configValue;
		try {
			value = JSON.parse(value);
		} catch (e) {
			value = {};
		}
		return value;
	});
}

export default {
	getActivityConfig,
};

