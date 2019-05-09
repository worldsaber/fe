// 图片的地址列表，分页映射
import store from '../store/index';
import getShareFunc from './share/index';

// entry
import leafTop from './leaf-top.png';
import leafLeft from './leaf-left.png';
import leafRight from './leaf-right.png';
import title from './title.png';
import sportyLogo from './sporty-logo.png';

import doorBack from './entry/door-back.png';
import doorLeft from './entry/door-left.png';
import doorRight from './entry/door-right.png';
import doorShadow from './entry/door-shadow.png';
import wine from './entry/wine.png';
import buttonBack from './entry/button-back.png';
import doorDecoration from './entry/door-decoration.png';
// import btnStart from './entry/btn-start.png';
import doorLight from './entry/light.png';

// 注册
import ceilLeaf from './registration/ceil-leaf.png';
import floor from './registration/floor.png';
import bar from './registration/bar.png';
import handBeer from './registration/hand-beer.png';
import btnNext from './btn-next.png';
import uefa from './registration/uefa.png';
import fifa from './registration/fifa.png';
import epl from './registration/epl.png';
import date from './registration/date.png';

//  first winning time
import firework from './first-winning/firework.png';
import flagBottom from './first-winning/flag-bottom.png';
import flagTop from './first-winning/flag-top.png';
import football from './first-winning/football.png';
import gift from './first-winning/gift.png';
import winLeafLeft from './first-winning/leaf-left.png';
import winLeafRight from './first-winning/leaf-right.png';
import photo from './first-winning/photo.png';
import stage from './first-winning/stage.png';
import trophy from './first-winning/trophy.png';

//  biggest winning amount
import bigBar from './winning/big-bar.png';
import car from './winning/car.png';
import feast from './winning/feast.png';
import bigFloor from './winning/big-floor.png';
import house from './winning/house.png';
import coke from './winning/coke.png';
import travel from './winning/travel.png';
import popo from './winning/popo.png';
import shoe from './winning/shoe.png';
import bigLeaf from './winning/big-leaf.png';
import bike from './winning/bike.png';
import phone from './winning/phone.png';
import banner from './winning/banner.png';

// winning ratio
import gold from './winning/gold.png';
import silver from './winning/silver.png';
import bronze from './winning/bronze.png';

// new-customer
import wholeFootball from './new-customer/whole-football.png';
import ghsShield from './new-customer/ghs-shield.png';
import kesShield from './new-customer/kes-shield.png';
import ngnShield from './new-customer/ngn-shield.png';
import greenLeaf from './new-customer/green-leaf-right.png';
import orangeLeaf from './new-customer/orange-leaf-left.png';
import smallLeafLeft from './new-customer/small-leaf-left.png';
import smallLeafRight from './new-customer/small-leaf-right.png';
import wineLean from './new-customer/wine-lean.png';
import betNow from './new-customer/bet-now.png';

// continent
import dbBeer from './continent/db-beer.png';
import desktop from './continent/desktop.png';
import glass from './continent/glass.png';
import mapBack from './continent/map-back.png';
import mapCorner from './continent/map-corner.png';
import tennis from './continent/tennis.png';
import wuwuzula from './continent/wuwuzula.png';
import halfFootball from './continent/football.png';
import finger from './continent/finger.png';
import mapaf from './continent/map-af.png';
import mapasia from './continent/map-asia.png';
import mapau from './continent/map-au.png';
import mapeu from './continent/map-eu.png';
import mapna from './continent/map-na.png';
import mapsa from './continent/map-sa.png';
import continentLight from './continent/light.png';
import mark from './continent/mark.png';

// favorite
import bundesliga from './favorite/bundesliga.png';
import ecl from './favorite/ecl.png';
import favoriteEpl from './favorite/epl.png';
import laliga from './favorite/laliga.png';
import ligue1 from './favorite/ligue1.png';
import seriea from './favorite/seriea.png';
import other from './favorite/other.png';
import outLight from './favorite/out-light.png';
import favoriteFootball from './favorite/football.png';

// games
import gameFloor from './games/game-floor.png';
import bingo from './games/bingo.png';
import dice from './games/dice.png';
import jackpot from './games/jackpot.png';
import jetton from './games/jetton.png';
import roulette from './games/roulette.png';
import virtual from './games/virtual.png';
import gameWine from './games/wine.png';
import gameLight from './games/border-light.png';
import yellowDot from './games/yellow-dot.png';
import gameDesk from './games/desktop.png';
import tryOut from './games/try-out.png';
import barRight from './games/bar-right.png';

// gift
import coins from './gift/coins.png';
import hand from './gift/hand.png';
import pig from './gift/pig.png';
import tree from './gift/tree.png';

const { getters, state } = store;

export const entry = {
	leafLeft,
	leafTop,
	leafRight,
	doorBack,
	doorLeft,
	doorRight,
	doorShadow,
	wine,
	buttonBack,
	doorDecoration,
	// btnStart,
	doorLight,
	title,
	sportyLogo
};

export function getRegistTime() {
	const index = getters['annual/getTimeIndex'];
	return {
		ceilLeaf,
		floor,
		bar,
		handBeer,
		date,
		logo: [uefa, fifa, '', epl][index]
	};
}
export function getFirstWinning() {
	const result = {
		firework,
		flagBottom,
		flagTop,
		football,
		leafLeft: winLeafLeft,
		leafRight: winLeafRight,
		photo,
		stage,
	};

	if (getters['annual/isNeverWin']) {
		result.gift = gift;
	} else {
		result.trophy = trophy;
	}
	return result;
}
const gifts = [coke, feast, shoe, phone, travel, house];
const countryGifts = {
	// ng1: bike,
	ng4: car,
};
export function getWinningAmount() {
	const index = getters['annual/getAmountIndex'];

	const gift = countryGifts[`${window.country}${index}`] || gifts[index];

	return {
		bar: bigBar,
		floor: bigFloor,
		popo,
		leaf: bigLeaf,
		banner,

		gift,
	};
}
export function getWinningRatio() {
	const medal = [bronze, silver, gold];

	const index = getters['annual/getRatioIndex'];

	return {
		bar: bigBar,
		floor: bigFloor,
		popo,
		leaf: bigLeaf,
		banner,

		medal: medal[index],
	};
}
export function getNewCustomer() {
	const map = {
		ke: kesShield,
		ng: ngnShield,
		gh: ghsShield
	};
	return {
		leafLeft,
		leafTop,
		leafRight,
		title,
		football: wholeFootball,
		shield: map[window.country || 'ke'],
		greenLeaf,
		orangeLeaf,
		smallLeafLeft,
		smallLeafRight,
		wine: wineLean,
		betNow,
		sportyLogo
	};
}

const continentMap = {
	africa: mapaf,
	asia: mapasia,
	oceania: mapau,
	southamerica: mapsa,
	northamerica: mapna,
	europe: mapeu
};

export function getContinent() {
	// 根据五洲状态
	const lights = getters['annual/getContinentsLight'];
	let continents = lights.split(',') || [];

	const result = {
		dbBeer,
		desktop,
		glass,
		mapBack,
		mapCorner,
		tennis,
		wuwuzula,
		football: halfFootball,
		finger,
		mark,
		light: continentLight
	};

	continents = continents.map(con => con.toLowerCase().replace(/ /g, ''));

	['africa', 'asia', 'oceania', 'southamerica', 'northamerica', 'europe'].forEach(item => {
		if (continents.indexOf(item) > -1) {
			result[item] = continentMap[item];
		}
	});
	return result;
}

export const map = {
	mapaf,
	mapasia,
	mapau,
	mapeu,
	mapna,
	mapsa,
	mark,
};

const tournamentIdMap = {
	'sr:tournament:35': bundesliga, // Bundesliga,
	'sr:tournament:23': seriea, // Serie A
	'sr:tournament:8': laliga, // Laliga
	'sr:tournament:17': favoriteEpl, // EPL
	'sr:tournament:34': ligue1, // Ligue 1
	'sr:tournament:7': ecl, // UEFA Champions League
	football: favoriteFootball,
	other,
};

export function getFavorite() {
	const tournamentId = state.annual.topTournamentId;
	const topSportId = state.annual.topSportId;
	// 判断是足球且非6大联赛
	let tournament = tournamentIdMap[tournamentId];
	if (!tournament && topSportId === 'sr:sport:1') {
		tournament = tournamentIdMap.football;
	}

	return {
		light: continentLight,
		tournament: tournament || tournamentIdMap.other,
		outLight,
	};
}

export function getGames() {
	return {
		floor: gameFloor,
		bingo,
		dice,
		jackpot,
		jetton,
		roulette,
		virtual,
		wine: gameWine,
		light: gameLight,
		dot: yellowDot,
		desktop: gameDesk,
		tryOut,
		barRight,
	};
}
export const PromotionGift = {
	coins,
	hand,
	pig,
	tree
};

export const winning = {
	bar: bigBar,
	floor: bigFloor,
	popo,
	leaf: bigLeaf,
	coke,
	feast,
	shoe,
	phone,
	travel,
	house,
	bike,
	car,
	bronze,
	silver,
	gold
};

export function getShare() {
	const result = getShareFunc();
	return {
		leafLeft,
		leafTop,
		leafRight,
		football: wholeFootball,
		greenLeaf,
		orangeLeaf,
		smallLeafLeft,
		smallLeafRight,
		wine: wineLean,
		betNow,
		sportyLogo,
		...result,
	};
}

export const next = {
	btnNext,
};
export default {
	entry,
	'new-customer': getNewCustomer,
	registration: getRegistTime,
	'first-winning-time': getFirstWinning,
	'winning-amount': getWinningAmount,
	'winning-ratio': getWinningRatio,
	'stake-location': getContinent,
	favorite: getFavorite,
	games: getGames,
	'promotion-gift': PromotionGift,
	share: getShare,
};
