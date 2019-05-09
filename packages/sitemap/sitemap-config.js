const domain = 'https://www.sportybet.com';

// 占位符'$$': 用来替换成国家/区域标志, 如 ke
const pcPathname = '/$$';
const wapPathname = '/$$/m';

const wapPath = `${domain}${wapPathname}`;
const pcPath = `${domain}${pcPathname}`;

/**
 * 配置说明
 * 1. currentCountries: 当前网站所支持的国家/地区版本列表
 * 	注意首位顺序，默认取第一个国家，即 ke。后续开通其他国家的话，请 push 新国家路径 xx，如 https://www.sportybet.com/xx/m.
 *
 * 2. canonical: Google规范版本
 * 	目前是移动优先，所以采用 wap 作为规范版本.
 *
 * 3. siteList: 网站地址路径列表
 * 	(1) 注意：不建议在链接后添加 query 或 hash
 *  (2) 每个 item 说明：
 *  	wap: String/Object, 如为Object类型的话，需提供各个国家/地区版本的完整链接, 示例可看 app download page(不知道为何，配置同学居然搞了三个不一样的链接，😔)
 *  	pc: String/Object, 配置同上，可选
 */
module.exports = {
	// 当前网站所支持的国家/地区版本列表
	currentCountries: ['ke', 'ng', 'gh'],
	// Google规范版本, 有两个值，wap / pc
	canonical: 'wap',
	// 网站地址路径列表
	siteList: [{
		// home
		wap: `${wapPath}`,
		pc: `${pcPath}`
	}, {
		// register and log in
		wap: `${wapPath}/registration`
	}, {
		// app download page
		wap: {
			ke: `${domain}/swdp/pagemaker/sportybet/ke/sportybet-app/index.htm`,
			ng: `${domain}/swdp/pagemaker/sportybet/ng/sportybet-ng-app/index.htm`,
			gh: `${domain}/swdp/pagemaker/sportybet/gh/sportybet-gh/index.htm`
		}
	}, {
		// Sports Menu
		wap: `${wapPath}/sports`
	}, {
		// live football list
		wap: `${wapPath}/sport/football/live_list`
	}, {
	// 	// live basketball list
	// 	wap: `${wapPath}/sport/basketball/live_list`
	// }, {
	// 	// live tennis list
	// 	wap: `${wapPath}/sport/tennis/live_list`
	// }, {
	// 	// live rugby list
	// 	wap: `${wapPath}/sport/rugby/live_list`
	// }, {
	// 	// live cricket list
	// 	wap: `${wapPath}/sport/cricket/live_list`
	// }, {
		// prematch football list
		wap: `${wapPath}/sport/football`
	}, {
	// 	// prematch basketball list
	// 	wap: `${wapPath}/sport/basketball`
	// }, {
	// 	// prematch tennis list
	// 	wap: `${wapPath}/sport/tennis`
	// }, {
	// 	// prematch rugby list
	// 	wap: `${wapPath}/sport/rugby`
	// }, {
	// 	// prematch cricket list
	// 	wap: `${wapPath}/sport/cricket`
	// }, {
	// 	// best odds
	// 	wap: `${wapPath}/best_odds?marketId=1,18,10,8`
	// }, {
		// virtual
		wap: `${wapPath}/virtual`
	}, {
		// sportybingo
		wap: `${wapPath}/sportybingo`
	}, {
		// roulette
		wap: `${wapPath}/roulette`
	}, {
		// jackpot
		wap: `${wapPath}/jackpot`
	}, {
		// promotion 列表
		wap: `${wapPath}/promotions`
	}, {
		// Deposit
		wap: `${wapPath}/my_accounts/deposit`
	}, {
		// Withdraw
		wap: `${wapPath}/my_accounts/withdraw`
	// }, {
		// load code 与首页是单页，影响Google误判，先去除
	// 	// load code
	// 	wap: `${wapPath}/load_code`
	}, {
		// search
		wap: `${wapPath}/search`
	}, {
		// Results
		wap: `${wapPath}/liveResult`
	}, {
		// help
		wap: `${wapPath}/help`
	}]
};
