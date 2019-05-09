// import * as mutationTypes from './mutationTypes';
import { getComplexAdConfig } from 'utils/getAdConfig';
import { UPDATE_CAROUSEL, UPDATE_BRAODCAST_LIST } from './mutationTypes';

export default {
		// 获取录播列表
	getCarouselAds({ commit }) {
		return getComplexAdConfig([{
			spotId: 'bingoWinBanner'
		}]).then((spots = []) => {
			const spot = spots[0] || {};
			const ads = spot.ads || [];
			const list = ads.map(ad => ({
				link: ad.linkUrl,
				img: ad.imgUrl
			}));
			commit(UPDATE_CAROUSEL, list);
		});
	},
	// 获取广播内容
	getBroadcastList({ commit }) {
		fetch('/bingowin/broadcast/win')
		.then(res => res.json())
		.then(res => {
			if (res.bizCode === 10000) {
				const data = res.data;
				let awardInfos = [];

				for (const group of data) {
					const type = group.groupType;
					// 中奖通知
					if (type === 0) {
						const infos = group.infos || [];
						awardInfos = [...awardInfos, ...infos];
					}
				}
				commit(UPDATE_BRAODCAST_LIST, awardInfos);
			}
		})
		.catch(e => {
			// 错误处理，保证不中断定时更新
			console.error(e);
		});
	}
};
