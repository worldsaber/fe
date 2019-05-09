
// 页面的name名称列表
const path = ['entry', 'registration', 'first-winning-time', 'winning-amount',
	'winning-ratio', 'stake-location', 'favorite', 'games', 'promotion-gift', 'share'
];

// 根据当前页面名称获取下一页
export function getNextRoute() {
	const name = this.$route.name;
	const index = path.indexOf(name);
	return path[index + 1];
}
export function goNextRoute() {
	const nextName = getNextRoute.call(this);

	// 有效路由名称
	if (nextName) {
		this.$router.push({
			name: nextName
		});
	} else {
		console.log('no next route name');
	}
}

export default {
	goNextRoute,
};
