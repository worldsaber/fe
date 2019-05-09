/*
从topic中获取基础信息
event: #{sportId}^#{categoryId}^#{tournamentId}^#{eventId}^status
marketStatus: #{sportId}^#{categoryId}^#{tournamentId}^#{eventId}^#{productId}^#{marketId}^#{marketSpecifiers}^status
outcome: #{sportId}^#{categoryId}^#{tournamentId}^#{eventId}^#{productId}^#{marketId}^#{marketSpecifiers}^odds

 */
const eventTopicKeys = ['sportId', 'categoryId', 'tournamentId', 'eventId'];
const marketTopicKeys = ['sportId', 'categoryId', 'tournamentId', 'eventId', 'productId', 'marketId', 'marketSpecifiers'];
const outcomeTopicKeys = ['sportId', 'categoryId', 'tournamentId', 'eventId', 'productId', 'marketId', 'marketSpecifiers'];

function getTopicInfo(topic, type) {
	if (!topic || !type) {
		return null;
	}

	const infoList = topic.split('^');
	const topicKeys = type === 'event' ?
		eventTopicKeys :
		type === 'market' ?
			marketTopicKeys :
			outcomeTopicKeys;

	const ret = {};
	for (let i = 0, len = topicKeys.length; i < len; i++) {
		ret[topicKeys[i]] = infoList[i] === '~' ? '' : infoList[i];
	}

	return ret;
}

export default getTopicInfo;
