import '../../../mockData/deposit/index?debug';

// 获取个人账户信息
export function	getAccountInfo () {
	return new Promise((resolve, reject) => {
		fetch('/patron/account/info')
    .then(res => res.json())
    .then(data => {
	const code = data.bizCode;
	if (code === 10000) {
		resolve(data.data);
	} else {
		reject(false);
	}
}).catch(() => {
	reject(false);
});
	});
}

export function getWholePhone (data) {
	const phone = data.phone;
	if (phone) {
		return (data.phoneCountryCode || window.countryCode || 254) + (phone.substring(0, 1) === '0' ? phone.substr(1) : phone);
	}
	return '';
}
// 获取个人账户手机号
export default function	getMobile () {
	return getAccountInfo().then(data => Promise.resolve({
		mobile: data.phone || '',
		wholeMobile: getWholePhone(data)
	}), () => Promise.resolve('')).catch(() => Promise.resolve(''));
}
