export default {
	// TIMEPOINT: new Date('2018/12/20'), // 时间分界点

	registTime: 0,

	firstPrizeSequence: 0,
	firstPrizeWinning: 0,
	firstPrizeSettleTime: 0, // 首中单 settle时间
	firstPrizeTime: 0, // 首中单 下单时间

	firstOrderTime: 0, // 首次投注时间
	// 最大奖
	bigPrizeTime: 0,
	bigPrizeSettleTime: 0,
	bigPrizeWinning: 0,
	// realSports 投注
	selectionCount: 0,
	winningsSelectionCount: 0,
	// 大洲
	continentsLightend: 'Europe', //  ['Africa', 'Asia', 'South America', 'North America', 'Oceania', 'Europe'].join(','),

	topTournamentId: '',
	topTournamentName: '',
	topTeamName: '',
	topTeamCount: 0,
	topSportId: '',

	// 其他运动投注数目
	rouletteCount: 0,
	diceCount: 0,
	bingowinCount: 0,
	jackpotCount: 0,
	virtualCount: 0,

	// 促销礼物 减免
	giftReceivedAmount: 0,
	giftUsedAmount: 0,
	depositChargeAmount: 0,
	withdrawChargeAmount: 0,
	discountGiftSavedAmount: 0,

	totalStakeAmount: 0,
	totalWinningsAmount: 0,
	totalPlacebetDays: 0,
	totalBetCount: 0,
	meanOdds: 0,

	updateTime: 0,
};
