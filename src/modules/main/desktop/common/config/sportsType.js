// import invert from 'utils/invert';

// sportName 空格移除，首字母小写即可； e.g. Beach Volley => beachVolley
// 转换后可以用在url里面
export const getSportRoute = sportName => {
	let name = sportName.trim();
	// 移除空格
	name = name.split(' ');
	name = name.map((n, index) => {
		if (index > 0) {
			return `${n[0].toUpperCase()}${n.substring(1)}`;
		}
		return `${n[0].toLowerCase()}${n.substring(1)}`;
	});

	return name.join('');
};

// nav列表，保持顺序
export const sportListUpperCase = [{
	id: '1',
	name: 'Football'
}, {
	id: '2',
	name: 'Basketball'
}, {
	id: '5',
	name: 'Tennis'
}, {
	id: '12',
	name: 'Rugby'
}, {
	id: '21',
	name: 'Cricket'
}, {
	id: 23,
	name: 'Volleyball',
}, {
	id: 4,
	name: 'Ice Hockey',
}, {
	id: 6,
	name: 'Handball',
}, {
	id: 22,
	name: 'Darts',
}, {
	id: 34,
	name: 'Beach Volley'
}];
const sportLower = {};
const sportUpper = {};
const nameToIdMap = {};
const sportOrder = {};  // nav tab 排序

sportListUpperCase.forEach((sport, index) => {
	const routeName = getSportRoute(sport.name);
	const sportId = `sr:sport:${sport.id}`;
	sportLower[sport.id] = routeName;  // 原因是 以前就用sportConfigLowerCase[sportId] 来拼接路由
	// 加入sr:sport:id, 减少slice(9)
	sportLower[sportId] = routeName;
	sportUpper[sport.id] = sport.name;
	nameToIdMap[routeName] = sport.id;
	nameToIdMap[routeName.toLowerCase()] = sport.id;  // 应对路由处理，遗留

	// order
	sportOrder[sport.id] = index;
	sportOrder[sportId] = index;
});

// Upper Map
export const sportConfigUpperCase = sportUpper;

// Lower Map [key=route]
export const sportConfigLowerCase = sportLower;

// 根据name查找id
export const getSportIdByName = sportName => {
	const name = getSportRoute(sportName);
	return nameToIdMap[name];
};
export const sportConfigOrder = sportOrder;

// prematch stats
export const trackerSports = [1, 2, 5, 6, 22];

// live match tracer
export const liveTrackers = [1, 2, 4, 5, 6, 22, 23, 34];

export const DoubleScoreSports = [23, 34]; // 显示两个比分: set score ， game score; volleyball beach volley
export const TribleScoreSports = [5]; // 显示三场比分， set, game, point ; tennis

export const statisticsSports = [1, 4, 6, 22, 23, 34]; // live single view 展示statistics
// Lower List
export const sportListLowerCase = sportListUpperCase.map(cur => ({
	...cur,
	name: cur.name.toLowerCase()
}));

// Map[id]， 获取id
export const sportType2Id = nameToIdMap;

// @deprecated 没有用处了
export const sportTypes = Object.values(sportConfigLowerCase);
