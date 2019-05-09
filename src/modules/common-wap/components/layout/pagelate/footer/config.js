const base = window.country || __baseUrl__.replace(/\//g, ''); // eslint-disable-line

/* eslint-disable */
// 合作方相关配置
const partnerConfig = {
	access: {
		type: 'img',
		url: require('./image/access.png')
	},
	diamond: {
		type: 'img',
		url: require('./image/diamond.png')
	},
	fidelity: {
		type: 'img',
		url: require('./image/fidelity.png')
	},
	gtbank: {
		type: 'img',
		url: require('./image/gtbank.png')
	},
	// paystake: {
	// 	type: 'img',
	// 	url: require('./image/paystake.png')
	// },
	masterCard: {
		type: 'img',
		url: require('./image/masterCard.png')
	},
	verve: {
		type: 'img',
		url: require('./image/verve.png')
	},
	visa: {
		type: 'img',
		url: require('./image/visa.png')
	},
	zenith: {
		type: 'img',
		url: require('./image/zenith.png')
	},
	safaricon: {
		type: 'icon',
		className: 'm-icon-safaricon'
	},
	mpesa: {
		type: 'icon',
		className: 'm-icon-mpesa'
	},
	airtel: {
		type: 'img',
		url: require('./image/airtel.png')
	},
	mtn: {
		type: 'img',
		url: require('./image/mtn.png')
	},
	tiGo: {
		type: 'img',
		url: require('./image/tiGo.png')
	},
	vodafone: {
		type: 'img',
		url: require('./image/vodafone.png')
	}
};
/* eslint-enable */

const kePartner = ['safaricon', 'mpesa'];

const ngPartner = ['paystake', 'verve', 'masterCard', 'visa', 'access', 'diamond', 'fidelity', 'gtbank', 'zenith'];

const ghPartner = ['tiGo', 'mtn', 'airtel', 'vodafone'];

// 描述方面的配置-- desc 显示成一行了
const keDescConfig = [
	'Must be 18 years of age or older to register or play at SportyBet. Gambles may have adverse effects if not made with moderation.' +
	'SportyBet Ltd trading as SportyBet Kenya is licensed by BCLB under the Betting, Lotteries and Gaming Act, Cap 131, Laws of Kenya under License No 683.'
];

const ngDescConfig = [
	'Must be 18 years of age or older to register or play at SportyBet. Gambles may have adverse effects if not made with moderation.' +
	'SportyBet Nigeria is licensed by the Lagos State Lotteries Board (LSLB) under License No 0000355.'
];

const ghDescConfig = [
	'Must be 18 years of age or older to register or play at SportyBet. Gambles may have adverse effects if not made with moderation.' +
	'SportyBet Ghana is licensed by the Gaming Commission of Ghana under the Gaming Act, 2006 (Act, 721).'
];

// 国家logo
const keLogo = require('./image/KenyaFlag.svg');
const ngLogo = require('./image/ngLogo.png');
const ghLogo = require('./image/ghLogo.png');

// 关键信息方面的配置
const keInfoConfig = [
	{
		label: 'SMS “Join” TO',
		value: '29123',
		type: 'text'
	},
	{
		label: 'M-PESA Paybill:',
		value: '202202',
		type: 'text'
	}
];

// ng的config删掉不要
const ngInfoConfig = [
	// {
	// 	label: 'SMS “Join” TO',
	// 	value: '654',
	// 	type: 'text'
	// },
	// {
	// 	type: 'img',
	// 	url: require('./image/lagos.png') // eslint-disable-line
	// }
];
// 暂时不显示 payBill
const ghInfoConfig = [
	{
		label: 'Paybill:',
		value: '*711*222#',
		type: 'text'
	},
	{
		type: 'img',
		url: require('./image/gh.png') // eslint-disable-line
	}
];

export function getPartnerConfig() {
	let config = [];
	const ret = [];

	switch (base) {
	case 'ke':
		config = kePartner;
		break;
	case 'ng':
		config = ngPartner;
		break;
	case 'gh':
		config = ghPartner;
		break;
	default:
	}

	for (const item of config) {
		ret.push(Object.assign(
			partnerConfig[item] || {},
			{
				key: item
			}
		));
	}

	return ret;
}

export function getDescConfig() {
	switch (base) {
	case 'ke':
		return keDescConfig;
	case 'ng':
		return ngDescConfig;
	case 'gh':
		return ghDescConfig;
	default:
		return [];
	}
}

export function getCountryLogo() {
	switch (base) {
	case 'ke':
		return keLogo;
	case 'ng':
		return ngLogo;
	case 'gh':
		return ghLogo;
	default:
		return '';
	}
}

export function getInfoConfig() {
	switch (base) {
	case 'ke':
		return keInfoConfig;
	case 'ng':
		return ngInfoConfig;
	case 'gh':
		return ghInfoConfig;
	default:
		return [];
	}
}

export function getConcatUrl () {
	return __baseUrl__ + 'm/help?showChat=1#/contact-us'; // eslint-disable-line
}
