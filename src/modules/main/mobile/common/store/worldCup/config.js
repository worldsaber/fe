const base = window.country || __baseUrl__.replace(/\//g, ''); // eslint-disable-line

const path = {
	ke: {
		bonus: '//www.sportybet.com/swdp/pagemaker/sportybet/ke/winnings-boost--ke/index.htm',
		promotions: '//www.sportybet.com/swdp/pagemaker/sportybet/ke/worldcup-sportybet/index.htm',
		winners: '//www.sportybet.com/swdp/pagemaker/sportybet/ke/sporty_predict_and_win_smartphone_winners/index.htm'
	},
	ng: {
		bonus: '//www.sportybet.com/swdp/pagemaker/sportybet/ng/winnings-boost-ng/index.htm',
		promotions: '//www.sportybet.com/swdp/pagemaker/sportybet/ng/worldcup-sportybet/index.htm',
		winners: '//www.sportybet.com/swdp/pagemaker/sportybet/ng/sporty_predict_and_win_smartphone_winners/index.htm'
	}
};

export const actPath = path[base] || {};

export default actPath;
