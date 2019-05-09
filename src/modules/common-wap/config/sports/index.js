// sport icon 样式
import './sports.less';

/**
 * sports 配置
 * id: sport id
 * text: 页面显示用 text
 * icon: sport 对应的 iconfont 样式
 * name: 球类名，遵循驼峰法，来源于属性名
 */
const sportsConfig = {
	football: {
		id: 'sr:sport:1',
		text: 'Football',
		icon: 'm-icon-football'
	},
	basketball: {
		id: 'sr:sport:2',
		text: 'Basketball',
		icon: 'm-icon-basketball'
	},
	tennis: {
		id: 'sr:sport:5',
		text: 'Tennis',
		icon: 'm-icon-tennis'
	},
	rugby: {
		id: 'sr:sport:12',
		text: 'Rugby',
		icon: 'm-icon-rugby'
	},
	cricket: {
		id: 'sr:sport:21',
		text: 'Cricket',
		icon: 'm-icon-cricket'
	},
	volleyball: {
		id: 'sr:sport:23',
		text: 'Volleyball',
		icon: 'm-icon-volleyball',
	},
	iceHockey: {
		id: 'sr:sport:4',
		text: 'Ice Hockey',
		icon: 'm-icon-iceHockey',
	},
	handball: {
		id: 'sr:sport:6',
		text: 'Handball',
		icon: 'm-icon-handball',
	},
	darts: {
		id: 'sr:sport:22',
		text: 'Darts',
		icon: 'm-icon-darts',
	},
	beachVolley: {
		id: 'sr:sport:34',
		text: 'Beach Volley',
		icon: 'm-icon-beachVolley',
	}
};

// sportsConfig 的 sport id 版本, key 为 sport id
const sportsConfigById = {};

// 添加 name
for (const key in sportsConfig) { // eslint-disable-line
	const sport = sportsConfig[key];
	sport.name = key;
	sportsConfigById[sport.id] = sport;
}

export {
	sportsConfigById
};

export default sportsConfig;
