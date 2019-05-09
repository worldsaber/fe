// 解析 specifier 字符串
const parseSpecifier = specifier => {
	let tmp = specifier.split('|');
	tmp = tmp[0];
	tmp = tmp.split('=');
	tmp = tmp[1];
	return tmp;
};

const sortBySpecifier = markets => markets.sort((a, b) => {
	if (a.specifier && b.specifier) {
		const tmp = parseSpecifier(a.specifier);
		const tmp1 = parseSpecifier(b.specifier);
		return tmp - tmp1;
	}
	return false;
});

const sortMarkets = markets => {
	const specifierList = [];
	let name;
	const sortedMarkets = sortBySpecifier(markets);
	// 对market排序
	for (let i = 0; i < sortedMarkets.length; i++) {
		const market = sortedMarkets[i];
		// 锁哥specifier用|隔开，每个speifier是用=隔开
		let tmp = market.specifier.split('|');
		tmp = tmp[0];
		const ss = tmp.split('=');
		specifierList.push({
			index: i,
			name: ss[1]
		});
		// 每个specifier都是类似  goals=1.5这种,所以多次赋值也可以
		name = ss[0];
	}
	return {
		markets: sortedMarkets,
		specifierList,
		name
	};
};

export default sortMarkets;
