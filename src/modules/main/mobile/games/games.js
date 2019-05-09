import { pagePath } from '../../../common-wap/config/pageConfig';

export const gameList = [{
	name: 'luckypoker',
	title: 'Lucky Poker',
	img: require('./images/luckyPoker.png'),
	jmpTo: pagePath.luckypoker,
	countKey: 'countOfLuckyPoker'
}, {
	name: 'dicebattle',
	title: 'Dice Battle',
	img: require('./images/dicebattle.png'),
	jmpTo: pagePath.dicebattle,
	countKey: 'countOfDiceBattle'
}, {
	name: 'roulette', // 没用
	title: 'Sporty Roulette', // 显示标题
	img: require('./images/roulette.jpg'), // banner图地址
	jmpTo: pagePath.roulette, // play按钮跳转链接
	countKey: 'countOfRoulette' // 取后台在线人数用的key
}];

export default {
	gameList
};
