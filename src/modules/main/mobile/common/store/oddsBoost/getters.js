export default {
	// 是否在claim期间
	isDuringClaim(state) {
		const start = state.receivingStartTime;
		const end = state.receivingEndTime;
		const now = state.nowTime;
		return start && end && now >= start && now <= end;
	},
	// 是否在 使用期间
	isDuringUsage(state) {
		const start = state.usableTime;
		const expire = state.expireTime;
		const now = state.nowTime;

		return start && expire && now >= start && now <= expire;
	},
	// 根据sportId, tournamentId 判断是否boost
	isTournamentBoost(state, getters) {
		return payload => {
			if (!getters.isDuringUsage) {
				return false;
			}
			const details = state.details || [];
			return details.some(item => item.tournamentId === payload.tournamentId);
		};
	},
	isEventBoost(state, getters) {
		return payload => {
			if (!getters.isDuringUsage) {
				return false;
			}
			const details = state.details || [];
			return details.some(item => {
				let sameEvent = false;
				if (!item.eventId) {
					sameEvent = item.tournamentId === payload.tournamentId; // 退而判断联赛相同
				} else {
					sameEvent = item.eventId === payload.eventId;
				}
				return sameEvent;
			});
		};
	},
	isMarketBoost(state, getters) {
		return payload => {
			if (!getters.isDuringUsage) {
				return false;
			}
			const details = state.details || [];
			return details.some(item => {
				let sameEvent = false;
				if (item.eventId) {
					sameEvent = item.eventId === payload.eventId;
				} else {
					sameEvent = item.tournamentId === payload.tournamentId;
				}

				let sameSpecifier = false;
				if (!item.specifier) {
					sameSpecifier = true;  // 表示全部
				} else {
					sameSpecifier = item.specifier === payload.specifier;
				}
				return sameEvent && item.marketId === payload.marketId && sameSpecifier;
			});
		};
	},

	isLiveBoostWithMarket(state, getters) {
		return (options = {}) => {
			const {
				marketId: currentMarketId,
				productId: currentProductId
			} = options;
			const details = state.details || [];
			return payload => {
				if (!getters.isDuringUsage) {
					return false;
				}
				return details.some(item => {
					// 如果后台配了具体的marketId, eventId, tournamentId, productId, 则都要进行判断
					const { eventId, tournamentId, marketId, productId } = item;

					const isCorrectEvent = !eventId ||
						(eventId && eventId === payload.eventId);

					const isCorrectTournament = !tournamentId || (tournamentId && tournamentId === payload.tournamentId); // eslint-disable-line

					const isCorrectMarket = !marketId || (marketId && marketId === currentMarketId);

					const isCorrectProduct = !productId || (productId && productId === currentProductId);

					return isCorrectEvent && isCorrectTournament && isCorrectMarket && isCorrectProduct;
				});
			};
		};
	}
};
