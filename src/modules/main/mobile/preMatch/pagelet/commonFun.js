// 取到国家编码
const countryCode = window.countryCode;
// 注意/factsCenter/wapEvents的接口返回数据需要特殊处理，转成数组，后台才能认识
const fetchWapUrl = {
	// 按 时间取查询
	254: '/factsCenter/wapEvents',
	// 按星期几去查询
	234: '/factsCenter/wapChosenEvents',
	233: '/factsCenter/wapChosenEvents',
};

const date = new Date();
export const oneDayTime = 24 * 60 * 60 * 1000;
export const currentDay = String(date.getDay());
const time = {
	234: [{
		name: 'All',
		value: 'all'
	}, {
		name: 'Today',
		value: 'today'
	}]
};

function detailNgDate () {
	const dateFormatArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const dateNg = [];
	let time = date.getTime();
	let t = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	t = t.getTime();
	for (let i = 0; i < 7; i++) {
		const d = new Date(time).getDay();
		dateNg.push({
			value: String(d),
			name: i === 0 ? dateFormatArr[d] + '(Today)' : dateFormatArr[d],
			startTime: t + (i * oneDayTime),
			endTime: t + ((i + 1) * oneDayTime)
		});
		time += oneDayTime;
	}
	return dateNg;
}
const dateArr = detailNgDate().sort((a, b) => a.value - b.value);

time[234] = time[234].concat(dateArr);
time[234].push(time[234].splice(2, 1)[0]);

time['233'] = time['234'];

const arr = time[234];
time['254'] = [...arr.slice(0, 2), { name: '3 h', value: '3h', timeline: 3 }, ...arr.slice(2)];

/**
 * 获取国家处理 时间选择条件
 * 默认走ke类型的数据结构
 */
export function getTimeSelector() {
	return time[countryCode] || time[254];
}

export function getWapEventsUrl() {
	return fetchWapUrl[countryCode] || '/factsCenter/wapChosenEvents';
}
/**
 * 根据传入的time参数处理成给后台的time参数
 */
export function getTimeParam (timeData) {
	const param = {};
	if (timeData && timeData.value) {
		const value = timeData.value;
		if (value === 'today') {
			param.todayGames = true;
			return param;
		}
		if (value === 'all') {
			return param;
		}
		const cur = dateArr.find(cur => cur.value === value);
		if (cur) {
			param.startTime = cur.startTime;
			param.endTime = cur.endTime;
		} else { // 其他的默认处理为数字
			param.timeline = +timeData.timeline;
		}
	}
	return param;
}

/**
 * 解析 tournamentId 字符串，返回数组
 * @param {*} str 	tournamentId 字符串
 */
export function getTournamentIds(str) {
	let tournamentIds = [];
	if (str) {
		// tournamentId 可能存在 sr:tournament:241_sr:simple_tournament:19236_sr:tournament:27072 的情况
		tournamentIds = str.replace(/_sr/g, '$_$sr').split(/\$_\$/g);
	}
	return tournamentIds;
}
