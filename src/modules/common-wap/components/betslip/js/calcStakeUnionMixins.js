import { formatNumber } from 'utils';

export default {
	computed: {
		showStakeUnion () {
			const stakeUnion = this.stakeUnion || [];
			const res = {
				totalStake: 0,
				totalOdds: 0,
				count: 0,
				// bonus 乘过stake
				bonus: 0,
				// 原始的bonus，没有乘 stake
				originBonus: 0,
				// 用于显示的bonus
				showBonus: 0,
				showTotalStake: '0',
				potentialWin: '0'
			};
			let maxFinal = 0;
			let minFianl = 0;

			if (this.currentType === 'single') {
				const cur = stakeUnion[0] || {},
					tempSingle = +cur.stake;
				res.count += (cur.count || 0);
				res.boostCount = (cur.boostCount || 0);

				const oddsInfo = cur.oddsInfoMap || [],
					bonus = cur.bonus || [],
					singleStake = this.singleStake || {};

				for (const tempBonus of bonus) {
					if (!tempBonus) {
						break;
					}

					res.bonus += ((tempBonus.value || 0) * (singleStake[tempBonus.key || ''] || 0)) || 0;
					res.originBonus += (tempBonus.value || 0);
				}

				let minPotWin = 0;
				let maxPotWin = 0;

				for (let i = 0, len = oddsInfo.length; i < len; i++) {
					const item = oddsInfo[i];
					const tempOdds = [];

					for (const oddsItem of item) {
						if (!oddsItem) {
							break;
						}

						tempOdds.push((oddsItem.value || 0) * (singleStake[oddsItem.key || ''] || 0));
					}

					tempOdds.sort((a, b) => a - b);

					if (!minPotWin || (tempOdds.length && tempOdds[0] < minPotWin)) {
						minPotWin = tempOdds[0];
					}

					maxPotWin += (tempOdds.length && tempOdds[tempOdds.length - 1] || 0);
				}

				if (tempSingle) {
					if (!minFianl || (minFianl > minPotWin)) {
						minFianl = minPotWin;
					}

					maxFinal = maxPotWin;
				}
				res.totalStake += tempSingle;
			} else {
				stakeUnion.forEach(cur => {
					const stake = +cur.stake;
					if (cur.count) {
						res.count += cur.count;

						const min = cur.min;
						const sum = cur.sum;

						res.bonus += (+cur.bonus * stake || 0);
						res.originBonus += (+cur.bonus || 0);
						res.totalStake += stake * cur.count;

						if (stake) {
							if (!minFianl || (min && minFianl > min * stake)) {
								minFianl = min * stake;
							}
							maxFinal += sum * stake;
						}
					}
				});
			}

			if (stakeUnion.length === 1 && this.currentType === 'multiple') {
				res.totalOdds = stakeUnion[0].odds;
			}
			if (res.totalStake) {
				res.showTotalStake = formatNumber(res.totalStake, 2);
			}
			if (res.bonus > this.maxBonus) {
				res.bonus = this.maxBonus;
			}
			// max值加bonsu，min不加
			let maxPotentialWin = 0;
			maxPotentialWin = maxFinal + res.bonus;
			if (maxPotentialWin > this.maxPotWin) {
				maxPotentialWin = this.maxPotWin;
			}
			if (minFianl > this.maxPotWin) {
				minFianl = this.maxPotWin;
			}

			res.potentialWin = (maxFinal === minFianl || !minFianl) ? formatNumber(maxPotentialWin, 2) : (minFianl === maxPotentialWin ? formatNumber(minFianl, 2) : `${formatNumber(minFianl, 2)} ~ ${formatNumber(maxPotentialWin, 2)}`);
			if (res.bonus) {
				res.showBonus = formatNumber(res.bonus, 2);
			}
			return res;
		}
	}
};
