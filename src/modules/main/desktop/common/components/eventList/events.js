import LiveEvent from './liveEvent';
import SportEvent from './sportEvent';
import './events.less';

export default {
	functional: true,
	render (h, context) {
		const { props } = context;
		// 赛前
		if (props.productId === 3) {
			return h(SportEvent, context.data);
		}
		return h(LiveEvent, context.data);
	}
};
