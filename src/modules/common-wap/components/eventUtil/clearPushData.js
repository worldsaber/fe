/*
	根据push推动消息更新数据，
	params:
		type(event、market、odds)
		config: {
			mappingKey（推送消息对应的原始字段key，按推送消息顺序列出）
			updateKey (需要更新key，不需要按顺序列出)
		}
		pushData（推送消息）
 */
import { objType } from 'utils';

/*
	event default config
{
	'topic': '5^213^sr:tournament:20992^sr:match:12931194^status',
	'betStatus': -1,
	'eventGameScores': ['3:0'],
	'eventMatchPeriod': '1',
	'eventMatchStatus': ',
	'eventPlayedTime': ',
	'eventPointScore': ',
	'eventRemainingTimeInPeriod': ',
	'eventScore': '0:0',
	'eventStatus': 1,
	'fixtureAwayTeamName': 'Bejenaru, Karola Patricia',
	'fixtureEndTime': null,
	'fixtureHomeTeamName': 'Juvan, Kaja',
	'fixtureSportCategoryName': 'ITF Women',
	'fixtureSportName': 'Tennis',
	'fixtureStartTime': 1509964200000,
	'fixtureTournamentName': 'ITF Great Britain 16A, Women Singles',
	'productStatus': '0#0'
	'bmLcooCount': ''
	'bmLiveCount' '',
	'liveChannel': false
}
 */
const eventDefaultKey = {
	topic: 'topic',
	betStatus: 'betStatus',
	eventGameScores: 'gameScore',
	eventMatchPeriod: 'period',
	eventMatchStatus: 'matchStatus',
	eventPlayedTime: 'playedSeconds',
	eventPointScore: 'pointScore',
	eventRemainingTimeInPeriod: 'remainingTimeInPeriod',
	eventScore: 'setScore',
	eventStatus: 'status',
	fixtureAwayTeamName: 'awayTeamName',
	fixtureEndTime: 'estimateStopTime',
	fixtureHomeTeamName: 'homeTeamName',
	fixtureSportCategoryName: 'categoryName',
	fixtureSportName: 'sportName',
	fixtureStartTime: 'estimateStartTime',
	fixtureTournamentName: 'tournamentName',
	productStatus: 'productStatus',
	// sport的eventSize
	bmLcooCount: 'bmLcooCount',
	// live 的eventSize，这里没办法把这2个字段合并成一个eventSize，因为在这里不知道比赛到底是什么类型的
	bmLiveCount: 'bmLiveCount',
	liveChannel: 'liveChannel'
};

// events 推送消息需要更新的字段
// 这里必须所有字段都更新，因为在列表页面可能新增一场比赛
const eventUpdateDefaultKey = {
	topic: 1,
	betStatus: 1,
	gameScore: 1,
	period: 1,
	matchStatus: 1,
	playedSeconds: 1,
	pointScore: 1,
	remainingTimeInPeriod: 1,
	setScore: 1,
	status: 1,
	awayTeamName: 1,
	estimateStopTime: 1,
	homeTeamName: 1,
	categoryName: 1,
	sportName: 1,
	estimateStartTime: 1,
	tournamentName: 1,
	productStatus: 1,
	bmLcooCount: 1,
	bmLiveCount: 1,
	liveChannel: false
};

/*
	对应的原始数据的key，没有对应key使用原始key
	[
		'topic',
		'product',
		'marketStatus',
		'marketDesc',
		'group',
		'favourite',
		'pushTime'
	]
	marketStatus和marketDesc叫成  status 和 desc
 */
const marketDefaultKey = ['topic', 'product', 'status', 'desc', 'group', 'favourite', 'marketGuide', 'pushTime'];

// marketStatus 推送消息需要更新的字段
const marketUpdateDefaultKey = {
	product: 1,
	status: 1,
	desc: 1,
	group: 1,
	favourite: 1,
	marketGuide: '',
	pushTime: 1
};

/*
	odds default config
	对应的原始数据的key, 没有对应的key使用原始key
	[
		'topic',
		'product',
		'marketStatus',
		'marketDesc',
		'group',
		'favourite',
		'pushTime',
		['outomeId1,desc1,odds1,isActive1,isWinning1(can be null),refundFactor1(can be null)']
	]
 */
const oddsDefaultKey = [
	'topic',
	'product',
	'status',
	'desc',
	'group',
	'favourite',
	'marketGuide',
	'pushTime',
	[
		'id',
		'desc',
		'odds',
		'isActive',
		'isWinning',
		'refundFactor',
		'probability'
	]
];

// outcome  推送消息需要更新的字段
const oddsUpdateDefaultKey = {
	id: 1,
	desc: 1,
	odds: 1,
	isActive: 1,
	probability: 1
};

// push消息key
const keySet = ['odds', 'market', 'event'];

const defToNumSet = {
	isActive: 1,
	product: 1,
	status: 1,
	favourite: 1,
	betStatus: 1,
	bmLcooCount: 1,
	bmLiveCount: 1,
	probability: 1
};

function clearPushData(pushData, config, type) {
	if (!pushData) {
		return;
	}

	const topic = pushData[0];

	if (objType(config) === 'string') {
		type = config;
		config = null;
	}

	if (!type || !keySet.includes(type)) {
		type = topic.endsWith('odds') ?
			'odds' :
			topic.split('^').length === 6 ?
				'market' :
				'event';
	}

	if (config && (!config.mappingKey || !config.updateKey)) {
		config = null;
	}

	const { mappingKey, updateKey, toNumSet } = getConfig(config, type);

	// market status的推送消息处理
	if (type === 'market') {
		return clearArrayPush(pushData, mappingKey, updateKey, toNumSet);
	} else if (type === 'event') {
		// event数据转换成了一个对象，通过对象处理
		return clearEventPush(pushData, mappingKey, updateKey, toNumSet);
	}

	// odds推送消息处理，数组的部分
	return clearStringPush(pushData, mappingKey, updateKey, toNumSet);
}

function clearArrayPush(pushData, mappingKey, updateKey, toNumSet) {
	const ret = {};
	if (!pushData.length) {
		return;
	}
	// 只更新需要更新的字段，即在updateKey中的字段
	for (let i = 0, keyLen = pushData.length; i < keyLen; i++) {
		if (updateKey[mappingKey[i]] && pushData[i] !== null) {
			ret[mappingKey[i]] = toNumSet[mappingKey[i]] ? Number(pushData[i]) : pushData[i];
		}
	}
	return ret;
}

function clearStringPush(pushData, mappingKey, updateKey, toNumSet) {
	const ret = {};
	const outcomeKeys = mappingKey[mappingKey.length - 1];
	let outcomes = [];
	try {
		const tmp = pushData[pushData.length - 1];
		if (typeof tmp === 'string') {
			outcomes = JSON.parse(tmp);
		} else if (tmp.length) {
			outcomes = tmp;
		}
	} catch (e) { } // eslint-disable-line

	if (!Array.isArray(outcomes)) {
		// 上线时删除console
		console.log(`push outcome error ${pushData}`);
		return;
	}

	for (const item of outcomes) {
		const values = item ? item.split('#') : [];
		// 比odds需要更新字段的量少，数据不完整，不更新
		if (values.length >= outcomeKeys.length) {
			const id = values[0];
			ret[id] = {};
			// 只更新需要更新的字段，即在updateKey中的字段
			for (let i = 1, keyLen = values.length; i < keyLen; i++) {
				if (updateKey[outcomeKeys[i]] && values[i]) {
					ret[id][outcomeKeys[i]] = toNumSet[outcomeKeys[i]] ? Number(values[i]) : values[i];
				}
			}
		}
	}
	return ret;
}
function clearEventPush(pushData, mappingKey, updateKey, toNumSet) {
	const result = {};
	if (!pushData) {
		return result;
	}
	for (const key in pushData) {
		if (Object.prototype.hasOwnProperty.call(pushData, key)) {
			const k = mappingKey[key] || key;
			if (updateKey[k]) {
				result[k] = pushData[key];
				if (toNumSet[k]) {
					result[k] = Number(result[k]);
				}
			}
		}
	}
	return result;
}

/*
get mappingKey 和 updateKey
 */
function getConfig(config, type) {
	let mappingKey,
		updateKey;

	if (config) {
		if (!config.toNumSet) {
			config.toNumSet = defToNumSet;
		}
		return config;
	}

	switch (type) {
	case 'odds':
		mappingKey = oddsDefaultKey;
		updateKey = oddsUpdateDefaultKey;
		break;
	case 'market':
		mappingKey = marketDefaultKey;
		updateKey = marketUpdateDefaultKey;
		break;
	case 'event':
		mappingKey = eventDefaultKey;
		updateKey = eventUpdateDefaultKey;
		break;
	default:
	}
	return { mappingKey, updateKey, toNumSet: defToNumSet };
}

export default clearPushData;
