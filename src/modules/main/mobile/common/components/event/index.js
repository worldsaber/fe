import EventSport from './eventSport';
import EventLive from './eventLive';

export default {
	functional: true,
	render (h, context) {
		const { props } = context;
		// productId: 1(直播),3(赛前)
		if (+props.productId === 1) {
			return h(EventLive, context.data);
		}
		return h(EventSport, context.data);
	}
};
