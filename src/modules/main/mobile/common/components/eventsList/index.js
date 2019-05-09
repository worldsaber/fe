import LiveEventsList from './liveEventsList';
import SportEventsList from './sportEventsList';
import './events.less';

export default {
	functional: true,
	render (h, context) {
		const { props } = context;
		// 赛前
		if (+props.productId === 3) {
			return h(SportEventsList, context.data);
		}
		return h(LiveEventsList, context.data);
	}
};
