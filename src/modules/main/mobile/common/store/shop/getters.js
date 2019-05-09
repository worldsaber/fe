export default {
	getRulers: (state, getter) => state.rulers || [],
	getCurrentGift: (state, getter) => {
		const currentId = state.currentId || '',
			listsKeys = state.listsKeys || [],
			index = listsKeys.indexOf(currentId),
			lists = state.lists || [];

		if (~index) {
			return lists[index];
		}

		return null;
	},
	getDetailInfo: (state, getter) => {
		const currentGift = getter.getCurrentGift;

		let ret = {};

		if (currentGift) {
			ret = {
				gift: currentGift,
				rulers: getter.getRulers
			};
		}

		return ret;
	}
};
