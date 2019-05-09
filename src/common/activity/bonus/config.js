
export default ({
	bannerUrl = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="',
	vsDesc = 'Austria vs. Brazil',
	betPath = `/${window.country}/sport/football/sr:category:4/sr:tournament:851`,
	appPath = 'sportybet://tournament?sportId=sr:sport:1&tournamentId=sr:tournament:851&tournamentName=International Int. Friendly Games',
	...rest
} = {}) => {
	const result = {
		step1: `Place a Bet that includes "${vsDesc}".`,
		step2: 'Settled Winnings will have 5% extra winnings offered as a Cash Gift.',
		correctExample: `Peter placed a 3-fold Multiple Bet. His bet includes "${vsDesc}". The Settled Winnings are ${window.currency} 500, SportyBet will give him ${window.currency} 25 extra in Cash Gifts which will be distributed as a Gift into his account. `,
		wrongExample: 'Peter placed a Single Bet with "Sporting CP vs. Boavista FC" and Odds of 1.1, he will not get 5% extra winnings as Cash Gifts.',
		termsAndConds: [
			` 1. Promotion Period: ${getGameDate()} 00:00:00 to ${getGameDate()} 24:00:00.`,
			' 2. Betting Rules:',
			' \ta) Settled Winnings (Bonus not included) will have 5% extra winnings in Cash Gifts.',
			` \tb) Your Bets must include "${vsDesc}".`,
			` \tc) Bets must be placed in "Real Sports" with Odds of 1.5 or higher and settled until ${getGameDate()} 24:00.`,
			' 3. All Cash Gifts will be distributed to the customers\' account within 3-4 working days after the promotion is over.',
			' 4. Cash Gifts are valid for a period of 7 days.',
			` 5. Every customer can get a maximum amount of ${window.currency} ${money()} in Cash Gifts.`,
			' 6. Promotions and Gifts are created in order to reward our most valued customers. Under suspect of fraud or abuse of this promotion by any customer, we reserve ourselves the right to remove Gifts and associated winnings from a given account or any associated accounts.',
		],
		requirements: [
			{
				title: 'Promotion Period',
				desc: `Until ${getGameDate()}`
			},
			{
				title: 'Bet Condition',
				desc: `"${vsDesc}"`
			},
			{
				title: 'Cash Gifts Prize',
				desc: 'Settled Winnings (Bonus not included) x5%'
			}
		],
		betPath,
		appPath,
		bannerUrl,
	};
	Object.assign(result, rest);
	return result;
};

function getGameDate() {
	const whatDayIsToday = new Date().getDay();
	const showTime = new Date().setDate(new Date().getDate() + (7 - whatDayIsToday));
	const date = new Date(showTime).getDate();
	const month = new Date(showTime).getMonth() + 1;
	const year = new Date(showTime).getFullYear();
	let showDate;
	if (month >= 9) {
		if (date >= 10) {
			showDate = `${date}/${month}/${year}`;
		} else {
			showDate = `0${date}/${month}/${year}`;
		}
	} else if (date >= 10) {
		showDate = `${date}/0${month}/${year}`;
	} else {
		showDate = `0${date}/0${month}/${year}`;
	}
	return showDate;
}
function money () {
	return window.currency === 'KES' ? 1000 : 3000;
}
